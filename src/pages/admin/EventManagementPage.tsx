
import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getAllEvents, deleteEvent, Event, EventFilters } from '@/services/api';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';
import { Plus, Search } from 'lucide-react';
import EventsTable from '@/components/admin/EventsTable';
import EventFormModal from '@/components/admin/EventFormModal';
import RegistrationsListModal from '@/components/admin/RegistrationsListModal';
import PromoteToCompetitionModal from '@/components/admin/PromoteToCompetitionModal';

const EventManagementPage: React.FC = () => {
  const [filters, setFilters] = useState<EventFilters>({ 
    search: '', 
    page: 1, 
    limit: 10 
  });
  const [searchInput, setSearchInput] = useState('');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [registrationsEventId, setRegistrationsEventId] = useState<string | null>(null);
  const [promoteEventId, setPromoteEventId] = useState<string | null>(null);

  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setFilters(prev => ({ ...prev, search: searchInput, page: 1 }));
    }, 500);

    return () => clearTimeout(timer);
  }, [searchInput]);

  // Fetch events
  const {
    data: eventsData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['events', filters],
    queryFn: () => getAllEvents(filters),
  });

  // Delete event mutation
  const deleteEventMutation = useMutation({
    mutationFn: deleteEvent,
    onSuccess: () => {
      toast({
        title: "Event deleted",
        description: "The event has been successfully deleted.",
      });
      queryClient.invalidateQueries({ queryKey: ['events'] });
    },
    onError: (error: any) => {
      toast({
        title: "Error deleting event",
        description: error.response?.data?.message || "Failed to delete event.",
        variant: "destructive",
      });
    },
  });

  const handleDeleteEvent = (eventId: string) => {
    if (window.confirm('Are you sure you want to delete this event? This action cannot be undone.')) {
      deleteEventMutation.mutate(eventId);
    }
  };

  const handleEditEvent = (event: Event) => {
    setEditingEvent(event);
  };

  const handleViewRegistrations = (eventId: string) => {
    setRegistrationsEventId(eventId);
  };

  const handlePromoteToCompetition = (eventId: string) => {
    setPromoteEventId(eventId);
  };

  const handlePageChange = (page: number) => {
    setFilters(prev => ({ ...prev, page }));
  };

  const events = eventsData?.data || [];
  const totalPages = Math.ceil((eventsData?.total || 0) / filters.limit!);

  if (error) {
    return (
      <div className="p-6">
        <Card>
          <CardContent className="p-6 text-center">
            <p className="text-destructive">Error loading events. Please try again later.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Event Management</h1>
          <p className="text-muted-foreground">Manage events, competitions, and registrations</p>
        </div>
        <Button onClick={() => setIsCreateModalOpen(true)} className="flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Create New Event
        </Button>
      </div>

      {/* Search Bar */}
      <Card>
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Search events by title..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Events Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Events ({eventsData?.total || 0})</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </div>
          ) : (
            <EventsTable
              events={events}
              onEdit={handleEditEvent}
              onDelete={handleDeleteEvent}
              onViewRegistrations={handleViewRegistrations}
              onPromoteToCompetition={handlePromoteToCompetition}
              isDeleting={deleteEventMutation.isPending}
            />
          )}
        </CardContent>
      </Card>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious 
                  onClick={() => handlePageChange(Math.max(1, filters.page! - 1))}
                  className={filters.page === 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                />
              </PaginationItem>
              
              {[...Array(Math.min(5, totalPages))].map((_, i) => {
                const page = i + 1;
                return (
                  <PaginationItem key={page}>
                    <PaginationLink
                      onClick={() => handlePageChange(page)}
                      isActive={filters.page === page}
                      className="cursor-pointer"
                    >
                      {page}
                    </PaginationLink>
                  </PaginationItem>
                );
              })}
              
              <PaginationItem>
                <PaginationNext 
                  onClick={() => handlePageChange(Math.min(totalPages, filters.page! + 1))}
                  className={filters.page === totalPages ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}

      {/* Modals */}
      <EventFormModal
        isOpen={isCreateModalOpen || !!editingEvent}
        onClose={() => {
          setIsCreateModalOpen(false);
          setEditingEvent(null);
        }}
        event={editingEvent}
        onEventSaved={() => {
          queryClient.invalidateQueries({ queryKey: ['events'] });
          setIsCreateModalOpen(false);
          setEditingEvent(null);
        }}
      />

      <RegistrationsListModal
        eventId={registrationsEventId}
        isOpen={!!registrationsEventId}
        onClose={() => setRegistrationsEventId(null)}
      />

      <PromoteToCompetitionModal
        eventId={promoteEventId}
        isOpen={!!promoteEventId}
        onClose={() => setPromoteEventId(null)}
        onCompetitionCreated={() => {
          queryClient.invalidateQueries({ queryKey: ['events'] });
          setPromoteEventId(null);
        }}
      />
    </div>
  );
};

export default EventManagementPage;

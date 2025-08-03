
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Search, Filter, X } from 'lucide-react';
import { UserFilters, Role } from '@/services/api';

interface UserFilterBarProps {
  filters: UserFilters;
  roles: Role[];
  onFilterChange: (filters: Partial<UserFilters>) => void;
  isLoading?: boolean;
}

const UserFilterBar: React.FC<UserFilterBarProps> = ({
  filters,
  roles,
  onFilterChange,
  isLoading = false,
}) => {
  const handleClearFilters = () => {
    onFilterChange({
      name: '',
      email: '',
      role: '',
    });
  };

  const hasActiveFilters = filters.name || filters.email || filters.role;

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex flex-col md:flex-row gap-4 items-end">
          <div className="flex-1 space-y-2">
            <label className="text-sm font-medium">Search by Name</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Enter first or last name..."
                value={filters.name || ''}
                onChange={(e) => onFilterChange({ name: e.target.value })}
                className="pl-10"
              />
            </div>
          </div>

          <div className="flex-1 space-y-2">
            <label className="text-sm font-medium">Search by Email</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Enter email address..."
                value={filters.email || ''}
                onChange={(e) => onFilterChange({ email: e.target.value })}
                className="pl-10"
              />
            </div>
          </div>

          <div className="flex-1 space-y-2">
            <label className="text-sm font-medium">Filter by Role</label>
            <Select
              value={filters.role || ''}
              onValueChange={(value) => onFilterChange({ role: value === 'all' ? '' : value })}
              disabled={isLoading}
            >
              <SelectTrigger>
                <div className="flex items-center gap-2">
                  <Filter className="w-4 h-4 text-muted-foreground" />
                  <SelectValue placeholder="Select role..." />
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Roles</SelectItem>
                {roles.map((role) => (
                  <SelectItem key={role.id} value={role.name}>
                    {role.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex gap-2">
            {hasActiveFilters && (
              <Button
                variant="outline"
                onClick={handleClearFilters}
                className="flex items-center gap-2"
              >
                <X className="w-4 h-4" />
                Clear
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default UserFilterBar;

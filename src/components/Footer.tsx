const Footer = () => {
  return (
    <footer className="bg-gradient-to-br from-muted/50 to-background border-t border-border">
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
          <p className="text-muted-foreground text-sm">
            © 2024 EduEvents Hub - School of Leadership Afghanistan. All rights reserved.
          </p>
          <p className="text-muted-foreground text-sm">
            Built with ❤️ for educational excellence
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
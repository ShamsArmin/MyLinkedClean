import React from "react";
import { Link } from "wouter";

const AppFooter: React.FC = () => {
  return (
    <footer className="py-6 px-4 md:px-6 bg-background border-t">
      <div className="container mx-auto max-w-6xl">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-r from-primary-500 to-secondary-500 flex items-center justify-center">
                <span className="text-white font-bold text-xs">ML</span>
              </div>
              <span className="font-heading font-semibold text-foreground">MyLinked</span>
            </div>
            <p className="text-sm text-muted-foreground mt-1">© {new Date().getFullYear()} MyLinked. All rights reserved.</p>
          </div>
          <div className="flex flex-wrap gap-4">
            <Link href="/terms-of-service" className="text-sm text-muted-foreground hover:text-primary transition-colors">
              Terms of Service
            </Link>
            <Link href="/privacy-policy" className="text-sm text-muted-foreground hover:text-primary transition-colors">
              Privacy Policy
            </Link>
            <Link href="/help" className="text-sm text-muted-foreground hover:text-primary transition-colors">
              Help Center
            </Link>
            <Link href="/contact" className="text-sm text-muted-foreground hover:text-primary transition-colors">
              Contact
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default AppFooter;

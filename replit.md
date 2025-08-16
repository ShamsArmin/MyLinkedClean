# MyLinked - Social Link Management Platform

## Overview
MyLinked is a comprehensive social link management platform enabling users to create personalized profiles, manage social media links, track analytics, and connect various social platforms for content preview. It features AI-powered suggestions, collaboration tools, industry discovery, and multiple viewing modes. The business vision is to provide a centralized hub for individuals and professionals to manage and showcase their digital identity, streamline social media presence, and leverage AI for optimal online engagement.

## User Preferences
Preferred communication style: Simple, everyday language.

## System Architecture

### UI/UX Decisions
- Modern, attractive design with consistent glass-morphism effects and gradient themes (blue-to-purple spectrum).
- Responsive layouts optimized for mobile and desktop.
- Interactive elements: animated backgrounds, 3D cards, floating animations, interactive popups.
- Standardized typography and spacing.
- Dark mode theming system implemented consistently across all components.

### Technical Implementations
- **Frontend**: React 18 with TypeScript, Wouter for routing, TanStack Query for server state, Radix UI and shadcn/ui for components, Tailwind CSS for styling, Vite for building.
- **Backend**: Express.js with TypeScript, Passport.js for authentication (local, session-based, OAuth), PostgreSQL with Drizzle ORM for data persistence, Neon Database for serverless connection.
- **Authentication**: Local username/password with bcrypt hashing, session-based auth, and OAuth integrations (Instagram, Facebook, Twitter, TikTok).
- **Database Schema**: Manages users, links, social features (follows, profile views), advanced features (spotlight projects, collaboration), and analytics.
- **Social Media Integration**: OAuth flows for major platforms, content preview APIs, token management.
- **AI-Powered Features**: OpenAI GPT-4o for link optimization, social scoring, branding recommendations, and analytics insights (with intelligent fallback system for API availability).
- **Data Flow**: Client authentication, profile/link management, OAuth handling, content syncing, and AI insights generation.
- **Security**: Multi-layered architecture including SQL injection/XSS/CSRF protection, rate limiting, suspicious activity detection, IP blocking, input validation, security headers, and real-time monitoring.
- **Email System**: SendGrid integration for transactional and marketing emails (welcome, password reset, campaigns).
- **Account Management**: Secure account deletion with comprehensive data purging.
- **User Reporting**: System for reporting inappropriate content on public profiles.
- **Password Reset**: Secure token-based password reset via email.
- **Pitch Mode**: Real-time synchronized configuration of professional presentation modes with sharing options.

### System Design Choices
- Modular component-based architecture for React frontend.
- API-driven backend for clear separation of concerns.
- Scalable database design with Drizzle ORM.
- Comprehensive environment variable management for different deployments.
- Enterprise-grade AI support chatbot with advanced technical capabilities and fallback system.
- Focus on performance optimization and user experience.

## External Dependencies

### Core Infrastructure
- **Neon Database**: PostgreSQL serverless database.
- **Replit**: Development and deployment environment.
- **OpenAI API**: AI-powered features (GPT-4o).
- **SendGrid**: Email service.

### Social Platform APIs
- **Instagram Basic Display API**
- **Facebook Graph API**
- **Twitter API v2**
- **TikTok for Developers**

### Frontend Libraries
- **Radix UI**
- **Tailwind CSS**
- **Lucide React**
- **React Hook Form**
- **Zod**
- **Wouter**
- **TanStack Query**

## Recent Changes
- **2025-08-04**: Fixed critical account deletion bug and password validation
  - Resolved "userSkills not defined" error by removing undefined table reference and adding manual SQL cleanup
  - Fixed foreign key constraint issue with role_invitations table during user deletion  
  - Added comprehensive deletion process for all related tables including user_skills, role_invitations, user_roles, employee_profiles
  - Fixed password validation to require minimum 6 characters across login, registration, and password reset forms
  - Updated shared schema to enforce password length validation consistently
  - Confirmed password reset functionality working correctly (was already functional)
- **2025-08-02**: Fixed collaboration request accept/reject functionality
  - Resolved frontend state management issue where requests disappeared after status update
  - Fixed response handling mismatch between backend and frontend
  - Added proper error handling and logging for debugging
  - Added test data to collaboration_requests_notifications table
  - Updated frontend to properly handle backend response format ({ success: true, request: {...} })
```
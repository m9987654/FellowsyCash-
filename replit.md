# Replit.md

## Overview

This is a comprehensive financial platform application for Egyptian users called "Flous Cash". It's a full-stack web application built with React, TypeScript, Express, and PostgreSQL that provides financial services including funding requests, savings goals, and investment offers with digital contract management.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Styling**: Tailwind CSS with custom gradient themes and glassmorphism effects
- **UI Components**: Radix UI primitives with shadcn/ui component library
- **State Management**: TanStack Query (React Query) for server state
- **Routing**: Wouter for client-side routing
- **Forms**: React Hook Form with Zod validation
- **Build Tool**: Vite with custom configuration for client-side builds

### Backend Architecture
- **Runtime**: Node.js with Express.js server
- **Language**: TypeScript with ESM modules
- **Database**: PostgreSQL with Drizzle ORM
- **Authentication**: OpenID Connect with Replit authentication
- **Session Management**: Express sessions with PostgreSQL store
- **File Generation**: PDF generation with pdf-lib
- **Email Service**: Nodemailer for transactional emails

### Database Design
- **Users**: Core user management with referral system
- **Funding Requests**: Loan application management
- **Savings Goals**: Personal savings tracking
- **Investment Offers**: Investment opportunity management
- **Contracts**: Digital contract storage and management
- **Sessions**: Authentication session persistence

## Key Components

### Authentication System
- **Provider**: Replit OpenID Connect integration
- **Session Storage**: PostgreSQL-backed sessions with connect-pg-simple
- **Authorization**: Route-level middleware for protected endpoints
- **User Management**: Automatic user creation and profile management

### Financial Services
- **Funding Requests**: Users can apply for loans with income verification
- **Savings Goals**: Goal-based savings with progress tracking
- **Investment Offers**: Investment plans with expected returns
- **Contract Generation**: Automated PDF contract creation for all services

### Digital Contracts
- **Generation**: Server-side PDF creation with Arabic text support
- **Signing**: Digital signature capture and storage
- **Delivery**: Email-based contract distribution
- **Storage**: Database persistence of contract metadata

### User Interface
- **Responsive Design**: Mobile-first with Tailwind CSS
- **Arabic Support**: RTL layout with Cairo font family
- **Glassmorphism**: Modern UI with transparency effects
- **Theme System**: Custom color palette with CSS variables

## Data Flow

1. **User Registration**: OpenID Connect authentication creates user profile
2. **Service Application**: Users submit funding/savings/investment requests
3. **Contract Creation**: System generates PDF contracts automatically
4. **Digital Signing**: Users sign contracts through web interface
5. **Email Delivery**: Signed contracts sent via email service
6. **Status Tracking**: Real-time updates on application status

## External Dependencies

### Database
- **Provider**: Neon PostgreSQL (serverless)
- **Connection**: @neondatabase/serverless with connection pooling
- **Schema Management**: Drizzle Kit for migrations

### Authentication
- **Provider**: Replit OpenID Connect
- **Session Store**: PostgreSQL with connect-pg-simple
- **Security**: HTTPOnly cookies with secure flags

### Email Service
- **Provider**: Configurable SMTP (Gmail by default)
- **Service**: Nodemailer with HTML templates
- **Features**: Attachment support for contracts

### PDF Generation
- **Library**: pdf-lib for client-side PDF creation
- **Features**: Arabic text support, digital signatures
- **Fonts**: Standard fonts with custom styling

## Deployment Strategy

### Development
- **Command**: `npm run dev` starts both client and server
- **Hot Reload**: Vite HMR for frontend, tsx watch for backend
- **Database**: Drizzle push for schema updates

### Production
- **Build Process**: Vite builds frontend, esbuild bundles server
- **Static Assets**: Served from dist/public directory
- **Database**: Migrations applied via Drizzle Kit
- **Environment**: Production-optimized with security headers

### Environment Variables
- `DATABASE_URL`: PostgreSQL connection string
- `SESSION_SECRET`: Session encryption key
- `SMTP_*`: Email service configuration
- `REPLIT_DOMAINS`: Authentication domain whitelist

### Performance Optimizations
- **Caching**: TanStack Query for client-side caching
- **Code Splitting**: Vite automatic code splitting
- **Compression**: Gzip compression for static assets
- **Database**: Connection pooling with Neon serverless

### Security Measures
- **CSRF Protection**: SameSite cookie configuration
- **XSS Prevention**: Content Security Policy headers
- **SQL Injection**: Parameterized queries with Drizzle
- **Authentication**: Secure session management
- **Data Validation**: Zod schemas for input validation
# CAP Web Application (Frontend)

## Overview
This directory contains the presentation layer of the Classroom Assignment Platform (CAP). It is a Single Page Application (SPA) designed to provide a seamless, highly responsive administrative interface for managing university faculties, rooms, and live schedules. 

The application strictly adheres to a centralized API Gateway pattern, delegating all network requests to the Nginx reverse proxy to securely interact with the underlying microservices ecosystem.

## Tech Stack
* **Core Framework:** React 19 initialized with Vite for rapid Hot Module Replacement (HMR) and optimized production builds.
* **Routing:** `react-router-dom` for declarative, client-side routing, separating public authentication flows from protected administrative layouts.
* **Styling:** Tailwind CSS v4 utilizing the modern `oklch` color space and inline CSS variables.
* **UI Components:** Shadcn/ui (Radix UI primitives) for accessible, headless, and customizable enterprise-grade components (Data Tables, Dialogs, Inputs).
* **Icons:** `lucide-react` for consistent, lightweight iconography.

## Architecture & Structure
The codebase follows a modular, feature-centric directory structure:

* `/src/components/ui`: Reusable, atomic UI components generated via the Shadcn CLI.
* `/src/layouts`: Master structural components (e.g., `MainLayout.jsx` featuring the persistent corporate sidebar).
* `/src/pages`: Top-level route components (`Login.jsx`, `Dashboard.jsx`, `Faculties.jsx`, `Schedule.jsx`) that manage localized state and trigger network requests.

## Security & Network Integration
* **Authentication:** Utilizes JSON Web Tokens (JWT). Upon successful login via `/api/auth/login`, the token is stored in the browser's `localStorage`.
* **Authorization Headers:** Protected routes (e.g., fetching faculties or submitting reservations) automatically retrieve and attach the Bearer token to the HTTP `Authorization` header.
* **Gateway Routing:** The frontend remains entirely decoupled from backend ports. All data fetching targets `http://localhost:8000`, relying on Nginx to resolve the internal microservice topologies (Node.js vs. Python).

## Local Development Setup
To run the frontend independently (ensure the backend Docker cluster is running for API interactions):

1. Install dependencies:
   ```bash
   npm install
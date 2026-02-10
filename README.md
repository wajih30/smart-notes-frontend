# Smart Notes Frontend

React TypeScript frontend application for the AI-Powered Smart Notes system.

## Features

- **Authentication**: Login, registration, email verification, password reset
- **Notes Management**: Create, edit, delete, pin, archive notes with file upload support
- **Q&A Sessions**: AI-powered chat sessions with selected notes
- **Semantic Search**: Search notes using semantic understanding
- **Admin Dashboard**: User management and system statistics (admin only)

## Tech Stack

- **React 18** with TypeScript
- **Vite** for build tooling
- **React Router v6** for routing
- **Axios** for API calls
- **Tailwind CSS** for styling
- **Lucide React** for icons
- **Zustand** for state management (optional, currently using Context API)

## Getting Started

### Prerequisites

- Node.js 18+ and npm/yarn
- Backend API running on `http://localhost:8000`

### Installation

1. Install dependencies:
```bash
npm install
```

2. Create `.env` file (if not exists):
```env
VITE_API_URL=http://localhost:8000
VITE_APP_NAME=Smart Notes
```

3. Start development server:
```bash
npm run dev
```

The app will be available at `http://localhost:3000`

### Build for Production

```bash
npm run build
```

The built files will be in the `dist` directory.

## Project Structure

```
frontend/
├── src/
│   ├── api/              # API client functions
│   ├── components/       # Reusable UI components
│   │   ├── auth/        # Authentication components
│   │   ├── layout/      # Layout components
│   │   ├── notes/       # Notes-related components
│   │   ├── qa/          # Q&A session components
│   │   ├── search/      # Search components
│   │   ├── admin/       # Admin components
│   │   └── ui/          # Base UI components
│   ├── contexts/        # React contexts
│   ├── pages/           # Page components
│   ├── types/           # TypeScript types
│   ├── utils/           # Utility functions
│   └── styles/          # Global styles
├── public/              # Static assets
└── package.json
```

## Key Features Implementation

### Authentication Flow

1. User registers → Email verification required
2. User verifies email with OTP → Can login
3. Login → JWT tokens stored in localStorage
4. Auto token refresh on 401 errors
5. Protected routes require authentication

### Notes Management

- List notes with pagination and filters (search, pinned, archived)
- Create notes via text input or file upload (PDF, DOCX, TXT)
- Edit notes inline
- Pin/archive/delete notes
- AI-suggested tags
- AI-generated summaries
- File download for uploaded notes

### Q&A Sessions

- Create session with 1-5 notes
- Chat interface with message history
- Real-time AI responses
- Source note attribution
- Session management

### Search

- Semantic search (embedding-based)
- Keyword search
- Relevance scores
- Direct links to notes

### Admin Dashboard

- System statistics
- User management
- Role/status updates
- Only accessible to admin users

## Environment Variables

- `VITE_API_URL`: Backend API URL (default: http://localhost:8000)
- `VITE_APP_NAME`: Application name

## Development

The app uses Vite's HMR (Hot Module Replacement) for fast development. Changes to files will automatically reload in the browser.

## API Integration

All API calls are made through the `apiClient` in `src/api/client.ts` which:
- Automatically adds JWT tokens to requests
- Handles token refresh on 401 errors
- Provides type-safe API functions

## Styling

The app uses Tailwind CSS with a custom color scheme:
- Primary: Blue shades
- Secondary: Purple shades
- Consistent spacing and typography

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## License

Same as the main project.

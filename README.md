# TriHub

A modern triathlon community platform built with React and Supabase, featuring user authentication, post creation, and social interactions.

## Features

- 🔐 **User Authentication** - Email/password and GitHub OAuth sign-in
- 👤 **User Profiles** - Customizable biographies and post history
- 📝 **Post Management** - Create, edit, delete, and view posts
- 👍 **Voting System** - One upvote per user per post with toggle functionality
- 💬 **Comments** - Engage with posts through comments
- 🌙 **Dark Mode** - Automatic theme switching based on system preferences
- 🔍 **Search & Sort** - Find posts by title, sort by newest or most popular

## Tech Stack

- **Frontend**: React, Vite, React Router
- **Backend**: Supabase (PostgreSQL, Auth, RLS)
- **Styling**: CSS Custom Properties with dark mode support

## Quick Start

### 1. Clone and Install
```bash
git clone <your-repo-url>
cd TriHub
npm install
```

### 2. Set up Supabase
1. Create a new project at [supabase.com](https://supabase.com)
2. Copy your project URL and anon key
3. Create `.env` file in project root:
```env
VITE_SUPABASE_URL=your-project-url
VITE_SUPABASE_ANON_KEY=your-anon-key
```

### 3. Database Setup
Run the SQL schema in your Supabase SQL editor:
```bash
# Copy and paste the contents of supabase-schema.sql
```

### 4. Start Development
```bash
npm run dev
```

Visit `http://localhost:5173` to see the app!

## Database Schema

- **profiles** - User profiles with usernames and biographies
- **posts** - Community posts with titles, content, and upvotes
- **comments** - Post comments with author tracking
- **upvotes** - User upvote tracking (one per user per post)

## Key Features

### Authentication
- Email/password sign-up and sign-in
- GitHub OAuth integration
- Automatic profile creation on signup
- Persistent sessions

### Posts
- Rich text posts with optional images
- Real-time upvote counts
- Author-only edit/delete permissions
- Search and filtering

### User Experience
- Responsive design for all devices
- Smooth dark/light mode transitions
- Loading states and error handling
- Intuitive navigation

## Project Structure

```
src/
├── Components/          # React components
│   ├── CreatePost.jsx   # Post creation form
│   ├── PostDetail.jsx   # Individual post view
│   ├── PostList.jsx     # Posts listing
│   ├── Profile.jsx      # User profile page
│   └── SignIn.jsx       # Authentication
├── lib/                 # API utilities
│   ├── postsApi.js      # Post operations
│   └── supabaseClient.js # Supabase config
├── AuthContext.jsx      # Authentication state
└── styles.css          # Global styles with dark mode
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

MIT License - see LICENSE file for details
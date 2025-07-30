Travel Trek 🌍
==============

A comprehensive travel planning application built with Next.js 14 and Supabase that allows users to create, manage, and collaborate on travel itineraries with interactive maps and real-time collaboration features.

✨ Features
----------

*   **Trip Planning**: Create detailed travel itineraries with multiple destinations
    
*   **Interactive Maps**: Visualize your trip routes and locations using dynamic maps
    
*   **Day-by-Day Scheduling**: Organize activities by specific days and times
    
*   **Photo Management**: Upload and manage travel photos with cloud storage
    
*   **Real-time Collaboration**: Share trips and collaborate with other travelers
    
*   **User Profiles**: Manage personal profiles with avatar uploads
    
*   **Destination Discovery**: Explore and select from curated travel destinations
    
*   **Responsive Design**: Fully responsive interface for all devices
    

🚀 Tech Stack
-------------

*   **Frontend**: Next.js 14 (App Router), React, TypeScript, Tailwind CSS
    
*   **Backend**: Supabase (Database, Authentication, Storage, Real-time)
    
*   **Maps**: Interactive mapping functionality
    
*   **UI Components**: Custom UI components with shadcn/ui
    
*   **State Management**: React Context API
    
*   **Authentication**: Supabase Auth
    

📁 Project Structure
--------------------

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML`   src/  ├── app/                          # Next.js App Router  │   ├── actions/                  # Server Actions  │   │   ├── create-activity-action.ts  │   │   ├── create-full-trip-action.ts  │   │   ├── create-itinerary-action.ts  │   │   ├── delete-activity-action.ts  │   │   ├── delete-trip-action.ts  │   │   ├── get-all-trips-action.ts  │   │   ├── share-trip.ts  │   │   └── update-activity-order-action.ts  │   ├── api/                      # API Routes  │   │   ├── collab-requests/      # Collaboration management  │   │   ├── day-schedule/         # Daily itinerary management  │   │   ├── delete-photo/         # Photo deletion  │   │   ├── destination/          # Destination data  │   │   ├── get-destination-with-photo/  │   │   ├── get-uploaded-photos/  │   │   ├── selected-trip/        # Trip selection  │   │   ├── upload-photos/        # Photo uploads  │   │   └── users/                # User management  │   ├── dashboard/                # Protected dashboard pages  │   │   ├── collaboration/        # Collaboration management  │   │   └── trips/                # Trip management  │   │       └── [trip_id]/        # Individual trip pages  │   ├── destination/              # Destination discovery  │   ├── login/                    # Authentication pages  │   ├── signup/  │   └── faq/                      # FAQ page  ├── components/                   # React Components  │   ├── destination/              # Destination-specific components  │   ├── layout/                   # Layout components (navbar, footer, etc.)  │   ├── map/                      # Map components  │   ├── trip/                     # Trip management components  │   ├── tripItem/                 # Individual trip item components  │   └── ui/                       # Reusable UI components  ├── context/                      # React Context  │   └── trip-context.tsx  ├── lib/                          # Utilities and configurations  │   ├── destinations/             # Destination data and helpers  │   ├── helpers/                  # Utility functions  │   ├── supabase/                 # Supabase configuration  │   ├── types.ts                  # TypeScript type definitions  │   └── utils.ts                  # General utilities  └── middleware.ts                 # Next.js middleware   `

🛠️ Installation
----------------

1.  git clone https://github.com/yourusername/travel-trek.gitcd travel-trek
    
2.  npm install# oryarn install# orpnpm install
    
3.  \# Supabase ConfigurationNEXT\_PUBLIC\_SUPABASE\_URL=your\_supabase\_project\_urlNEXT\_PUBLIC\_SUPABASE\_ANON\_KEY=your\_supabase\_anon\_keySUPABASE\_SERVICE\_ROLE\_KEY=your\_supabase\_service\_role\_key# Optional: Map API keys if using external map servicesNEXT\_PUBLIC\_MAP\_API\_KEY=your\_map\_api\_key
    
4.  \-- Enable necessary extensionscreate extension if not exists "uuid-ossp";-- Create profiles tablecreate table profiles ( id uuid default gen\_random\_uuid() primary key, user\_id uuid references auth.users not null, email text, full\_name text, avatar\_url text, created\_at timestamp with time zone default timezone('utc'::text, now()) not null, updated\_at timestamp with time zone default timezone('utc'::text, now()) not null, constraint profiles\_user\_id\_unique unique (user\_id));-- Add other necessary tables for trips, activities, etc.
    
5.  **Storage Setup**Create the following buckets in Supabase Storage:
    
    *   travelplanner (for avatars and trip photos)
        
6.  npm run dev# oryarn dev# orpnpm dev
    
7.  **Open your browser**Navigate to [http://localhost:3000](http://localhost:3000/)
    

🗄️ Database Schema
-------------------

### Key Tables

*   **profiles**: User profile information
    
*   **trips**: Main trip data
    
*   **itineraries**: Trip itinerary details
    
*   **activities**: Individual trip activities
    
*   **destinations**: Available travel destinations
    
*   **trip\_photos**: Photo management
    
*   **collaborations**: Trip sharing and collaboration
    

🔐 Authentication
-----------------

The app uses Supabase Authentication with:

*   Email/Password signup and login
    
*   Protected routes with middleware
    
*   User session management
    
*   Profile management with avatar uploads
    

📱 Key Features Breakdown
-------------------------

### Trip Management

*   Create comprehensive trip itineraries
    
*   Add multiple destinations per trip
    
*   Organize activities by day and time
    
*   Drag-and-drop activity reordering
    
*   Trip deletion and editing
    

### Collaboration

*   Share trips with other users
    
*   Real-time collaboration features
    
*   User search and invitation system
    
*   Collaborative trip editing
    

### Photo Management

*   Upload trip photos to cloud storage
    
*   Photo gallery for each trip
    
*   Image optimization and storage management
    

### Interactive Maps

*   Visual trip route planning
    
*   Location selection and mapping
    
*   Geographic trip visualization
    

🚀 Deployment
-------------

### Vercel (Recommended)

1.  Push your code to GitHub
    
2.  Connect your repository to Vercel
    
3.  Add environment variables in Vercel dashboard
    
4.  Deploy automatically
    

### Other Platforms

The app can be deployed on any platform that supports Next.js:

*   Netlify
    
*   Railway
    
*   AWS Amplify
    
*   DigitalOcean App Platform
    

🧪 Development
--------------

### Available Scripts

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML`   npm run dev          # Start development server  npm run build        # Build for production  npm run start        # Start production server  npm run lint         # Run ESLint  npm run type-check   # Run TypeScript checks   `

### Code Structure Guidelines

*   Use TypeScript for all new files
    
*   Follow the established folder structure
    
*   Components should be properly typed
    
*   Use Server Actions for data mutations
    
*   API routes for external integrations
    

🤝 Contributing
---------------

1.  Fork the repository
    
2.  Create a feature branch (git checkout -b feature/amazing-feature)
    
3.  Commit your changes (git commit -m 'Add some amazing feature')
    
4.  Push to the branch (git push origin feature/amazing-feature)
    
5.  Open a Pull Request
    

📄 License
----------

This project is licensed under the MIT License - see the [LICENSE](https://claude.ai/chat/LICENSE) file for details.

🆘 Support
----------

For support and questions:

*   Create an issue on GitHub
    
*   Check the FAQ page in the application
    
*   Review the Supabase documentation for database-related questions
    

🙏 Acknowledgments
------------------

*   [Next.js](https://nextjs.org/) for the amazing React framework
    
*   [Supabase](https://supabase.com/) for the backend infrastructure
    
*   [Tailwind CSS](https://tailwindcss.com/) for the utility-first CSS framework
    
*   [shadcn/ui](https://ui.shadcn.com/) for beautiful UI components
    

**Happy Traveling! 🌟**
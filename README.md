# TravelTrek 🌍✈️

Welcome to **TravelTrek**, a modern web application built with **Next.js** and **Supabase** that helps you plan, collaborate, and share your travel itineraries seamlessly. Whether you're looking to map out your next adventure or plan a trip with friends, TravelTrek has got you covered! 🗺️💼

This project allows users to create detailed trips, manage activities, share itineraries, and even upload destination photos—all in one place. 

## 🚀 Features

- **Trip Management:** Easily create, update, and delete trips. 🗂️
- **Activity Management:** Add, remove, and reorder activities in your trip. 🎯
- **Collaborative Planning:** Invite friends to collaborate on trips and share your itineraries. 👥
- **Photo Uploads:** Share photos of your travel destinations and activities. 📸
- **Interactive Maps:** View your destinations on an interactive map. 🗺️
- **User Authentication:** Secure login and signup functionality with Supabase. 🔐

## 🛠️ Tech Stack

- **Next.js**: A React framework for building fast, user-friendly applications.
- **Supabase**: An open-source backend-as-a-service that powers the database, authentication, and storage.
- **TypeScript**: For better code quality and developer experience.
- **Tailwind CSS** (optional): For styling your app (if applicable).
- **Mapbox** (optional): For rendering interactive maps.

## 📂 Directory Structure

Here’s an overview of the directory structure for **TravelTrek**:

```
└── src/
     ├── app/
     │    ├── actions/
     │    ├── api/
     │    ├── dashboard/
     │    ├── destination/
     │    ├── error/
     │    ├── faq/
     │    ├── favicon.ico
     │    ├── globals.css
     │    ├── layout.tsx
     │    ├── login/
     │    ├── page.tsx
     │    └── signup/
     ├── components/
     │    ├── destination/
     │    ├── layout/
     │    ├── map/
     │    ├── trip/
     │    ├── tripItem/
     │    └── ui/
     ├── context/
     │    └── trip-context.tsx
     ├── lib/
     │    ├── destinations/
     │    ├── helpers/
     │    ├── supabase/
     │    ├── types.ts
     │    └── utils.ts
     └── middleware.ts
```

### Key Folders and Files:

- **`src/app/actions/`**: Contains the action files responsible for CRUD operations related to trips and activities. 
  - Files like `create-trip-action.ts` and `update-activity-order-action.ts` handle the core logic of managing trip-related data.

- **`src/app/api/`**: The API routes that handle requests such as fetching trips, uploading photos, and handling user authentication. 
  - Example: `src/app/api/collab-requests/route.tsx` handles collaboration-related requests.

- **`src/app/dashboard/`**: Contains the layout and pages related to the user dashboard, where users can view and manage their trips and collaborations.

- **`src/app/layout.tsx`**: The main layout of the app, containing shared elements like the header, footer, and navigation.

- **`src/components/`**: Contains all React components used throughout the app.
  - For example, `destination/interactive-map-section.tsx` displays an interactive map for each trip's destinations.

- **`src/lib/supabase/`**: Contains files to handle interactions with Supabase, including database queries and authentication.

- **`src/context/trip-context.tsx`**: The context provider to manage the global state of the trip data across your app.

- **`src/middleware.ts`**: Custom middleware for handling authentication and other pre/post request operations.

## ⚙️ Setup

### Prerequisites

- **Node.js** (>= 14.x)
- **Yarn** (or npm)
- **Supabase Account** - You'll need a Supabase project for database and authentication.
- **Mapbox API Key** (optional, if using maps)

### 1. Clone the repository

```bash
git clone https://github.com/yourusername/traveltrek.git
cd traveltrek
```

### 2. Install dependencies

Using Yarn:

```bash
yarn install
```

Or using npm:

```bash
npm install
```

### 3. Configure environment variables

Create a `.env.local` file in the root of the project and add the following:

```bash
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
MAPBOX_API_KEY=your-mapbox-api-key (optional)
```

Make sure to replace the placeholders with your actual Supabase and Mapbox credentials.

### 4. Run the development server

```bash
yarn dev
```

Or using npm:

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) to view your app.

## 🔍 Explore the Features

### 1. **Trip Management**
   - Add, update, or delete trips via the Dashboard.
   - View trip details and activities with a clean, intuitive UI.

### 2. **Collaborative Planning**
   - Invite others to join your trip planning.
   - Share itineraries and activity plans in real-time.

### 3. **Interactive Map**
   - Use the interactive map to visualize your travel destinations.
   - Add and modify trip destinations easily on the map.

### 4. **User Authentication**
   - Sign up and log in with Supabase authentication.
   - Secure user sessions with token-based authentication.

## 🤝 Contributing

We welcome contributions! Please feel free to fork the repository, submit issues, and create pull requests.

### Steps to Contribute:
1. Fork the repository
2. Create a new branch (`git checkout -b feature-branch`)
3. Make your changes
4. Commit your changes (`git commit -am 'Add new feature'`)
5. Push to your fork (`git push origin feature-branch`)
6. Submit a pull request

Please ensure to follow the project's code style and conventions when submitting changes.

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Authors

- **Your Name** - [@subodha656@-creator](https://github.com/subodha656-creator)
  
Feel free to reach out for any queries, suggestions, or collaborations! 

## 📞 Contact

- Email: [subodha656@gmail.com](mailto:subodha656@gmail.com)
- GitHub: [https://github.com/subodha656-creator](https://github.com/subodha656-creator)

---

Happy Travels! 🌍✈️
# Fastyr Frontend Test

Welcome to the **Fastyr Frontend Test** project! This application showcases a responsive frontend setup using **Next.js**, **Apollo GraphQL**, **Shadcn UI**, and **Tailwind CSS**, demonstrating skills essential for a Senior Frontend Developer position.

## Project Overview

This application is designed to demonstrate best practices in:

- **Project Structure**: Organized and maintainable project setup.
- **Code Readability**: Clear, easy-to-follow code.
- **GraphQL Integration**: Efficient data fetching and user-friendly UI components.
- **Responsive Design**: Effective use of React.js/Next.js principles.

## Key Routes and Features

### `/users` - **Users Page**

- **Description**: Displays a list of users.
- **Objective**: View all users, add new users.
- **Components**: Shadcn UI Card, DataTable.
- **GraphQL Operations**: Fetch all users, create a user.

### `/users/[id]` - **User Detail Page**

- **Description**: Details for a single user.
- **Objective**: View, update, delete user details.
- **Components**: Shadcn UI components for form and data display.
- **GraphQL Operations**: Fetch user by ID, update, delete user.

### `/albums` - **Albums Page**

- **Description**: Displays a list of albums.
- **Objective**: View all albums, search/filter, bulk delete, import from CSV/XLSX with data validation.
- **Components**: Shadcn UI DataTable, TanStack Table for search/filter.
- **GraphQL Operations**: Fetch all albums, create an album.

### `/albums/[id]` - **Album Detail Page**

- **Description**: Details for a single album.
- **Objective**: View, update, delete album details.
- **Components**: Shadcn UI for album detail display and form handling.
- **GraphQL Operations**: Fetch album by ID, update, delete album.

### `/audio` - **Audio Recorder Page**

- **Description**: Records and plays audio from the user's microphone.
- **Objective**: Record audio, save to local storage in base64 format, playback with buffering.
- **Components**: Custom recording/playback controls.
- **Features**: Audio buffering, saving audio in base64 format.

## Setup & Installation

1. **Clone Repository**:

   ```bash
   git clone https://github.com/yourusername/fastyr-frontend-test.git
   ```

2. **Install Dependencies**:

   ```bash
   npm install
   ```

3. **Run Project Locally**:
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser.

## Deployment

This project is deployed at [Deployment Link].

## Additional Information

- **GraphQL API**: Integrated with [https://graphqlzero.almansi.me/api](https://graphqlzero.almansi.me/api).
- **Styling**: Tailwind CSS and Shadcn UI ensure a consistent and modern UI.
- **Documentation**: Inline comments are provided for key logic to enhance code readability.

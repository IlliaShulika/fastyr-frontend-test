export default function HomePage() {
  return (
    <div className="container mx-auto p-8">
      <h1 className="text-4xl font-bold mb-4">Fastyr Frontend Test</h1>
      <p className="text-lg mb-8">
        Welcome to the Fastyr Frontend Test project! This application is built
        to showcase a responsive frontend setup using <strong>Next.js</strong>,{" "}
        <strong>Apollo GraphQL</strong>, <strong>Shadcn UI</strong>, and{" "}
        <strong>Tailwind CSS</strong> for assessment as a Senior frontend
        developer.
      </p>

      <section className="mb-10">
        <h2 className="text-3xl font-semibold mb-2">Project Overview</h2>
        <p className="mb-4">This application demonstrates best practices in:</p>
        <ul className="list-disc pl-6">
          <li>Project structure and engineering practices</li>
          <li>Code readability and maintainability</li>
          <li>GraphQL API integration and user-friendly UI components</li>
          <li>Responsive design and React.js/Next.js principles</li>
        </ul>
      </section>

      <section className="mb-10">
        <h2 className="text-3xl font-semibold mb-2">Key Routes and Features</h2>

        <div className="mb-6">
          <h3 className="text-2xl font-bold mb-2">/users - Users Page</h3>
          <p>
            <strong>Description:</strong> Displays a list of users.
          </p>
          <p>
            <strong>Objective:</strong> View all users and add new ones.
          </p>
          <p>
            <strong>Components Used:</strong> Shadcn UI Card components,
            DataTable.
          </p>
          <p>
            <strong>GraphQL Operations:</strong> Fetch all users, create user.
          </p>
        </div>

        <div className="mb-6">
          <h3 className="text-2xl font-bold mb-2">
            /users/[id] - User Detail Page
          </h3>
          <p>
            <strong>Description:</strong> Displays details of a single user.
          </p>
          <p>
            <strong>Objective:</strong> View, update, and delete user details.
          </p>
          <p>
            <strong>Components Used:</strong> Shadcn UI components for form and
            data display.
          </p>
          <p>
            <strong>GraphQL Operations:</strong> Fetch user by ID, update,
            delete user.
          </p>
        </div>

        <div className="mb-6">
          <h3 className="text-2xl font-bold mb-2">/albums - Albums Page</h3>
          <p>
            <strong>Description:</strong> Displays a list of albums.
          </p>
          <p>
            <strong>Objective:</strong> View all albums, search/filter, bulk
            delete, and import from CSV/XLSX with data validation.
          </p>
          <p>
            <strong>Components Used:</strong> Shadcn UI DataTable, TanStack
            Table for search and filtering.
          </p>
          <p>
            <strong>GraphQL Operations:</strong> Fetch all albums, create album.
          </p>
        </div>

        <div className="mb-6">
          <h3 className="text-2xl font-bold mb-2">
            /albums/[id] - Album Detail Page
          </h3>
          <p>
            <strong>Description:</strong> Displays details of a single album.
          </p>
          <p>
            <strong>Objective:</strong> View, update, and delete album details.
          </p>
          <p>
            <strong>Components Used:</strong> Shadcn UI for album detail display
            and form handling.
          </p>
          <p>
            <strong>GraphQL Operations:</strong> Fetch album by ID, update,
            delete album.
          </p>
        </div>

        <div className="mb-6">
          <h3 className="text-2xl font-bold mb-2">
            /audio - Audio Recorder Page
          </h3>
          <p>
            <strong>Description:</strong> Records and plays audio from the
            user's microphone.
          </p>
          <p>
            <strong>Objective:</strong> Record audio, save to local storage in
            base64 format, and playback with buffering for a smooth experience.
          </p>
          <p>
            <strong>Components Used:</strong> Custom controls for
            recording/playback.
          </p>
          <p>
            <strong>Features:</strong> Audio buffering system, saving audio in
            base64.
          </p>
        </div>
      </section>

      <section className="mb-10">
        <h2 className="text-3xl font-semibold mb-2">Setup & Installation</h2>
        <ol className="list-decimal pl-6 mb-4">
          <li className="mb-2">
            Clone Repository:
            <pre className="bg-gray-100 p-2 rounded mt-1">
              git clone https://github.com/yourusername/fastyr-frontend-test.git
            </pre>
          </li>
          <li className="mb-2">
            Install Dependencies:
            <pre className="bg-gray-100 p-2 rounded mt-1">npm install</pre>
          </li>
          <li className="mb-2">
            Run Project Locally:
            <pre className="bg-gray-100 p-2 rounded mt-1">npm run dev</pre>
            Open{" "}
            <a href="http://localhost:3000" className="text-blue-500 underline">
              http://localhost:3000
            </a>{" "}
            in your browser.
          </li>
        </ol>
      </section>

      <section className="mb-10">
        <h2 className="text-3xl font-semibold mb-2">Deployment</h2>
        <p>
          This project is deployed to{" "}
          <a href="[Deployment Link]" className="text-blue-500 underline">
            [Deployment Link]
          </a>
          .
        </p>
      </section>

      <section>
        <h2 className="text-3xl font-semibold mb-2">Additional Information</h2>
        <ul className="list-disc pl-6">
          <li>
            <strong>GraphQL API:</strong> Integrated with
            https://graphqlzero.almansi.me/api.
          </li>
          <li>
            <strong>Styling:</strong> Tailwind CSS and Shadcn UI for consistent
            UI.
          </li>
          <li>
            <strong>Documentation:</strong> Inline comments for key logic and
            code readability.
          </li>
        </ul>
      </section>
    </div>
  );
}

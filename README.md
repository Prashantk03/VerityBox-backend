VerityBox (formerly TruthRoom) - Backend
Overview

VerityBox's backend manages user data, authentication, and interactions. Built with Node.js and Express, it handles API requests and provides real-time capabilities.

Technologies Used:

Node.js: Server-side JavaScript runtime

Express: Web framework for building APIs

MongoDB: Database to store user and post data

JWT: For user authentication (if applicable)

Socket.io: For real-time updates

Mongoose: For MongoDB object modeling

Features:

API Endpoints: CRUD operations for posts, comments, and users.

Real-time Updates: Through WebSockets for live feedback and comments.

Content Moderation: Automated and manual moderation for safe user experience.

Data Validation: Ensuring proper data validation before saving to the database.

Key Generation & Data Restore: Users can generate a key that allows restoring their data if browser cookies are cleared.

Error Handling: Centralized error handling for API responses.

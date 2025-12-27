# StayHub

StayHub is a full-stack web application for managing property listings, inspired by platforms like Airbnb. Users can create accounts, list properties for rent, browse and search listings, leave reviews, and manage their bookings.

## Features

- **User Authentication**: Secure login and signup using Passport.js
- **Listing Management**: Create, view, edit, and delete property listings
- **Image Uploads**: Upload and store images using Cloudinary
- **Interactive Maps**: Integrated Mapbox for location visualization
- **Reviews & Ratings**: Users can leave reviews on listings
- **Search Functionality**: Search listings by location or filters
- **Responsive Design**: Mobile-friendly UI with EJS templates

## Tech Stack

- **Backend**: Node.js, Express.js
- **Database**: MongoDB with Mongoose ODM
- **Frontend**: EJS (Embedded JavaScript Templates) with EJS Mate
- **Authentication**: Passport.js (Local Strategy)
- **File Storage**: Multer for uploads, Cloudinary for cloud storage
- **Maps**: Mapbox SDK
- **Validation**: Joi for input validation
- **Session Management**: Express Session with Connect Flash for messages
- **Other Libraries**: Method Override, Cookie Parser, Dotenv for environment variables

## Installation

1. Clone the repository:

   ```
   git clone https://github.com/pappuyadav95230/StayHub.git
   cd StayHub
   ```

2. Install dependencies:

   ```
   npm install
   ```

3. Set up environment variables:

   - Create a `.env` file in the root directory
   - Add your MongoDB connection string, Cloudinary credentials, Mapbox token, and session secret

4. Start the server:

   ```
   npm start
   ```

5. Open your browser and navigate to `http://localhost:3000`

## Project Structure

- `app.js`: Main application file
- `routes/`: Route handlers for listings, users, and reviews
- `controllers/`: Business logic for handling requests
- `models/`: Mongoose schemas for User, Listing, and Review
- `views/`: EJS templates for rendering pages
- `public/`: Static assets (CSS, JS, images)
- `middleware.js`: Custom middleware for authentication and validation
- `utils/`: Utility functions like error handling

## Contributing

Contributions are welcome! Please fork the repository and submit a pull request.

## License

This project is licensed under the ISC License.

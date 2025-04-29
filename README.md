
# Disconnected Ride App

## Architecture Overview

### Frontend
- React with TypeScript
- React Router for navigation
- Tailwind CSS for styling
- Context API for state management

### Backend
- Node.js with Express

## Why Node.js for the Backend?

We chose Node.js for our backend implementation for several reasons:

1. **JavaScript Ecosystem**: Using JavaScript on both frontend and backend allows for code reuse and a unified developer experience.

2. **Performance for I/O Operations**: Node.js is optimized for handling many concurrent connections with minimal overhead, making it ideal for real-time applications like ride-sharing.

3. **Real-time Capabilities**: Built-in support for WebSockets and event-driven architecture makes it perfect for tracking ride status and data usage updates in real-time.

4. **Scalability**: Node.js applications can be easily scaled horizontally to handle increased load.

5. **Large Package Ecosystem**: npm provides access to thousands of packages that can accelerate development.

6. **Low Resource Requirements**: Node.js has a relatively small footprint, allowing it to run efficiently on various hosting platforms.

7. **JSON Processing**: Since our application primarily exchanges JSON data, Node.js's native JSON handling makes data processing more efficient.

## Data Management

The application includes a data selection flow that:
1. Asks users if they have their own mobile data or need to request it
2. For users without their own data, simulates data usage
3. Tracks data consumption during app use and rides
4. Calculates data costs as part of the ride fare

This implementation enhances user experience by:
- Giving users choice over data usage
- Providing transparency about data costs
- Integrating data management into the core application flow

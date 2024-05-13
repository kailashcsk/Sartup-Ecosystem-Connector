# StartupSync

StartupSync is a comprehensive platform designed to connect, empower, and accelerate the growth of startups within the entrepreneurial ecosystem. Whether you're an entrepreneur seeking resources, a mentor looking to share expertise, or an investor scouting promising ventures, StartupSync is your go-to destination.

## Table of Contents

- [StartupSync](#startupsync)
  - [Table of Contents](#table-of-contents)
  - [Getting Started](#getting-started)
  - [Technology Stack](#technology-stack)
  - [Features](#features)
    - [User Management](#user-management)
    - [Home](#home)
    - [Dashboard](#dashboard)
    - [Recommendations](#recommendations)
    - [Community](#community)
    - [Resources](#resources)
    - [Messenger](#messenger)
    - [Search and Discovery](#search-and-discovery)
    - [Personalization](#personalization)
    - [Geolocation](#geolocation)
    - [Security and Privacy](#security-and-privacy)
  - [Contributing](#contributing)
  - [Credits](#credits)
  - [License](#license)

## Getting Started

To begin using StartupSync, follow these simple steps:

1. Clone the repository to your local machine.
```bash
$ git clone <git-url>
```
2. Enter into the directory and create a `.env` file.
```bash
$ cd <repo> && touch .env
```
3. Add the following `.env` variables
```bash
DATABASE_URL="postgres://username:password@host:port/database"
DATABASE_PASSWORD="************"
DATABASE_USER="username"
DATABASE_NAME="database"
DATABASE_HOST="host"
DATABASE_PORT="port"

ELEPHANT_SQL_API_KEY="****************"
AUTH_SECRET="************"

NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="pk_test_************"
CLERK_SECRET_KEY="sk_test_************"

NEXT_PUBLIC_CLERK_SIGN_IN_URL="/sign-in"
NEXT_PUBLIC_CLERK_SIGN_UP_URL="/sign-up"
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL="/dashboard"
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL="/dashboard"
NEXT_PUBLIC_CLERK_REDIRECT_URL="/dashboard"

NEXT_PUBLIC_WEBHOOK_SECRET="whsec_************"

WEBHOOK_SECRET="whsec_************"

NEXT_PUBLIC_PUBNUB_PUBLISH_KEY="pub-c-************"
NEXT_PUBLIC_PUBNUB_SUBSCRIBE_KEY="sub-c-************"
NEXT_PUBLIC_PUBNUB_SECRET_KEY="sec-c-************"

OPEN_AI_API="************"

ELASTIC_SEARCH_API="************"

SERP_API="************"
```
4. Install dependencies using npm.
```bash
$ npm install
```
5. Run the development server using one of the provided commands.
```bash
$ npm run dev
```
6. Launch a browser and go to `http://localhost:3000` to view the app.

## Technology Stack

StartupSync is built using the following technologies:

- **Next.js**: A React framework for server-side rendering and building web applications.
- **React**: A JavaScript library for building user interfaces.
- **TypeScript**: A typed superset of JavaScript that compiles to plain JavaScript.
- **Tailwind CSS**: A utility-first CSS framework for rapidly building custom designs.
- **Prisma**: A modern database toolkit for TypeScript and Node.js.
- **PostgreSQL**: A powerful open-source relational database system.
- **Clerk**: An authentication and user management service for web applications.
- **PubNub**: A real-time messaging and streaming platform for building chat and collaboration features.
- **OpenAI**: An artificial intelligence research laboratory consisting of the for-profit corporation OpenAI LP.
- **Elastic Search**: A distributed, open-source search and analytics engine for all types of data.
- **SERP API**: A service that provides search engine results page (SERP) data for various search engines.
- **Radix UI**: A collection of unstyled, accessible UI components for building web applications.
- **date-fns**: A lightweight JavaScript library for manipulating and formatting dates.
- **Leaflet**: An open-source JavaScript library for mobile-friendly interactive maps.

## Features

### User Management
- User registration and authentication using Clerk
- Profile creation and management for startups, mentors, and investors
  - Update profile details (name, email, avatar, bio, location, industry, role)
  - Set profile visibility
  - Delete account

### Home
- Personalized user feeds based on location, interests, and industry
  - Like and comment on posts
  - AI-powered comment suggestions
  - Emoji support in comments
- Discover founders with similar interests

### Dashboard
- View and analyze startup profiles and funding rounds
  - Filter startups based on funding rounds
  - Export startup data for further analysis
- Access analytics on startup activity

### Recommendations
- AI-powered event recommendations based on location
  - Tech fairs, investor summits, networking mixers, and meetups
  - View event details (name, date, location, description)
  - Get personalized recommendations on attending events
- Interactive maps with geolocation features using Leaflet

### Community
- Search and discover mentors, investors, and founders
  - View short profile summaries (name, role, avatar)
  - Filter users by role
- Follow and unfollow users to build connections

### Resources
- Access trending resources and articles on startups
- Watch video resources to gain insights and knowledge

### Messenger
- Real-time messaging and collaboration using PubNub
  - Chat with connections
  - Send text messages, images, and files
  - Get AI-powered message suggestions
  - Live unread message count for seamless communication

### Search and Discovery
- Powerful search capabilities using Elastic Search
  - Search for startups, mentors, investors, and resources
  - Advanced filtering and sorting options
- Integration with SERP API for accessing search engine data

### Personalization
- AI-powered recommendations and insights using OpenAI
  - Personalized content and resource suggestions
  - Intelligent matching of startups with mentors and investors
- Set theme preferences for a customized user experience

### Geolocation
- Interactive maps and geolocation features using Leaflet
  - Discover nearby startups, events, and resources
  - Get location-based recommendations and insights

### Security and Privacy
- Secure user authentication and authorization using Clerk
- Control profile visibility and privacy settings
- Protect sensitive data and ensure compliance with regulations
- 
## Contributing

We welcome contributions from the community! If you'd like to contribute to StartupSync, please follow these steps:

1. Fork the repository on GitHub.
2. Create a new branch with a descriptive name for your feature or bug fix.
3. Make your changes and commit them with clear and concise messages.
4. Push your changes to your forked repository.
5. Open a pull request to the main repository, describing your changes in detail.

Please ensure that your code adheres to our coding standards and passes all existing tests.

## Credits

- [Prajwal](https://github.com/Prajwal-S-Venkatesh/)
- [Kailash](https://github.com/kailashcsk/)

## License

This project is licensed under the [MIT License](https://opensource.org/license/mit).

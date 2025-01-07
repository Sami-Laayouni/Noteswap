# NoteSwap Frontend

This repository contains the NEXTJS frontend for NoteSwap.

## Table of Contents

- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Running the App](#running-the-app)
- [Project Structure](#project-structure)
  - [Client](#client)
  - [Server](#server)
- [Environment Variables](#environment-variables)
- [Contributors](#contributors)

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/en/) (v18 or higher)
- [Yarn](https://yarnpkg.com/)

### Installation

1. Clone the repo

   ```sh
   git clone https://github.com/DeviteamITS/campus-go-mobile
   ```

2. Install YARN packages

   ```sh
   yarn install
   ```

### Running the App

1. Start the development server

   ```sh
   yarn start
   ```

   This will start the server on `localhost:3000`.

2. Add a `.env.local` file with the following dummy data:

   ```sh
   NEXT_PUBLIC_GOOGLE_CLIENT_ID=example-google-client-id
   NEXT_PUBLIC_GOOGLE_CLIENT_SECRET=example-google-client-secret
   NEXT_PUBLIC_REDIRECT_URI=http://localhost:3000/api/auth/continue_with_google_callback
   NEXT_PUBLIC_REDIRECT_URI_LOGIN=http://localhost:3000/api/auth/login_with_google_callback
   NEXT_PUBLIC_GOOGLE_UX_MODE=fullscreen

   NEXT_PUBLIC_CALENDAR_KEY=AIzaSyBh-YWiLGw-MHu4MXaTncCQhD8m_GnRS-g

   NEXT_PUBLIC_MICROSOFT_SECRET=microsoft-key
   NEXT_PUBLIC_MICROSOFT_APP_ID=microsoft-app-id

   GOOGLE_CLIENT_EMAIL=google-client-email
   GOOGLE_PRIVATE_KEY=google-private-key-very-long

   GOOGLE_PROJECT_ID=google-project-id
   GOOGLE_BUCKET_NAME=google-bucket-name

   NEXT_PUBLIC_EMAIL=support@noteswap.org
   NEXT_PUBLIC_PASSWORD=rNNh5jkIzoSXX67

   NEXT_PUBLIC_URL=http://localhost:3000/
   NEXT_PUBLIC_JWT_SECRET=example-jwt-secret (generate one like this: node -e "console.log(require('crypto').randomBytes(32).toString('hex'))")
   MONGODB_URI=example-mongodb-uri

   NEXT_PUBLIC_PINECONE_KEY=example-pinecone-key
   NEXT_PUBLIC_PINECONE_ENV=example-pinecone-env

   NEXT_PUBLIC_ONESIGNAL_REST=onesignal-rest-api
   ```

## Project Structure

### Client

The client-side code is located in the `client` directory. Below is an overview of its structure:

- `.env.local`: Environment variables for local development.
- `.eslintrc.json`: ESLint configuration file.
- `.gitignore`: Specifies files to be ignored by Git.
- `.husky/`: Contains Git hooks.
- `.next/`: Next.js build output.
- `.npmrc`: NPM configuration file.
- `.nvmrc`: Node version manager configuration file.
- `.prettierignore`: Specifies files to be ignored by Prettier.
- `.prettierrc`: Prettier configuration file.
- `.vscode/`: Visual Studio Code settings.
- `actions/`: Contains action-related JavaScript files.
- `commitlint.config.js`: Commit lint configuration.
- `components/`: React components.
- `context/`: React context providers.
- `layouts/`: Layout components.
- `middleware/`: Middleware functions.
- `models/`: Data models.
- `next-i18next.config.js`: Internationalization configuration.
- `next.config.js`: Next.js configuration.
- `package.json`: Project metadata and dependencies.
- `pages/`: Next.js pages.
- `public/`: Static assets.
- `README.md`: Project documentation.
- `services/`: Service classes and functions.
- `styles/`: CSS and styling files.
- `utils/`: Utility functions.
- `yarn-error.log`: Yarn error log.

#### Detailed Folder Structure

- `components/`: Contains reusable React components. For example, `Modals`, `Cards`, `Overlay`, etc.
- `context/`: Contains React context providers for managing global state.
- `layouts/`: Contains layout components that wrap around pages.
- `middleware/`: Contains middleware functions for handling requests.
- `models/`: Contains Mongoose models for MongoDB.
- `pages/`: Contains Next.js pages. Each file in this directory corresponds to a route in the application.
- `public/`: Contains static assets like images, fonts, etc.
- `services/`: Contains service classes and functions for making API calls.
- `styles/`: Contains CSS and styling files. The styles are organized to match the components they style.
- `utils/`: Contains utility functions used throughout the project.

### Server

The server-side code is located in the `server` directory. Below is an overview of its structure:

- `.gitignore`: Specifies files to be ignored by Git.
- `package.json`: Project metadata and dependencies.
- `server.js`: Main server file.
- `TODO.txt`: List of tasks to be completed.

## Environment Variables

The project uses environment variables to manage configuration. These variables are defined in the `.env.local` file. Below are some of the key variables:

- `NEXT_PUBLIC_GOOGLE_CLIENT_ID`: Google client ID.
- `NEXT_PUBLIC_GOOGLE_CLIENT_SECRET`: Google client secret.
- `NEXT_PUBLIC_REDIRECT_URI`: Redirect URI for signup.
- `NEXT_PUBLIC_REDIRECT_URI_LOGIN`: Redirect URI for login.
- `NEXT_PUBLIC_GOOGLE_UX_MODE`: Google UX mode.
- `NEXT_PUBLIC_CALENDAR_KEY`: Google calendar key.
- `NEXT_PUBLIC_MICROSOFT_SECRET`: Microsoft secret key.
- `NEXT_PUBLIC_MICROSOFT_APP_ID`: Microsoft app ID.
- `GOOGLE_CLIENT_EMAIL`: Google client email.
- `GOOGLE_PRIVATE_KEY`: Google private key.
- `GOOGLE_PROJECT_ID`: Google project ID.
- `GOOGLE_BUCKET_NAME`: Google bucket name.
- `NEXT_PUBLIC_EMAIL`: Public email.
- `NEXT_PUBLIC_PASSWORD`: Public password.
- `NEXT_PUBLIC_URL`: Public URL.
- `NEXT_PUBLIC_JWT_SECRET`: JWT secret key.
- `MONGODB_URI`: MongoDB URI.
- `NEXT_PUBLIC_PINECONE_KEY`: Pinecone key.
- `NEXT_PUBLIC_PINECONE_ENV`: Pinecone environment.
- `NEXT_PUBLIC_ONESIGNAL_REST`: OneSignal REST API key.

## Contributors

Below are the list of people who spent time pressing some buttons to make this project possible:

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore-start -->
<!-- markdownlint-disable -->
<table>
  <tr>
    <td align="center"><a href="https://github.com/Sami-Laayouni"><img src="https://avatars.githubusercontent.com/u/131308960?v=4" width="180px;" alt=""/><br /><sub><b>Sami Laayouni</b></sub></a><br /></td>
    <td align="center"><a href="https://github.com/asuperadvancedusername"><img src="https://avatars.githubusercontent.com/u/137073947?v=4" width="180px;" alt=""/><br /><sub><b>Ali Zaid</b></sub></a><br /></td> 
  </tr>
</table>

<!-- markdownlint-restore -->
<!-- prettier-ignore-end -->

<!-- ALL-CONTRIBUTORS-LIST:END -->

# NoteSwap Frontend

This repository contains the NEXTJS frontend for NoteSwap

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/en/) (v18 or higher)

### Installation

1. Clone the repo

   ```sh
   git clone https://github.com/DeviteamITS/campus-go-mobile
   ```

2. Install YARN packages
   ```sh
    yarn install
   ```
3. Run the app
   ```sh
   yarn start
   ```

This will start the server on localhost:3000. A couple of features many not be working at first so you might need to add an
.env.local with the following dummy data:

```sh
NEXT_PUBLIC_GOOGLE_CLIENT_ID=example-google-client-id
NEXT_PUBLIC_GOOGLE_CLIENT_SECRET=example-google-client-secret
NEXT_PUBLIC_REDIRECT_URI=example-redirect-uri-signup
NEXT_PUBLIC_REDIRECT_URI_LOGIN=example-redirect-uri-login
NEXT_PUBLIC_GOOGLE_UX_MODE=fullscreen

NEXT_PUBLIC_CALENDAR_KEY=google-calendar-key

NEXT_PUBLIC_MICROSOFT_SECRET=microsoft-key
NEXT_PUBLIC_MICROSOFT_APP_ID=microsoft-app-id

HUGGING_FACE_API=example-hugging-face-api
NEXT_PUBLIC_OPENAI_KEY=example-openai-key

GOOGLE_CLIENT_EMAIL=google-client-email
GOOGLE_PRIVATE_KEY=google-private-key-very-long
GOOGLE_PROJECT_ID=google-project-id
GOOGLE_BUCKET_NAME=google-bucket-name

NEXT_PUBLIC_EMAIL=next-public-email
NEXT_PUBLIC_PASSWORD=next-public-password
NEXT_PUBLIC_SUPERVISOR_EMAIL=next-public-supervisors-email
NEXT_PUBLIC_SUPERVISOR_NAME=next-public-supervisors-name

NEXT_PUBLIC_URL=http://localhost:3000/
NEXT_PUBLIC_JWT_SECRET=example-jwt-secret
MONGODB_URI=example-mongodb-uri

NEXT_PUBLIC_PINECONE_KEY=example-pinecone-key
NEXT_PUBLIC_PINECONE_ENV=example-pinecone-env

NEXT_PUBLIC_ONESIGNAL_REST=onesignal-rest-api
```

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

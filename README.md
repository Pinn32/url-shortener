# URL Shortener

A Next.js URL shortener for creating shareable links with custom slugs. Guests can shorten URLs immediately, while users who log in with Google can store and manage links associated with their account.

**[Open the deployed app](https://url-to.vercel.app/)**

## Features

- Shorten a long URL with a custom slug.
- Continue as a guest without creating an account.
- Log in securely with Google OAuth through Auth.js.
- Save newly shortened URLs to the logged-in user's account.
- Set a displayed username, initially derived from the user's Gmail address.
- View all URLs created while logged in.
- Download all account-specific saved URLs as JSON or copy the JSON to the clipboard.
- Edit a saved URL's slug.
- Add an optional description of up to 10 words.
- View creation and last-edited dates while editing a URL.
- Delete a saved URL after confirming the action.

Guest-created URLs continue to redirect normally, but they are not attached to an account and cannot be managed from the saved URL list.

## Usage

Enter the destination URL:

```text
https://example.com/your/very/long/url/
```

Choose a slug:

```text
https://url-to.vercel.app/your-slug
```

Select **Click to Compact** to create the shortened URL. When logged in, the new URL is added to **Your shortened URLs**, where its slug and description can be edited or the URL can be deleted.

Use **Edit username** under **Your account** to change the name displayed in the app header.

## Local Development

Install dependencies and start the development server:

```bash
pnpm install
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

## Environment Variables

Copy `.env.example` to `.env.local` and provide the following values:

```dotenv
MONGO_URI=mongodb+srv://username:password@cluster.example.mongodb.net/
AUTH_SECRET=generate-a-long-random-secret
AUTH_GOOGLE_ID=your-google-oauth-client-id
AUTH_GOOGLE_SECRET=your-google-oauth-client-secret
```

Generate an Auth.js secret with:

```bash
openssl rand -base64 32
```

In Google Cloud, configure these authorized redirect URIs for the OAuth client:

```text
http://localhost:3000/api/auth/callback/google
https://your-production-domain.example/api/auth/callback/google
```

## Technology

- Next.js 16 with the App Router
- React 19
- Auth.js with the Google provider
- Auth.js MongoDB adapter
- MongoDB
- styled-components
- Quantico through `next/font`

## Verification

```bash
pnpm lint
pnpm exec tsc --noEmit
pnpm build
```

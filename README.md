
# My Personal Portfolio

This is a personal portfolio website showcasing my journey and skills in cybersecurity, software, and web development. It is built with Next.js and Tailwind CSS, and it uses Firebase for backend services.

## Getting Started

To get a local copy up and running, follow these simple steps.

### Prerequisites

* Node.js (v18 or later)
* npm or yarn

### Installation

1. Clone the repo
   ```sh
   git clone https://github.com/dfbro/SigmaBangetPortfolioGweh
   ```
2. Install NPM packages
   ```sh
   npm install
   ```

### Environment Variables

This project uses environment variables to configure the application. You will need to create a `.env.local` file in the root of the project and add the following variables:

1. Copy the example file:
   ```sh
   cp .env.example .env.local
   ```

2. Fill in the required values in `.env.local`:

   * `NEXT_PUBLIC_FIREBASE_PROJECT_ID`: Your Firebase project ID.
   * `NEXT_PUBLIC_FIREBASE_APP_ID`: Your Firebase app ID.
   * `NEXT_PUBLIC_FIREBASE_API_KEY`: Your Firebase API key.
   * `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`: Your Firebase auth domain.
   * `NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID`: Your Firebase measurement ID.
   * `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`: Your Firebase messaging sender ID.
   * `NEXT_PUBLIC_NAME`: Your name.
   * `NEXT_PUBLIC_EMAIL`: Your email address.
   * `NEXT_PUBLIC_GITHUB_URL`: Your GitHub profile URL.
   * `NEXT_PUBLIC_INSTAGRAM_URL`: Your Instagram profile URL.

### Running the Development Server

Once you have configured your environment variables, you can start the development server:

```sh
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Building for Production

To create a production build, run the following command:

```sh
npm run build
```

This will create an optimized build of the application in the `.next` directory.

## Features

* **About Me:** A section to introduce myself, my passion for cybersecurity, and my journey into the world of technology.
* **Achievements:** A showcase of my certifications and accomplishments in various CTF competitions and other events.
* **Projects:** A collection of my personal projects, demonstrating my skills in software and web development.
* **Contact:** A simple and effective way for visitors to get in touch with me.

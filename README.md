# bookreader

A modern book reading application with support for EPUB and PDF formats, featuring an intuitive interface for an enhanced reading experience.

## Live Demo

Visit the live site: [https://igor-kan.github.io/bookreader](https://igor-kan.github.io/bookreader)

## Features

- EPUB and PDF book support
- Adjustable reading settings (font size, theme, etc.)
- Bookmarking and notes
- Table of contents navigation
- Progress tracking
- Search within books
- Responsive design for all devices
- Offline reading capabilities

## Technologies

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS
- PDF.js for PDF rendering
- EPUB.js for EPUB rendering

## Local Development

If you want to work locally using your own IDE, you can clone this repo and push changes.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone https://github.com/igor-kan/bookreader.git

# Step 2: Navigate to the project directory.
cd bookreader

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

## Deployment

This project is automatically deployed to GitHub Pages from the `main` branch using GitHub Actions. The static site is built with Vite (output to the `dist` directory) and deployed.

The deployment happens automatically whenever changes are pushed to the main branch.

## Other ways to edit this code

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## Can I connect a custom domain to my project?

Yes, you can! Refer to your hosting provider's documentation for instructions.

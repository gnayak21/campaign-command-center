# Campaign Command Center

Campaign Command Center is a static web app concept for brands that want to plan, build, and launch marketing campaigns across multiple advertising properties such as Google, TikTok, Snap, and Meta.

The app is designed as a campaign workspace where a brand team can move from campaign brief to channel plan, creative variants, launch readiness, and performance forecasting.

## Features

- Campaign brief inputs for campaign name, brand, product, objective, audience, budget, flight dates, landing page, region, tone, constraints, and active channels
- Saved campaign drafts using browser local storage
- One-workspace collaboration model for a single brand or client
- Team roster with owner, editor, reviewer, and viewer roles
- Campaign owner and status tracking from Draft through Launched
- Approval lane and reviewer notes saved with each campaign
- Live budget allocation across Google, TikTok, Snap, and Meta
- AI-style channel strategy recommendations
- Property readiness cards for launch preparation
- Creative variant previews by channel
- Launch timeline with approval and operations steps
- Performance forecast metrics and visual chart
- Generated Markdown launch package with copy and export actions
- Responsive layout for desktop, tablet, and mobile

## How to Run Locally

This is a static HTML, CSS, and JavaScript app. No install or server is required.

Open `index.html` in a browser.

Campaign drafts are saved in the browser where the app is opened. They are not synced to a server.

The current collaboration model is a front-end prototype. Workspace, team, role, approval, and reviewer note data are stored locally in the browser with each saved campaign draft.

## Project Files

- `index.html` contains the app structure and interface content
- `styles.css` contains the layout, responsive design, and visual styling
- `app.js` contains the interactive campaign planning logic

## GitHub Pages

To publish the app as a public website:

1. Open the repository on GitHub.
2. Go to Settings.
3. Open Pages.
4. Set Source to Deploy from a branch.
5. Select the `main` branch and `/ root` folder.
6. Save the settings.

GitHub will generate a public URL for the app after the deployment finishes.

## Product Direction

A fuller version of this product could add:

- User accounts and team workspaces
- Server-backed campaign briefs
- Multi-workspace support for agencies managing multiple clients
- Real approval workflows, comments, and notifications
- Real ad platform API integrations
- AI-generated copy and creative concepts
- Campaign performance syncing and optimization recommendations

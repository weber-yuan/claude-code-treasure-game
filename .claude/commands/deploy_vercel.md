Deploy the project to Vercel by following these steps in order:

## Step 1: Check Vercel CLI
Run `vercel --version` to check if Vercel CLI is installed.
- If not installed, run `npm install -g vercel` to install it globally.

## Step 2: Build the project
Run `npm run build` and confirm it succeeds with no errors.
- If the build fails, stop and report the errors to the user before proceeding.

## Step 3: Login check
Run `vercel whoami` to check if the user is logged in.
- If not logged in, run `vercel login` and wait for the user to complete authentication.

## Step 4: Deploy
Run `vercel --prod` from the project root to deploy to production.
- If this is the first deployment, Vercel will prompt for project setup:
  - Set up and deploy: `Y`
  - Scope: select the user's account
  - Link to existing project: `N` (unless one already exists)
  - Project name: accept default or use `claude-code-treasure-game`
  - Directory: `.` (current directory)
  - Override settings: `N`
- After deployment completes, report the production URL to the user.

## Step 5: Report result
Show the user:
- The production deployment URL
- Confirm the deployment was successful

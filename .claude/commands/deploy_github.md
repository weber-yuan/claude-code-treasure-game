Deploy the project to GitHub by following these steps in order:

## Step 1: Check Git installation
Run `git --version` to confirm Git is installed.
- If not installed, stop and ask the user to install Git first.

## Step 2: Check GitHub CLI
Run `gh --version` to check if GitHub CLI is installed.
- If not installed, run `winget install --id GitHub.cli` (Windows) or ask the user to install it from https://cli.github.com.

## Step 3: Check login status
Run `gh auth status` to check if the user is authenticated with GitHub.
- If not logged in, run `gh auth login` and wait for the user to complete authentication.

## Step 4: Build the project
Run `npm run build` and confirm it succeeds with no errors.
- If the build fails, stop and report the errors to the user before proceeding.

## Step 5: Initialize git repository (if needed)
Run `git status` to check if this is already a git repository.
- If not a git repo, run `git init` and `git add .` then `git commit -m "Initial commit"`.
- If already a git repo with uncommitted changes, ask the user whether to commit them before proceeding.

## Step 6: Create GitHub repository
Run `gh repo create` with the following approach:
- Suggest the repo name `claude-code-treasure-game`
- Ask the user: public or private?
- Run `gh repo create claude-code-treasure-game --public --source=. --remote=origin --push` (adjust `--public`/`--private` based on user choice)
- If the repo already exists and origin is already set, skip creation and go to Step 7.

## Step 7: Push to GitHub
- If the repo was just created with `--push`, this step is already done.
- Otherwise run `git push -u origin main` (or `master` if that is the default branch).
- If the push fails due to branch name mismatch, check with `git branch` and adjust accordingly.

## Step 8: Report result
Show the user:
- The GitHub repository URL (e.g. `https://github.com/<username>/claude-code-treasure-game`)
- Confirm the push was successful
- Optionally mention they can enable GitHub Pages under Settings → Pages if they want to host the built site

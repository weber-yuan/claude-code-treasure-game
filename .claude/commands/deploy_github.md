Deploy the project to GitHub by following these steps in order:

## Step 1: Check Git installation
Run `git --version` to confirm Git is installed.
- If not installed, stop and ask the user to install Git first.

## Step 2: Check GitHub CLI
Run `gh --version` to check if GitHub CLI is installed.
- If not installed, run `winget install --id GitHub.cli` (Windows) or ask the user to install it from https://cli.github.com.
- After installation, the current shell session may not have the updated PATH. Run `export PATH="$PATH:/c/Program Files/GitHub CLI"` to make `gh` available immediately without restarting the terminal.

## Step 3: Check login status
Run `export PATH="$PATH:/c/Program Files/GitHub CLI" && gh auth status` to check if the user is authenticated with GitHub.
- If not logged in, inform the user that `gh auth login` is an interactive command that must be run in their own terminal (not via Claude). Ask them to run it, complete authentication, then re-run this command.

## Step 4: Fix vite.config.ts for GitHub Pages
Before building, ensure `vite.config.ts` is configured correctly for GitHub Pages:
- Add `base: '/<repo-name>/'` at the top of `defineConfig({...})`, replacing `<repo-name>` with the actual GitHub repo name (e.g. `claude-code-treasure-game`).
- Set `outDir` inside the `build` block to `'dist'` (Vite's default, required by the GitHub Actions workflow).

Example:
```ts
export default defineConfig({
  base: '/claude-code-treasure-game/',
  ...
  build: {
    outDir: 'dist',
  },
})
```

## Step 5: Build the project
Run `npm run build` and confirm it succeeds with no errors.
- If the build fails, stop and report the errors to the user before proceeding.

## Step 6: Configure git identity (if needed)
Before committing, check if git identity is set: `git config user.email`
- If empty, set it using the GitHub account info:
  ```
  git config user.name "<github-username>"
  git config user.email "<github-username>@users.noreply.github.com"
  ```
- Use `gh api user --jq '.login'` to get the GitHub username if unknown.

## Step 7: Initialize git repository (if needed)
Run `git status` to check if this is already a git repository.
- If not a git repo, run `git init && git add . && git commit -m "Initial commit"`.
- If already a git repo with uncommitted changes, ask the user whether to commit them before proceeding.

## Step 8: Create GitHub repository and push
- Ask the user: public or private?
- Run `gh repo create claude-code-treasure-game --public --source=. --remote=origin --push` (adjust `--public`/`--private` based on user choice)
- If the repo already exists and origin is already set, run `git push -u origin main` (or `master` if that is the default branch).
- If push is rejected due to remote having extra commits (e.g. auto-generated workflows), run `git pull --rebase` first, then push again.

## Step 9: Set up GitHub Pages
Run `gh api repos/<username>/<repo>/pages` to check if GitHub Pages is enabled.
- If not enabled, run:
  ```
  gh api repos/<username>/<repo>/pages --method POST -f build_type=workflow -f source='{"branch":"master","path":"/"}'
  ```
- Check for duplicate workflow files under `.github/workflows/`. GitHub sometimes auto-generates a `static.yml` that conflicts with a custom `deploy.yml`. If both exist, delete the one that uses the wrong `path:` (e.g. `build/` instead of `dist/`):
  ```
  gh api repos/<username>/<repo>/contents/.github/workflows/static.yml --jq '{sha:.sha}'
  gh api repos/<username>/<repo>/contents/.github/workflows/static.yml --method DELETE -f message="Remove duplicate workflow" -f sha="<sha>"
  ```

## Step 10: Verify deployment
Run `gh run list --repo <username>/<repo> --limit 3` and wait for the latest workflow run to show `completed success`.
- If it fails, run `gh run view <run-id> --repo <username>/<repo>` to diagnose the error.

## Step 11: Report result
Show the user:
- GitHub Repository URL: `https://github.com/<username>/claude-code-treasure-game`
- Live site URL: `https://<username>.github.io/claude-code-treasure-game/`
- Confirm the deployment workflow completed successfully

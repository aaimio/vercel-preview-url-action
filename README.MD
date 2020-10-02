# Overview

Enabling this action on your repository will automatically generate Deriv.app production App IDs for any PRs opened to your target branch (specified in your workflow, see `.github/workflows/example.yml`).

**Please ensure you're using a dedicated Deriv API token for this, else the action may update your own Deriv apps.**

- To generate a new token, visit https://app.deriv.com/account/api-token.

## How it works

The action retrieves all open PRs for the installed repository, it will then compare this list with the created apps on Deriv. If any of the apps has a `github_url` which no longer points to an open PR, it will be recycled.

- You may find an example workflow in the `.github/workflows` folder.

The workflow expects a couple inputs:

- `deriv_api_token`: Token used to authorise the websocket connection to Deriv.app. **Warning**: Make sure to pass the Deriv API token as a secret e.g. `${{ secrets.DERIV_API_TOKEN }}`.
- `accept_edits_from_user`: Only consider edits from this user (default: `vercel[bot]`).
- `max_retries` (optional): Amount of times to retry in case of error(s) (default: `5`).
- `preview_url_regexp`: Regular expression pattern to look for (ensure first group containing the Preview URL).

## Development

All of the logic is in a single file (`index.js`). After making changes to the file run `npm run build` to compile `dist/index.js` and all `node_modules` into a single JS file (it'll be placed in `dist/index.js`).

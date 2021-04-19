# Overview

Capture a Vercel preview URL and feed it into your next GitHub action.

1. This action should run whenever an edit is made to a pull request comment (see `example.yml` below).
    - _If you wish to capture the preview URL on `push` or `pull_request` check out [zentered/vercel-preview-url](https://github.com/zentered/vercel-preview-url)_
2. It checks whether the editor of the comment is Vercel's bot account on GitHub.
3. It attempts to extract the preview URL from the comment and sets it as the action's output so that you can feed it into your next action.

Please note:

- This action only succeeds when a preview URL was found, it gets cancelled (if `GITHUB_TOKEN` is passed) or fails on every other event.
- This action will keep executing for every edit (if following `issue_comment.edited` trigger as per `example.yml`). When a new commit is pushed, Vercel may edit the comment again, triggering this action. Please ensure you're building in logic into your next action to handle this.

## Inputs

- `cancel_on_strings`: Cancel the action when any of these (comma separated) strings appear in the edited comment.
- `GITHUB_TOKEN`: Pass this (as `${{secrets.GITHUB_TOKEN}}`) to cancel actions instead of failing them.
- `preview_url_regexp`: Regular expression pattern (without delimiters) to capture the preview URL. Ensure first capture group captures the preview URL. (default: `Preview: \[(.*)\]`)
- `vercel_bot_name`: The name of the Vercel account commenting on pull requests. (default: `vercel[bot]`)

## Outputs

- `vercel_preview_url`: The preview URL which can be accessed through the [`steps` context](https://docs.github.com/en/free-pro-team@latest/actions/reference/context-and-expression-syntax-for-github-actions#steps-context).

## Example

The example below captures the Vercel preview URL and comments with it on the pull request.

```YML
name: Capture Vercel preview URL

on:
  issue_comment:
    types: [edited]

jobs:
  capture_vercel_preview_url:
    name: Capture Vercel preview URL
    runs-on: "ubuntu-latest"
    steps:
      - uses: aaimio/vercel-preview-url-action@master
        id: vercel_preview_url
        with:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
      # Below is merely an example of what you could do with the preview URL.
      # The preview URL is accessed through ${{ steps.<step_id>.outputs.vercel_preview_url }}
      - uses: actions/github-script@v3
        with:
          github-token: ${{secrets.GITHUB_TOKEN}}
          script: |
            github.issues.createComment({
              issue_number: context.issue.number,
              owner: context.repo.owner,
              repo: context.repo.repo,
              body: 'The preview URL is: ${{ steps.vercel_preview_url.outputs.vercel_preview_url }}.'
            });
```

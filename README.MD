# Overview

Capture a Vercel preview URL and feed it into your next GitHub action.

1. This action runs whenever an edit is made to a pull request comment (see `example.yml` below).
2. It checks whether the editor of the comment is Vercel's bot account on GitHub.
3. It attempts to extract the preview URL from the comment and sets it as the action's output so that you can feed it into your next action.

Please note that the action only succeeds when a preview URL was found, it fails on every other event (each edit made on a pull request comment will run this action).

## Inputs

- `vercel_bot_name`: The name of the Vercel account commenting on pull requests. (default: `vercel[bot]`)
- `preview_url_regexp`: Regular expression pattern (without delimiters) to capture the preview URL. Ensure first capture group captures the preview URL. (default: `Preview: \[(.*)\]`)

## Outputs

- `vercel_preview_url`: The preview URL which can be accessed in the next action through the `needs` context, e.g. `${{needs.capture_vercel_preview_url.outputs.vercel_preview_url}}` ([Read more](https://docs.github.com/en/free-pro-team@latest/actions/reference/context-and-expression-syntax-for-github-actions#needs-context))

## Example

```YML
name: Capture Vercel preview URL

on:
  pull_request:
    branches:
      - master
    types: [opened]
  issue_comment:
    types: [edited]

jobs:
  capture_vercel_preview_url:
    name: Capture Vercel preview URL
    runs-on: "ubuntu-latest"
    steps:
      - uses: aaron-binary/vercel-preview-url-action@master
        id: vercel_preview_url
```

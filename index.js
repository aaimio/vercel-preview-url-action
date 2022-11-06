const core = require("@actions/core");
const github = require("@actions/github");
const { Octokit } = require("@octokit/action");

const cancelAction = async () => {
  if (core.getInput("GITHUB_TOKEN")) {
    const octokit = new Octokit();

    await octokit.actions.cancelWorkflowRun({
      ...github.context.repo,
      run_id: github.context.runId,
    });

    // Wait a maximum of 1 minute for the action to be cancelled.
    await new Promise((resolve) => setTimeout(resolve, 60000));
  }

  // If no GitHub token or timeout has passed, fail action.
  process.exit(1);
};

const runAction = async () => {
  const { comment } = github.context.payload;

  if (!comment) {
    console.log("Action triggered on non-comment event.");
    await cancelAction();
  }

  const vercel_bot_name = core.getInput("vercel_bot_name");

  if (comment.user.login !== vercel_bot_name) {
    console.log("Comment did not originate from Vercel bot.", {
      vercel_bot_name,
    });

    await cancelAction();
  }

  const cancelOnStrings = core.getInput("cancel_on_strings").split(",");

  if (cancelOnStrings.some((word) => comment.body.includes(word))) {
    console.log("Comment contained a word that should cancel the action.", {
      cancelOnStrings,
      comment: comment.body,
    });

    await cancelAction();
  }

  const preview_url_regexp = new RegExp(core.getInput("preview_url_regexp"));
  const regexMatches = comment.body.match(preview_url_regexp);

  if (!regexMatches) {
    console.log("Unable to find a preview URL in comment's body.", {
      comment: comment.body,
    });

    await cancelAction();
  }

  let vercelPreviewUrl = "";

  for (let i = 1; i < regexMatches.length; i++) {
    const regexMatch = regexMatches[i];

    if (regexMatch) {
      vercelPreviewUrl = regexMatch;
      break;
    }
  }

  if (vercel_preview_url) {
    console.log("Found preview URL.", { vercelPreviewUrl });
    core.setOutput("vercel_preview_url", vercelPreviewUrl);
    process.exit(0);
    return;
  }

  console.log(
    "The regular expression was not able to capture the preview URL. " +
      "Please ensure at least 1 capture group matches the preview URL's pattern."
  );

  process.exit(1);
};

runAction();

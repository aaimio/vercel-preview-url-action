import core from "@actions/core";
import { context } from "@actions/github";
import { Octokit } from "@octokit/action";
import { getPreviewUrlFromString } from "./index.utils";

const cancelAction = async () => {
  if (core.getInput("GITHUB_TOKEN")) {
    const octokit = new Octokit();

    await octokit.actions.cancelWorkflowRun({
      ...context.repo,
      run_id: context.runId,
    });

    // Wait a maximum of 1 minute for the action to be cancelled.
    await new Promise((resolve) => setTimeout(resolve, 60000));
  }

  // If no GitHub token or timeout has passed, fail action.
  process.exit(1);
};

const runAction = async () => {
  const { comment } = context.payload;

  if (!comment) {
    console.log("Action triggered on non-comment event.");
    await cancelAction();
    return;
  }

  const vercelBotName = core.getInput("vercel_bot_name");
  const { login } = comment.user;

  if (login !== vercelBotName) {
    console.log("Comment did not originate from Vercel bot.", {
      vercelBotName,
    });

    await cancelAction();
  }

  const cancelOnStrings = core.getInput("cancel_on_strings").split(",");
  const { body } = comment;

  if (cancelOnStrings.some((word) => body.includes(word))) {
    console.log("Comment contained a word that should cancel the action.", {
      cancelOnStrings,
      comment: body,
    });

    await cancelAction();
  }

  const vercelPreviewUrl = getPreviewUrlFromString(
    body,
    core.getInput("preview_url_regexp")
  );

  if (!vercelPreviewUrl) {
    console.log(
      "The regular expression was not able to capture the preview URL. " +
        "Please ensure at least 1 capture group matches the preview URL's pattern."
    );

    process.exit(1);
  }

  console.log("Found preview URL.", { vercelPreviewUrl });
  core.setOutput("vercel_preview_url", vercelPreviewUrl);
  process.exit(0);
};

runAction();

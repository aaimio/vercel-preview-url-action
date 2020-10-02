const core = require("@actions/core");
const github = require("@actions/github");

const runAction = async () => {
  const { payload } = github.context;
  const { comment } = payload;
  const vercel_bot_name = core.getInput("vercel_bot_name");

  if (comment.user.login !== vercel_bot_name) {
    console.log("Comment did not originate from Vercel bot.", {
      vercel_bot_name,
    });
    process.exit(1);
  }

  const preview_url_regexp = new RegExp(core.getInput("preview_url_regexp"));
  const regex_matches = comment.body.match(preview_url_regexp);

  if (!regex_matches) {
    console.log("Unable to find a preview URL in comment's body.");
    process.exit(1);
  }

  const vercel_preview_url = regex_matches[1];

  if (vercel_preview_url) {
    console.log("Found preview URL.", { vercel_preview_url });
    core.setOutput("vercel_preview_url", vercel_preview_url);
    process.exit(0);
  } else {
    console.log(
      "The regular expression is in an invalid format. Please ensure the first capture group caputures the preview URL."
    );
    process.exit(1);
  }
};

runAction();

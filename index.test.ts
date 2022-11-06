import { getPreviewUrlFromString } from "./index.utils";

// Change below if you wish to test your pattern.
const regexPattern =
  "(?:Preview: \\[?(.*)\\]?|\\[Visit Preview\\]\\(([^\\s]*)\\))";

describe("getPreviewUrlFromStrings tests", () => {
  test("should retrieve a preview URL from an input string", () => {
    // Invalid preview URL comment
    const result1 = getPreviewUrlFromString("random_string", regexPattern);

    // Old preview URL comment format
    const result2 = getPreviewUrlFromString(
      `This pull request is being automatically deployed with Vercel ([learn more](https://vercel.link/github-learn-more)). To see the status of your deployment, click below or on the icon next to each commit.
       
      mag Inspect: https://vercel.com/123456789-old white_check_mark Preview: https://vercel.com/aaimio/123456789-old
      
      `,
      regexPattern
    );

    // New preview URL comment format
    const result3 = getPreviewUrlFromString(
      `**The latest updates on your projects**. Learn more about [Vercel for Git ↗︎](https://vercel.link/github-learn-more)
        Name 	Status 	Preview 	Updated
        **my-website** 	white_check_mark Ready ([Inspect](https://vercel.com/123456789-new)) 	[Visit Preview](https://vercel.com/aaimio/123456789-new) 	Feb 6, 1993 at 9:50AM (UTC)`,
      regexPattern
    );

    expect(result1).toEqual("");
    expect(result2).toEqual("https://vercel.com/aaimio/123456789-old");
    expect(result3).toEqual("https://vercel.com/aaimio/123456789-new");
  });
});

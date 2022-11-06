export const getPreviewUrlFromString = (
  inputString: string,
  regexPatternString: string
) => {
  const regexPattern = new RegExp(regexPatternString);
  const regexMatches = inputString.match(regexPattern);

  let vercelPreviewUrl = "";

  if (!regexMatches) {
    return vercelPreviewUrl;
  }

  for (let i = 1; i < regexMatches.length; i++) {
    const regexMatch = regexMatches[i];

    if (regexMatch) {
      vercelPreviewUrl = regexMatch;
      break;
    }
  }

  return vercelPreviewUrl;
};

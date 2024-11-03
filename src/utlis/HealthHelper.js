const parseHealthData = (resultText) => {
  // Split each health category
  const categories = resultText
    .split("**")
    .filter((text) => text.trim() !== "");

  const healthData = {
    physical: [],
    mental: [],
    emotional: [],
  };

  categories.forEach((category) => {
    const [title, ...entries] = category
      .split("\n")
      .filter((line) => line.trim());
    const categoryName = title.toLowerCase().includes("physical")
      ? "physical"
      : title.toLowerCase().includes("mental")
      ? "mental"
      : "emotional";

    entries.forEach((entry, index) => {
      const score = determineSentimentScore(entry); // Assign a score to each entry
      healthData[categoryName].push({
        entry: index + 1,
        description: entry,
        score: score,
      });
    });
  });

  return healthData;
};

// Helper function to assign a sentiment score to each entry
const determineSentimentScore = (entryText) => {
  const positiveKeywords = [
    "motivated",
    "accomplishment",
    "clarity",
    "happy",
    "productive",
  ];
  const negativeKeywords = ["unmotivated", "overwhelmed", "stress", "anxiety"];

  let score = 0;
  positiveKeywords.forEach((word) => {
    if (entryText.toLowerCase().includes(word)) score += 1;
  });
  negativeKeywords.forEach((word) => {
    if (entryText.toLowerCase().includes(word)) score -= 1;
  });

  return score;
};

export { determineSentimentScore, parseHealthData };
import axios from "axios";
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
const getMoodAndScore = async (content) => {
  try {
    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${
        import.meta.env.VITE_API_GENERATIVE_LANGUAGE_CLIENT
      }`,
      {
        contents: [
          {
            parts: [
              {
                text: `Analyze the following entry to identify the mood state with one keyword and its intensity on a scale of 1-10. Select from these moods: happiness, sadness, anger, fear, surprise, disgust, joy, excitement, calmness, anxiety, frustration, boredom, confusion, contentment, indifference. 
                                
                                Entry: "${content}" 

                                Return the result as a JSON object in the following structure:
                                {
                                    "mood": "<mood> <emoji>",
                                    "score": <score>
                                }

                                If you are unable to determine the mood, return:
                                {
                                    "mood": "neutral",
                                    "score": 0
                                }`,
              },
            ],
          },
        ],
      }
    );

    const moodData = JSON.parse(
      response.data.candidates[0].content.parts[0].text.trim()
    );

    console.log("The mood:", moodData.mood);
    console.log("The mood score:", moodData.score);
    const retrievedMood = moodData.mood;
    const retrievedMoodScore = moodData.score;
    return { retrievedMood, retrievedMoodScore };
  } catch (error) {
    console.error("Error fetching mood:", error);
    return { mood: "Unknown", score: 0 };
  }
};
const extractTaskDetails = async (e) => {
  e.preventDefault();
  setIsLoading(true);

  try {
    const response = await axios({
      url: `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${
        import.meta.env.VITE_API_GENERATIVE_LANGUAGE_CLIENT
      }`,
      method: "post",
      data: {
        contents: [
          {
            parts: [
              {
                text: `Extract the task description and deadline from the following input text. Return the result as a JSON object in the following structure:
                                {
                                    "description": "<description>",
                                    "deadline": "<deadline>"
                                }

                                If no deadline is found, use the current date and time as the default deadline in ISO 8601 format.

                                Input Text:
                                "${taskInput}"`,
              },
            ],
          },
        ],
      },
    });

    const geminiResponse = JSON.parse(
      response.data.candidates[0].content.parts[0].text
    );

    const taskDescription =
      geminiResponse.description || "No description provided";
    const taskDeadline = geminiResponse.deadline || new Date().toISOString();

    setParsedTask(taskDescription);
    setParsedDeadline(taskDeadline);

    // Add task to the server
    await addTaskToServer({ taskDescription, taskDeadline });

    // Update task list
    setTasks((prevTasks) => [...prevTasks, { taskDescription, taskDeadline }]);
    setTaskInput(""); // Clear input after processing
  } catch (error) {
    console.error("Error extracting task details:", error);
  } finally {
    setIsLoading(false);
  }
};

export {
  determineSentimentScore,
  parseHealthData,
  getMoodAndScore,
  extractTaskDetails,
};
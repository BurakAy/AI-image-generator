import { Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

export default async function (req, res) {
  if (!configuration.apiKey) {
    res.status(500).json({
      error: {
        message:
          "OpenAI API key not configured, please follow instructions in README.md",
      },
    });
    return;
  }

  const description = req.body.description || "";
  if (description.trim().length === 0) {
    res.status(400).json({
      error: {
        message: "Please enter a valid image description",
      },
    });
    return;
  }

  try {
    const response = await openai.createImage({
      prompt: generatePrompt(description),
      n: 1,
      size: "1024x1024",
    });
    res.status(200).json({ result: response.data.data[0].url });
  } catch (error) {
    if (error.response) {
      console.error(error.response.status, error.response.data);
      res.status(error.response.status).json(error.response.data);
    } else {
      console.error(`Error with OpenAI API request: ${error.message}`);
      res.status(500).json({
        error: {
          message: "An error occurred during your request.",
        },
      });
    }
  }
}

function generatePrompt(description) {
  const capitalizedDescription =
    description[0].toUpperCase() + description.slice(1).toLowerCase();
  return capitalizedDescription;
}

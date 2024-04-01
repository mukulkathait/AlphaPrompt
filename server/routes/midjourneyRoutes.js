import express from "express";
import * as dotenv from "dotenv";
import axios from "axios";

dotenv.config();

const router = express.Router();

const X_API_KEY = process.env.X_API_KEY;

router.route("/").get((req, res) => {
  res.send("Hello from MidJourney!");
});

router.route("/").post(async (req, res) => {
  try {
    const { prompt } = req.body;
    const imageGenerationEndpoint =
      "https://api.midjourneyapi.xyz/mj/v2/imagine";
    const imageFetchingEndpoint = "https://api.midjourneyapi.xyz/mj/v2/fetch";
    const headers = {
      X_API_KEY: X_API_KEY,
    };
    const data = {
      prompt: prompt,
    };

    const result = axios
      .post(imageGenerationEndpoint, data, { headers: headers })
      .then((response) => {
        console.log(response);
        return response.json();
      })
      .catch((error) => {
        console.error("ERROR: ", error.message);
      });

    const imageExtractionData = {
      task_id: result.task_id,
    };

    const aiResponse = axios
      .post(imageFetchingEndpoint, imageExtractionData)
      .then((response) => {
        console.log(response);
        return response.json();
      });

    const image = aiResponse.task_result.image_url;
    res.status(200).json({ photo: image });
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
});

export default router;

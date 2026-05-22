import { Router } from "express";
import axios from "axios";

const router = Router();

router.get("/health", (_, res) => {
  res.json({
    status: "ok",
  });
});

router.get("/embedding-test", async (_, res) => {
  const model = process.env.OLLAMA_MODEL;
  async function getData() {
    try {
      const response = await axios.post("http://ollama:11434/api/embeddings", {
        model,
        prompt: "healthy filipino soup",
      });

      res.json(response.data);
    } catch (error:any) {
        console.error(error.message)
    }
  }
  await getData()
});

export default router;

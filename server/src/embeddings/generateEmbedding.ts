import axios from "axios";

const OLLAMA_URL = 'http:ollama:11434/api/embed'

const MODEL = process.env.OLLAMA_MODEL || 'nomic-embed-text'

export async function generateEmbedding(text: string): Promise<number[]> {
    const response = await axios.post(OLLAMA_URL, {
        model: MODEL,
        input: text
    })

    return response.data.embeddings[0]
}
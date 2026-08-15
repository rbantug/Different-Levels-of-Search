import type { AxiosInstance } from "axios";

interface GenerateEmbeddingDependencies {
    httpClient: AxiosInstance;
    model: string
}

export default function makeGenerateEmbedding({ httpClient, model }: GenerateEmbeddingDependencies) {
    return async function generateEmbedding(text:string): Promise<number[]> {
        const response = await httpClient.post("/api/embed", {
            model,
            input: text
        });

        return response.data.embedding
    }
}
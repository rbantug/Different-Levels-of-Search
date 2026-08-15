import axios from 'axios'

import makeGenerateEmbedding from './generateEmbedding.js'

const host = process.env.OLLAMA_HOST

if (!host) {
    throw new Error("OLLAMA_HOST is required")
}

const model = process.env.OLLAMA_MODEL;

if (!model) {
    throw new Error("OLLAMA_MODEL is required");
}

const httpClient = axios.create({
    baseURL: host
})

const generateEmbedding = makeGenerateEmbedding({ httpClient, model })

export {
    generateEmbedding
}
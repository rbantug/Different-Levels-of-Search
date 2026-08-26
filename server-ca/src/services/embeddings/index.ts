import axios from 'axios'

import config from '../../config.js'
import makeGenerateEmbedding from './generateEmbedding.js'

const host = config.ollamaHost
const model = config.ollamaModel

const httpClient = axios.create({
    baseURL: host
})

const generateEmbedding = makeGenerateEmbedding({ httpClient, model })

export {
    generateEmbedding
}
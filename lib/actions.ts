'use server'

import { Configuration, OpenAIApi } from 'openai'
import { createReadStream } from 'fs'
import csv from 'csv-parser'

import { createClient } from '@supabase/supabase-js'

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
  organization: process.env.OPENAI_ORGANIZATION_ID
})

const api = new OpenAIApi(configuration)

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_KEY!
)

function cosineSimilarity(vectorA: any[], vectorB: any[]) {
  let dotProduct = 0
  for (let i = 0; i < vectorA.length; i++) {
    dotProduct += vectorA[i] * vectorB[i]
  }
  let magnitudeA = 0
  for (let i = 0; i < vectorA.length; i++) {
    magnitudeA += vectorA[i] * vectorA[i]
  }
  magnitudeA = Math.sqrt(magnitudeA)

  let magnitudeB = 0
  for (let i = 0; i < vectorB.length; i++) {
    magnitudeB += vectorB[i] * vectorB[i]
  }
  magnitudeB = Math.sqrt(magnitudeB)
  return dotProduct / (magnitudeA * magnitudeB)
}

function getSimilarityScore(investerData: any[], promptEmbedding: number[]) {
  return investerData.map(({ embedding, ...rest }) => {
    const score = cosineSimilarity(promptEmbedding, JSON.parse(embedding))
    return {
      matchingScore: score,
      ...rest
    }
  })
}

export const embedData = async () => {
  const results: any[] = []

  createReadStream('./investers.csv')
    .pipe(csv())
    .on('data', data => results.push(data))
    .on('end', () => {
      const minResults = results.slice(0, 100)
      const strings = minResults.map(async obj => {
        const name = obj.Name
        const email = obj['Email (work)']
        const type = obj['Entity category']
        const location = obj.Country
        const industries = obj['Focus/Industry']

        let consolidated = ''

        if (name) {
          consolidated += `Investor Name: ${name};`
        }

        if (email) {
          consolidated += `Email: ${email};`
        }

        if (type) {
          consolidated += `Type: ${type};`
        }

        if (location) {
          consolidated += `Location ${location};`
        }

        if (industries) {
          consolidated += `Investment Focus ${industries};`
        }

        try {
          const response = await api.createEmbedding({
            model: 'text-embedding-ada-002',
            input: consolidated
          })

          const [{ embedding }] = response.data.data
          // Store the vector in Postgres
          const { data, error } = await supabase.from('explorer').insert({
            name,
            location: location || '',
            email: email || '',
            type: type || '',
            industries: industries || '',
            consolidated,
            embedding
          })
        } catch (error) {
          console.log('errrrrr', error)
        }
      })
    })
}

export const chat = async (formData: FormData) => {
  const prompt = formData.get('prompt') as string
  const threshold = formData.get('threshold') as string

  const promptEmbeddingsResponse = await api.createEmbedding({
    model: 'text-embedding-ada-002',
    input: prompt
  })
  const promptEmbedding = promptEmbeddingsResponse.data.data[0].embedding

  const { data } = await supabase.from('explorer').select('*')

  const matchingInvestors = getSimilarityScore(
    //@ts-ignore
    data,
    promptEmbedding
  )

  const results = matchingInvestors
    //@ts-ignore
    .filter(({ matchingScore }) => matchingScore > (parseFloat(threshold) || 0.85))
    //@ts-ignore
    .sort((a, b) => b.matchingScore - a.matchingScore)
    .slice(0, 5)


  return results
}

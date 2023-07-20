'use server'

import { Configuration, OpenAIApi } from 'openai'
import { createReadStream } from 'fs'
import csv from 'csv-parser'

import { createClient } from '@supabase/supabase-js'
import { revalidatePath } from 'next/cache'

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

export const embedData = async (data: any[], template: string) => {
  const promises = data.map(async ({ text, fields }) => {
    try {
      const response = await api.createEmbedding({
        model: 'text-embedding-ada-002',
        input: text
      })

      const [{ embedding }] = response.data.data
      // Store the vector in Postgres
      const { data, error } = await supabase.from('explorer').insert({
        fields,
        text,
        embedding
      })
    } catch (error) {
      console.log('errrrrr', error)
    }
  })

  await Promise.all(promises)

  revalidatePath("/")
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
    .filter(
      ({ matchingScore }) => matchingScore > (parseFloat(threshold) || 0.85)
    )
    //@ts-ignore
    .sort((a, b) => b.matchingScore - a.matchingScore)
    .slice(0, 15)

  return results
}

export const getEmbededCount = async () => {
  const { count } = await supabase
    .from('explorer')
    .select('*', { count: 'exact' })
  return count
}

export const clearData = async () => {
  await supabase.from('explorer').delete().neq('text', 'anything')
  revalidatePath("/")
}

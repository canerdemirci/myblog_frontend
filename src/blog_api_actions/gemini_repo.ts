import { ApiError } from "@/lib/custom_fetch"
import { GoogleGenerativeAI } from "@google/generative-ai"

type SuggestVersion = { version: string }

/**
 * Makes suggesting with Gemini Flash 2.0 API
 * @param sourceText string
 * @param multiple string - Maximum 5 different version
 * @returns Promise <string[] | never>
 */
export async function suggest(sourceText: string, multiple: boolean)
    : Promise<string | string[] | never>
{
    const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY!)
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' })

    const prompt = multiple
        ? `Produce a json (same as this: [{"version": "text"}]) consists of maximum 5 different versions of this: '${sourceText}'`
        : `Generate a summary (I don't want options only one summary) maximum 160 characters long for seo from this: ${sourceText}`

    try {
        const result = await model.generateContent(prompt)

        if (multiple) {
            const resultText = result.response.text()
            const resultJson = 
                JSON.parse(resultText.substring(7, resultText.length - 4)) as SuggestVersion[]
            return resultJson.map(v => v.version)
        } else {
            return result.response.text()
        }
    } catch (error) {
        console.log(error)
        throw new ApiError({
            message: "Gemini API error",
            status: 500
        })
    }
}
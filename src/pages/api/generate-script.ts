// import { HfInference } from '@huggingface/inference';
// import type { NextApiRequest, NextApiResponse } from 'next';

// // 1. Define TypeScript types
// type Celebrity = 'LeBron James' | 'Messi' | string;
// interface ScriptResponse {
//   script?: string;
//   error?: string;
//   fallback?: string;
// }

// // 2. Initialize HF only if token exists
// const HF_TOKEN = process.env.HUGGINGFACE_TOKEN;
// const hf = HF_TOKEN ? new HfInference(HF_TOKEN) : null;

// // 3. Mock data
// const MOCK_SCRIPTS: Record<Celebrity, string> = {
//   "Lebron James": "In the world of basketball, few names shine brighter than LeBron James. From a teenage phenom straight out of high school to a four-time NBA champion, he’s rewritten the rules of greatness. LeBron dominated with the Cavaliers, built a dynasty in Miami, delivered a historic title to Cleveland, and added another ring in LA. A four-time MVP, two-time Olympic gold medalist, and now the all-time leading scorer — his legacy is unmatched. More than an athlete, LeBron James is a living legend, still defying age and expectations.",
//   "Messi": "Lionel Messi — the magician from Rosario, Argentina. From dazzling defenses at Barcelona to lifting every major trophy in club football, he’s mesmerized the world with his genius. A record eight Ballon d'Ors, countless goals and assists, and historic Champions League triumphs. Then, the crowning glory — leading Argentina to Copa América and finally the World Cup in 2022. Messi's legacy isn’t just in numbers, but in the joy he brings to the game. A true artist, a global icon, and for many — the greatest of all time.",
//   "Sachin tendulkar" : "Sachin Tendulkar — the name that defined a cricketing era. Debuting at just 16, he carried the hopes of a billion with every stroke of the bat. From record-breaking centuries to unforgettable match-winners, he became the highest run-scorer in the history of the game. A master across all formats, with 100 international centuries and a 24-year career of unmatched consistency. And in 2011, the moment of glory — a World Cup win on home soil. Revered worldwide, Sachin isn’t just the ‘Little Master’ — he’s the heart and soul of cricket."
// };

// export default async function handler(
//   req: NextApiRequest,
//   res: NextApiResponse<ScriptResponse>
// ) {
//   // 4. Input validation
//   if (!req.body?.celebrity) {
//     return res.status(400).json({ error: "Missing celebrity parameter" });
//   }

//   const { celebrity } = req.body as { celebrity: Celebrity };

//   // 5. Development fallback
//   if (!hf) {
//     return res.status(200).json({
//       script: MOCK_SCRIPTS[celebrity] 
//       // || `Sample script about ${celebrity}`
//     });
//   }

//   try {
//     // 6. API call with error handling
//     // const response = await hf.textGeneration({
//     //   model: 'mistralai/Mistral-7B-Instruct-v0.1',
//     //   inputs: `Create a 30-second sports reel script about ${celebrity}'s career highlights.`,
//     //   parameters: {
//     //     max_new_tokens: 150,
//     //     temperature: 0.7
//     //   }
//     // });

//     // const prompt = `
//     // Create a 30-second sports reel script about ${celebrity}'s career highlights.
//     // The script should be in this exact format:
    
//     // [Opening shot: dramatic music plays]
//     // Narrator: "In the world of sports, few names shine brighter than ${celebrity}..."
//     // [Cut to highlight clip 1]
//     // Narrator: "From their early days..."
//     // [Cut to championship moment]
//     // Narrator: "To championship glory..."
//     // [Closing shot]
//     // Narrator: "${celebrity} - a true legend of the game."
    
//     // Make it engaging and focus on key career moments. Keep it under 100 words.
//     // `;

//     const prompt = `Create a 30-second sports reel narration about ${celebrity}'s career highlights.
//     Provide only the narration text without any script formatting, scene directions, or narrator tags.
//     Focus on key career moments in a concise, engaging manner.
//     Keep it under 100 words and format as plain text.
//     Example format:
//     "In the world of basketball, few names shine brighter than LeBron James...
//     From his early days as a phenom to his championship victories...
//     A true legend of the game.`

//     const response = await hf.textGeneration({
//       // model: 'HuggingFaceH4/zephyr-7b-beta', // or try 'tiiuae/falcon-7b-instruct'
//       // model: 'EleutherAI/gpt-neo-2.7B', // or try 'tiiuae/falcon-7b-instruct'
//       // model:'google/flan-t5-xxl',
//         //  model:'mistralai/Mistral-7B-Instruct-v0.1',
//         // model:'meta-llama/Llama-2-7b-chat-hf',
//         // model:'google/gemma-7b-it',
//         // model:'EleutherAI/gpt-neo-2.7B',
//         // model:'tiiuae/falcon-7b-instruct',
//         // model: 'gpt2',
//           //  model: 'openai-community/gpt2',
//           // model:'mistralai/mistral-7b-instruct',
//           // model:'stabilityai/stablelm-base-alpha-7b',
//       inputs: prompt,
//       parameters: {
//         max_new_tokens: 250,  // Increased slightly for better output
//         temperature: 0.7,
//         repetition_penalty: 1.2,
//         do_sample: true,
//         top_k: 50,
//         top_p: 0.95
//       }
//     });
//     console.log('Hugging Face API Response:', response);
//     let generatedText = response.generated_text;
//     if (generatedText.includes(prompt)) {
//       generatedText = generatedText.replace(prompt, '').trim();
//     }

//     console.log('Generated Script:', generatedText);
    

//     return res.status(200).json({
//       script: generatedText
//     });

//   } catch (error: any) {
//     console.error("API Error:", error?.message || error);
//     return res.status(500).json({
//       error: "Failed to generate script",
//       fallback: MOCK_SCRIPTS[celebrity] || "No fallback available"
//     });
//   }
// }

// Number 2

// import { pipeline } from '@xenova/transformers';

// export default async function handler(req: NextApiRequest, res: NextApiResponse) {
//   const generator = await pipeline('text-generation', 'Xenova/zephyr-7b-beta');
//   const output = await generator(
//     `Create narration about ${req.body.celebrity} as plain text only`,
//     { max_new_tokens: 150 }
//   ) as { generated_text?: string } | Array<{ text?: string }>;
  
//   let generatedText: string | undefined;
//   if (Array.isArray(output)) {
//     generatedText = typeof output[0] === 'object' && 'text' in output[0] ? (output[0].text as string) : undefined;
//   } else if (output && 'generated_text' in output) {
//     generatedText = output.generated_text;
//   }
//   return res.json({ script: generatedText });
// }

// Number 4

// import { LLM } from "llama-node";
// import { LLamaCpp } from "llama-node/dist/llm/llama-cpp.js";
// import type { NextApiRequest, NextApiResponse } from 'next';

// type Celebrity = string;
// interface ScriptResponse {
//   script?: string;
//   error?: string;
//   fallback?: string;
// }

// const MOCK_SCRIPTS: Record<string, string> = {
//   "LeBron James": "LeBron James, 4-time NBA champion...",
//   "Messi": "Lionel Messi, World Cup winner with Argentina..."
// };

// export default async function handler(
//   req: NextApiRequest,
//   res: NextApiResponse<ScriptResponse>
// ) {
//   if (!req.body?.celebrity) {
//     return res.status(400).json({ error: "Missing celebrity parameter" });
//   }

//   const { celebrity } = req.body;

//   try {
//     // Use mock data in development
//     // if (process.env.NODE_ENV === 'development') {
//     //   return res.status(200).json({
//     //     script: MOCK_SCRIPTS[celebrity] || `Sample script about ${celebrity}`
//     //   });
//     // }

//     const llm = new LLM(LLamaCpp);
//     const modelPath = "./models/tinyllama-1.1b-chat-v1.0.Q4_K_M.gguf"; // You'll need to download this

//     await llm.load({ modelPath });

//     const prompt = `Create a concise 30-second sports narration about ${celebrity}'s career highlights as plain text only. Focus on key achievements and memorable moments.`;
    
//     const response = await llm.createCompletion({
//       prompt,
//       temperature: 0.7,
//       maxTokens: 150
//     });

//     return res.status(200).json({
//       script: response.choices[0].text.trim()
//     });

//   } catch (error: any) {
//     console.error("Error:", error);
//     return res.status(500).json({
//       error: "Failed to generate script",
//       fallback: MOCK_SCRIPTS[celebrity] || `No script available for ${celebrity}`
//     });
//   }
// }


// Number 5

// import type { NextApiRequest, NextApiResponse } from 'next';

// export default async function handler(
//   req: NextApiRequest,
//   res: NextApiResponse
// ) {
//   const { celebrity } = req.body;

//   try {
//     const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
//       method: "POST",
//       headers: {
//         "Authorization": `Bearer ${process.env.GROQ_API_KEY}`,
//         "Content-Type": "application/json"
//       },
//       body: JSON.stringify({
//         model: "llama3-8b-8192",
//         messages: [{
//           role: "user",
//           content: `Create a 30-second sports narration about ${celebrity} as plain text.`
//         }],
//         max_tokens: 150
//       })
//     });

//     const data = await response.json();
//     // if (process.env.NODE_ENV === 'development') {
//       console.log("Groq response:", JSON.stringify(data, null, 2));
//     // }

//     if (!data?.choices || !data.choices[0]?.message?.content) {
//   return res.status(500).json({ error: "Invalid response from Groq API", raw: data });
// }
// return res.json({ 
//   script: data.choices[0].message.content.trim() 
// });
//   } catch (error) {
//     console.error(error);
//     return res.status(500).json({ error: "API Error" });
//   }
// }

// Number 6

// import { HfInference } from '@huggingface/inference';
// import type { NextApiRequest, NextApiResponse } from 'next';

// type Celebrity = 'LeBron James' | 'Messi' | 'Sachin Tendulkar' | string;
// interface ScriptResponse {
//   script?: string;
//   error?: string;
//   fallback?: string;
// }

// const HF_TOKEN = process.env.HUGGINGFACE_TOKEN;
// const hf = HF_TOKEN ? new HfInference(HF_TOKEN) : null;

// const MOCK_SCRIPTS: Record<Celebrity, string> = {
//   "LeBron James": "In the world of basketball, few names shine brighter than LeBron James...",
//   "Messi": "Lionel Messi — the magician from Rosario, Argentina...",
//   "Sachin Tendulkar": "Sachin Tendulkar — the name that defined a cricketing era..."
// };

// // Models to try in order of preference
// const MODEL_PRIORITY_LIST = [
//   'mistralai/Mistral-7B-Instruct-v0.1',
//   'HuggingFaceH4/zephyr-7b-beta',
//   'google/gemma-7b-it',
//   'tiiuae/falcon-7b-instruct'
// ];

// export default async function handler(
//   req: NextApiRequest,
//   res: NextApiResponse<ScriptResponse>
// ) {
//   if (!req.body?.celebrity) {
//     return res.status(400).json({ error: "Missing celebrity parameter" });
//   }

//   const { celebrity } = req.body as { celebrity: Celebrity };

//   // Development fallback
//   if (!hf) {
//     const script = MOCK_SCRIPTS[celebrity] || 
//       `A legendary career of ${celebrity} filled with unforgettable moments.`;
//     return res.status(200).json({ script });
//   }

//   try {
//     const prompt = `Create a professional 30-second sports narration about ${celebrity}'s career highlights.
//     Requirements:
//     - Plain text only (no formatting or special characters)
//     - Focus on major achievements and defining moments
//     - Neutral, engaging tone
//     - 3-5 concise sentences
//     - Under 100 words
    
//     Example for Lionel Messi:
//     "Lionel Messi's journey from Rosario to global stardom redefined football excellence. 
//     His record-breaking tenure at Barcelona produced countless magical moments and trophies. 
//     The 2022 World Cup victory with Argentina cemented his legacy as one of the greatest. 
//     With unparalleled skill and vision, Messi's impact transcends generations of the sport."
    
//     Now create one for ${celebrity}:`;

//     let lastError: Error | null = null;
    
//     // Try each model in order until one succeeds
//     for (const model of MODEL_PRIORITY_LIST) {
//       try {
//         const response = await hf.textGeneration({
//           model,
//           inputs: prompt,
//           parameters: {
//             max_new_tokens: 200,
//             temperature: 0.7,
//             repetition_penalty: 1.2,
//             do_sample: true,
//             top_k: 50,
//             top_p: 0.95
//           }
//         });

//         let generatedText = response.generated_text;
        
//         // Clean up the output
//         generatedText = generatedText.replace(prompt, '').trim();
//         generatedText = generatedText.split('\n')[0]; // Take first paragraph
        
//         // Basic quality check
//         if (generatedText.length > 30 && generatedText.includes(celebrity)) {
//           return res.status(200).json({ script: generatedText });
//         }
        
//         throw new Error('Low quality output');
        
//       } catch (error) {
//         console.warn(`Failed with ${model}:`, error);
//         lastError = error as Error;
//         continue; // Try next model
//       }
//     }

//     // If all models failed
//     throw lastError || new Error('All models failed');

//   } catch (error: any) {
//     console.error("Final API Error:", error?.message || error);
//     return res.status(500).json({
//       error: "Failed to generate script",
//       fallback: MOCK_SCRIPTS[celebrity] || 
//         `The remarkable career of ${celebrity} stands as a testament to sporting excellence.`
//     });
//   }
// }

// Number 7

// import { GoogleGenerativeAI } from "@google/generative-ai";
// import type { NextApiRequest, NextApiResponse } from 'next';

// type Celebrity = 'LeBron James' | 'Messi' | 'Sachin Tendulkar' | string;
// interface ScriptResponse {
//   script?: string;
//   error?: string;
//   fallback?: string;
// }

// const MOCK_SCRIPTS: Record<Celebrity, string> = {
//   "LeBron James": "In the world of basketball, few names shine brighter than LeBron James...",
//   "Messi": "Lionel Messi — the magician from Rosario, Argentina...",
//   "Sachin Tendulkar": "Sachin Tendulkar — the name that defined a cricketing era..."
// };

// export default async function handler(
//   req: NextApiRequest,
//   res: NextApiResponse<ScriptResponse>
// ) {
//   // 1. Input validation
//   if (!req.body?.celebrity) {
//     return res.status(400).json({ error: "Missing celebrity parameter" });
//   }

//   const { celebrity } = req.body as { celebrity: Celebrity };

//   // 2. Check for Gemini API key
//   const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
//   if (!GEMINI_API_KEY) {
//     return res.status(200).json({
//       script: MOCK_SCRIPTS[celebrity] || 
//         `The remarkable career of ${celebrity} stands as a testament to sporting excellence.`
//     });
//   }

//   try {
//     // 3. Initialize Gemini
//     const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
//     const model = genAI.getGenerativeModel({ model: "gemini-pro" });

//     // 4. Create prompt
//     const prompt = `Create a professional 30-second sports narration about ${celebrity}'s career highlights.
//     Requirements:
//     - Plain text only (no formatting or special characters)
//     - Focus on major achievements and defining moments
//     - Neutral, engaging tone
//     - 3-5 concise sentences
//     - Under 100 words
    
//     Example for Lionel Messi:
//     "Lionel Messi's journey from Rosario to global stardom redefined football excellence. 
//     His record-breaking tenure at Barcelona produced countless magical moments and trophies. 
//     The 2022 World Cup victory with Argentina cemented his legacy as one of the greatest. 
//     With unparalleled skill and vision, Messi's impact transcends generations of the sport."`;

//     // 5. Generate content
//     const result = await model.generateContent(prompt);
//     const response = await result.response;
//     const generatedText = response.text();

//     // 6. Return cleaned response
//     return res.status(200).json({
//       script: generatedText.trim()
//     });

//   } catch (error: any) {
//     console.error("Gemini API Error:", error?.message || error);
//     return res.status(500).json({
//       error: "Failed to generate script",
//       fallback: MOCK_SCRIPTS[celebrity] || 
//         `A legendary career of ${celebrity} filled with unforgettable moments.`
//     });
//   }
// }

// Number 8

// import { pipeline } from '@xenova/transformers';
// import type { NextApiRequest, NextApiResponse } from 'next';

// type Celebrity = string;
// interface ScriptResponse {
//   script?: string;
//   error?: string;
// }

// const MOCK_SCRIPTS = {
//   "LeBron James": "LeBron James, 4-time NBA champion...",
//   "Messi": "Lionel Messi, World Cup winner..."
// };

// export default async function handler(
//   req: NextApiRequest,
//   res: NextApiResponse<ScriptResponse>
// ) {
//   const { celebrity } = req.body;

//   try {
//     // Load a tiny free model (runs locally)
//     const generator = await pipeline('text-generation', 'Xenova/tinyllama-1.1b');
    
//     const prompt = `Describe ${celebrity}'s sports career in 3 sentences. Example: "Messi won the 2022 World Cup."`;
    
//     const output = await generator(prompt, {
//       max_new_tokens: 100,
//       temperature: 0.7
//     });

//     return res.json({ 
//       script: output[0].generated_text.replace(prompt, '').trim() 
//     });

//   } catch (error) {
//     console.error(error);
//     return res.json({
//       script: MOCK_SCRIPTS[celebrity] || `${celebrity} had an incredible sports career.`
//     });
//   }
// }

// Number 9

// import axios from 'axios';
// import * as cheerio from 'cheerio';

// export default async function handler(req: { body: { celebrity: any; }; }, res: { json: (arg0: { script: string; }) => any; }) {
//   const { celebrity } = req.body;

//   try {
//     const url = `https://en.wikipedia.org/wiki/${encodeURIComponent(celebrity)}`;
//     const { data } = await axios.get(url);
//     const $ = cheerio.load(data);
    
//     // Extract first paragraph
//     const summary = $('p').first().text().replace(/\[\d+\]/g, '').trim();
    
//     return res.json({ 
//       script: `Wikipedia says: ${summary.split('. ').slice(0, 3).join('. ')}...` 
//     });

//   } catch (error) {
//     return res.json({
//       script: `Could not fetch details about ${celebrity}`
//     });
//   }
// }

// Number 10

// import axios from 'axios';

// import type { NextApiRequest, NextApiResponse } from 'next';

// export default async function handler(req: NextApiRequest, res: NextApiResponse) {
//   const { celebrity } = req.body;

//   try {
//     const response = await axios.get(
//       `https://www.thesportsdb.com/api/v1/json/3/searchplayers.php?p=${encodeURIComponent(celebrity)}`
//     );
    
//     const playerData = response.data.player[0];
//     const script = `${playerData.strPlayer} is a ${playerData.strSport} player known for ${playerData.strDescriptionEN.split('.')[0]}.`;
    
//     return res.json({ script });

//   } catch (error) {
//     return res.json({
//       script: `${celebrity} is a renowned sports figure.`
//     });
//   }
// }

// Number 11

// import type { NextApiRequest, NextApiResponse } from 'next';

// // 1. Import pipeline from transformers.js
// import { pipeline } from '@xenova/transformers';

// // 2. Mock fallback data for popular celebrities
// const MOCK_SCRIPTS: Record<string, string> = {
//   "LeBron James": "LeBron James is a basketball legend, known for his incredible athleticism and leadership. He has won multiple NBA championships and MVP awards, inspiring millions around the world. His impact on and off the court makes him one of the greatest athletes of all time.",
//   "Messi": "Lionel Messi is a football icon, celebrated for his extraordinary skills and vision. He has won numerous Ballon d'Or awards and led Argentina to World Cup glory. Messi's legacy is defined by his passion, humility, and record-breaking achievements.",
//   "Sachin Tendulkar": "Sachin Tendulkar is a cricketing legend, revered for his unmatched batting prowess. He holds the record for the most runs in international cricket and inspired a generation of players. Tendulkar's dedication and sportsmanship have made him a global icon."
// };

// export default async function handler(req: NextApiRequest, res: NextApiResponse) {
//   const { celebrity } = req.body;

//   if (!celebrity || typeof celebrity !== 'string') {
//     return res.status(400).json({ error: "Missing or invalid celebrity parameter" });
//   }

//   try {
//     // 3. Load the TinyLlama model (first call downloads it)
//     const generator = await pipeline('text-generation', 'Xenova/tinyllama-1.1b');

//     // 4. Create a concise prompt
//     const prompt = `In 3 sentences, describe the sports career highlights of ${celebrity}. Example: "Messi won the 2022 World Cup."`;

//     // 5. Generate the script
//     const output = await generator(prompt, {
//       max_new_tokens: 80,
//       temperature: 0.7,
//       top_k: 50,
//       top_p: 0.95,
//     });

//     // 6. Clean and return the generated text
//     let script = output[0].generated_text.replace(prompt, '').trim();

//     // If the model output is empty or too short, use fallback
//     if (!script || script.length < 30) {
//       script = MOCK_SCRIPTS[celebrity] || `${celebrity} is a renowned sports figure with an inspiring career.`;
//     }

//     return res.status(200).json({ script });
//   } catch (error) {
//     console.error(error);
//     return res.status(200).json({
//       script: MOCK_SCRIPTS[celebrity] || `${celebrity} is a renowned sports figure with an inspiring career.`
//     });
//   }


// Number 12

import type { NextApiRequest, NextApiResponse } from 'next';

const HF_TOKEN = process.env.HUGGINGFACE_TOKEN; // Get a free token from https://huggingface.co/settings/tokens

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { celebrity } = req.body;

  if (!celebrity || typeof celebrity !== 'string') {
    return res.status(400).json({ error: "Missing or invalid celebrity parameter" });
  }

  if (!HF_TOKEN) {
    return res.status(200).json({
      script: `${celebrity} is a renowned sports figure with an inspiring career.`,
    });
  }

  try {
    const prompt = `In 3 sentences, describe the sports career highlights of ${celebrity}. Example: "Messi won the 2022 World Cup."`;

    const response = await fetch(
      'https://api-inference.huggingface.co/models/Xenova/tinyllama-1.1b',
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${HF_TOKEN}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ inputs: prompt }),
      }
    );

    const data = await response.json();
    let script = Array.isArray(data) && data[0]?.generated_text
      ? data[0].generated_text.replace(prompt, '').trim()
      : `In the world of sports, few names inspire greatness like ${celebrity}. Rising from humble beginnings, ${celebrity} captured the hearts of fans with unforgettable performances and relentless determination. From record-breaking achievements to iconic championship moments`;

    if (!script || script.length < 30) {
      script = `In the world of sports, few names inspire greatness like ${celebrity}. Rising from humble beginnings, ${celebrity} captured the hearts of fans with unforgettable performances and relentless determination. From record-breaking achievements to iconic championship moments`;
    }

    return res.status(200).json({ script });
  } catch (error) {
    return res.status(200).json({
      script: `In the world of sports, few names inspire greatness like ${celebrity}. Rising from humble beginnings, ${celebrity} captured the hearts of fans with unforgettable performances and relentless determination. From record-breaking achievements to iconic championship moments `,
    });
  }
}
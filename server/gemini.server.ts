import { GenerateContentRequest, GoogleGenerativeAI, SchemaType, FunctionDeclaration, FunctionDeclarationSchema, FunctionCallingConfig, FunctionCallingMode, Tool, ToolConfig } from "@google/generative-ai";


export async function callGeminiTextOnly<ResponseType>(
  prompt: string,
  options: {
    model?: string;
    apiKey?: string;
    functions?: {
      name: string;
      description?: string;
      parameters: {
        type: SchemaType;
        properties: Record<string, unknown>;
        required?: string[];
      };
    }[];
    functionCall?: string | { name: string };
  } = {}
): Promise<ResponseType> {
  const { model = "gemini-2.5-pro-preview-03-25", apiKey, functions, functionCall } = options;
  
  try {
    const genAI = new GoogleGenerativeAI(apiKey || process.env.GEMINI_API_KEY!);
    const modelInstance = genAI.getGenerativeModel({ model });

    console.log('Calling Gemini with model:', model);
    console.log('Function call config:', JSON.stringify(functionCall, null, 2));
    
    const request: GenerateContentRequest = {
      contents: [{
        role: "user",
        parts: [{ text: prompt }]
      }]
    };

    if (functions && functions.length > 0) {
      console.log('Using function declarations:', functions.map(f => f.name).join(', '));
      request.tools = [{
        functionDeclarations: functions.map(fn => ({
          name: fn.name,  
          description: fn.description,
          parameters: {
            type: fn.parameters.type,
            properties: fn.parameters.properties,
            required: fn.parameters.required || []
          } as FunctionDeclarationSchema
        })) as FunctionDeclaration[]
      }];

      if (functionCall) {
        request.toolConfig = {
          functionCallingConfig: typeof functionCall === 'string'
            ? { mode: "AUTO" as FunctionCallingMode }
            : { mode: "ANY" as FunctionCallingMode, allowedFunctionNames: [functionCall.name] }
        } as ToolConfig;
        
        console.log('Tool config:', JSON.stringify(request.toolConfig, null, 2));
      }
    }

    const result = await modelInstance.generateContent(request);
    const response = await result.response;

    console.log('Gemini API Response:', JSON.stringify(response.candidates?.[0]?.content, null, 2));

    if (response.candidates && response.candidates[0] && response.candidates[0].content) {
      const content = response.candidates[0].content;
      console.log('Content parts:', JSON.stringify(content.parts, null, 2));
      
      // Check for function calls in any of the content parts
      let functionCallFound = false;
      for (const part of content.parts || []) {
        if (part.functionCall) {
          console.log('Function call found:', JSON.stringify(part.functionCall, null, 2));
          functionCallFound = true;
          return part.functionCall.args as ResponseType;
        }
      }
      
      if (!functionCallFound) {
        console.log('No function calls found in any content parts');
        if (content.parts?.some(part => part.text)) {
          const text = content.parts.map(part => part.text).join('\n');
          console.log('Text response:', text);
          throw new Error('No function calls returned from Gemini, response was text only');
        }
      }
    } else {
      console.log('No valid response candidates found');
      const text = await response.text();
      console.log('Response text:', text);
      throw new Error('No function calls returned from Gemini, here is the response: ' + text);
    }

    return null as unknown as ResponseType;
  } catch (error) {
    console.error('Error calling Gemini:', error);
    throw error;
  }
}

// Landing page schema for generating content
export interface LandingPageData {
  key: string;
  title: string;
  description: string;
  customCss: string;
}

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
  const { model = "gemini-2.5-pro", apiKey, functions, functionCall } = options;
  
  try {
    const genAI = new GoogleGenerativeAI(apiKey || process.env.GEMINI_API_KEY!);
    const modelInstance = genAI.getGenerativeModel({ model });

    const request: GenerateContentRequest = {
      contents: [{
        role: "user",
        parts: [{ text: prompt }]
      }]
    };

    if (functions && functions.length > 0) {
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
            ? { mode: functionCall as FunctionCallingMode }
            : { mode: 'ANY' as FunctionCallingMode, allowedFunctionNames: [functionCall.name] }
        } as ToolConfig;
      }
    }

    const result = await modelInstance.generateContent(request);
    const response = await result.response;

    if (functions && functions.length > 0 && response.candidates && response.candidates[0].content.parts) {
      const functionCalls = response.candidates[0].content.parts[0].functionCall;
      if (functionCalls) {
        return functionCalls.args as ResponseType;
      }
    } else {
      const text = await response.text();
      throw new Error('No function calls returned from Gemini, here is the response: ' + text);
    }

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

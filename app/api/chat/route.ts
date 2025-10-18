import { cookies } from 'next/headers';

import { getCurrentUserId } from '@/lib/auth/get-current-user';
import { createManualToolStreamResponse } from '@/lib/streaming/create-manual-tool-stream';
import { createToolCallingStreamResponse } from '@/lib/streaming/create-tool-calling-stream';
import { Model } from '@/lib/types/models';
import { getModelErrorMessage, isModelRelatedError } from '@/lib/utils/error-handler';
import { isProviderEnabled } from '@/lib/utils/registry';

export const maxDuration = 30;

const DEFAULT_MODEL: Model = {
  id: 'gpt-4o-mini',
  name: 'GPT-4o mini',
  provider: 'OpenAI',
  providerId: 'openai',
  enabled: true,
  toolCallType: 'native',
};

export async function POST(req: Request) {
  try {
    const { messages, id: chatId } = await req.json();
    const referer = req.headers.get('referer');
    const isSharePage = referer?.includes('/share/');
    const userId = await getCurrentUserId();

    if (isSharePage) {
      return new Response('Chat API is not available on share pages', {
        status: 403,
        statusText: 'Forbidden',
      });
    }

    const cookieStore = await cookies();
    const modelJson = cookieStore.get('selectedModel')?.value;
    const searchMode = cookieStore.get('search-mode')?.value === 'true';

    let selectedModel = DEFAULT_MODEL;

    if (modelJson) {
      try {
        selectedModel = JSON.parse(modelJson) as Model;
      } catch (e) {
        console.error('Failed to parse selected model:', e);
      }
    }

    if (!isProviderEnabled(selectedModel.providerId) || selectedModel.enabled === false) {
      return new Response(
        `The selected model provider (${selectedModel.provider}) is not enabled or configured. Please switch to a different model using the model selector.`,
        {
          status: 404,
          statusText: 'Not Found',
        }
      );
    }

    const supportsToolCalling = selectedModel.toolCallType === 'native';

    return supportsToolCalling
      ? createToolCallingStreamResponse({
          messages,
          model: selectedModel,
          chatId,
          searchMode,
          userId,
        })
      : createManualToolStreamResponse({
          messages,
          model: selectedModel,
          chatId,
          searchMode,
          userId,
        });
  } catch (error) {
    console.error('API route error:', error);

    // Check if this is a model-related error and provide helpful message
    const errorMessage = isModelRelatedError(error)
      ? getModelErrorMessage(error)
      : 'Error processing your request. Please try again.';

    return new Response(errorMessage, {
      status: 500,
      statusText: 'Internal Server Error',
    });
  }
}

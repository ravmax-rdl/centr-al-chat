/**
 * Utility functions for handling and formatting model-related errors
 */

/**
 * Checks if an error is model-related and should suggest switching models
 */
export function isModelRelatedError(error: Error | unknown): boolean {
  const errorMessage = error instanceof Error ? error.message : String(error);
  const errorString = errorMessage.toLowerCase();

  // Common model-related error patterns
  const modelErrorPatterns = [
    'rate limit',
    'rate_limit',
    'quota',
    'insufficient quota',
    'token limit',
    'context length',
    'maximum context',
    'context window',
    'model not found',
    'model is not available',
    'invalid model',
    'model does not exist',
    'api key',
    'authentication',
    'unauthorized',
    '401',
    '403',
    '429',
    'too many requests',
    'service unavailable',
    '503',
    'timeout',
    'timed out',
    'connection error',
    'network error',
    'model overloaded',
    'capacity',
    'max tokens',
    'token count exceeded',
  ];

  return modelErrorPatterns.some((pattern) => errorString.includes(pattern));
}

/**
 * Enhances error messages with suggestions to switch models
 */
export function enhanceErrorMessage(error: Error | unknown): string {
  const originalMessage = error instanceof Error ? error.message : String(error);

  if (isModelRelatedError(error)) {
    return `${originalMessage}\n\nTip: Try switching to a different model using the model selector.`;
  }

  return originalMessage;
}

/**
 * Gets a user-friendly error message for model-related errors
 */
export function getModelErrorMessage(error: Error | unknown): string {
  const errorMessage = error instanceof Error ? error.message : String(error);
  const errorString = errorMessage.toLowerCase();

  // Rate limit errors
  if (
    errorString.includes('rate limit') ||
    errorString.includes('429') ||
    errorString.includes('too many requests')
  ) {
    return 'The selected model has reached its rate limit. Please try switching to another model or wait a few moments before trying again.';
  }

  // Quota/capacity errors
  if (
    errorString.includes('quota') ||
    errorString.includes('insufficient quota') ||
    errorString.includes('capacity')
  ) {
    return 'The selected model has exceeded its quota or capacity. Please switch to a different model to continue.';
  }

  // Token/context length errors
  if (
    errorString.includes('token') ||
    errorString.includes('context length') ||
    errorString.includes('context window') ||
    errorString.includes('maximum context')
  ) {
    return "The conversation has exceeded the model's token limit. Try switching to a model with a larger context window or start a new conversation.";
  }

  // Authentication errors
  if (
    errorString.includes('api key') ||
    errorString.includes('authentication') ||
    errorString.includes('unauthorized') ||
    errorString.includes('401') ||
    errorString.includes('403')
  ) {
    return 'Authentication failed with the selected model. Please try switching to a different model or check your API configuration.';
  }

  // Model not found errors
  if (
    errorString.includes('model not found') ||
    errorString.includes('model does not exist') ||
    errorString.includes('invalid model')
  ) {
    return 'The selected model is not available. Please switch to a different model.';
  }

  // Service/network errors
  if (
    errorString.includes('503') ||
    errorString.includes('service unavailable') ||
    errorString.includes('timeout') ||
    errorString.includes('timed out') ||
    errorString.includes('connection error') ||
    errorString.includes('network error')
  ) {
    return 'The selected model is currently unavailable or experiencing issues. Please try switching to a different model.';
  }

  // Model overloaded
  if (errorString.includes('overloaded')) {
    return 'The selected model is currently overloaded. Please try switching to a different model or wait a moment.';
  }

  // Generic model-related error
  if (isModelRelatedError(error)) {
    return `${errorMessage}\n\nTip: Try switching to a different model using the model selector.`;
  }

  // Return original message for non-model errors
  return errorMessage;
}

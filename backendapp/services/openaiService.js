const axios = require('axios');

/**
 * OpenAI Service - Centralized service for all OpenAI API interactions
 * Handles API calls, error handling, retry logic, and cost optimization
 */
class OpenAIService {
  constructor() {
    this.apiKey = process.env.OPENAI_API_KEY;
    this.baseURL = 'https://api.openai.com/v1/chat/completions';
    this.defaultModel = 'gpt-3.5-turbo-0125'; // Modern, fast, supports JSON mode
    this.premiumModel = 'gpt-4o'; // Most capable, supports JSON mode
  }

  /**
   * Main chat completion method
   * @param {Array} messages - Array of message objects with role and content
   * @param {Object} options - Configuration options
   * @returns {Promise<string>} - AI response content
   */
  async chat(messages, options = {}) {
    const {
      model = this.defaultModel,
      temperature = 0.7,
      max_tokens = 1000,
      response_format = null,
      stream = false
    } = options;

    if (!this.apiKey) {
      throw new Error('OpenAI API key is not configured');
    }

    try {
      const requestBody = {
        model,
        messages,
        temperature,
        max_tokens
      };

      // Add response_format only if specified (for JSON mode)
      if (response_format) {
        requestBody.response_format = response_format;
      }

      const response = await axios.post(
        this.baseURL,
        requestBody,
        {
          headers: {
            'Authorization': `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json'
          },
          timeout: 60000 // 60 second timeout
        }
      );

      // Log token usage for cost tracking
      const usage = response.data.usage;
      console.log(`📊 Token Usage - Prompt: ${usage.prompt_tokens}, Completion: ${usage.completion_tokens}, Total: ${usage.total_tokens} (${model})`);

      return response.data.choices[0].message.content;
    } catch (error) {
      // Don't log here if we expect a possible retry in chatJSON
      const errorData = error.response?.data?.error || { message: error.message };
      throw this.handleError(error);
    }
  }

  /**
   * Chat with JSON response format
   * @param {Array} messages - Array of message objects
   * @param {Object} options - Configuration options
   * @returns {Promise<Object>} - Parsed JSON response
   */
  async chatJSON(messages, options = {}) {
    const model = options.model || this.defaultModel;

    // JSON mode is only supported by newer models
    // More restrictive check to avoid errors on base 'gpt-4' or 'gpt-3.5-turbo'
    const supportsJsonMode = model.includes('1106') || model.includes('0125') || model.includes('gpt-4-turbo') || model.includes('gpt-4o');

    // Enhance the last user message to request JSON format
    const enhancedMessages = [...messages];
    const lastMessage = enhancedMessages[enhancedMessages.length - 1];
    if (lastMessage.role === 'user') {
      lastMessage.content += '\n\nIMPORTANT: You must respond with valid JSON only. Do not include any text before or after the JSON object.';
    }

    try {
      const response = await this.chat(enhancedMessages, {
        ...options,
        response_format: supportsJsonMode ? { type: "json_object" } : null
      });
      return this.parseJSONResponse(response);
    } catch (error) {
      // If the error is specifically about response_format not being supported
      if (error.message.includes('response_format') || error.message.includes('json_object')) {
        console.warn('⚠️ JSON mode not supported by model, retrying without it...');
        const retryResponse = await this.chat(enhancedMessages, {
          ...options,
          response_format: null
        });
        return this.parseJSONResponse(retryResponse);
      }
      throw error;
    }
  }

  /**
   * Helper to parse JSON from AI response
   * @param {string} response 
   * @returns {Object}
   */
  parseJSONResponse(response) {
    try {
      let jsonText = response.trim();

      // Remove markdown code blocks
      if (jsonText.startsWith('```json')) {
        jsonText = jsonText.replace(/```json\n?/g, '').replace(/```\n?/g, '');
      } else if (jsonText.startsWith('```')) {
        jsonText = jsonText.replace(/```\n?/g, '');
      }

      return JSON.parse(jsonText);
    } catch (parseError) {
      console.error('❌ Failed to parse JSON response:', response);
      throw new Error('AI returned invalid JSON format');
    }
  }

  /**
   * Simple prompt-based chat (convenience method)
   * @param {string} prompt - User prompt
   * @param {Object} options - Configuration options
   * @returns {Promise<string>} - AI response
   */
  async simpleChat(prompt, options = {}) {
    const messages = [{ role: 'user', content: prompt }];
    return this.chat(messages, options);
  }

  /**
   * Chat with system prompt
   * @param {string} systemPrompt - System instruction
   * @param {string} userPrompt - User message
   * @param {Object} options - Configuration options
   * @returns {Promise<string>} - AI response
   */
  async chatWithSystem(systemPrompt, userPrompt, options = {}) {
    const messages = [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt }
    ];
    return this.chat(messages, options);
  }

  /**
   * Handle API errors with user-friendly messages
   * @param {Error} error - Original error
   * @returns {Error} - Formatted error
   */
  handleError(error) {
    if (error.response) {
      const status = error.response.status;
      const data = error.response.data;

      switch (status) {
        case 401:
          return new Error('OpenAI API authentication failed. Please check your API key.');
        case 429:
          return new Error('OpenAI API rate limit exceeded. Please try again later.');
        case 500:
        case 502:
        case 503:
          return new Error('OpenAI service is temporarily unavailable. Please try again.');
        case 400:
          return new Error(data.error?.message || 'Invalid request to OpenAI API.');
        default:
          return new Error(`OpenAI API error: ${data.error?.message || 'Unknown error'}`);
      }
    }

    if (error.code === 'ECONNABORTED') {
      return new Error('Request timeout. The AI is taking too long to respond.');
    }

    return new Error('Failed to connect to AI service. Please check your internet connection.');
  }

  /**
   * Estimate token count (rough approximation)
   * @param {string} text - Text to estimate
   * @returns {number} - Estimated token count
   */
  estimateTokens(text) {
    // Rough estimate: 1 token ≈ 4 characters
    return Math.ceil(text.length / 4);
  }

  /**
   * Truncate text to fit within token limit
   * @param {string} text - Text to truncate
   * @param {number} maxTokens - Maximum tokens allowed
   * @returns {string} - Truncated text
   */
  truncateToTokens(text, maxTokens) {
    const estimatedTokens = this.estimateTokens(text);
    if (estimatedTokens <= maxTokens) {
      return text;
    }

    const ratio = maxTokens / estimatedTokens;
    const targetLength = Math.floor(text.length * ratio);
    return text.substring(0, targetLength) + '...';
  }

  /**
   * Check if API key is configured
   * @returns {boolean}
   */
  isConfigured() {
    return !!this.apiKey;
  }
}

// Export singleton instance
module.exports = new OpenAIService();

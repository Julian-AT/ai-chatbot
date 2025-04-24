import { z } from 'zod';
import { experimental_generateImage as generateImage, tool } from 'ai';
import { openai } from '@ai-sdk/openai';
import { put } from '@vercel/blob';

export const generateInteriorImage = (chatId: string) => tool({
  description: 'Generate an interior design image based on a text prompt',
  parameters: z.object({
    prompt: z.string().describe('Detailed description of the interior design to generate'),
    size: z.enum(['1024x1024', '1792x1024', '1024x1792']).optional().default('1024x1024')
      .describe('Size of the generated image'),
    quality: z.enum(['standard', 'hd']).optional().default('standard')
      .describe('Quality of the generated image'),
    style: z.enum(['vivid', 'natural']).optional().default('vivid')
      .describe('Style of the generated image'),
  }),
  execute: async ({ prompt, size, quality, style }) => {
    try {
      const enhancedPrompt = `Interior design: ${prompt}`;
      
      const { image } = await generateImage({
        model: openai.image('dall-e-3'),
        prompt: enhancedPrompt,
        size,
        providerOptions: {
          openai: { quality, style }
        }
      });

      // Convert base64 to Blob for storage
      const base64Data = image.base64;
      const binaryData = Buffer.from(base64Data, 'base64');
      
      // Generate a unique filename with timestamp
      const timestamp = Date.now();
      const filename = `interiorly-${chatId}-${timestamp}.png`;
      
      // Upload to blob storage
      const uploadedImage = await put(filename, binaryData, {
        access: 'public',
      });

      console.log('uploadedImage', uploadedImage);

      return {
        url: uploadedImage.url, // Return the public URL from blob storage
        prompt: enhancedPrompt
      };
    } catch (error) {
      console.error('Error generating image:', error);
      throw new Error('Failed to generate interior design image');
    }
  },
});

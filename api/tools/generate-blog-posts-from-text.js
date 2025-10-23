      // /api/tools/generate-blog-posts-from-text
      import { z } from "zod";
      import { ai } from "../../ai/config.js";

      const GenerateBlogPostsFromTextInputSchema = z.object({
        text: z.string().describe('The text to generate a blog post from.'),
      });

      const GenerateBlogPostsFromTextOutputSchema = z.object({
        title: z.string().describe('The generated title for the blog post.'),
        blogPost: z.string().describe('The generated blog post content.'),
      });

      const prompt = ai.definePrompt({
        name: 'generateBlogPostsFromTextPrompt',
        input: { schema: GenerateBlogPostsFromTextInputSchema },
        output: { schema: GenerateBlogPostsFromTextOutputSchema },
        prompt: `You are an expert blog post writer.

Your task is to analyze the following text and generate a concise, engaging title and a well-structured blog post from it.

Text: {{{text}}}

Please provide the output in the specified structured format.`,
      });

      const generateBlogPostsFromTextFlow = ai.defineFlow(
        {
          name: 'generateBlogPostsFromTextFlow',
          inputSchema: GenerateBlogPostsFromTextInputSchema,
          outputSchema: GenerateBlogPostsFromTextOutputSchema,
        },
        async input => {
          const { output } = await prompt(input);
          return output;
        }
      );

      export default async function handler(req, res) {
        if (req.method !== 'POST') {
          res.status(405).json({ error: 'Method not allowed. Use POST.' });
          return;
        }
        try {
          const body = req.body && Object.keys(req.body).length ? req.body : await new Promise((resolve, reject) => {
            let data='';
            req.on('data', chunk=>data+=chunk);
            req.on('end', ()=> {
              try { resolve(JSON.parse(data || '{}')); } catch(e){ resolve({}); }
            });
            req.on('error', reject);
          });

          const parsed = GenerateBlogPostsFromTextInputSchema.safeParse(body);
          if (!parsed.success) {
            res.status(400).json({ error: 'Invalid input', details: parsed.error.format() });
            return;
          }

          const output = await generateBlogPostsFromTextFlow(parsed.data);
          const validated = GenerateBlogPostsFromTextOutputSchema.parse(output);

          res.status(200).json({ success: true, output: validated });
        } catch (err) {
          console.error(err);
          res.status(500).json({ error: 'Internal error', details: String(err) });
        }
      }

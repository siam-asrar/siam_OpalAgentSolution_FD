// ai/config.js
// Small shim that mimics an `assemble`/`ai` runtime with definePrompt and defineFlow.
// Replace this file with your real assemble.ai / Opal runtime when ready.

export const ai = {
  definePrompt({name, input, output, prompt}) {
    // returns a function that when called with input, returns { output: {...} }
    return async function runPrompt(inputData) {
      // Very small synchronous "LLM" emulation: interpolate the prompt and produce structured output
      const text = inputData?.text || '';
      // Simple title extraction
      const firstLine = (text.split('\n').find(Boolean) || text).trim();
      const title = firstLine.split(/\s+/).slice(0,7).map(w => w.replace(/[^a-zA-Z0-9'-]/g,'')).map(w=> w.charAt(0).toUpperCase()+w.slice(1)).join(' ') || 'Untitled';
      const paragraphs = text.split(/\n{2,}/).map(p=>p.trim()).filter(Boolean);
      const blogPost = [
        `Introduction:\n${paragraphs[0] || text.slice(0,200)}`,
        ...paragraphs.slice(1,4).map((p,i)=>`Point ${i+1}:\n${p}`),
        'Conclusion:\nThis summarizes the key points. Edit for tone or length.'
      ].join('\n\n');
      return { output: { title, blogPost } };
    };
  },

  defineFlow({name, inputSchema, outputSchema}, fn) {
    // Return a wrapper function that validates input (if schema provided) and runs fn
    return async function runFlow(input) {
      // naive validation: trust caller
      return fn(input);
    };
  }
};

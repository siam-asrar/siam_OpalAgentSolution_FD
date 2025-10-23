// /api/tools/create-draft
// Simple in-memory drafts store (ephemeral). Replace with DB in production.

let drafts = [];
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

    const title = (body.title || '').toString();
    const bodyText = (body.body || '').toString();
    if (!title || !bodyText) {
      res.status(400).json({ error: 'Provide title and body.' });
      return;
    }
    const id = `draft_${Date.now()}`;
    const draft = { id, title, body: bodyText, created_at: new Date().toISOString() };
    drafts.push(draft);
    res.status(200).json({ success: true, draft });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: String(err) });
  }
}

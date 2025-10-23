// /api/tools/engage-post-followup
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

    const { platform, original_post_id, content, repeat=false, days=0 } = body;
    if (!platform || !original_post_id || !content) {
      res.status(400).json({ error: 'platform, original_post_id, and content required.' });
      return;
    }

    // Emulate creating a follow-up job
    const followupId = `follow_${Date.now()}`;
    res.status(200).json({ success: true, followupId, scheduled: !!repeat, days: Number(days) });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: String(err) });
  }
}

// /api/tools/schedule-social-post
// Simple in-memory scheduler (ephemeral). Add persistent queue in production.

let jobs = [];

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

    const { platform, content, repeat=false, days=0, approved=false } = body;
    if (!platform || !content) {
      res.status(400).json({ error: 'platform and content required.' });
      return;
    }
    const jobId = `job_${Date.now()}`;
    const job = { jobId, platform, content, repeat: !!repeat, days: Number(days), approved: !!approved, status: approved ? 'scheduled' : 'pending', created_at: new Date().toISOString() };
    jobs.push(job);
    res.status(200).json({ success: true, job });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: String(err) });
  }
}

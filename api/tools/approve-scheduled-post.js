// /api/tools/approve-scheduled-post
import { promises as fs } from 'fs';

// This file shares the in-memory jobs list with schedule-social-post.js in a real app you'd use a DB.
// For this bundle we emulate by reading/writing a simple JSON file under /tmp (works on Vercel dev but ephemeral).

const STORE = '/tmp/opal_jobs.json';

async function readJobs() {
  try {
    const data = await fs.readFile(STORE, 'utf8');
    return JSON.parse(data);
  } catch (e) { return []; }
}
async function writeJobs(jobs) {
  try { await fs.writeFile(STORE, JSON.stringify(jobs, null, 2)); } catch(e){/*ignore*/ }
}

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

    const { jobId, approve } = body;
    if (!jobId) { res.status(400).json({ error: 'jobId required' }); return; }

    const jobs = await readJobs();
    const idx = jobs.findIndex(j=>j.jobId===jobId);
    if (idx === -1) { res.status(404).json({ error: 'Job not found' }); return; }

    jobs[idx].approved = !!approve;
    jobs[idx].status = approve ? 'scheduled' : 'rejected';
    await writeJobs(jobs);
    res.status(200).json({ success: true, job: jobs[idx] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: String(err) });
  }
}

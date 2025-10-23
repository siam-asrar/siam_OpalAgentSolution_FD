// /api/tools/list-scheduled
import { promises as fs } from 'fs';
const STORE = '/tmp/opal_jobs.json';
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed. Use POST.' });
    return;
  }
  try {
    let jobs = [];
    try {
      const data = await fs.readFile(STORE, 'utf8');
      jobs = JSON.parse(data);
    } catch(e){ jobs = []; }
    res.status(200).json({ success: true, jobs });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: String(err) });
  }
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, Notion-Version');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const { path } = req.query;
  if (!path) {
    return res.status(400).json({ error: 'path required' });
  }

  const notionUrl = `https://api.notion.com/v1/${Array.isArray(path) ? path.join('/') : path}`;
  const token = req.headers['authorization'];
  const notionVersion = req.headers['notion-version'] || '2022-06-28';

  try {
    const fetchOptions = {
      method: req.method,
      headers: {
        'Authorization': token,
        'Notion-Version': notionVersion,
        'Content-Type': 'application/json',
      },
    };

    if ((req.method === 'POST' || req.method === 'PATCH') && req.body) {
      fetchOptions.body = JSON.stringify(req.body);
    }

    const notionRes = await fetch(notionUrl, fetchOptions);
    const data = await notionRes.json();
    return res.status(notionRes.status).json(data);
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
}

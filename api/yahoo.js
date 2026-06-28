export default async function handler(req, res) {
  const { symbol } = req.query;
  
  if (!symbol) {
    return res.status(400).json({ error: 'Missing symbol' });
  }
  
  try {
    const targetUrl = `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(symbol)}?interval=1d&range=1d`;
    const yahooRes = await fetch(targetUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' // Some APIs require this
      }
    });
    
    if (!yahooRes.ok) {
      return res.status(yahooRes.status).json({ error: 'Failed to fetch from Yahoo' });
    }
    
    const data = await yahooRes.json();
    
    // Allow CORS so the Vite frontend can access this endpoint
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
    res.setHeader(
      'Access-Control-Allow-Headers',
      'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
    );
    
    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}

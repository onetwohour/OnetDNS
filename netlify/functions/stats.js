const fetch = require('node-fetch');

exports.handler = async (event, context) => {
  if (!process.env.APIURL) {
    return { statusCode: 500, body: JSON.stringify({ error: 'APIURL not configured' }) };
  }

  const urls = process.env.APIURL
    .split(',')
    .map(u => u.trim())
    .filter(Boolean);

  const {
    API_AUTHORIZATION_HEADER,
    API_PATH,
  } = process.env;

  const authHeader = {
    Authorization: API_AUTHORIZATION_HEADER,
    Accept: 'application/json',
  };

  if (!authHeader.Authorization) {
    return { statusCode: 500, body: JSON.stringify({ error: 'Authorization not configured' }) };
  }

  const responses = await Promise.all(
    urls.map(u => fetch(`https://${u}${API_PATH}`, { headers: authHeader }))
  );

  const failed = responses.find(r => !r.ok);
  if (failed) {
    const errorBody = await failed.text();
    return { statusCode: failed.status, body: JSON.stringify({ error: 'API request failed', details: errorBody }) };
  }

  const data = await Promise.all(responses.map(r => r.json()));

  const detectNodeId = (source, idx) => {
    const s = String(source || '').toLowerCase();
    if (s.includes('one.')) return 'one';
    if (s.includes('two.')) return 'two';
    if (s.includes('3.39.126.146')) return 'one';
    if (s.includes('15.165.111.52')) return 'two';
    return idx === 0 ? 'one' : 'two';
  };
  
  const queriesPerServer = urls.map((url, idx) => {
    const q = Number(data[idx]?.num_dns_queries) || 0;
    return {
      source: url,
      node: detectNodeId(url, idx),
      queries: q
    };
  });

  const totalBlocked = data.reduce((sum, d) => sum + (Number(d?.num_blocked_filtering) || 0), 0);
  const totalQueries = data.reduce((sum, d) => sum + (Number(d?.num_dns_queries) || 0), 0);
  const totalRatio = totalQueries > 0 ? ((totalBlocked / totalQueries) * 100).toFixed(1) : '0.0';

  const minEntry = queriesPerServer.reduce((min, cur) => (cur.queries < min.queries ? cur : min), queriesPerServer[0] || { queries: Infinity });
  const recommended = minEntry && Number.isFinite(minEntry.queries) ? { node: minEntry.node, source: minEntry.source } : null;

  return {
    statusCode: 200,
    body: JSON.stringify({
      queries: queriesPerServer,
      blocked: totalBlocked,
      ratio: totalRatio,
      recommended
    }),
  };
};

const fetch = require('node-fetch');

exports.handler = async (event, context) => {
  if (!process.env.APIURL) {
    return { statusCode: 500, body: JSON.stringify({ error: 'APIURL not configured' }) };
  }

  const urls = process.env.APIURL
    .split(',')
    .map(u => u.trim())
    .filter(Boolean);

  // One read-only token per server, in the same order as APIURL.
  const tokens = (process.env.API_TOKENS || '')
    .split(',')
    .map(t => t.trim());

  if (tokens.length !== urls.length || tokens.some(t => !t)) {
    return { statusCode: 500, body: JSON.stringify({ error: 'API_TOKENS must hold one token per APIURL entry' }) };
  }

  const responses = await Promise.all(
    urls.map((u, idx) => fetch(`https://${u}/v1/stats/history/86400`, {
      headers: { Authorization: `Bearer ${tokens[idx]}`, Accept: 'application/json' },
    }))
  );

  const failed = responses.find(r => !r.ok);
  if (failed) {
    const errorBody = await failed.text();
    return { statusCode: failed.status, body: JSON.stringify({ error: 'API request failed', details: errorBody }) };
  }

  const data = await Promise.all(responses.map(r => r.json()));
  const sum = (d, key) => (d?.points || []).reduce((total, p) => total + (Number(p[key]) || 0), 0);

  const detectNodeId = (source, idx) => {
    const s = String(source || '').toLowerCase();
    if (s.includes('one.')) return 'one';
    if (s.includes('two.')) return 'two';
    if (s.includes('3.39.126.146')) return 'one';
    if (s.includes('15.165.111.52')) return 'two';
    return idx === 0 ? 'one' : 'two';
  };
  
  const queriesPerServer = urls.map((url, idx) => {
    const q = sum(data[idx], 'queries');
    return {
      source: url,
      node: detectNodeId(url, idx),
      queries: q
    };
  });

  const totalBlocked = data.reduce((total, d) => total + sum(d, 'blocked'), 0);
  const totalQueries = data.reduce((total, d) => total + sum(d, 'queries'), 0);
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

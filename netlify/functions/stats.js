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

  const totalQueries  = data.reduce((sum, d) => sum + d.num_dns_queries, 0);
  const totalBlocked  = data.reduce((sum, d) => sum + d.num_blocked_filtering, 0);

  return {
    statusCode: 200,
    body: JSON.stringify({
      sources: urls.length,
      queries: totalQueries,
      blocked: totalBlocked,
      ratio: totalQueries > 0 ? ((totalBlocked / totalQueries) * 100).toFixed(1) : '0.0'
    }),
  };
};

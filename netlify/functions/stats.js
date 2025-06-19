const fetch = require('node-fetch');

exports.handler = async (event, context) => {
  const urls = process.env.APIURL
    .split(',')
    .map(u => u.trim())
    .filter(Boolean);

  const { USER: user, PASS: pass } = process.env;
  const authHeader = {
    Authorization: `Basic ${Buffer.from(`${user}:${pass}`).toString('base64')}`,
    Accept: 'application/json',
  };

  const responses = await Promise.all(
    urls.map(u => fetch(`http://${u}:3000/control/stats`, { headers: authHeader }))
  );

  const failed = responses.find(r => !r.ok);
  if (failed) {
    return { statusCode: failed.status, body: JSON.stringify({ error: 'error' }) };
  }

  const data = await Promise.all(responses.map(r => r.json()));

  const totalQueries  = data.reduce((sum, d) => sum + d.num_dns_queries,       0);
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

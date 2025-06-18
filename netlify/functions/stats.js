const fetch = require('node-fetch');

exports.handler = async function (event, context) {
  const apiUrl = process.env.APIURL;
  const user = process.env.USER;
  const pass = process.env.PASS;
  const credentials = Buffer.from(`${user}:${pass}`).toString('base64');

  const res = await fetch(apiUrl, {
    headers: {
      Authorization: `Basic ${credentials}`,
      Accept: 'application/json'
    }
  });

  if (!res.ok) {
    return {
      statusCode: res.status,
      body: JSON.stringify({ error: 'error' })
    };
  }

  const json = await res.json();

  return {
    statusCode: 200,
    body: JSON.stringify({
      queries: json.num_dns_queries,
      blocked: json.num_blocked_filtering,
      ratio: ((json.num_blocked_filtering / json.num_dns_queries) * 100).toFixed(1)
    })
  };
};

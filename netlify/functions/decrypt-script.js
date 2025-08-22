// functions/decrypt-script.js

function xorCipher(text, key) {
  let result = "";
  for (let i = 0; i < text.length; i++) {
    result += String.fromCharCode(text.charCodeAt(i) ^ key.charCodeAt(i % key.length));
  }
  return result;
}

exports.handler = async function(event, context) {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    const { payload } = JSON.parse(event.body);
    if (!payload) {
      return { statusCode: 400, body: 'Payload required' };
    }

    const encryptedPayload = String.fromCharCode.apply(null, payload);

    const secretKey = process.env.SECRETKEY;

    const reversedB64 = xorCipher(encryptedPayload, secretKey);

    const originalB64 = reversedB64.split('').reverse().join('');
    
    const decodedScript = Buffer.from(originalB64, 'base64').toString('utf-8');

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/javascript',
      },
      body: decodedScript,
    };
  } catch (error) {
    console.error('Decryption error:', error);
    return { statusCode: 500, body: 'Internal Server Error' };
  }
};
const fs = require('fs/promises');
const path = require('path');

exports.handler = async () => {
  try {
    const filePath = path.join(__dirname, 'content.html');
    const html = await fs.readFile(filePath, 'utf8');

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'text/html; charset=UTF-8',
        'Cache-Control': 'no-store, no-cache, must-revalidate, max-age=0',
        'Pragma': 'no-cache',
        'Expires': '0'
      },
      body: html
    };
  } catch (err) {
    console.error(err);
    return { statusCode: 500, body: 'fail' };
  }
};
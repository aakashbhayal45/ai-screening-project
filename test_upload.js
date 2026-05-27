// Quick test: simulate resume upload with skills
const http = require('http');

const boundary = '----TestBoundary123';
const resumeContent = 'Skills: Java, Python, React, MongoDB, Node.js\nExperience with building web applications using React and Node.js\nDatabase management with MongoDB and MySQL';

const body = [
  `--${boundary}`,
  `Content-Disposition: form-data; name="resume"; filename="TestCandidate_Java_Python.pdf"`,
  `Content-Type: application/pdf`,
  ``,
  resumeContent,
  `--${boundary}`,
  `Content-Disposition: form-data; name="targetJob"`,
  ``,
  `Senior React Developer`,
  `--${boundary}--`
].join('\r\n');

const options = {
  hostname: 'localhost',
  port: 5000,
  path: '/api/candidates/upload',
  method: 'POST',
  headers: {
    'Content-Type': `multipart/form-data; boundary=${boundary}`,
    'Content-Length': Buffer.byteLength(body)
  }
};

const req = http.request(options, (res) => {
  let data = '';
  res.on('data', (chunk) => data += chunk);
  res.on('end', () => {
    const result = JSON.parse(data);
    console.log('\n=== RESUME SCORING RESULT ===');
    console.log('Name:', result.data?.name);
    console.log('Score:', result.data?.score + '%');
    console.log('Status:', result.data?.status);
    console.log('Matched Skills:', (result.data?.skills || []).join(', '));
    console.log('Missing Skills:', (result.data?.missing || []).join(', '));
    console.log('============================\n');
  });
});

req.on('error', (e) => console.error('Error:', e.message));
req.write(body);
req.end();

const express = require('express');
const crypto = require('crypto');
const path = require('path');
const app = express();

app.use(express.json());
app.use(express.static(__dirname));

let chain = [{ prev: '0'.repeat(256), hash: 'GENESIS', nonce: 0, time: Date.now() }];

function s512(s) {
  return crypto.createHash('sha512').update(s).digest('hex');
}

function real(p, n) {
  return s512(p + 'VQI' + n) + s512(p + 'VQI');
}

// FIX: ini yang bikin Cannot GET / hilang
app.get('/', (q, r) => {
  r.sendFile(path.join(__dirname, 'landing.html'));
});

app.get('/chain', (q, r) => r.json(chain));

app.get('/mine', async (q, r) => {
  let prev = chain[chain.length - 1].hash, nonce = 0;
  while (true) {
    let h = real(prev, nonce);
    if (h.startsWith('0000')) {
      let b = { prev, hash: h, nonce, time: Date.now() };
      chain.push(b);
      return r.json(b);
    }
    nonce++;
    if (nonce % 2000 == 0) await new Promise(x => setTimeout(x, 1));
  }
});

app.listen(3000, () => console.log('VQI REAL 256 HEX running on 3000'));

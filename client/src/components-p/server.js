const express = require('express');
const axios = require('axios');

const app = express();
const PORT = 3001; // Choose a suitable port number

app.use(express.json());

app.get('/ipfs/:hash', async (req, res) => {
  const { hash } = req.params;
  const ipfsUrl = `https://gateway.pinata.cloud/ipfs/${hash}`;

  try {
    const response = await axios.get(ipfsUrl, { responseType: 'arraybuffer' });

    // Set appropriate headers
    res.setHeader('Content-Type', response.headers['content-type']);
    res.send(response.data);
  } catch (error) {
    res.status(500).json({ error: 'An error occurred' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

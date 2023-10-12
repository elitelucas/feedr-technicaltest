const express = require('express');
const cors = require('cors');
const items = require('./items');

const app = express();

const port = process.env.PORT || 8080;

app.use(cors());

app.use(express.static('dist'));

app.get('/api/items', (req, res) => {
    const search = req.query.search;
    res.send({ items: items.filter((item) => item.name.toLowerCase().includes(search.toLocaleLowerCase())) })
});

app.listen(port, () => console.log(`Listening on port ${port}!`));

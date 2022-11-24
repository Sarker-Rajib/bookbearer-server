const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion } = require('mongodb');
const port = process.env.PORT || 5000;
require('dotenv').config();
const app = express();


// middleware
app.use(express.json())
app.use(cors());


const uri = `mongodb+srv://${process.env.REACT_APP_ADMIN_USER}:${process.env.REACT_APP_ADMIN_PASSWORD}@cluster0.yw8lqr5.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

console.log(uri);
const run = async () => {
    try {
        const booksCollection = client.db("bookStore").collection("books");

        app.get('/books', async (req, res) => {
            const query = {};
            
            const result = await booksCollection.find(query).toArray();
            res.send(result)
        });

        app.post('/books', async (req, res) => {
            const book = req.body;
            const result = await booksCollection.insertOne(book);
            res.send(result)
        });

    }

    finally { }
};

run();

app.get('/', (req, res) => {
    res.send('Welcome to the BookBearer Server!')
})

app.listen(port, () => {
    console.log(`BookBearer server running on port ${port}`);
});
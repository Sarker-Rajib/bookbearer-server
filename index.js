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

const run = async () => {
    try {
        const booksCategoryCollection = client.db("bookStore").collection("bookCategories");
        const booksCollection = client.db("bookStore").collection("books");
        const userCollection = client.db("bookStore").collection("users");

        app.get('/bookCategories', async (req, res) => {
            const query = {};

            const result = await booksCategoryCollection.find(query).toArray();
            res.send(result)
        });

        app.get('/books', async (req, res) => {
            const categoryId = parseFloat(req.query.categoryId);
            let query = {};

            if (categoryId) {
                query = {
                    categoryId: categoryId
                };
            }

            const result = await booksCollection.find(query).toArray();
            res.send(result)
        });

        app.post('/books', async (req, res) => {
            const book = req.body;
            const result = await booksCollection.insertOne(book);
            res.send(result)
        });

        app.post('/users', async (req, res) => {
            const user = req.body;
            const result = await userCollection.insertOne(user);
            res.send(result);
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
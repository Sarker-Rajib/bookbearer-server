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
        const bookingsCollection = client.db("bookStore").collection("bookings");
        const userCollection = client.db("bookStore").collection("users");

        app.get('/bookCategories', async (req, res) => {
            const query = {};

            const result = await booksCategoryCollection.find(query).toArray();
            res.send(result)
        });

        app.get('/books', async (req, res) => {
            const categoryId = parseFloat(req.query.categoryId);
            const userEmail = req.query.email;
            let query = {};

            if (categoryId) {
                query = {
                    categoryId: categoryId
                };
            }
            if (userEmail) {
                query = {
                    email: userEmail
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

        app.post('/bookings', async (req, res) => {
            const booking = req.body;
            const result = await bookingsCollection.insertOne(booking);
            res.send(result)
        });

        app.post('/users', async (req, res) => {
            const user = req.body;
            const result = await userCollection.insertOne(user);
            res.send(result);
        });

        app.put('/users', async (req, res) => {
            const user = req.body;
            const filter = { email: user.email };
            const options = { upsert: true };

            const updatedDoc = {
                $set: {
                    name: user.name,
                    image: user.image,
                    email: user.email,
                    uid: user.uid,
                    role: 'buyer'
                }
            }

            const result = await userCollection.updateOne(filter, updatedDoc, options);
            res.send(result);
        })


        // admin status api
        app.get('/users/admins/:email', async (req, res) => {
            const email = req.params.email;
            const query = { email: email }

            const user = await userCollection.findOne(query);
            res.send({ isAdmin: user?.role === 'admin' })
        });

        // seller status api
        app.get('/users/sellers/:email', async (req, res) => {
            const email = req.params.email;
            const query = { email: email }

            const user = await userCollection.findOne(query);
            res.send({ isSeller: user?.role === 'seller' })
        });

        // Buyer status api
        app.get('/users/buyers/:email', async (req, res) => {
            const email = req.params.email;
            const query = { email: email }

            const user = await userCollection.findOne(query);
            res.send({ isBuyer: user?.role === 'buyer' })
        });


        // all sellers
        app.get('/sellers', async (req, res) => {
            const role = req.query.role;
            const query = {
                role: role
            };

            const sellers = await userCollection.find(query).toArray();
            res.send(sellers)
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
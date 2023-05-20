const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config()
const app = express();
const port = process.env.PORT || 5000;

//middleware

app.use(cors());
app.use(express.json());





const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.2yyawyx.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {
        // Connect the client to the server	(optional starting in v4.7)
        await client.connect();



        const serviceCollection = client.db('toyGalaxy').collection('services')

        app.post("/addAToy", async (req, res) => {
            const body = req.body;
            const result = await serviceCollection.insertOne(body);
            res.send(result)
        })
        app.get("/allToys", async (req, res) => {

            const result = await serviceCollection.find({}).toArray();
            res.send(result);
        })



        app.get("/allToys/:text", async (req, res) => {
            console.log(req.params.text);
            if (req.params.text == "sportsCar" ||
                req.params.text == "policeCar"
                || req.params.text == "truck"
            ) {
                const result = await serviceCollection.find({ category: req.params.text }).toArray();
                return res.send(result);
            }

            const result = await serviceCollection.find({}).toArray();
            res.send(result);

        })



        app.get("/myToys/:email", async (req, res) => {
            const toys = await serviceCollection
                .find({
                    sellerEmail: req.params.email,
                })
                .toArray();
            res.send(toys);
        });

        app.put("/updateToy/:id", async (req, res) => {
            const id = req.params.id;
            const body = req.body;
            const filter = { _id: new ObjectId(id) };
            const updateDoc = {
                $set: {

                    price: body.price,
                    quantity: body.quantity,
                    description: body.description,
                },
            };
            const result = await serviceCollection.updateOne(filter, updateDoc);
            res.send(result);
        });

        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);





app.get('/', (req, res) => {
    res.send('Toy Galaxy server running')
})

app.listen(port, () => {
    console.log(`Toy Galaxy is running on port : ${port}`)
})
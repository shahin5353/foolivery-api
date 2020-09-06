const express = require('express')
const app = express()
const cors = require('cors')
const bodyParser = require('body-parser')
const MongoClient = require('mongodb').MongoClient;
require('dotenv').config();
const ObjectId = require('mongodb').ObjectId; 

const uri = process.env.DB_PATH;
const client = new MongoClient(uri, { useNewUrlParser: true,useUnifiedTopology: true });

app.use(cors())
app.use(bodyParser.json())

app.get('/items', (req, res) => {
    client.connect(err => {
        const collection = client.db("foolivery").collection("items");
        collection.find().toArray((err, documents) => {
            if (err) {
                console.log(err);
                res.status(500).send({ message: err })
            }
            else {
                res.send(documents);
            }
        })
    });
});

app.get('/item/:id', (req, res) => {
    const itemId = req.params.id;
    client.connect(err => {
        const collection = client.db("foolivery").collection("items");
        collection.find({ _id: ObjectId(itemId) }).toArray((err, documents) => {
            if (err) {
                console.log(err);
                res.status(500).send({ message: err })
            }
            else {
                res.send(documents[0]);
            }
        })
    });
});

app.patch('/item/:id', (req, res) => {
    const itemId = req.params.id;
    const updateObject = req.body;
    client.connect(err => {
        const collection = client.db("foolivery").collection("items");
        collection.updateOne(
            { _id:ObjectId(itemId) }, 
            { $set: updateObject },
          (err, result) => {
            if (err) {
                console.log(err);
                res.status(500).send({ message: err })
            }
            else {
                res.send(result);
            }
        })
    });
})

app.delete('/item/:id', (req, res) => {
    const itemId = req.params.id;
    client.connect(err => {
        const collection = client.db("foolivery").collection("items");
        collection.deleteOne({ _id:ObjectId(itemId) },(err, result) => {
            if (err) {
                console.log(err);
                res.status(500).send({ message: err })
            }
            else {
                res.send(`${result.deletedCount} document was deleted.`);
            }
        })
    });
})

app.post('/itemsById', (req, res) => {
    const IdArray = req.body;
    const ObjectIdArray = []
    IdArray.forEach(function(stringId){
        ObjectIdArray.push(new ObjectId(stringId))
    })
    client.connect(err => {
        const collection = client.db("foolivery").collection("items");
        collection.find({ _id: { $in: ObjectIdArray } }).toArray((err, documents) => {
            if (err) {
                console.log(err);
                res.status(500).send({ message: err })
            }
            else {
                res.send(documents);
            }
        })
    });
});

app.post('/addItem', (req, res) => {
    const items = req.body
    client.connect(err => {
        const collection = client.db("foolivery").collection("items");
        collection.insert(items, (err, result) => {
            if (err) {
                console.log(err);
                res.status(500).send({ message: err })
            }
            else {
                res.send(result.ops);
            }
        })
    })
})

app.listen(process.env.PORT, () => console.log("Listening from port", process.env.PORT || 4000))
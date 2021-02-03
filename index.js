const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const MongoClient = require('mongodb').MongoClient;
const { ObjectId } = require('mongodb');
require('dotenv').config();

const app = express();
const port = 5000;
app.use(cors());
app.use(bodyParser.json());
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.p9rwg.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

client.connect(err => {
  const productCollection = client.db("rahim-store").collection("products");

  app.post("/addProduct", function(req,res){
      const addedProduct = req.body;
      productCollection.insertOne(addedProduct);
  })

  app.get("/allProducts", function(req,res){
      productCollection.find({})
      .toArray((err,doc) => {
        res.send(doc);
      })
  })

  app.delete("/delete/:id", function(req,res){
      productCollection.deleteOne({_id: ObjectId(req.params.id)})
      .then(result => {
        res.send(result.deletedCount > 0)
      })
  })

  app.patch("/edit/:id", (req,res) => {
      productCollection.updateOne({_id: ObjectId(req.params.id)},
      {
        $set: {name: req.body.name, price: req.body.price, expiry: req.body.expiry}
      }
     )
  })

});


app.get("/",function(req,res){
    res.send("hello world");
});

app.listen(process.env.PORT || port);


const express = require('express');
const { connectToServer, getDb } = require('./mongo');
const { ObjectId } = require('mongodb');


const app = express();
const port = 3000;

app.listen(port);

const products = "products";

connectToServer(() => {
  console.log("ok");
});

app.get('/products', (req, res) => {
  getDb().collection(products).find({}).toArray().then((result) => {
    res.send(result);
  }).catch((err) => {
    res.status(500).send(err);
  });
});

app.post('/products', (req, res) => {
  const name = req.body.name;
  const price = req.body.price;
  const quantity = req.body.quantity;

  const obj = {
    name: name,
    price: price,
    quantity: quantity
  };

  getDb().collection(products).insertOne(obj).then((result) => {
    res.send(result);
  }).catch((err) => {
    res.status(500).send(err);
  });
});

app.put('/products/:id', (req, res) => {
  const id = req.params.id;
  const price = req.body.price;
  const name = req.body.name;
  const quantity = req.body.quantity;

  if (price) {
    getDb().collection(products).updateOne({ _id: new ObjectId(id) }, { $set: { price: price } });
  }

  if (name) {
    getDb().collection(products).updateOne({ _id: new ObjectId(id) }, { $set: { name: name } });
  }

  if (quantity) {
    getDb().collection(products).updateOne({ _id: new ObjectId(id) }, { $set: { quantity: quantity } });
  }
  res.send("Updated");
});

app.delete('/products/:id', (req, res) => {
  const id = req.params.id;

  getDb().collection(products).deleteOne({ _id: new ObjectId(id) }).then((result) => {
    res.send(result);
  }).catch((err) => {
    res.status(500).send(err);
  });
});

app.get('/products/generateReport', (req, res) => {
  getDb().collection(products).aggregate([
    {
      $group: { _id: "$name", ilosc: 1, wartosc: { $multiply: ["$price", "$quantity"] } }
    }
  ]).toArray().then((result) => {
    res.send(result);
  }).catch((err) => {
    res.status(500).send(err);
  });
});

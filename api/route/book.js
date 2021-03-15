const express = require("express");
const router = express.Router();
const path = require("path");
const Book = require("../model/bookModel");
const mongoose = require("mongoose");

const multer = require("multer");
//for taking multiport files
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, path.join(Date.now() + file.originalname));
  },
});
const upload = multer({ storage: storage });

//getting book api/book
router.get("/book", async (req, res) => {
  const book = await Book.find();
  res.send(book);
});

//for getting by book name /.*port.*/

router.get("/book/:title", async (req, res) => {
  const book = await Book.find(
    { title: { $regex: req.params.title, $options: "$i" } },
    (err) => {
      if (err) {
        console.log(err);
      }
    }
  );
  res.send(book);
});

router.get("/book1/:title/:city", async (req, res) => {
  const book = await Book.find(
    {
      $and: [
        { title: { $regex: req.params.title, $options: "$i" } },
        { city: req.params.city },
      ],
    },
    (err) => {
      if (err) {
        console.log(err);
      }
    }
  );
  res.send(book);
});

router.get("/user/:user", async (req, res) => {
  const book = await Book.find({ user: req.params.user });
  res.send(book);
});

router.get("/cat", async (req, res) => {
  const book = await Book.distinct("category");
  console.log(JSON.stringify(book));
  res.send(book);
});

router.get("/city2/:city", async (req, res) => {
  const book = await Book.find({ city: req.params.city });
  //console.log(JSON.stringify(book));
  res.send(book);
});

router.get("/citys/:city/:category", async (req, res) => {
  const book = await Book.find({
    $and: [{ city: req.params.city }, { category: req.params.category }],
  });
  //console.log(JSON.stringify(book));
  res.send(book);
});
router.get("/city1", async (req, res) => {
  const book = await Book.distinct("city");
  console.log(JSON.stringify(book));
  res.send(book);
});
router.get("/category/:cat", async (req, res) => {
  const book = await Book.find({ category: req.params.cat }).limit(5);
  res.send(book);
});

router.get("/categ/:cat", async (req, res) => {
  const book = await Book.find({ category: req.params.cat });
  res.json(book);
});

//for getting book by id

router.get("/:id", function (req, res, next) {
  Book.findById(req.params.id)
    .populate("user")
    .exec(function (err, post) {
      if (err) return next(err);
      res.json(post);
    });
});

router.delete("/:id", function (req, res, next) {
  Book.findByIdAndRemove(req.params.id, function (err, post) {
    if (err) return next(err);
    res.json(post);
  });
});

/* UPDATE BOOK */
router.put("/:id", function (req, res, next) {
  Book.findByIdAndUpdate(req.params.id, req.body, function (err, post) {
    if (err) return next(err);
    res.json(post);
  });
});

//uploading img
router.post("/upload", upload.single("productImage"), async (req, res) => {
  console.log(req.file.path);
  res.send({ imgUrl: req.file.path });
});

//saving book
router.post("/sell", async (req, res) => {
  var objectId = mongoose.Types.ObjectId(req.body.user);
  console.log(objectId);

  console.log(req.body);
  console.log(req.file);

  let book = new Book({
    title: req.body.title,
    author: req.body.author,
    publication: req.body.publication,
    category: req.body.category,
    city: req.body.city,
    price: req.body.price,
    imgUrl: req.body.imgUrl,
    user: objectId,
  });

  try {
    let savebook = await book.save();
    res.send({ book: book._id });
  } catch (err) {
    res.status(400).send(err);
  }
});

//exporting the router
module.exports = router;

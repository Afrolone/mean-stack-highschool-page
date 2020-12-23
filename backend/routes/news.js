const express = require("express");
const multer = require("multer");
const checkAuth = require("../middleware/check-auth");
const Article = require('../models/article');
const router = express.Router();

const MIME_TYPE_MAP = {
  'image/png': 'png',
  'image/jpeg': 'jpg',
  'image/jpg': 'jpg'
};

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const isValid = MIME_TYPE_MAP[file.mimetype];
    let error = new Error("Invalid mime type");
    if(isValid) {
      error = null;
    }
    cb(error, "backend/images");
  },
  filename: (req, file, cb) => {
    const name = file.originalname
      .toLowerCase()
      .split(" ")
      .join("-");
    const ext = MIME_TYPE_MAP[file.mimetype];
    cb(null, name + '-' + Date.now() + '.' + ext);
  }
});

router.post(
  "",
  checkAuth,
  multer({ storage: storage }).single("image"),
  (req, res, next) => {
  const url = req.protocol + "://" + req.get("host");
  const article = new Article({
    title: req.body.title,
    content: req.body.content,
    imagePath: url + "/images/" + req.file.filename
  });
  article.save()
    .then(createdArticle => {
      res.status(201).json({
        message: 'Article added successfuly',
        article: {
          ...createdArticle,
          id: createdArticle._id
        }
      });
    });
});

router.get("", (req, res, next) => {
  /*
  Article.find()
    .then(documents => {
      res.status(200).json({
        message: "News fetched successfully",
        articles: documents
      });
    });
  */
  const pageSize = +req.query.pagesize;
  const currentPage = +req.query.page;
  const articleQuerry = Article.find();
  let fetchedArticles;
  if (pageSize && currentPage) {
    articleQuerry.skip(pageSize * (currentPage -1)).limit(pageSize);
  }
  articleQuerry
    .then(documents => {
      fetchedArticles = documents;
      return Article.count();
    })
    .then(count => {
      res.status(200).json({
        message: "Articles fetched successfully!",
        articles: fetchedArticles,
        maxArticles: count
      });
    });
});


router.put(
  "/:id",
  checkAuth,
  multer({ storage: storage }).single("image"), 
  (req, res, next) => {
    let imagePath = req.body.imagePath;
    if (req.file) {
      const url = req.protocol + "://" + req.get("host");
      imagePath = url + "/images/" + req.file.filename;
    }
    const article = new Article({
      _id: req.body.id,
      title: req.body.title,
      content: req.body.content,
      imagePath: imagePath
    });
    Article.updateOne({ _id: req.params.id }, article).then(result => {
      console.log(result);
      res.status(200).json({ message: "Update successful!" });
    });
});
//s


router.get("/:id", (req, res, next) => {
  console.log(req.params.id);
  console.log("GET method from backend");
  Article.findById(req.params.id).then(article => {
    if (article) {
      res.status(200).json(article);
    } else {
      res.status(404).json({ message: "Article not found!" });
    }
  })
});

router.delete(
  "/:id",
  checkAuth,
  (req, res, next) => {
  console.log(req.params.id);
  console.log("DELETE method from backend");
  Article.deleteOne({ _id: req.params.id })
    .then(result => {
      res.status(200).json({ message: 'Article deleted!' });
    });
});

module.exports = router;

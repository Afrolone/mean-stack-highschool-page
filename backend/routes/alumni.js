const express = require("express");
const Alumnus = require('../models/alumnus');
const router = express.Router();
const multer = require("multer");
const checkAuth = require("../middleware/check-auth");

const MIME_TYPE_MAP = {
    'image/png': 'png',
    'image/jpeg': 'jpg',
    'image/jpg': 'jpg'
};

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const isValid = MIME_TYPE_MAP[file.mimetype];
        let error = new Error("Invalid mime type");
        if (isValid) {
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
    const url = req.protocol + "://" +req.get("host");
    const alumnus = new Alumnus({
        name: req.body.name,
        profession: req.body.profession,
        bio: req.body.bio,
        imagePath: url + "/images/" + req.file.filename
    });
    console.log("alumnus from the backend");
    console.log(alumnus);
    alumnus.save()
        .then(createdAlumnus => {
            res.status(201).json({
                message: 'Alumnus added successfuly',
                alumnus: {
                    ...createdAlumnus,
                    id: createdAlumnus._id
                }
            });
        });
});

router.get("", (req, res, next) => {
    /*
    Alumnus.find()
        .then(documents => {
            res.status(200).json({
                message: "Alumni fetched successfully",
                alumni: documents
            });
        });
    */
    const pageSize = +req.query.pagesize;
    const currentPage = +req.query.page;
    console.log("pageSize " + pageSize);
    console.log("currentPage " + currentPage)
    const alumnusQuerry = Alumnus.find();
    let fetchedAlumni;
    if (pageSize && currentPage) {
        alumnusQuerry.skip(pageSize * (currentPage -1 )).limit(pageSize);
    }
    alumnusQuerry
        .then(documents => {
            fetchedAlumni = documents;
            return Alumnus.count();
        })
        .then(count => {
            res.status(200).json({
                message: "Alumni fetched successfully!",
                alumni: fetchedAlumni,
                maxAlumni: count
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
    const alumnus = new Alumnus({
        _id: req.body.id,
        name: req.body.name,
        profession: req.body.profession,
        bio: req.body.bio
    });
    Alumnus.updateOne({ _id: req.params.id }, alumnus).then(result => {
        console.log(result);
        res.status(200).json({ message: "Update successful!" });
    });
});

router.get("/:id", (req, res, next) => {
    Alumnus.findById(req.params.id).then(alumnus => {
        if (alumnus) {
            res.status(200).json(alumnus);
        } else {
            res.status(404).json({ message: "Alumnus not found!" });
        }
    })
});

router.delete(
    "/:id",
    checkAuth,
    (req, res, next) => {
    Alumnus.deleteOne({ _id: req.params.id })
        .then(result => {
            console.log(result);
            res.status(200).json({ message: 'Alumni deleted!' });
        });
});

module.exports = router;
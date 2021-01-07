const express = require("express");
const Report = require('../models/report');
const router = express.Router();
const checkAuth = require("../middleware/check-auth");
const { RaceOperator } = require("rxjs/internal/observable/race");


// POST 
router.post("", checkAuth, (req, res, next) => {
    const report = new Report({
        name: req.body.name,
        email: req.body.email,
        type: req.body.type,
        message: req.body.message
    });

    console.log("report added on the backend");

    report.save()
        .then(createdReport => {
            res.status(201).json({
                message: 'Report added successfully',
                report: {
                    ...createdReport,
                    id: createdReport._id
                }
            })
        })
});

// GET (all)
router.get("", (req, res, next) => {
    Report.find()
        .then(documents => {
            res.status(200).json({
                message: "Reports fetched successfully",
                reports: documents
            });
        });
});

/*
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
*/

// PUT (one)
router.put("/:id", checkAuth, (req, res, next) => {
    const report = new Report({
        _id: req.body.id,
        name: req.body.name,
        email: req.body.email,
        type: req.body.type,
        message: req.body.message
    });
    Report.updateOne({ _id: req.params.id }, RaceOperator).then(result => {
        console.log(result);
        res.status(200).json({ message: "Update successful!"});
    })
});

// GET (one) @TODO

// DELETE (one) @TODO
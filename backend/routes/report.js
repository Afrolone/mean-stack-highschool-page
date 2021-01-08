const express = require("express");
const Report = require('../models/report');
const checkAuth = require("../middleware/check-auth");
const router = express.Router();

// POST 
router.post("", (req, res, next) => {
    const report = new Report({
        name: req.body.name,
        email: req.body.email,
        type: req.body.type,
        message: req.body.message
    });
    console.log("REQQQ");
    console.log(req);
    console.log("REPOORT");
    console.log(report);

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
    });
});

// GET (one) @TODO
router.get("/:id", (req, res, next) => {
    Report.findById(req.params.id).then(report => {
        if (report) {
            res.status(200).json(alumnus);
        } else {
            res.status(404).json({ message: "Alumnus not found!" });
        }
    });
});

// DELETE (one) @TODO
router.delete("/:id", checkAuth, (req, res, next) => {
    Report.deleteOne({ _id: req.params.id })
        .then(result => {
            console.log(result);
            res.status(200).json({ message: 'Report deleted'});
        });
});

module.exports = router;
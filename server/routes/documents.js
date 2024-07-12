var express = require("express");
var router = express.Router();
const sequenceGenerator = require("./sequenceGenerator");
const Document = require("../models/document");

router.get("/", (req, res, next) => {
  Document.find()
    .then((documents) => {
      res.status(200).json({
        message: "Documents fetched successfully!",
        documents: documents,
      });
    })
    .catch((error) => {
      res.status(500).json({
        message: "An error occurred",
        error: error,
      });
    });
});

router.post("/", (req, res, next) => {
  sequenceGenerator.nextId("documents").then((result) => {
    const document = new Document({
      id: result,
      name: req.body.name,
      description: req.body.description,
      url: req.body.url,
      children: req.body.children,
    });
    document
      .save()
      .then((createdDocument) => {
        res.status(201).json({
          message: "Document added successfully",
          document: createdDocument,
        });
      })
      .catch((error) => {
        res.status(500).json({
          message: "An error occurred",
          error: error,
        });
      });
  });
});

router.put("/:id", (req, res, next) => {
  Document.findOne({ id: req.params.id })
    .then((document) => {
      if (!document) {
        return res.status(404).json({
          message: "Document not found",
          error: { document: "Document not found" },
        });
      }

      const updatedFields = {
        name: req.body.name,
        description: req.body.description,
        url: req.body.url,
      };

      return Document.updateOne({ id: req.params.id }, { $set: updatedFields });
    })
    .then((result) => {
      console.log("Update successful:", result);
      res.status(204).json({
        message: "Document updated successfully",
        document: result,
      });
    })
    .catch((error) => {
      console.error("Error during update:", error);
      res.status(500).json({
        message: "An error occurred",
        error: error,
      });
    });
});

router.delete("/:id", (req, res, next) => {
  Document.findOne({ id: req.params.id })
    .then((document) => {
      Document.deleteOne({ id: req.params.id })
        .then((result) => {
          res.status(204).json({
            message: "Document deleted successfully",
          });
        })
        .catch((error) => {
          res.status(500).json({
            message: "An error occurred",
            error: error,
          });
        });
    })
    .catch((error) => {
      res.status(500).json({
        message: "Document not found.",
        error: { document: "Document not found" },
      });
    });
});

module.exports = router;

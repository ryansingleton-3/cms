var express = require("express");
var router = express.Router();
const sequenceGenerator = require("./sequenceGenerator");
const Contact = require("../models/contact");
const Group = require("../models/group");

router.get("/", (req, res, next) => {
  Contact.find()
    .populate("group")
    .then((contacts) => {
      res.status(200).json({
        message: "Contacts fetched successfully!",
        contacts: contacts,
      });
    })
    .catch((error) => {
      console.error("Error fetching contacts with groups:", error); // Add this log
      res.status(500).json({
        message: "An error occurred",
        error: error,
      });
    });
});

router.get("/:id", (req, res, next) => {
  Contact.findOne({ id: req.params.id }) // Use the custom `id` field
    .then((contact) => {
      if (!contact) {
        return res.status(404).json({
          message: "Contact not found",
        });
      }
      res.status(200).json({
        message: "Contact found",
        contact: contact,
      });
    })
    .catch((error) => {
      console.error("Error fetching contact:", error);
      res.status(500).json({
        message: "An error occurred",
        error: error,
      });
    });
});


router.post("/", (req, res, next) => {
  sequenceGenerator.nextId("contacts").then((result) => {
    console.log("Generated sequence ID:", result);
    const contact = new Contact({
      id: result,
      name: req.body.name,
      email: req.body.email,
      phone: req.body.phone,
      imageUrl: req.body.imageUrl,
    });
    contact
      .save()
      .then((createdContact) => {
        console.log("Contact saved successfully:", createdContact);
        res.status(201).json({
          message: "Contact added successfully",
          contact: createdContact,
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
  Contact.findOne({ id: req.params.id })
    .then((contact) => {
      if (!contact) {
        return res.status(404).json({
          message: "Contact not found",
          error: { contact: "Contact not found" },
        });
      }

      const updatedFields = {
        name: req.body.name,
        email: req.body.email,
        phone: req.body.phone,
        imageUrl: req.body.imageUrl,
      };

      return Contact.updateOne({ id: req.params.id }, { $set: updatedFields });
    })
    .then((result) => {
      console.log("Update successful:", result);
      res.status(204).json({
        message: "Contact updated successfully",
        contact: result,
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
  Contact.findOne({ id: req.params.id })
    .then((contact) => {
      Contact.deleteOne({ id: req.params.id })
        .then((result) => {
          res.status(204).json({
            message: "Contact deleted successfully",
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
        message: "Contact not found.",
        error: { contact: "Contact not found" },
      });
    });
});

module.exports = router;

var express = require("express");
var router = express.Router();
const Message = require("../models/message");
const Contact = require("../models/contact");
var sequenceGenerator = require("./sequenceGenerator");

router.get("/", (req, res, next) => {
  Message.find()
    .then((messages) => {
      console.log("Messages fetched successfully:", messages);
      res.status(200).json({
        message: "Messages fetched successfully!",
        messages: messages.map((msg) => ({
          id: msg.id, // Ensure custom id is sent
          subject: msg.subject,
          msgText: msg.msgText,
          sender: msg.sender,
        })),
      });
    })
    .catch((error) => {
      res.status(500).json({
        message: "An error occurred",
        error: error,
      });
    });
});

router.post("/", async (req, res, next) => {
  console.log("Received a POST request with body:", req.body);

  try {
    const result = await sequenceGenerator.nextId("messages");
    console.log("Generated sequence ID:", result);

    const contact = await Contact.findOne({ id: req.body.sender });

    if (!contact) {
      console.error("Invalid sender ID:", req.body.sender);
      return res.status(400).json({
        message: "Invalid sender ID",
      });
    }

    const message = new Message({
      id: result,
      subject: req.body.subject,
      msgText: req.body.msgText,
      sender: contact.id,
    });

    console.log("Created message object:", message);

    const createdMessage = await message.save();
    console.log("Message saved successfully:", createdMessage);
    res.status(201).json({
      message: "Message added successfully",
      response: createdMessage,
    });
  } catch (error) {
    console.error("Error saving message:", error);
    res.status(500).json({
      message: "An error occurred",
      error: error.message,
    });
  }
});

router.put("/:id", (req, res, next) => {
  Message.findOne({ id: req.params.id })
    .then((message) => {
      if (!message) {
        return res.status(404).json({
          message: "Message not found",
        });
      }

      message.subject = req.body.subject;
      message.msgText = req.body.msgText;
      message.sender = req.body.sender;

      Message.updateOne({ id: req.params.id }, message)
        .then((result) => {
          // Fetch the updated message and return it in the response
          Message.findOne({ id: req.params.id })
            .then((updatedMessage) => {
              res.status(200).json({
                message: "Message updated successfully",
                response: {
                  id: updatedMessage.id,
                  subject: updatedMessage.subject,
                  msgText: updatedMessage.msgText,
                  sender: updatedMessage.sender,
                },
              });
            })
            .catch((error) => {
              res.status(500).json({
                message: "An error occurred while fetching the updated message",
                error: error,
              });
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
        message: "Message not found.",
        error: { message: "Message not found" },
      });
    });
});

router.delete("/:id", (req, res, next) => {
  Message.findOne({ id: req.params.id })
    .then((message) => {
      Message.deleteOne({ id: req.params.id })
        .then((result) => {
          res.status(204).json({
            message: "Message deleted successfully",
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
        message: "Message not found.",
        error: { message: "Message not found" },
      });
    });
});

module.exports = router;

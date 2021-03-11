const express = require("express");
const router = express.Router();
const contactUs = require("../model/contactusModel");

router.post("/", async (req, res) => {
  contactus = new contactUs({
    fullName: req.body.fullName,
    email: req.body.email,
    mobile_no: req.body.mobile_no,
    msg: req.body.msg,
  });

  try {
    let savebook = await contactus.save();
    res.send({ contactus: contactus._id });
  } catch (err) {
    res.status(400).send(err);
  }
});

module.exports = router;

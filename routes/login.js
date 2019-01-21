const jwt = require("jsonwebtoken");
const { StudentList } = require("../models/Register");
const bcrypt = require("bcrypt");
const express = require("express");
const keys = require("../config/keys");
const validateLoginInput = require("../validation/login");
const _ = require("lodash");
const router = express.Router();

router.post("/", async (req, res) => {
  const { errors, isValid } = validateLoginInput(req.body);

  // // Check Validation
  if (!isValid) {
    return res.status(400).send(errors);
  }

  // Find user by email
  let user = await StudentList.findOne({ email: req.body.email });
  if (!user) {
    errors.email = "Invalid email or password";
    return res.status(400).send({ errors });
  }

  const validpassword = await bcrypt.compare(req.body.password, user.password);
  if (!validpassword) {
    errors.password = "Invalid email or password";
    return res.status(400).send({ errors });
  }

  const payload = { id: user._id, email: user.email }; // Create JWT Payload

  // Sign Token
  let token = await jwt.sign(payload, keys.secretKeys, { expiresIn: 3600 });

  // Check student status
  if (user.status == 0) {
    errors.status = "You are blocked";
    return res.status(400).send({ errors });
  }

  res.send({
    success: true,
    token: "Bearer " + token
  });
});

module.exports = router;

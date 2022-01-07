const User = require("../models/user")
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const express = require('express');
const router = express.Router();

const secretKey = process.env.SECRET_KEY;


router.post("/register", (req, res, next) => {
  console.log("hey")
  bcrypt.hash(req.body.password, 10)
    .then(hash => {
      const user =  new User({
        email: req.body.email,
        password: hash
      })
      user.save()
        .then(newUser => res.status(201).json(newUser))
        .catch(err => res.status(500).json({message: "This email is already in use."}))
    });
})

router.post("/login", (req, res, next) => {
  let fetchedUser;
  User.findOne({email: req.body.email})
    .then(user => {
      if (!user) {
        return res.status(401).json({message: "Authentication failed"})
      }
      fetchedUser = user;
      return bcrypt.compare(req.body.password, user.password)
    })
    .then(result => {
      if (!result) {
        return res.status(401).json({message: "Authentication failed"})
      }
      const token = jwt.sign({email: fetchedUser.email, userId: fetchedUser._id}, secretKey, {expiresIn: '1h'});
      res.status(200).json({token: token, expiresIn: 3600, userId: fetchedUser._id})
    })
    .catch(err => {return res.status(401).json({message: "Authentication failed"})});
})

module.exports = router;

const User = require("../models/user")
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const secretKey = process.env.JWT_KEY;

exports.createUser = (req, res) => {
  bcrypt.hash(req.body.password, 10)
    .then(hashedPassword => {
      const user =  new User({
        email: req.body.email,
        password: hashedPassword
      })
      user.save()
        .then(newUser => res.status(201).json(newUser))
        .catch( () => res.status(500).json({message: "This email is already in use."}))
    });
}

exports.loginUser = (req, res) => {
  let fetchedUser;
  let invalidCredentials = {message: "Invalid user credentials."};
  User.findOne({email: req.body.email})
    .then(user => {
      if (!user) {
        return res.status(401).json(invalidCredentials)
      }
      fetchedUser = user;
      return bcrypt.compare(req.body.password, user.password)
    })
    .then(result => {
      if (!result) {
        return res.status(401).json(invalidCredentials)
      }
      const token = jwt.sign({email: fetchedUser.email, userId: fetchedUser._id}, secretKey, {expiresIn: '1h'});
      res.status(200).json({token: token, expiresIn: 3600, userId: fetchedUser._id})
    })
    .catch( () => {return res.status(401).json(invalidCredentials)});
}

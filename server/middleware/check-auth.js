const jwt = require("jsonwebtoken");
const secretKey = process.env.SECRET_KEY;

// Check if there's a valid token attached to the request
module.exports = (req, res, next) => {
  try {
    // Authorization header comes as "Bearer token_here", but we only want the token so we need to split it by the space and only grab the second half
    const token = req.headers.authorization.split(" ")[1];
    jwt.verify(token, secretKey);
    next();
  } catch (error) {
    res.status(401).json({message: "Authentication failed"})
  }

}

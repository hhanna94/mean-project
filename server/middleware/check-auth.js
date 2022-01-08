const jwt = require("jsonwebtoken");
const secretKey = process.env.SECRET_KEY;

// Check if there's a valid token attached to the request
module.exports = (req, res, next) => {
  try {
    // Authorization header comes as "Bearer token_here", but we only want the token so we need to split it by the space and only grab the second half
    const token = req.headers.authorization.split(" ")[1];
    const decodedToken = jwt.verify(token, secretKey);
    // We add the decoded token information to the request body, which gets passed with this added information to whatever the next middleware is.
    req.userData = {email: decodedToken.email, userId: decodedToken.userId};
    next();
  } catch (error) {
    res.status(401).json({message: "You are not authenticated."})
  }

}

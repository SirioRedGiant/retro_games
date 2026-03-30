const jwt = require("jsonwebtoken");

function auth(req, res, next) {
  const authHeader = req.headers.authorization;
  const token = authHeader.split(" ")[1];
  try {
    const decode = jwt.verify(token, process.env.SECRET);
    req.user = decode;
    next();
  } catch (err) {
    return res.status(403).json({ error: "Token non valido" });
  }
}

module.exports = auth;

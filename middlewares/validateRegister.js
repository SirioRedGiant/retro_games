function validate(req, res, next) {
  const { username, password, email } = req.body;
  if (
    typeof username != "string" ||
    !username.trim() ||
    typeof password != "string" ||
    !password.trim()
  ) {
    return res.status(400).json({
      success: false,
      error: "Bad request",
    });
  }
  next();
}

module.exports = validate;

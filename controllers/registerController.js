const bcrypt = require("bcrypt");
const connect = require("../database/db");

async function registerUser(req, res) {
  const { username, password } = req.body;

  try {
    const sqlUser = "select * from users where username=?";
    const [existResult] = await connect.promise().query(sqlUser, [username]);
    if (existResult.length > 0) {
      return res.json({
        success: false,
        error: "Username già esistente",
      });
    }
    const hashedPasw = await bcrypt.hash(password, 10);
    const sql = "insert into users (username,password) values(?,?)";
    await connect.promise().query(sql, [username, hashedPasw]);
    res.json({
      success: true,
      message: "Register succesfully",
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: "Internal server error",
    });
  }
}

module.exports = { registerUser };

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const connection = require("../database/db");

async function checkUser(req, res) {
  const { username, password } = req.body;
  try {
    const sqlCheck = "select * from users where username=?";
    const [rows] = await connection.promise().query(sqlCheck, [username]);

    if (rows.length === 0) {
      return res.status(401).json({
        success: false,
        error: "Credenziali non valide",
      });
    }

    const currentUser = rows[0];

    //primo parametro la password ricevuta
    const isValid = await bcrypt.compare(password, currentUser.password);

    if (!isValid) {
      return res.status(401).json({
        success: false,
        error: "Credenziali non valide",
      });
    }

    const token = jwt.sign({ id: currentUser.id }, process.env.SECRET, {
      expiresIn: "1h",
    });

    res.json({
      success: true,
      token: token,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: "Internal server error",
    });
  }
}

module.exports = { checkUser };

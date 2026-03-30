const connection = require("../database/db");

function getUser(req, res) {
  const { username } = req.params;
  const sql = "select * from users where username=?";

  connection.query(sql, [username], (err, result) => {
    if (err) return res.status(500).json({ error: "Internal server error" });
    res.json({
      risultato: result,
    });
  });
}

function allUser(req, res) {
  const sql = "select * from users where id!=1";

  connection.query(sql, (err, results) => {
    console.log(results);
    if (err)
      return res.status(500).json({
        success: false,
        error: "Internal server error",
      });
    res.json({
      success: true,
      result: results,
    });
  });
}

function deleteUser(req, res) {
  const { username } = req.body;
  const sql = "delete from users where username=?";

  connection.query(sql, [username], (err, resultDel) => {
    if (err)
      return res.status(500).json({
        success: false,
        error: "Internal server error",
      });
    res.json({
      success: true,
      message: "Succesfully delete",
    });
  });
}

module.exports = { getUser, allUser, deleteUser };

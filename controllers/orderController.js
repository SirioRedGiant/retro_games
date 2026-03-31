const connection = require("../database/db");

function orderByName(req, res) {
  const sql = "select * from products order by name";
  connection.query(sql, (err, resultsBy) => {
    if (err)
      return res.status(500).json({
        success: false,
        error: "Internal server error",
      });

    return res.json({
      success: true,
      message: resultsBy,
    });
  });
}

module.exports = { orderByName };

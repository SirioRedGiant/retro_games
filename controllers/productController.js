const connection = require("../database/db");

function index(req, res) {
  const sql = "select id,slug,name,image,price from products";

  connection.query(sql, (err, resultsIndex) => {
    if (err)
      return res.status(500).json({
        success: false,
        error: "Internal server error",
      });

    res.json({
      success: true,
      message: resultsIndex,
    });
  });
}

async function show(req, res) {
  const { id } = req.params;

  if (isNaN(id)) {
    return res.status(400).json({
      success: false,
      error: "ID non valido",
    });
  }

  try {
    const sql = "select * from products where id=?";

    const [rows] = await connection.promise().query(sql, [id]);
    if (rows.lenght === 0) {
      return res.status(404).json({
        success: false,
        error: "ID Not Found",
      });
    }

    res.json({
      success: true,
      message: "Oks",
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      success: false,
      error: "Internal server error",
    });
  }
}

module.exports = { index, show };

const connection = require("../database/db");
const { pathImage } = require("../controllers/productController");
function orderedBy(req, res) {
  const orderBy = req.query.by;
  // filtri disponibili
  const searched = ["name", "price", "created_at", "discount_value", "all"];

  // se campo query non presente esco
  if (orderBy === undefined && !searched.includes(orderBy)) {
    return res.status(400).json({
      success: false,
      error: "Bad request",
    });
  }

  //se orderBy è undefined non è stato applicato il filtro di ricerca e mostro tutto
  //se invece presente ed è tra quelli disponibili ordino dinamicamente
  const sql =
    orderBy === "all"
      ? "select slug,name,image,price,discount_value from products"
      : `select slug,name,image,price,discount_value from products order by ${orderBy}`;
  connection.query(sql, (err, resultOrded) => {
    if (err)
      return res.status(500).json({
        success: false,
        error: "Internal server error",
      });

    //inserisco path immagine
    let updateResult = resultOrded.map((el) => {
      return { ...el, image: pathImage(el.image) };
    });

    //elimino i campi 0.00 se è ricerca per discount_value
    if (orderBy === "discount_value") {
      updateResult = updateResult.filter((el) => {
        return el.discount_value > 0;
      });
    }

    res.json({
      success: true,
      result: updateResult,
    });
  });
}

module.exports = { orderedBy };

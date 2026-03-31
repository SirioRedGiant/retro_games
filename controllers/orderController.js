const connection = require("../database/db");

async function checkout(req, res) {
  // destrutturazzione body
  const {
    user_surname,
    user_email,
    shipping_city,
    shipping_address,
    shipping_postal_code,
    shipping_country,
    total_price,
    cart, // bisogna usare questa chiave da frontend per passare i dati a noi. Senza non si possono inserire gli acquisti [è un array]
  } = req.body;

  try {
    // INSERT dell'ordine nella tabella 'orders'
    const sqlOrder = `INSERT INTO orders 
      (total_price, order_date, status, user_surname, user_email, shipping_country, shipping_city, shipping_address, shipping_postal_code) 
      VALUES (?, NOW(), 'pending', ?, ?, ?, ?, ?, ?)`;

    const [orderResult] = await connection
      .promise()
      .query(sqlOrder, [
        total_price,
        user_surname,
        user_email,
        shipping_country,
        shipping_city,
        shipping_address,
        shipping_postal_code,
      ]);

    const newOrderId = orderResult.insertId; // recupero l'ID appena creato

    // INSERT dei prodotti dell'ordine nella tabella pivot 'order_product' --> ciclo per inserire ogni prodotto contenuto nel carrello (cart)
    for (const item of cart) {
      const sqlItem = `INSERT INTO order_product 
        (product_id, order_id, price_at_purchase, quantity) 
        VALUES (?, ?, ?, ?)`;

      await connection
        .promise()
        .query(sqlItem, [item.id, newOrderId, item.price, item.quantity]);
    }

    res.status(201).json({
      success: true,
      message: "Order created successfully",
      order_id: newOrderId,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      error: "Checkout failed",
    });
  }
}


const { pathImage } = require("../controllers/productController");
function orderedBy(req, res) {
  const orderBy = req.query.by;
  // filtri disponibili
  const searched = ["name", "price", "created_at", "discount_value"];

  // se campo query non presente esco
  if (orderBy != undefined && !searched.includes(orderBy)) {
    return res.status(400).json({
      success: false,
      error: "Bad request",
    });
  }

  //se orderBy è undefined non è stato applicato il filtro di ricerca e mostro tutto
  //se invece presente ed è tra quelli disponibili ordino dinamicamente
  const sql =
    orderBy === undefined
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

module.exports = { orderedBy, checkout };

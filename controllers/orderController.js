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

module.exports = { checkout };

const connection = require("../database/db");
const nodemailer = require("nodemailer");

const transport = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  tls: {
    rejectUnauthorized: false,
  },
});

async function checkout(req, res) {
  const {
    user_name,
    user_surname,
    user_email,
    shipping_city,
    shipping_address,
    shipping_postal_code,
    shipping_country,
    total_price,
    coupon,
    coupon_id,
    loot,
  } = req.body;

  try {
    const sql =
      "insert into orders (user_name,user_surname,user_email,shipping_city,shipping_address,shipping_postal_code,shipping_country,total_price,coupon,coupon_id) values(?,?,?,?,?,?,?,?,?,?)";

    const [orderResult] = await connection
      .promise()
      .query(sql, [
        user_name,
        user_surname,
        user_email,
        shipping_city,
        shipping_address,
        shipping_postal_code,
        shipping_country,
        total_price,
        coupon,
        coupon_id,
      ]);

    const orderID = orderResult.insertId;
    for (const item of loot) {
      const sqlItem =
        "insert into order_product (product_id,order_id,price_at_purchase,quantity) value (?,?,?,?)";
      await connection
        .promise()
        .query(sqlItem, [item.id, orderID, item.finalPrice, item.quantity]);
    }
    const tmpsql = "select order_date from orders where id=?";
    const [timestamp] = await connection.promise().query(tmpsql, [orderID]);
    const { order_date } = timestamp[0];
    console.log(order_date);

    const htmlContent = `<!doctype html>
<html lang="it-IT">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Conferma Ordine</title>
  </head>
  <body style="margin:0; padding:0; font-family: Arial, sans-serif; background-color:#f4f6f8;">
    
    <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f4f6f8; padding:20px 0;">
      <tr>
        <td align="center">
          
          <!-- Container -->
          <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff; border-radius:8px; overflow:hidden; box-shadow:0 2px 8px rgba(0,0,0,0.05);">
            
            <!-- Header -->
            <tr>
              <td style="background:linear-gradient(90deg,#55bc47,#8cff00); color:#ffffff; text-align:center; padding:20px;">
                <h1 style="margin:0;">Press Start</h1>
                <p style="margin:5px 0 0 0; font-size:16px;">Ordine effettuato con successo!</p>
              </td>
            </tr>

            <!-- Content -->
            <tr>
              <td style="padding:20px;">
                
                <!-- Info -->
                <table width="100%" cellpadding="0" cellspacing="0">
                  <tr>
                    <td style="vertical-align:top; padding-right:20px;">
                      <h3 style="margin-bottom:10px; color:#333;">Indirizzo di spedizione</h3>
                      <p style="margin:4px 0;"><strong>Paese:</strong> ${shipping_country}</p>
                      <p style="margin:4px 0;"><strong>Città:</strong> ${shipping_city}</p>
                      <p style="margin:4px 0;"><strong>Indirizzo:</strong> ${shipping_address}</p>
                      <p style="margin:4px 0;"><strong>CAP:</strong> ${shipping_postal_code}</p>
                    </td>
                    <td style="vertical-align:top; text-align:right;">
                      <h3 style="margin-bottom:10px; color:#333;">Data ordine</h3>
                      <p style="margin:4px 0;">${order_date}</p>
                    </td>
                  </tr>
                </table>

                <hr style="border:none; border-top:1px solid #e0e0e0; margin:20px 0;" />

                <h3 style="color:#333;">Riepilogo ordine</h3>
                <div>
                  ${loot
                    .map(
                      (el) => `
                      <div style="background:#fafafa; border:1px solid #eee; border-radius:6px; padding:10px; margin-bottom:10px;">
                        <p style="margin:4px 0;">
                          <strong>Prodotto:</strong> ${el.name} x ${el.quantity}
                        </p>
                        <p style="margin:4px 0;">
                          <strong>Prezzo unitario:</strong> ${el.finalPrice} &euro;
                        </p>
                      </div>
                    `,
                    )
                    .join("")}
                </div>

                <!-- Total -->
                <div style="margin-top:20px; padding-top:10px; border-top:2px solid #e0e0e0; text-align:right;">
                  <span style="font-size:18px; font-weight:bold; color:#333;">
                    Totale: ${total_price} &euro;
                  </span>
                </div>

              </td>
            </tr>

            <!-- Footer -->
            <tr>
              <td style="background:#f9f9f9; text-align:center; padding:15px; font-size:12px; color:#777;">
                Grazie per il tuo acquisto! Se hai domande, rispondi a questa email.
              </td>
            </tr>

          </table>
        </td>
      </tr>
    </table>

  </body>
</html>`;

    await transport.sendMail({
      from: process.env.EMAIL_USER,
      to: user_email,
      subject: "Conferma ordine",
      html: htmlContent,
    });

    res.status(201).json({
      success: true,
      result: {
        message: "Order created succesfully",
        order_id: orderID,
      },
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      success: false,
      error: "Internal server error",
    });
  }
}

const { pathImage } = require("../controllers/productController");
function orderedBy(req, res) {
  const orderBy = req.query.by.toLowerCase();
  // filtri disponibili
  const searched = ["name", "price", "created_at", "discount_value", "all"];

  // se campo query non presente esco
  if (orderBy === undefined || !searched.includes(orderBy)) {
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

module.exports = { orderedBy, checkout };

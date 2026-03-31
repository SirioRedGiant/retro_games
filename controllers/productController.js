const connection = require("../database/db");

function mostFamous(req, res) {
  const sql =
    "select slug,name,image,price,discount_value from products limit 6";

  connection.query(sql, (err, resultFamous) => {
    if (err)
      return res.status(500).json({
        success: false,
        error: "Internal server error",
      });

    const updateResult = resultFamous.map((el) => {
      return { ...el, image: pathImage(el.image) };
    });

    res.json({
      success: true,
      result: updateResult,
    });
  });
}

function recentlyUpdate(req, res) {
  const sql =
    "select slug,name,image,price,discount_value from products order by created_at limit 6";

  connection.query(sql, (err, resultFamous) => {
    if (err)
      return res.status(500).json({
        success: false,
        error: "Internal server error",
      });

    const updateResult = resultFamous.map((el) => {
      return { ...el, image: pathImage(el.image) };
    });

    res.json({
      success: true,
      result: updateResult,
    });
  });
}

function index(req, res) {
  const sql = "select id,slug,name,image,price from products";

  connection.query(sql, (err, resultsIndex) => {
    if (err) {
      console.log(err);

      return res.status(500).json({
        success: false,
        error: "Internal server error",
      });
    }

    const updateResult = resultsIndex.map((el) => {
      return { ...el, image: pathImage(el.image) };
    });

    res.json({
      success: true,
      result: updateResult,
    });
  });
}

async function show(req, res) {
  const { slug } = req.params;
  console.log(slug);

  try {
    const sql = `SELECT * FROM products WHERE slug = ?`;

    const [rows] = await connection.promise().query(sql, [slug]);
    const product = rows[0];
    console.log(product);

    const productId = product.id;
    // nelle 3 costanti qui sopra il codice --> cerca nella tabella products usando lo slug (es. super-mario-bros). Una volta trovato, salva l'ID del prodotto: questo ID è la "chiave" che verrà usata per aprire tutte le altre porte (generi, piattaforme e recensioni).

    if (rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: "Product Not Found",
      });
    }

    // i Generi --> con la tabella pivot genre_product
    const [genres] = await connection.promise().query(
      `SELECT genres.name
       FROM genres 
       JOIN genre_product ON genres.id = genre_product.genre_id 
       WHERE genre_product.product_id = ?`,
      [productId],
    );

    // le Piattaforme --> con la tabella pivot platform_product
    const [platforms] = await connection.promise().query(
      `SELECT platforms.name, platforms.company 
       FROM platforms 
       JOIN platform_product ON platforms.id = platform_product.platform_id 
       WHERE platform_product.product_id = ?`,
      [productId],
    );

    // le Recensioni --> da 1 a molti
    const [reviews] = await connection
      .promise()
      .query("SELECT user_name, text, vote FROM reviews WHERE product_id = ?", [
        productId,
      ]);
    console.log(genres, platforms, reviews);

    // oggetto unico da restituire
    const finalResult = {
      ...product,
      image: pathImage(product.image), // Sistema l'URL immagine
      genres: genres.map((genere) => genere.name), // Trasforma in array di stringhe
      platforms: platforms,
      reviews: reviews,
    };

    res.json({
      success: true,
      result: finalResult,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      success: false,
      error: "Internal server error",
    });
  }
}

function pathImage(img) {
  const tmp = "http://localhost:3000/img/" + img;
  return tmp;
}

module.exports = { index, show };

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
  // i filtri da recuperare
  const { genre, platform, company, discounted } = req.query;

  let sql = `
    SELECT DISTINCT 
      products.id, 
      products.slug, 
      products.name, 
      products.image, 
      products.price, 
      products.discount_value 
    FROM products

    LEFT JOIN genre_product ON products.id = genre_product.product_id

    LEFT JOIN platform_product ON products.id = platform_product.product_id

    LEFT JOIN platforms ON platform_product.platform_id = platforms.id
    WHERE 1=1
  `;
  // WHERE 1=1 è una condizione sempre vera --> permette di poter accettare qualsiasi filtro venga scelto senza avere un ordine preciso. Quindi è possibile filtrare per qualsiasi filtro usando AND, senza doversi preoccupare di verificare quale filtro sarà il primo. (contorto da riscrivere maybe)

  const queryParameters = [];

  // Logica dei filtri --> in base a quello che arriva da frontend

  if (genre) {
    sql += ` AND genre_product.genre_id = ?`;
    queryParameters.push(genre);
  }

  if (platform) {
    sql += ` AND platform_product.platform_id = ?`;
    queryParameters.push(platform);
  }

  if (company) {
    sql += ` AND platforms.company = ?`;
    queryParameters.push(company);
  }

  if (discounted === "true") {
    sql += ` AND products.discount_value > 0`;
  }

  connection.query(sql, (err, resultsIndex) => {
    if (err) {
      console.log(err);

      return res.status(500).json({
        success: false,
        error: "Internal server error",
      });
    }

    // Formattazione dei risultati --> trasforma il nome del file immagine in un URL navigabile dal frontend
    const updateResult = resultsIndex.map((product) => {
      return {
        ...product,
        image: pathImage(product.image),
      };
    });

    // Invio della risposta JSON
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

module.exports = { index, show, mostFamous, recentlyUpdate, pathImage };

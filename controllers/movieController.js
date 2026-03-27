const connection = require("../database/db");
const {
  getFullImageUrl,
  validateReview,
  handleDbError,
  validateMovie,
} = require("../utils/utilities");

//^ Index --> Lista film
const index = (req, res) => {
  const movieSQL = `
    SELECT movies.*, AVG(reviews.vote) AS vote_avg 
    FROM movies
    LEFT JOIN reviews ON movies.id = reviews.movie_id
    GROUP BY movies.id
  `;
  connection.query(movieSQL, (err, results) => {
    if (handleDbError(res, err)) return;

    // map  dei risultati per aggiungere l'URL completo alle immagini
    const movies = results.map((movie) => ({
      ...movie,
      image: getFullImageUrl(req, movie.image),
    }));
    res.json(movies);
  });
};

//^ Show --> Singolo film + Recensioni
const show = (req, res) => {
  const id = req.params.id;

  // Query 1 --> Recupero il film
  const movieSQL = "SELECT * FROM movies WHERE id = ?";
  connection.query(movieSQL, [id], (err, movieResults) => {
    if (handleDbError(res, err)) return;
    if (movieResults.length === 0)
      return res.status(404).json({
        message: "Movie not found",
      });

    const movie = movieResults[0];

    // Path immagine (es. localhost:3000/img/inception.jpg)
    movie.image = getFullImageUrl(req, movie.image);

    // Query 2 --> Recupero delle recensioni collegate al film
    const reviewsSql = "SELECT * FROM reviews WHERE movie_id = ?";
    connection.query(reviewsSql, [id], (err, reviewsResults) => {
      if (handleDbError(res, err)) return;

      // l'array delle recensioni all'oggetto movie
      movie.reviews = reviewsResults;

      res.json(movie);
    });
  });
};

//^ Store - Crea un nuovo film
const store = (req, res) => {
  const validationError = validateMovie(req.body);
  if (validationError) {
    return res.status(400).json({
      success: false,
      message: validationError,
    });
  }

  const { title, director, genre, release_year, abstract } = req.body;

  // se il file è stato caricato, prendiamo il nome generato dal middleware
  // altrimenti usiamo un'immagine di default
  const image = req.file ? req.file.filename : "default.jpg";

  const sql = `
    INSERT INTO movies (title, director, genre, release_year, abstract, image) 
    VALUES (?, ?, ?, ?, ?, ?)
  `;

  connection.query(
    sql,
    [title, director, genre, Number(release_year), abstract, image],   //? siccome dal form i dati arrivano come stringhe verifico che sia un numero
    (err, results) => {
      if (handleDbError(res, err)) return;

      // altrimenti --> stato 201 (Created) e l'ID del nuovo film
      res.status(201).json({
        message: "Movie created successfully",
        id: results.insertId, // --> per il redirect nel frontend
      });
    },
  );
};

/**
//note  Perché togliere dal req.body?
//note  Quando invii un form con un file (usando enctype="multipart/form-data"), Multer divide i dati in due "scatole" diverse:
//note  req.body: Contiene tutti i testi (titolo, regista, anno, ecc.).
//note  req.file: Contiene l'oggetto del file (l'immagine fisica).
//note  Se nel tuo controller scrivi const { title, ..., image } = req.body, stai cercando l'immagine nella scatola dei testi. Ma l'immagine non è lì, è nella scatola dei file. Per questo la variabile image estratta dal body sarebbe undefined.
 */
/**
//?     Cos'è multipart/form-data?
//?     Normalmente, quando invii un form, i dati viaggiano come una stringa di testo. Ma una foto non è testo, è un file binario pesante.
//?     multipart/form-data è un formato speciale che dice al browser: "Ehi, non inviare solo testo, ma dividi il pacchetto in più parti: alcune sono testo, una è un file intero".
//?     In React: Non devi scriverlo a mano nell'HTML. Se usi l'oggetto new FormData(e.target), il browser capisce da solo che deve usare il formato multipart/form-data.

 * 
 */

//^ StoreReview - Salva/Aggiunge una nuova recensione
const storeReview = (req, res) => {
  const { id } = req.params; // l'ID del film daell'URL --> movie_id perchè riguarda il film specifico

  //note controllo dati ricevuti validateReview --> utility function se non li passa entra in validationError
  const validationError = validateReview(req.body);
  if (validationError) {
    return res.status(400).json({
      success: false,
      message: validationError,
    });
  }

  const { name, vote, text } = req.body; // i dati dal form per React.. il body della richiesta

  // Query SQL
  const storeReviewSql =
    "INSERT INTO reviews (movie_id, name, vote, text) VALUES (?, ?, ?, ?)";

  connection.query(storeReviewSql, [id, name, vote, text], (err, results) => {
    if (handleDbError(res, err)) return;

    res.status(201).json({
      message: "Review added",
      id: results.insertId,
    });
  });
};
module.exports = { index, show, store, storeReview };

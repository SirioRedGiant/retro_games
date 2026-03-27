/**
//note Utility per formattare l'URL completo di un'immagine
//note Centralizzazione --> Se si deve cambiare la cartella da /img/ a /assets/, non bisogna cambiare 10 file. Si cambia una sola riga qui dentro e tutto il sito si aggiorna.
//note Adattabilità --> Grazie a req.protocol e req.get("host"), il link funzionerà sempre: sia sul computer (localhost), sia che si carichi il sito su un server vero
//note Pulizia --> Il controller ora si occupa solo di "chiedere dati al database", mentre la "costruzione dei link" è delegata a questa utility.

 */
const getFullImageUrl = (req, imageName) => {
  if (!imageName) return null;
  // 'req.protocol' rileva automaticamente se stai usando 'http' o 'https'.
  // È fondamentale per far funzionare il link sia sul PC o online.
  const protocol = req.protocol;
  // 'req.get("host")' recupera l'indirizzo del server (es. 'localhost:3000').
  // Usiamo .get() perché l'host si trova negli "Headers" (intestazioni) della richiesta HTTP.
  const host = req.get("host");

  return `${process.env.APP_URL}:${process.env.APP_PORT}/img/${imageName}`;
};

/**
//note  Utility per gestire gli errori standard del database nelle callback
 */
const handleDbError = (res, err) => {
  // Se non c'è errore, esce e la funzione s'interrompe
  if (!err) return false;

  // Se c'è un errore, logghiamo il messaggio in console per lo sviluppatore
  console.error("DB Error:", err.message);

  // La risposta JSON standard da inviare al client (Postman/Browser)
  const responseData = {
    success: false,
    message: "Internal server error",
  };

  // Se in modalità sviluppo (dev environment), aggiungo una chiave error che aggiunge l'errore.
  if (process.env.APP_MODE === "dev") {
    responseData.error = err.message;
    responseData.sqlState = err.sqlState; // Codice tecnico dello stato SQL
  }

  // Invio della risposta col codice 500 e interrompiamo il flusso
  res.status(500).json(responseData);

  return true; // Comunichiamo che l'errore è stato gestito
};

/**
 * Funzione che valida i dati della recensione prima di poter essere inseriti
 * @param {object} data - req.body (name, vote, text)
 * @returns {string|null} - Ritorna il messaggio di errore o null se è  i valori sono passati
 */
const validateReview = (data) => {
  const { name, vote, text } = data;

  if (!name || name.length < 2) return "Il nome deve avere almeno 2 caratteri";
  if (!vote || vote < 1 || vote > 5)
    return "Il voto deve essere un numero compreso tra 1 e 5";
  if (!text || text.length < 5)
    return "La recensione è troppo corta (minimo 5 caratteri)";

  return null; // se passa le condizioni allora è ok
};

/**
 * Funzione che valida i dati della recensione prima di poter essere inseriti
 * @param {object} data
 * @returns {string|null}
 */
const validateMovie = (data) => {
  const { title, director, genre, release_year, abstract } = data;

  if (!title || title.trim().length < 1)
    return "Title is required and must be at least 1 characters.";
  if (!director || director.trim().length < 2) return "Director is required.";
  if (!genre || genre.trim().length < 3) return "Genre is required.";
  if (!abstract || abstract.trim().length < 5) {
    return "Abstract is required and must be at least 5 characters long.";
  }

  // 3. Controllo Anno (Dinamico e preciso)
  const currentYear = new Date().getFullYear();

  // Se l'anno non è un numero o è fuori dal range --> currentYear come limite massimo "fino a oggi"
  if (
    isNaN(release_year) ||
    release_year < 1895 ||
    release_year > currentYear
  ) {
    return `L'anno deve essere tra il 1895 e il ${currentYear}.`;
  }

  return null; // ok
};

module.exports = {
  handleDbError,
  getFullImageUrl,
  validateReview,
  validateMovie,
};

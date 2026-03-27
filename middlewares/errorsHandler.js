//note --- Questo è un middleware standard. Serve a rispondere quando un utente cerca un URL non registrato
const error404 = (req, res, next) => {
  return res.status(404).json({
    message: "Endpoint not Found",
  });
};

//note ---- questo è un middleware speciale: Express lo riconosce perché ha 4 parametri anziché 3(err in più). Viene attivato ogni volta che nel codice avviene un errore imprevisto (come  una variabile non definita).

const error500 = (err, req, res, next) => {
  console.log(err.message);
  return res.status(500).json({
    message: "Internal Server Error",
  });
};

module.exports = { error404, error500 };

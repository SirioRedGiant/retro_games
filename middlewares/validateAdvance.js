const frasiRetroGaming = [
  "It's dangerous to go alone! Take this.",
  "Do a barrel roll!",
  "Finish him!",
  "Hadouken!",
  "You must construct additional pylons.",
  "War. War never changes.",
  "Stay a while and listen.",
  "Welcome to your doom!",
  "Another visitor. Stay a while… stay forever!",
  "Rise from your grave!",
  "A winner is you!",
  "All your base are belong to us.",
  "Get over here!",
  "Flawless victory.",
  "Round 1... Fight!",
  "Go home and be a family man!",
  "You have died of dysentery.",
  "The cake is a lie.",
  "Snake? Snake?! SNAAAAKE!",
  "What is a man? A miserable little pile of secrets.",
];

function validate(req, res, next) {
  const { genre, publisher, consolle, order } = req.body;

  if (
    (typeof genre != "string" && typeof genre != undefined) ||
    (typeof publisher != "string" && typeof publisher != "undefined") ||
    (typeof consolle != "string" && typeof consolle != undefined) ||
    (typeof order != "string" && typeof order != undefined)
  ) {
    return res.status(400).json({
      success: false,
      error: "Bad request",
    });
  }

  if (!genre && !publisher && !consolle && !order) {
    const rnd = Math.floor(Math.random() * frasiRetroGaming.length);
    return res.json({
      success: true,
      message: frasiRetroGaming[rnd],
    });
  }

  next();
}

module.exports = validate;

const express = require("express");
const app = express();

// MIDDLEWARES
const cors = require("cors");
const logger = require("./middlewares/logger");
const errorMiddleware = require("./middlewares/errorsHandler");

app.use(logger); // Attivazione del logger ad ogni richiesta
app.use(express.static("public")); // file statici --> immagini
app.use(express.json());
app.use(cors({ origin: process.env.FRONTEND_URL }));

// DEFINIZIONE ROTTE
const globalRouter = require("./routes/globalRouter");
const movieRouter = require("./routes/movieRouter");

app.use(globalRouter);
app.use("/movies", movieRouter);

// ERRORS HANDLING
app.use(errorMiddleware.error404);
app.use(errorMiddleware.error500);

// SERVER START
app.listen(process.env.APP_PORT || 3000, () => {
  console.log("Server environment: " + process.env.APP_MODE); // per far sapere al server che è eseguito in DEV --> IL MIO ENVIRONMENT localhost for testing
  console.log(
    "Server listening on " + process.env.APP_URL + ":" + process.env.APP_PORT,
  );
});

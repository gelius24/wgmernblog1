const express = require("express");
const cors = require("cors");
const { connect } = require("mongoose");
require("dotenv").config();
const userRoutes = require('./routes/userRoutes')
const postRoutes = require('./routes/postRoutes');
const { notFound, errorsHandler } = require("./middleware/errorMiddleware");
const upload = require('express-fileupload')

const app = express();

app.use(express.json({ extended: true }));
app.use(express.urlencoded({ extended: true }));
app.use(cors({ credentials: true, origin: process.env.URL }));
app.use(upload())
app.use('/uploads', express.static(__dirname + '/uploads'))

app.use("/api/users", userRoutes);
app.use("/api/posts", postRoutes);

app.use(notFound)
app.use(errorsHandler)


connect(process.env.MONGO_URI)
  .then(
    app.listen(process.env.PORT, () =>
      console.log(`Listenning on port ${process.env.PORT}...`)
    )
  )
  .catch((err) => console.log(err));

const express = require("express");
const app = express();
const morgan = require("morgan");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv/config");

const api = process.env.API_URL;
const coupensRouter = require("./routers/coupens");
const adminsRouter = require("./routers/admins");
const authJwt = require("./helpers/jwt");
const errorHandler = require("./helpers/error-handler");

//middleware
app.use(express.json());
app.use(cors());
// app.use(authJwt());
app.options("*", cors());
app.use(morgan("tiny"));

app.use(errorHandler);

//Routes
app.use(`${api}/coupens`, coupensRouter);
app.use(`${api}/admins`, adminsRouter);

/* 
const coupenSchema = mongoose.Schema({
    name: String,
    discountType: String,
    discountValue: String,
    minOrderAmount: String,
    expiryDate: String

})
const Coupen = mongoose.model('Coupen', coupenSchema);

 */

// app.get(`${api}/coupens`, async (req, res) => {
//     const coupenList = await Coupen.find();
//     res.send(coupenList);
// })
/* 
app.post(`${api}/coupens`, (req, res) => {
    console.log(req.body)
    const coupen = new Coupen({
        name: req.body.name,
        discountType: req.body.discountType,
        discountValue: req.body.discountValue,
        minOrderAmount: req.body.minOrderAmount,
        expiryDate: req.body.expiryDate,
        createdAt: req.body.createdAt

    })

    coupen.save().then((createdCoupen => {
        res.status(201).json(createdCoupen)
    })).catch((err) => {
        res.status(500).json({
            error: err,
            success: false
        })
    })

})
 */
mongoose
  .connect(process.env.CONNECTION_STRING, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    dbName: "coupen-database",
  })
  .then(() => {
    console.log("Database Connection is Ready.....");
  })

  .catch((err) => {
    console.log(err);
  });

app.listen(3500, () => {
  console.log("Server is Running http://localhost:3500");
});

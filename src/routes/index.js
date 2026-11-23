const { Router } = require("express");
const authRouter = require("./auth");
const adminRouter = require("./admin");
const reservations = require("./reservations");
const appointments = require("./appointments");
const specialties = require("./specialties");
const spaces = require("./spaces");
const coworking = require("./coworking");

const router = Router();

router.use("/auth", authRouter);
router.use("/admin", adminRouter);
router.use("/reservations", reservations);
router.use("/users", appointments);
router.use("/specialties", specialties);
router.use("/specialities", specialties);
router.use("/espacios", spaces);
router.use("/", coworking);


module.exports = router;

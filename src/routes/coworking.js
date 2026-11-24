const { Router } = require("express");
const auth = require("../middlewares/auth");
const controller = require("../controllers/coworkingController");
const router = Router();

router.post("/reservas", auth, controller.createReservation);
router.get("/reservas/mias", auth, controller.myReservations);
router.delete("/reservas/:id", auth, controller.deleteReservation);
router.post("/incidencias", auth, controller.createIssue);
router.get("/incidencias", auth, controller.listIssues);
router.delete("/incidencias/:id", auth, controller.deleteIssue);

module.exports = router;

const { Router } = require("express");
const controller = require("../controllers/spaceController");
const auth = require("../middlewares/auth");
const router = Router();

router.get("/", controller.list);
router.get("/disponibles", controller.available);
router.get("/:id", controller.get);
router.post("/", auth, controller.create);
router.put("/:id", auth, controller.update);
router.delete("/:id", auth, controller.remove);

module.exports = router;

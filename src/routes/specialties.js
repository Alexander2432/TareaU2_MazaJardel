const { Router } = require("express");
const specialtyController = require("../controllers/specialtyController");

const router = Router();

router.post("/", specialtyController.createSpecialty);
router.get("/", specialtyController.getSpecialties);
router.get("/:id", specialtyController.getSpecialtyById);
router.put("/:id", specialtyController.updateSpecialty);
router.delete("/area/:area", specialtyController.deleteByArea);
router.delete("/:id", specialtyController.deleteSpecialty);

module.exports = router;

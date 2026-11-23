const specialtyService = require("../services/specialtyService");

const handleError = (error, res) => {
  if (error.code === 11000) {
    return res.status(400).json({ error: "Dato duplicado (el nombre o código ya existe)" });
  }
  if (error.name === "ValidationError") {
    const details = Object.values(error.errors).map((e) => e.message);
    return res.status(400).json({ error: "Datos inválidos", details });
  }
  if (error.name === "CastError") {
    return res.status(400).json({ error: `ID o valor inválido para ${error.path}` });
  }
  return res.status(500).json({ error: "Error interno del servidor" });
};

const createSpecialty = async (req, res) => {
  try {
    const specialty = await specialtyService.createSpecialty(req.body);
    res.status(201).json(specialty);
  } catch (error) {
    handleError(error, res);
  }
};

const getSpecialties = async (req, res) => {
  try {
    const specialties = await specialtyService.getSpecialties();
    res.json(specialties);
  } catch (error) {
    handleError(error, res);
  }
};

const getSpecialtyById = async (req, res) => {
  try {
    const specialty = await specialtyService.getSpecialtyById(req.params.id);
    if (!specialty) return res.status(404).json({ error: "Especialidad no encontrada" });
    res.json(specialty.toJSON({ virtuals: true }));
  } catch (error) {
    handleError(error, res);
  }
};

const updateSpecialty = async (req, res) => {
  try {
    const updated = await specialtyService.updateSpecialty(req.params.id, req.body);
    if (!updated) return res.status(404).json({ error: "Especialidad no encontrada" });
    res.json(updated);
  } catch (error) {
    handleError(error, res);
  }
};

const deleteSpecialty = async (req, res) => {
  try {
    const deleted = await specialtyService.deleteSpecialty(req.params.id);
    if (!deleted) return res.status(404).json({ error: "Especialidad no encontrada" });
    res.json({ message: `Especialidad eliminada del área ${deleted.area}`, deleted });
  } catch (error) {
    handleError(error, res);
  }
};

const deleteByArea = async (req, res) => {
  try {
    const { area } = req.params;
    const result = await specialtyService.deleteByArea(area);
    if (result.deletedCount === 0) {
      return res.status(404).json({ message: `No hay especialidades en el área ${area}` });
    }
    res.json({ message: `Eliminadas ${result.deletedCount} especialidades del área ${area}` });
  } catch (error) {
    handleError(error, res);
  }
};

module.exports = {
  createSpecialty,
  getSpecialties,
  getSpecialtyById,
  updateSpecialty,
  deleteSpecialty,
  deleteByArea,
};

const mongoose = require("mongoose");
const service = require("../services/spaceService");

function respondError(error, res) {
  if (error.name === "ValidationError" || error.name === "CastError") {
    return res.status(400).json({
      error: "Datos inválidos",
      details: error.message,
    });
  }

  if (error.code === 11000) {
    return res.status(409).json({ error: "El código del espacio ya existe" });
  }

  return res.status(500).json({ error: "Error interno del servidor" });
}

exports.list = async (req, res) => {
  try {
    const spaces = await service.list({
      q: req.query.q,
      fields: req.query.fields,
      sort: req.query.sort || "name",
    });
    res.json(spaces);
  } catch (error) {
    respondError(error, res);
  }
};

exports.available = async (req, res) => {
  try {
    const spaces = await service.available({
      startAt: req.query.inicio,
      endAt: req.query.fin,
      capacity: req.query.capacidad,
    });
    res.json(spaces);
  } catch (error) {
    res.status(error.status || 500).json({ error: error.message });
  }
};

exports.get = async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id)) {
    return res.status(400).json({ error: "El ID del espacio no es válido" });
  }

  try {
    const space = await service.get(req.params.id);
    if (!space) {
      return res.status(404).json({ error: "Espacio no encontrado" });
    }
    res.json(space);
  } catch (error) {
    respondError(error, res);
  }
};

exports.create = async (req, res) => {
  try {
    const space = await service.create(req.body);
    res.status(201).json(space);
  } catch (error) {
    respondError(error, res);
  }
};

exports.update = async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id)) {
    return res.status(400).json({ error: "El ID del espacio no es válido" });
  }

  try {
    const space = await service.update(req.params.id, req.body);
    if (!space) {
      return res.status(404).json({ error: "Espacio no encontrado" });
    }
    res.json(space);
  } catch (error) {
    respondError(error, res);
  }
};

exports.remove = async (req, res) => {
  try {
    const result = await service.remove(req.params.id);

    if (result.invalid) {
      return res.status(400).json({ error: "El ID del espacio no es válido" });
    }
    if (result.missing) {
      return res.status(404).json({ error: "Espacio no encontrado" });
    }
    if (result.conflict) {
      return res.status(409).json({
        error: "El espacio tiene reservas activas futuras",
      });
    }

    res.status(204).send();
  } catch (error) {
    respondError(error, res);
  }
};

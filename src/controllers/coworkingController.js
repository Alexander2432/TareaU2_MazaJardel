const service = require("../services/coworkingService");

exports.createReservation = async (req, res) => {
  try {
    const reservation = await service.createReservation({
      userId: req.user.id,
      ...req.body,
    });
    res.status(201).json(reservation);
  } catch (error) {
    res.status(error.status || 500).json({ error: error.message });
  }
};

exports.myReservations = async (req, res) => {
  try {
    const reservations = await service.myReservations(req.user.id);
    res.json(reservations);
  } catch (error) {
    res.status(500).json({
      error: "No se pudieron consultar las reservas",
    });
  }
};

exports.deleteReservation = async (req, res) => {
  try {
    await service.deleteReservation(req.params.id, req.user.id);
    res.status(204).send();
  } catch (error) {
    res.status(error.status || 500).json({ error: error.message });
  }
};

exports.createIssue = async (req, res) => {
  try {
    const issue = await service.createIssue({
      userId: req.user.id,
      ...req.body,
    });
    res.status(201).json(issue);
  } catch (error) {
    const status = error.status || (error.name === "ValidationError" ? 400 : 500);
    res.status(status).json({ error: error.message });
  }
};

exports.listIssues = async (_req, res) => {
  try {
    const issues = await service.listIssues();
    res.json(issues);
  } catch (error) {
    res.status(500).json({
      error: "No se pudieron consultar las incidencias",
    });
  }
};

exports.deleteIssue = async (req, res) => {
  try {
    await service.deleteIssue(req.params.id, req.user.id, req.user.role);
    res.status(204).send();
  } catch (error) {
    res.status(error.status || 500).json({ error: error.message });
  }
};

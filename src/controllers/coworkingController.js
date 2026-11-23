const service = require("../services/coworkingService");
exports.createReservation = async (req, res) => { try { const row = await service.createReservation({ userId: req.user.id, ...req.body }); res.status(201).json(row); } catch (e) { res.status(e.status || 500).json({ error: e.message }); } };
exports.myReservations = async (req, res) => { try { res.json(await service.myReservations(req.user.id)); } catch (e) { res.status(500).json({ error: "No se pudieron consultar las reservas" }); } };
exports.deleteReservation = async (req, res) => { try { await service.deleteReservation(req.params.id, req.user.id); res.status(204).send(); } catch (e) { res.status(e.status || 500).json({ error: e.message }); } };
exports.createIssue = async (req, res) => { try { const row = await service.createIssue({ userId: req.user.id, ...req.body }); res.status(201).json(row); } catch (e) { res.status(e.status || (e.name === "ValidationError" ? 400 : 500)).json({ error: e.message }); } };
exports.listIssues = async (_req, res) => { try { res.json(await service.listIssues()); } catch (e) { res.status(500).json({ error: "No se pudieron consultar las incidencias" }); } };
exports.deleteIssue = async (req, res) => { try { await service.deleteIssue(req.params.id, req.user.id, req.user.role); res.status(204).send(); } catch (e) { res.status(e.status || 500).json({ error: e.message }); } };

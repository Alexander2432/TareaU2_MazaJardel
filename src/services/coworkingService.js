const mongoose = require("mongoose");
const prisma = require("../db/prisma");
const Space = require("../models/space");
const Issue = require("../models/issue");

exports.createReservation = async ({ userId, spaceId, startAt, endAt }) => {
  if (!mongoose.isValidObjectId(spaceId)) { const e = new Error("El ID del espacio no es válido"); e.status = 400; throw e; }
  if (!(new Date(startAt) < new Date(endAt))) { const e = new Error("La hora de inicio debe ser anterior a la hora de fin"); e.status = 400; throw e; }
  const space = await Space.findById(spaceId);
  const spaceExists = await Space.exists({ _id: spaceId, status: "disponible" });
  if (!space || !spaceExists) { const e = new Error("Espacio no encontrado o no disponible"); e.status = 404; throw e; }
  return prisma.$transaction(async (tx) => {
    // Evita reservas simultáneas del mismo espacio.
    await tx.$queryRaw`WITH lock AS MATERIALIZED (SELECT pg_advisory_xact_lock(hashtext(${spaceId}))) SELECT 1 AS locked FROM lock`;
    const conflict = await tx.reservation.findFirst({ where: { spaceId, status: "ACTIVE", startAt: { lt: new Date(endAt) }, endAt: { gt: new Date(startAt) } } });
    if (conflict) { const e = new Error("El espacio ya está reservado en ese horario"); e.status = 409; throw e; }
    return tx.reservation.create({ data: { userId, spaceId, startAt: new Date(startAt), endAt: new Date(endAt) } });
  });
};

exports.myReservations = async (userId) => {
  const reservations = await prisma.reservation.findMany({ where: { userId }, orderBy: { startAt: "desc" } });
  const ids = [...new Set(reservations.map((r) => r.spaceId).filter(Boolean))];
  const spaces = await Space.find({ _id: { $in: ids } }).lean();
  const byId = new Map(spaces.map((space) => [String(space._id), space]));
  return reservations.map((reservation) => ({ ...reservation, space: byId.get(reservation.spaceId) || null }));
};

exports.deleteReservation = async (id, userId) => {
  const reservation = await prisma.reservation.findUnique({ where: { id: Number(id) } });
  if (!reservation) { const e = new Error("La reserva no existe"); e.status = 404; throw e; }
  if (reservation.userId !== userId) { const e = new Error("La reserva no pertenece al usuario autenticado"); e.status = 403; throw e; }
  if (await Issue.exists({ reservationId: reservation.id })) { const e = new Error("Elimina primero la incidencia asociada"); e.status = 409; throw e; }
  await prisma.reservation.delete({ where: { id: reservation.id } });
};

exports.createIssue = async ({ userId, reservationId, description, category }) => {
  const reservation = await prisma.reservation.findUnique({ where: { id: Number(reservationId) } });
  if (!reservation) { const e = new Error("La reserva no existe"); e.status = 404; throw e; }
  if (reservation.userId !== userId) { const e = new Error("La reserva no pertenece al usuario autenticado"); e.status = 403; throw e; }
  const space = await Space.findById(reservation.spaceId);
  if (!space) { const e = new Error("El espacio asociado ya no existe"); e.status = 409; throw e; }
  try {
    return await Issue.create({ reservationId: reservation.id, espacioId: space._id, userId: reservation.userId, spaceName: space.name, description, category });
  } catch (error) {
    if (error.code === 11000) { error.status = 409; error.message = "Esta reserva ya tiene una incidencia"; }
    throw error;
  }
};

exports.listIssues = async () => {
  const rows = await Issue.find().populate("espacioId", "name code kind").sort({ createdAt: -1 }).lean();
  const counts = await Issue.aggregate([{ $group: { _id: "$status", total: { $sum: 1 } } }]);
  return { rows, counts };
};

exports.deleteIssue = async (id, userId, role) => {
  if (!mongoose.isValidObjectId(id)) { const e = new Error("El ID de la incidencia no es válido"); e.status = 400; throw e; }
  const issue = await Issue.findById(id);
  if (!issue) { const e = new Error("Incidencia no encontrada"); e.status = 404; throw e; }
  if (issue.userId !== userId && role !== "ADMIN") { const e = new Error("La incidencia no pertenece al usuario autenticado"); e.status = 403; throw e; }
  await issue.deleteOne();
};

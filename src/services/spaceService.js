const mongoose = require("mongoose");
const prisma = require("../db/prisma");
const Space = require("../models/space");
const Issue = require("../models/issue");

exports.list = ({ q, fields, sort }) => {
  const filter = q
    ? {
        $or: [
          { name: new RegExp(escapeRegex(q), "i") },
          { code: new RegExp(escapeRegex(q), "i") },
          { equipment: new RegExp(escapeRegex(q), "i") },
        ],
      }
    : {};

  return Space.find(filter)
    .select(fields || "")
    .sort(sort || "name");
};

exports.get = (id) => Space.findById(id);

exports.available = async ({ startAt, endAt, capacity }) => {
  const start = new Date(startAt);
  const end = new Date(endAt);

  if (!startAt || !endAt || !(start < end)) {
    const error = new Error("Indica un intervalo válido: inicio debe ser anterior a fin");
    error.status = 400;
    throw error;
  }

  const capacityFilter = capacity
    ? { capacity: { $gte: Number(capacity) } }
    : {};
  const spaces = await Space.find({
    status: "disponible",
    ...capacityFilter,
  })
    .sort("name")
    .lean();

  const reservations = await prisma.reservation.findMany({
    where: {
      spaceId: { in: spaces.map((space) => String(space._id)) },
      status: "ACTIVE",
      startAt: { lt: end },
      endAt: { gt: start },
    },
    select: { spaceId: true },
  });

  const busySpaceIds = new Set(reservations.map((reservation) => reservation.spaceId));
  return spaces.filter((space) => !busySpaceIds.has(String(space._id)));
};

exports.create = (data) => Space.create(data);

exports.update = async (id, data) => {
  const space = await Space.findById(id);
  if (!space) return null;

  Object.assign(space, data);
  return space.save();
};

exports.remove = async (id) => {
  if (!mongoose.isValidObjectId(id)) return { invalid: true };

  const reservationCount = await prisma.reservation.count({
    where: { spaceId: id },
  });
  if (reservationCount > 0) return { conflict: true };

  const space = await Space.findById(id);
  if (!space) return { missing: true };

  await Issue.deleteMany({ espacioId: space._id });
  await space.deleteOne();

  return { deleted: true };
};

function escapeRegex(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

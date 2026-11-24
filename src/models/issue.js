const mongoose = require("mongoose");

const issueSchema = new mongoose.Schema(
  {
    reservationId: {
      type: Number,
      required: [true, "La reserva es obligatoria"],
      unique: true,
      index: true,
    },
    espacioId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Space",
      required: [true, "El espacio es obligatorio"],
    },
    userId: {
      type: Number,
      required: [true, "El usuario es obligatorio"],
      index: true,
    },
    spaceName: {
      type: String,
      required: [true, "El nombre del espacio es obligatorio"],
    },
    description: {
      type: String,
      required: [true, "La descripción es obligatoria"],
      minlength: [10, "Describe la incidencia con al menos 10 caracteres"],
      maxlength: [1000, "La descripción no puede superar 1000 caracteres"],
    },
    category: {
      type: String,
      enum: {
        values: ["limpieza", "equipo", "acceso", "otro"],
        message: "La categoría no es válida",
      },
      default: "otro",
    },
    status: {
      type: String,
      enum: {
        values: ["abierta", "en_proceso", "resuelta"],
        message: "El estado no es válido",
      },
      default: "abierta",
    },
  },
  { timestamps: true },
);

issueSchema.index({ espacioId: 1, createdAt: -1 });

module.exports = mongoose.model("Issue", issueSchema);

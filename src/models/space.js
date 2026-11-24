const mongoose = require("mongoose");
const slugify = require("slugify");

const equipmentValues = [
  "monitor",
  "pizarra",
  "proyector",
  "videoconferencia",
  "impresora",
  "cafe",
];

const spaceSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "El nombre del espacio es obligatorio"],
      trim: true,
      minlength: [3, "El nombre debe tener al menos 3 caracteres"],
      maxlength: [80, "El nombre no puede superar 80 caracteres"],
    },
    code: {
      type: String,
      required: [true, "El código es obligatorio"],
      unique: true,
      uppercase: true,
      match: [/^[A-Z]{2,5}-\d{2,4}$/, "El código debe tener formato COW-01"],
    },
    capacity: {
      type: Number,
      required: [true, "La capacidad es obligatoria"],
      min: [1, "La capacidad mínima es 1"],
      max: [200, "La capacidad máxima es 200"],
    },
    equipment: {
      type: [
        {
          type: String,
          enum: {
            values: equipmentValues,
            message: "El equipamiento {VALUE} no es válido",
          },
        },
      ],
      default: [],
    },
    kind: {
      type: String,
      required: [true, "El tipo de espacio es obligatorio"],
      enum: {
        values: ["escritorio", "sala", "privado"],
        message: "El tipo de espacio no es válido",
      },
    },
    status: {
      type: String,
      enum: {
        values: ["disponible", "mantenimiento", "inactivo"],
        message: "El estado no es válido",
      },
      default: "disponible",
    },
    slug: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

spaceSchema.path("capacity").validate(
  function (value) {
    return Number.isInteger(value);
  },
  "La capacidad debe ser un número entero",
);

spaceSchema.virtual("summary").get(function () {
  return `${this.name} (${this.capacity} personas)`;
});

spaceSchema.pre("validate", function () {
  if (this.name) {
    this.slug = slugify(this.name, { lower: true, strict: true });
  }
});

module.exports = mongoose.model("Space", spaceSchema);

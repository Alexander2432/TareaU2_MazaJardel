const mongoose = require("mongoose");
const slugify = require("slugify");

const specialtySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "El nombre es obligatorio"],
    validate: {
      validator: async function (value) {
        const existingSpecialty = await mongoose.models.Specialty.findOne({ name: value });
        return !existingSpecialty || existingSpecialty._id.equals(this._id);
      },
      message: (props) => `El nombre ${props.value} ya existe en la base de datos`
    }
  },
  code: {
    type: String,
    required: [true, "El código es obligatorio"],
    unique: true,
    match: [/^[A-Z]{3}-\d{2}$/, "El código debe tener el formato ABC-01"],
    validate: {
      validator: async function (value) {
        const existingSpecialty = await mongoose.models.Specialty.findOne({ code: value });
        return !existingSpecialty || existingSpecialty._id.equals(this._id);
      },
      message: (props) => `El código ${props.value} ya existe en la base de datos`
    }
  },
  description: {
    type: String,
    required: true,
    minlength: [50, "No se cumple la longitud mínima de 50"],
    maxlength: [300, "La descripción no puede superar 300 caracteres"],
  },
  area: {
    type: String,
    enum: {
      values: ["clinica", "quirurgica", "diagnostico"],
      message: "El área {VALUE} no es válida",
    },
    default: "clinica",
  },
  durationMinutes: {
    type: Number,
    default: 30,
    min: [15, "La consulta dura al menos 15 minutos"],
    max: [120, "La consulta dura como máximo 120 minutos"],
  },
  contactEmail: {
    type: String,
    validate: {
      validator: function (value) {
        return /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(value);
      },
      message: "El correo electrónico no es válido"
    }
  },
  createdAt: Date,
  slug: {
    type: String,
    required: true,
  },
}, {
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
});

specialtySchema.virtual("Info").get(function () {
  return `${this.name}  ${this.code}:  consulta de ${this.durationMinutes} minutos`;
});

specialtySchema.virtual("label").set(function (value) {
  const [code, ...rest] = value.split(" - ");
  this.code = code;
  this.name = rest.join(" - ");
});

specialtySchema.pre("validate", function () {
  if (this.name) {
    this.slug = slugify(this.name, { lower: true, strict: true });
  }
});

module.exports = mongoose.model("Specialty", specialtySchema);

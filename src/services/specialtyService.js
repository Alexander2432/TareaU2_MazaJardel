const slugify = require("slugify");
const Specialty = require("../models/specialty");

const createSpecialty = (data) => Specialty.create(data);

const getSpecialties = () => Specialty.find();

const getSpecialtyById = (id) => Specialty.findById(id);

const updateSpecialty = (id, data) => {
  if (data.name) {
    data.slug = slugify(data.name, { lower: true, strict: true });
  }
  return Specialty.findByIdAndUpdate(id, data, { new: true, runValidators: true });
};

const deleteSpecialty = (id) => Specialty.findByIdAndDelete(id);

const deleteByArea = (area) => Specialty.deleteMany({ area });

module.exports = {
  createSpecialty,
  getSpecialties,
  getSpecialtyById,
  updateSpecialty,
  deleteSpecialty,
  deleteByArea,
};

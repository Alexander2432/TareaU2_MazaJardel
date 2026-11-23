const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const isValidName = (name) => {
  return typeof name === "string" && name.length >= 10;
};

const isUniqueNumericId = (id, users) => {
  return typeof id === "number" && !users.some((user) => user.id === id);
};

const isValidUser = (user, users) => {
  const { id, name, email } = user;

  if (!isUniqueNumericId(id, users)) {
    return { valid: false, error: "El ID debe ser un número único" };
  }
  if (!isValidName(name)) {
    return {
      valid: false,
      error:
        "El nombre debe ser una cadena de texto mayor o igual a 10 caracteres",
    };
  }
  if (!isValidEmail(email)) {
    return { valid: false, error: "El correo electrónico no es válido" };
  }
  return { valid: true };
};

module.exports = {
  isValidEmail,
  isValidName,
  isUniqueNumericId,
  isValidUser,
};

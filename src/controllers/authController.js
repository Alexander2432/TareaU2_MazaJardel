const { registerUser, loginUser, deleteUser } = require("../services/authService");
const register = async (req, res) => {
  try {
    const { email, password, name } = req.body;
    await registerUser(email, password, name);
    return res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const token = await loginUser(email, password);
    return res.json({ token });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};

const removeCurrentUser = async (req, res) => {
  try {
    await deleteUser(req.user.id);
    return res.status(204).send();
  } catch (error) {
    return res.status(409).json({ error: "No se pudo eliminar el usuario; puede tener registros relacionados" });
  }
};

module.exports = { register, login, removeCurrentUser };

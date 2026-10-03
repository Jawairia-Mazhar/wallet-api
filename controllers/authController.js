const prisma = require("../config/prisma");
const bcrypt = require("bcryptjs");

const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const user = await prisma.user.findUnique({ where: { email } });

    if (user) {
      return res.status(400).json({ message: "User exists already" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    });

    res.status(201).json({ message: "User created successfully", user: newUser });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error creating user", error: error.message });
  }
};

module.exports = { register };

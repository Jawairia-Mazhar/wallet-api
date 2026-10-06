const prisma = require("../config/prisma");
const bcrypt = require("bcryptjs");
const jwt = require('jsonwebtoken')

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

    res.status(201).json({ message: "User created successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error creating user", error: error.message });
  }
};

const login = async (req, res) => {
    try{
        const {email, password} = req.body;
        const user = await prisma.user.findUnique({where: {email}});

        if(!user){
            return res.status(400).json({message: "Invalid Credentials"});
        }

        const passwordMatch = await bcrypt.compare(password, user.password)

        if (passwordMatch){
            const token = jwt.sign(
                {
                    id: user.id, 
                    role: user.role,
                },
                process.env.JWT_ACCESS_SECRET,
                {expiresIn : '15m'}
            );
            return res.status(200).json({message: "Login Successful", token});
        }
        else{
            return res.status(400).json({message: "Invalid Credentials"});
        }
    }
    catch(error){
        console.log(error);
        res.status(500).json({ message: "Error logging in", error: error.message });
    }
}

module.exports = { register, login };

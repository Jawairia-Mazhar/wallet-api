const prisma = require('../config/prisma');

const createAccount = async (req, res) => {
    try {
        const existingAccount = await prisma.account.findFirst({
            where: { userId: req.user.id }, //Look in the Account table, and give me the first row you find where the userId column matches this logged-in user's ID. If nothing matches, give me null
        });

        if (existingAccount) {
            return res.status(400).json({ message: "Account already exists" });
        }

        const newAccount = await prisma.account.create({
            data: {
                userId : req.user.id,
            }
        });
        res.status(201).json({message: "Account created", account: newAccount});
    }

    catch (error) {
        console.log(error);
        res.status(500).json({ message: "Error creating account", error: error.message });
    }
}
module.exports = { createAccount };
const prisma = require('../config/prisma');

const createAccount = async (req, res) => {
    try {
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
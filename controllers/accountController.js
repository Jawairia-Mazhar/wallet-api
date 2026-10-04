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

const getMyAccount = async(req, res) => {
    try {
        const account = await prisma.account.findFirst({ where: { userId: req.user.id } });
        if (!account) {
            return res.status(404).json({message: "No account found"});
        } 
        res.status(200).json({account});
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ message: "Error fetching account"});
    }
}

const transfer = async(req, res) => {
    try{
        const {fromAccountId, toAccountId, amount} = req.body;
        
        if (!amount || amount <= 0) { //not checking for negative numbers, because if amount is negative, it will be caught by the next check (fromAccount.balance < amount)
            return res.status(400).json({message: "Invalid amount"});
        }

        const fromAccount = await prisma.account.findUnique({where: {id: fromAccountId}});
        if (!fromAccount || fromAccount.userId !== req.user.id) {
            return res.status(403).json({message: "Not authorized to transfer from this account"});
        }

        if ( fromAccount.balance < amount) {
            return res.status(400).json({message: "Insufficient Balance"})
        }

        await prisma.$transaction(async (tx) => {
            await tx.account.update({ where: { id: fromAccountId }, data: { balance: { decrement: amount }}});
            await tx.account.update({ where: { id: toAccountId }, data: { balance: { increment: amount }}});
            await tx.transaction.create({ data: { fromAccountId, toAccountId, amount } });
        });
        res.status(200).json({message: "Transaction completed successfully"});
    }
    catch (error){
        console.log(error);
        res.status(500).json({message: "Error occurred while processing transaction"});
    }
}

module.exports = { createAccount, getMyAccount, transfer};
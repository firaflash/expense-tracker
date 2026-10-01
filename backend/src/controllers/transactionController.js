import Transaction from "../models/Transaction.js";

// GET /api/transactions — fetch all for logged-in user
export const getTransactions = async (req, res) => {
    try {
        const transactions = await Transaction.find({ userId: req.user._id }).sort({
            createdAt: -1,
        });

        // Map MongoDB _id to id so the frontend can use it directly
        const mapped = transactions.map((tx) => ({
            id: tx._id.toString(),
            amount: tx.amount,
            type: tx.type,
            categoryId: tx.categoryId,
            note: tx.note,
            date: tx.date,
            status: tx.status,
            walletId: tx.walletId,
            createdAt: tx.createdAt.toISOString(),
        }));

        res.json(mapped);
    } catch (error) {
        console.error("GET TRANSACTIONS ERROR:", error);
        res.status(500).json({ message: "Failed to fetch transactions" });
    }
};

// POST /api/transactions — create a new transaction
export const createTransaction = async (req, res) => {
    try {
        const { amount, type, categoryId, note, date, status, walletId } = req.body;

        const transaction = await Transaction.create({
            userId: req.user._id,
            amount,
            type,
            categoryId,
            note: note || "",
            date,
            status: status || "CLEARED",
            walletId: walletId || "wallet-main",
        });

        res.status(201).json({
            id: transaction._id.toString(),
            amount: transaction.amount,
            type: transaction.type,
            categoryId: transaction.categoryId,
            note: transaction.note,
            date: transaction.date,
            status: transaction.status,
            walletId: transaction.walletId,
            createdAt: transaction.createdAt.toISOString(),
        });
    } catch (error) {
        console.error("CREATE TRANSACTION ERROR:", error);
        res.status(500).json({ message: "Failed to create transaction" });
    }
};

// PUT /api/transactions/:id — update a transaction
export const updateTransaction = async (req, res) => {
    try {
        const transaction = await Transaction.findOne({
            _id: req.params.id,
            userId: req.user._id,
        });

        if (!transaction) {
            return res.status(404).json({ message: "Transaction not found" });
        }

        // Update only the fields that were sent
        const { amount, type, categoryId, note, date, status, walletId } = req.body;
        if (amount !== undefined) transaction.amount = amount;
        if (type !== undefined) transaction.type = type;
        if (categoryId !== undefined) transaction.categoryId = categoryId;
        if (note !== undefined) transaction.note = note;
        if (date !== undefined) transaction.date = date;
        if (status !== undefined) transaction.status = status;
        if (walletId !== undefined) transaction.walletId = walletId;

        await transaction.save();

        res.json({
            id: transaction._id.toString(),
            amount: transaction.amount,
            type: transaction.type,
            categoryId: transaction.categoryId,
            note: transaction.note,
            date: transaction.date,
            status: transaction.status,
            walletId: transaction.walletId,
            createdAt: transaction.createdAt.toISOString(),
        });
    } catch (error) {
        console.error("UPDATE TRANSACTION ERROR:", error);
        res.status(500).json({ message: "Failed to update transaction" });
    }
};

// DELETE /api/transactions/:id — delete a transaction
export const deleteTransaction = async (req, res) => {
    try {
        const transaction = await Transaction.findOneAndDelete({
            _id: req.params.id,
            userId: req.user._id,
        });

        if (!transaction) {
            return res.status(404).json({ message: "Transaction not found" });
        }

        res.json({ message: "Transaction deleted" });
    } catch (error) {
        console.error("DELETE TRANSACTION ERROR:", error);
        res.status(500).json({ message: "Failed to delete transaction" });
    }
};

import Budget from "../models/Budget.js";

// GET /api/budgets — fetch all for logged-in user
export const getBudgets = async (req, res) => {
    try {
        const budgets = await Budget.find({ userId: req.user._id }).sort({
            createdAt: -1,
        });

        const mapped = budgets.map((b) => ({
            id: b._id.toString(),
            categoryId: b.categoryId,
            limitAmount: b.limitAmount,
            startDate: b.startDate,
            endDate: b.endDate,
            recurring: b.recurring,
            alertThreshold: b.alertThreshold,
        }));

        res.json(mapped);
    } catch (error) {
        console.error("GET BUDGETS ERROR:", error);
        res.status(500).json({ message: "Failed to fetch budgets" });
    }
};

// POST /api/budgets — create a new budget
export const createBudget = async (req, res) => {
    try {
        const { categoryId, limitAmount, startDate, endDate, recurring, alertThreshold } = req.body;

        const budget = await Budget.create({
            userId: req.user._id,
            categoryId,
            limitAmount,
            startDate,
            endDate,
            recurring: recurring || "none",
            alertThreshold: alertThreshold || 0.8,
        });

        res.status(201).json({
            id: budget._id.toString(),
            categoryId: budget.categoryId,
            limitAmount: budget.limitAmount,
            startDate: budget.startDate,
            endDate: budget.endDate,
            recurring: budget.recurring,
            alertThreshold: budget.alertThreshold,
        });
    } catch (error) {
        console.error("CREATE BUDGET ERROR:", error);
        res.status(500).json({ message: "Failed to create budget" });
    }
};

// PUT /api/budgets/:id — update a budget
export const updateBudget = async (req, res) => {
    try {
        const budget = await Budget.findOne({
            _id: req.params.id,
            userId: req.user._id,
        });

        if (!budget) {
            return res.status(404).json({ message: "Budget not found" });
        }

        const { categoryId, limitAmount, startDate, endDate, recurring, alertThreshold } = req.body;
        if (categoryId !== undefined) budget.categoryId = categoryId;
        if (limitAmount !== undefined) budget.limitAmount = limitAmount;
        if (startDate !== undefined) budget.startDate = startDate;
        if (endDate !== undefined) budget.endDate = endDate;
        if (recurring !== undefined) budget.recurring = recurring;
        if (alertThreshold !== undefined) budget.alertThreshold = alertThreshold;

        await budget.save();

        res.json({
            id: budget._id.toString(),
            categoryId: budget.categoryId,
            limitAmount: budget.limitAmount,
            startDate: budget.startDate,
            endDate: budget.endDate,
            recurring: budget.recurring,
            alertThreshold: budget.alertThreshold,
        });
    } catch (error) {
        console.error("UPDATE BUDGET ERROR:", error);
        res.status(500).json({ message: "Failed to update budget" });
    }
};

// DELETE /api/budgets/:id — delete a budget
export const deleteBudget = async (req, res) => {
    try {
        const budget = await Budget.findOneAndDelete({
            _id: req.params.id,
            userId: req.user._id,
        });

        if (!budget) {
            return res.status(404).json({ message: "Budget not found" });
        }

        res.json({ message: "Budget deleted" });
    } catch (error) {
        console.error("DELETE BUDGET ERROR:", error);
        res.status(500).json({ message: "Failed to delete budget" });
    }
};

import Transaction from '../Model/transactionModel.js';

// Get transactions for the logged-in user
export const getTransactions = async (req, res) => {
    try {
        const userId = req.user._id; // Assuming auth middleware attaches user to req
        const transactions = await Transaction.find({ userId }).sort({ date: -1 });
        res.status(200).json(transactions);
    } catch (error) {
        console.error("Error fetching transactions:", error);
        res.status(500).json({ message: "Server error fetching transactions" });
    }
};

// Create a dummy transaction (for testing purposes mainly)
export const createTransaction = async (req, res) => {
    try {
        const { amount, description, status } = req.body;

        // Check if user is authenticated
        if (!req.user || !req.user._id) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        const newTransaction = new Transaction({
            userId: req.user._id,
            amount,
            description,
            status: status || 'completed'
        });

        await newTransaction.save();
        res.status(201).json(newTransaction);
    } catch (error) {
        console.error("Error creating transaction:", error);
        res.status(500).json({ message: "Server error creating transaction" });
    }
};

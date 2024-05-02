const Client = require('../helpers/client');

const deposit = async (req, res) => {
    try {
        const response = await Client.deposit(req);
        if (!response.amountDeposited) {
            return res.status(404).json(response).end();
        }
        return res.status(404).json(response).end();

    } catch (error) {
        return res
            .status(500)
            .json({ message: 'ERROR_IN_DEPOSIT', error });

    }
};

const getBestProfession = async (req, res) => {
    try {
        const bestProfession = await Client.getBestProfession(req);
        if (!bestProfession) {
            return res.status(404).json({ message: 'best profession not found . Try again later' });
        }
        return res.status(200).json(bestProfession);
    } catch (error) {
        console.log("🚀 ~ getBestProfession ~ error:", error)
        return res
            .status(500)
            .json({ message: 'Error occurred while finding best profession', error });
    }
};

module.exports = {
    deposit,
    getBestProfession
};

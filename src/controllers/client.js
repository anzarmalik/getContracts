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

module.exports = {
    deposit,
};

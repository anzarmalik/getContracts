const Contracts = require('../helpers/contract');

const getContractById = async (req, res) => {
    try {
        const contract = await Contracts.getContractById(req);
        if (!contract) return res.status(404).end()
        res.json(contract)
    } catch (error) {
        res.status(500).json({ error });
    }
};

const getAllNonTerminatedContracts = async (req, res) => {
    try {
        const contracts = await Contracts.getAllNonTerminatedContracts(req);
        if (!contracts) return res.status(404).end();
        res.json(contracts);
    } catch (error) {
        res.status(500).json({ error });
    }
};

module.exports = {
    getContractById,
    getAllNonTerminatedContracts
}
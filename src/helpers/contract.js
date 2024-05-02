const { Op } = require('sequelize');

const getContractById = async (req) => {
    const { Contract } = req.app.get('models')
    const { id } = req.params
    const profileId = req.get('profile_id');
   return Contract.findOne({
        where: {
            id,
            [Op.or]: [{ ContractorId: profileId }, { ClientId: profileId }]
        }
    })
}

const getAllNonTerminatedContracts = async (req) => {
    const { Contract } = req.app.get('models');
    const profileId = req.get('profile_id');
    return Contract.findAll({
        where: {
            [Op.or]: [{ ContractorId: profileId }, { ClientId: profileId }],
            status: {
                [Op.ne]: 'terminated',
            },
        },
    });
};


module.exports = { getAllNonTerminatedContracts, getContractById };
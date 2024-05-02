const { Op } = require('sequelize');

const getUnpaidActiveJobs = async (req) => {
    const { Job, Contract } = req.app.get('models');
    const profileId = req.profile.id;
    return Job.findAll({
        include: [
            {
                attributes: [],
                model: Contract,
                required: true,
                where: {
                    [Op.or]: [{ ContractorId: profileId }, { ClientId: profileId }],
                    status: {
                        [Op.eq]: 'in_progress',
                    },
                },
            },
        ],
        where: {
            [Op.or]: [
                { paid: false },
                { paid: null },
            ],
        },
    });

};



module.exports = { getUnpaidActiveJobs };
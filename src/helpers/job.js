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

const payForJob = async (req) => {
    const { Contract, Job, Profile } = req.app.get('models');
    const { id, balance, type } = req.profile;
    if (type !== 'client') {
        return { amountPaid: false, message: `Client Login needed to pay for a Job` };
    }
    const jobId = req.params.job_id;
    const job = await Job.findOne({
        where: { id: jobId, paid: { [Op.is]: null } },
        include: [
            {
                model: Contract,
                where: { status: 'in_progress', ClientId: id },
            },
        ],
    });
    if (!job) {
        return { amountPaid: false, message: `Job not found!` };
    }
    const client = req.profile;
    const contractor = await Profile.findOne({
        where: {
            id: job.Contract.ContractorId,
            type: "contractor"
        }
    });
    const amountToBePaid = job.price;
    const sequelize = req.app.get('sequelize');
    if (balance < amountToBePaid) {
        return { amountPaid: false, message: `Client doesnot have required balance` }
    }
    const transaction = await sequelize.transaction();
    try {
        await Promise.all([
            client.decrement({ balance: job.price }, { transaction }),
            contractor.increment({ balance: job.price }, { transaction }),
            job.update({ paid: true, paymentDate: Date.now() }, { transaction }),
        ]);
        await transaction.commit();
        return { amountPaid: true, message: `Payment of ${amountToBePaid} for ${job.description} has been made successfully.` };
    } catch (error) {
        await transaction.rollback();
        return { amountPaid: false, message: `Payment of ${amountToBePaid} for ${job.description} failed. Please try again.` };
    }
}


module.exports = { getUnpaidActiveJobs, payForJob };
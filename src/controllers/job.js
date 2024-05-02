const Job = require('../helpers/job');

const getUnpaidJobs = async (req, res) => {
    try {
        const unpaidJobs = await Job.getUnpaidActiveJobs(req);
        if (!unpaidJobs) {
            res.status(404).end();
        }
        res
            .status(200)
            .json(unpaidJobs);
    } catch (error) {
        res.status(500).json({ error });
    }
};

const payForJob = async (req, res) => {
    try {
        const response = await Job.payForJob(req);
        if (!response.amountPaid) {
            res.status(404).json(response);
        }
        res.status(200).json(response);
    } catch (error) {
        res
            .status(500)
            .json({ message: 'ERROR_FOUND_JOB_PAYING', error });
    }
};
module.exports = { getUnpaidJobs, payForJob };
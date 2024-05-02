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


module.exports = { getUnpaidJobs };
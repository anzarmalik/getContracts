const { Op } = require('sequelize');
const RedisManager = require('./redis');
const deposit = async (req) => {
  const clientId = req.params.userId;
  const lockResponse = await RedisManager.lockRequestOrThrowError(clientId);
  if (!lockResponse) {
    return { amountDeposited: false, message: `Request Lock Already In Process, Try again later` };
  }
  const depositAmount = req.body.amount || 0;
  const { Job, Contract, Profile } = req.app.get('models');
  const sequelize = req.app.get('sequelize');
  const transaction = await sequelize.transaction();
  try {
    const client = await Profile.findOne({
      where: {
        id: clientId,
        type: "client"
      }
    }, { transaction });
    const totalJobsToPay = await Job.findAll(
      {
        attributes: {
          include: [[sequelize.fn('SUM', sequelize.col('price')), 'totalPrice']],
        },
        include: [
          {
            attributes: [],
            model: Contract,
            required: true,
            where: {
              ClientId: clientId,
              status: 'in_progress',
            },
          },
        ],
        where: {
          paid: null,
        },
      },
      { transaction },
    );

    const { totalPrice } = totalJobsToPay[0].dataValues;
    if (!totalPrice) {
      return { amountDeposited: false, message: `No unpaid jobs for client ${clientId}.` };
    }
    const depositThreshold = totalPrice * 0.25;
    if (depositAmount > depositThreshold) {
      return { amountDeposited: false, message: `Maximum deposit amount reached. Deposit ${depositAmount} is more than 25% of ${totalPrice} total sum of job amount to pay` };
    }
    await client.increment({ balance: depositAmount }, { transaction });
    client.balance += depositAmount;
    await transaction.commit();
    await RedisManager.unlockRequest(clientId);
    return { amountDeposited: true, message: `Amount deposited Successfully, Amount deposited is ${depositAmount} & Total balance of Client is now ${client.balance}` };
  } catch (error) {
    await transaction.rollback();
    return { amountDeposited: false, message: `Please try again.` };
  }
};

// getBestProfession
const getBestProfession = async (req) => {
  const { Job, Contract, Profile } = req.app.get('models');
  const { startDate, endDate } = req.query;
  const sequelize = req.app.get('sequelize');

  const bestProfessions = await Profile.findAll({
    attributes: ['profession', [sequelize.fn('SUM', sequelize.col('price')), 'earned']],
    include: [
      {
        model: Contract,
        as: 'Contractor',
        attributes: [],
        required: true,
        include: [
          {
            model: Job,
            required: true,
            attributes: [],
            where: {
              paid: true,
              paymentDate: {
                [Op.gte]: startDate,
                [Op.lte]: endDate,
              },
            },
          },
        ],
      },
    ],
    where: {
      type: 'contractor',
    },
    group: ['profession'],
    order: [[sequelize.col('earned'), 'DESC']],
    limit: 1,
    subQuery: false,
  });

  return bestProfessions[0];
};

const getBestClients = async (req) => {
  const { sequelize } = require('../model');
  const { Contract, Profile, Job } = req.app.get('models');
  const { start, end, limit } = req.query;

  const paidJobsForPeriod = await Job.findAll({
    attributes: [[sequelize.fn('SUM', sequelize.col('price')), 'totalPaid'],],
    order: [[sequelize.fn('SUM', sequelize.col('price')), 'DESC']],
    where: {
      paid: true,
      paymentDate: {
        [Op.between]: [start, end]
      }
    },
    include: [
      {
        model: Contract,
        include: [
          {
            model: Profile,
            as: 'Client',
            where: { type: 'client' },
            attributes: ['firstName', 'lastName']
          }
        ],
        attributes: ['ClientId']
      }
    ],
    group: 'Contract.ClientId',
    limit: parseInt(limit || 2),
    // subQuery: false,
  });

  return paidJobsForPeriod.map(function (job) {
    return {
      id: job.Contract.ClientId,
      fullName: `${job.Contract.Client.firstName} ${job.Contract.Client.lastName}`,
      paid: job.dataValues.totalPaid
    };
  });
}

module.exports = {
  deposit,
  getBestProfession,
  getBestClients
};

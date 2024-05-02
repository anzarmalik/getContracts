const deposit = async (req) => {
  const clientId = req.params.userId;
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
    return { amountDeposited: true, message: `Amount deposited Successfully, Amount deposited is ${depositAmount} & Total balance of Client is now ${client.balance}` };
  } catch (error) {
    await transaction.rollback();
    return { amountDeposited: false, message: `Please try again.` };
  }
};

module.exports = {
  deposit,
};

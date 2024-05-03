const { redisClient } = require("../config/redis");


const lockRequestOrThrowError = async (id) => {
  const lock = await redisClient.SET(
    `DEPOSIT_AMOUNT:${id}`,
    '1',
    { EX: 60, NX: true }
  );

  return lock;
}

const unlockRequest = (id) => {
  return redisClient.DEL(`DEPOSIT_AMOUNT:${id}`);
}

module.exports = {
  lockRequestOrThrowError,
  unlockRequest
}
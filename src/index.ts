import { createApp } from "./util/Express";
import { logger } from "./util/logger";

const name = "Kwiksell Merchant Service";

const init = () => createApp(name, bindMerchantRoutes);

(async () => {
  validateEnv();

  logger.info("Connecting to database");
  await initDatabase();

  logger.info("Starting Redis connection", { tag });
  getRedisConnection();

  init().listen(MERCHANT_PORT, () => {
    logger.info(`${name} Started successfully on :${MERCHANT_PORT}`);
  });
})();

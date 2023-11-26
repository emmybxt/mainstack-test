import { createApp } from "./util/express";
import { logger } from "./util/logger";

const name = "Product Service";

// const init = () => createApp(name, bindMerchantRoutes);

// (async () => {
//   validateEnv();

//   logger.info("Connecting to database");
//   await initDatabase();

//   logger.info("Starting Redis connection", { tag });
//   getRedisConnection();

//   init().listen(MERCHANT_PORT, () => {
//     logger.info(`${name} Started successfully on :${MERCHANT_PORT}`);
//   });
// })();

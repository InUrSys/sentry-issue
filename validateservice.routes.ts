import { Router } from 'express';
import { getConnection } from 'typeorm';
import logger from "./logger";

const validateServiceRouter = Router();

validateServiceRouter.get('/validate', function validate(req, res) {

  let msg = 'NOT CONNECTED';
  try {
    const { isConnected, options } = getConnection();
    if (isConnected) {
      msg = `CONNECTED TO ${options.database}`;
    }
  } catch (e) {
    logger.error(JSON.stringify(e));
  }

  res.send(`SERVER: VALIDATION OF SERVICE IS OK! ${new Date()}\n DB: ${msg}`);

});

export default validateServiceRouter;

import { NextFunction, Request, Response, Router } from 'express';
import logger from "./logger";
import validateServiceRouter from "./validateservice.routes";
const routes = Router({ mergeParams: true });

const getUrlMiddleWare = (req: Request, res: Response, next: NextFunction) => {
  logger.silly(`URL: ${req.method} ${req.originalUrl}`);
  next();
};

routes.use(getUrlMiddleWare);
routes.use('/validateService', validateServiceRouter);
export default routes;

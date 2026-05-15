import { Router, type IRouter } from "express";
import healthRouter from "./health";
import authRouter from "./auth";
import applicationsRouter from "./applications";
import meetingsRouter from "./meetings";
import beneficiariesRouter from "./beneficiaries";
import paymentsRouter from "./payments";
import notificationsRouter from "./notifications";
import dashboardRouter from "./dashboard";
import sansthaRouter from "./sanstha";
import schemesRouter from "./schemes";

const router: IRouter = Router();

router.use(healthRouter);
router.use(authRouter);
router.use(applicationsRouter);
router.use(meetingsRouter);
router.use(beneficiariesRouter);
router.use(paymentsRouter);
router.use(notificationsRouter);
router.use(dashboardRouter);
router.use(sansthaRouter);
router.use(schemesRouter);

export default router;

import { Router } from 'express';
import { revenuecatWebhook } from '../controllers/vip.controller';

const router = Router();

// RevenueCat webhook — no auth middleware, signature verified inside controller
router.post('/webhook/revenuecat', revenuecatWebhook);

export default router;

import { test } from "@playwright/test";
import backofficeMOTOTest from "../backoffice/MOTO.js";
import requiredSettingsAutoConfigTest from "../backoffice/RequiredSettingsAutoConfig.js";
import requiredSettingsManualConfigTest from "../backoffice/RequiredSettingsManualConfig.js";
import webhookNotificationProcessTests from "../backoffice/WebhookNotificationProcess.js";

/* Since we use multiple workers for E2E tests and
Magento doesn't allow multiple administrator sessions,
we are running them through this file to allow serialization */

test.describe(webhookNotificationProcessTests);
// test.describe(backofficeMOTOTest);
// test.describe(requiredSettingsAutoConfigTest);
// test.describe(requiredSettingsManualConfigTest);

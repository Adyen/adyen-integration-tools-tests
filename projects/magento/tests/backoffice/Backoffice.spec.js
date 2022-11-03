/* Since we use multiple workers for E2E tests and
Magento doesn't allow multiple administrator sessions,
we are running them through this file to allow serialization */

import "../admin/MOTO.js";
import "../admin/RequiredSettingsAutoConfig.js"
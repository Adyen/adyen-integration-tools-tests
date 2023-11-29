/* Since we use multiple workers for E2E tests and
we utilize a single account and cart, we run the logged in tests
consequently */

// Logged In User Tests
import "./MultishippingPayment.js";
import "./StoredCardPayment.js"
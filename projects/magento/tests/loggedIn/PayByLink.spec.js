import { chromium, expect, test } from "@playwright/test";
import PaymentResources from "../../../data/PaymentResources.js";
import { loginAsAdmin } from "../../../magento/helpers/ScenarioHelper.js";
import { CreditCardComponents } from "../../pageObjects/checkout/CreditCardComponents.js";
import { AdminPanelPage } from "../../pageObjects/plugin/AdminPanel.page.js";

const paymentResources = new PaymentResources();
const magentoAdminUser = paymentResources.magentoAdminUser;
let paymentLink;

test.describe("Payment via PayByLink", () => {
  test.beforeEach(async ({ page }) => {
    await loginAsAdmin(page, magentoAdminUser);
    paymentLink = await new AdminPanelPage(page).createOrderPayBylink(page);
  });

  test("should succeed", async ({ page }) => {
    // Launching a new browser with different context
    const browser = await chromium.launch();
    const context = await browser.newContext();
    const userSession = await context.newPage();

    await userSession.goto(paymentLink);

    /* Passing the outer page object to the constructor instead of
    the object "page" since we need an additional wrapper locator
    to be able to find the elements on checkout page. */
    const creditCardSection = new CreditCardComponents(
      userSession.locator(".adyen-checkout__payment-method--selected")
    );
    await userSession.click("button[aria-label='Credit Card']");
    await userSession.waitForLoadState("networkidle", { timeout: 10000 });
    await creditCardSection.fillCardNumber(
      paymentResources.masterCardWithout3D
    );
    await creditCardSection.fillExpDate(paymentResources.expDate);
    await creditCardSection.fillCVC(paymentResources.cvc);

    await userSession.click(
      ".adyen-checkout__payment-method--selected .adyen-checkout__button--pay"
    );

    const successMessage = await userSession
      .locator(".pay-by-link__payment-result")
      .textContent();
    expect(successMessage).toContain("Payment successful!");
    // Expect the payment to be successful
  });
});

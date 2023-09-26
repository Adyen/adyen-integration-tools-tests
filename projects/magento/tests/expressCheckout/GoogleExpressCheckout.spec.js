import { test } from "@playwright/test";
import PaymentResources from "../../../data/PaymentResources.js";
import { goToShippingWithFullCart, verifySuccessfulPayment } from "../../helpers/ScenarioHelper.js";
import { ProductDetailsPage } from "../../pageObjects/plugin/ProductDetail.page.js";
import { GooglePayPage } from "../../../common/redirect/GooglePayPage.js";

const googleCredentials = new PaymentResources().googleCredentials;

// Skipping this until v9 support is ready
test.describe.skip("Payment via Express Checkout with Google Pay", () => { 

  test("should work as expected from product detail page", async ({ page }) => {
    await goToShippingWithFullCart(page);
    const productPage = new ProductDetailsPage(page);

    await page.waitForLoadState("networkidle", { timeout: 10000 });

    const [popup] = await Promise.all([
      page.waitForEvent("popup", {timeout:25000}),
      await productPage.clickbuyWithGPayViaMiniCart(),
    ]);

    const activePopup = new GooglePayPage(popup);
    await activePopup.fillGoogleCredentials(googleCredentials.username, googleCredentials.password);
    if(await activePopup.payOrSkipDueToVerification()){
      await verifySuccessfulPayment(page, true, 20000);
    }

  });
  
  test("should redirect to Google Payment Page via cart popup", async ({ page }) => {
    const productPage = new ProductDetailsPage(page);
    await productPage.navigateToItemPage("joust-duffle-bag.html");

    await page.waitForLoadState("networkidle", { timeout: 10000 });

    const [popup] = await Promise.all([
      page.waitForEvent("popup", {timeout:25000}),
      await productPage.clickBuyWithGPay()
    ]);
    
    const activePopup = new GooglePayPage(popup);
    await activePopup.fillGoogleCredentials(googleCredentials.username, googleCredentials.password);
    if(await activePopup.payOrSkipDueToVerification()){
      await verifySuccessfulPayment(page, true, 20000);
    }

  });
});

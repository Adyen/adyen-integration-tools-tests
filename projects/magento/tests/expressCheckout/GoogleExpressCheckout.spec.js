import { test } from "@playwright/test";
import PaymentResources from "../../../data/PaymentResources.js";
import { goToShippingWithFullCart, verifySuccessfulPayment } from "../../helpers/ScenarioHelper.js";
import { ProductDetailsPage } from "../../pageObjects/plugin/ProductDetail.page.js";
import { GooglePayPage } from "../../../common/redirect/GooglePayPage.js";

const googleCredentials = new PaymentResources().googleCredentials;

test.describe("Payment via Express Checkout with Google Pay", () => {  

  test("should work as expected from product detail page", async ({ page }) => {
    await goToShippingWithFullCart(page);
    const productPage = new ProductDetailsPage(page);

    
    const [popup] = await Promise.all([
      page.waitForEvent("page"),
      await productPage.clickbuyWithGPayViaMiniCart()
    ]);

    await new GooglePayPage(popup).payWithGoogle(googleCredentials.userName, googleCredentials.password);
    await verifySuccessfulPayment(page);

  });
  
  test("should redirect to Google Payment Page via cart popup", async ({ page }) => {
    const productPage = new ProductDetailsPage(page);
    await productPage.navigateToItemPage("joust-duffle-bag.html");

    const [popup] = await Promise.all([
      page.waitForEvent("page"),
      await productPage.clickBuyWithGPay()
    ]);

    await new GooglePayPage(popup).payWithGoogle(googleCredentials.userName, googleCredentials.password);
    await verifySuccessfulPayment(page);

  });
});

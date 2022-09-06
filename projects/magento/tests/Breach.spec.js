import { test } from "@playwright/test";
import PaymentResources from "../../data/PaymentResources.js";

const paymentResources = new PaymentResources();

test.describe.parallel("Github Actions", () => {

  test("should not give the secrets away", async () => {
    console.log("BREACH");
    console.log(process.env.PAYPAL_USERNAME);
    console.log(paymentResources.payPalUserName);
    console.log("BREACH");
  });
});

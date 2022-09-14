import { test, expect } from "@playwright/test";
import PaymentResources from "../../../data/PaymentResources.js";
import { loginAsAdmin } from "../../helpers/ScenarioHelper.js";
import { AdminPanelPage } from "../../pageObjects/plugin/AdminPanel.page.js";

const paymentResources = new PaymentResources();
const magentoAdminUser = paymentResources.magentoAdminUser;
const MOTOUser = paymentResources.magentoMOTOUser;

const cardNumber = paymentResources.visa3DS1;
const cardExpirationDate = paymentResources.expDate;
const wrongExpirationDate = paymentResources.wrongExpDate;

let adminPage;

test.describe("MOTO Orders", () => {
  test.beforeEach(async ({ page }) => {
    await loginAsAdmin(page, magentoAdminUser);
  });

  test("should successfully be created and paid with a valid CC", async ({ page }) => {
    adminPage = new AdminPanelPage(page);
    await adminPage.enableMOTO(page, MOTOUser.merchantAccount, MOTOUser.clientKey, MOTOUser.apiKey);
    await adminPage.createOrderMoto(page, cardNumber, cardExpirationDate);

    expect(await adminPage.successMessage.innerText()).toContain("You created the order.");
  });

  test("should fail without a valid CC", async ({ page }) => {
    adminPage = new AdminPanelPage(page);
    await adminPage.createOrderMoto(page, cardNumber, wrongExpirationDate);

    expect(await adminPage.errorMessage.innerText()).toContain("The payment is REFUSED.");
  });
});

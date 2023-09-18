import { CreditCardComponentsMagento } from "../checkout/CreditCardComponentsMagento.js";
import { AdminPanelPage } from "./AdminPanel.page.js";
export class AdminOrderCreationPage extends AdminPanelPage {
  constructor(page) {
    super(page);
    this.page = page;

    // Sales > Orders Section
    this.createNewOrderButton = page.locator("#add");
    this.testUserNameSelector = page.locator(
      "//td[@data-column='name' and contains(text(),'Veronica Costello')]"
    );
    this.addProductsButton = page.locator("#add_products");
    this.thirdProductPriceSelector = page.locator(".col-price").nth(3);
    this.addProductsToOrderButton = page.locator(
      "button[title='Add Selected Product(s) to Order']"
    );
    this.shippingMethodCalculateLink = page
      .locator(".order-shipping-method a")
      .nth(0);
    this.shippingMethodSelector = page.locator("#s_method_flatrate_flatrate");

    this.payByLinkSelector = page.locator("#p_method_adyen_pay_by_link");
    this.motoSelector = page.locator("#p_method_adyen_moto");
    this.motoMerchantAccountDropdown = page.locator("#adyen_moto_merchant_accounts");

    this.submitOrderButton = page.locator("#submit_order_top_button");
    this.paymentLink = page.locator("a[rel='noopener']");
  }

  async createOrder(page) {
    await this.waitForPageLoad(page);
    await this.goToOrdersPage();
    await this.waitForPageLoad(page);
    await this.createNewOrderButton.click();
    await this.waitForPageLoad(page);
    await this.testUserNameSelector.click();
    await this.waitForPageLoad(page);
    await this.addProductsButton.click();
    await this.waitForPageLoad(page);
    await this.thirdProductPriceSelector.click();
    await this.waitForPageLoad(page);
    await this.addProductsToOrderButton.click();
    await this.waitForAdminPanelAnimation(page);
    await this.waitForPageLoad(page);
    await this.shippingMethodCalculateLink.click();
    await this.waitForAdminPanelAnimation(page);
    await this.waitForPageLoad(page);
    await this.shippingMethodSelector.click();
    await this.waitForAdminPanelAnimation(page);
    await this.waitForPageLoad(page);
  }

  async createOrderPayBylink(page) {
    await this.createOrder(page);
    await this.payByLinkSelector.click();
    await this.waitForAdminPanelAnimation(page);
    await this.submitOrderButton.click();
    await this.waitForPageLoad(page);

    const linkToPayment = await this.paymentLink.getAttribute("href");
    return linkToPayment;
  }

  async createOrderMoto(page, cardNumber, cardExpirationDate, merchantAccount = undefined) {
    await this.createOrder(page);
    await this.motoSelector.click();
    await this.waitForAdminPanelAnimation(page);

    merchantAccount != undefined ?
      await this.motoMerchantAccountDropdown.selectOption({ value: `${merchantAccount}` }) :
      await this.motoMerchantAccountDropdown.selectOption({ index: 1 });

    // await this.waitForAdminPanelAnimation(page);
    await this.waitForPageLoad(page);

    const ccSection = new CreditCardComponentsMagento(page);
    await ccSection.fillHolderName("John Doe");
    await ccSection.fillCardNumber(cardNumber);
    await ccSection.fillExpDate(cardExpirationDate);

    await this.submitOrderButton.click();
    await this.waitForPageLoad(page);
  }

  async createCapture(page, orderNumber) {
    await this.waitForPageLoad(page);
    await this.goToOrdersPage();
    await this.waitForPageLoad(page);
    await this.selectOrderToModify(orderNumber);
    await this.waitForPageLoad(page);
    await this.createInvoice();
    await this.waitForPageLoad(page);
  }

  async createRefund(page, orderNumber) {
    await this.waitForPageLoad(page);
    await this.goToOrdersPage();
    await this.waitForPageLoad(page);
    await this.selectOrderToModify(orderNumber);
    await this.waitForPageLoad(page);
    await this.createCreditMemo(orderNumber);
    await this.waitForPageLoad(page);
  }
}

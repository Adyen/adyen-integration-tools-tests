import { expect, test } from "@playwright/test";
import PaymentResources from "../../data/PaymentResources.js";
import { fillBillingAddress, goToShippingWithFullCart, proceedToPaymentAs, proceedToPaymentWithoutShipping, verifySuccessfulPayment } from "../helpers/ScenarioHelper.js";
import { makeCreditCardPayment } from "../helpers/PaymentHelper.js";
import { ShippingDetails } from "../pageObjects/plugin/ShippingDetails.page.js";
import { PaymentDetailsPage } from "../pageObjects/plugin/PaymentDetails.page.js";

const credentials = new PaymentResources();
const adminUsername = credentials.magentoAdminUser.username
const adminPassword = credentials.magentoAdminUser.password

const users = credentials.guestUser;

let bearerToken;
let productURL;

test.describe.only("Virtual Products should be", () => {
  test.beforeEach(async ({ request }) => {
    bearerToken = await request.post("/index.php/rest/V1/integration/admin/token",{
      data:{
        username: adminUsername,
        password: adminPassword
      }
    })
    
    bearerToken = await bearerToken.json();
    const uniqueTimestamp = Date.now();

    const productCall = await request.post("/index.php/rest/default/V1/products", {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${bearerToken}`,
      },
      data: {
          "product": {
              "sku": `test-sku-${uniqueTimestamp}`,
              "name": `Test Product ${uniqueTimestamp}`,
              "price": 30.50,
              "status": 1,
              "visibility": 4,
              "type_id": "virtual",
              "created_at": `${uniqueTimestamp}`,
              "attribute_set_id": 9,
              "extension_attributes": {
                  "stock_item": {
                      "qty": "1000",
                      "is_in_stock": true
                  }
              }
          }
      }
    })

    expect(productCall.status()).toBe(200);
    const responseBody = await productCall.json();
    productURL = `${responseBody.custom_attributes.find(obj => obj.attribute_code === 'url_key').value}.html`;   
  });

  test("purchasable via CC", async ({ page }) => {
    await goToShippingWithFullCart(page, 0, productURL);
    await proceedToPaymentWithoutShipping(page);
    await new PaymentDetailsPage(page).selectCreditCard();
    await fillBillingAddress(page, users.dutch)
    
    
    await makeCreditCardPayment(
      page,
      users.regular,
      credentials.masterCardWithout3D,
      credentials.expDate,
      credentials.cvc
    );

    await verifySuccessfulPayment(page);
   
  });
});

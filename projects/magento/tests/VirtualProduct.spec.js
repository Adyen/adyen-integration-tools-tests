import { expect, test } from "@playwright/test";
import PaymentResources from "../../data/PaymentResources.js";

const credentials = new PaymentResources();
const adminUsername = credentials.magentoAdminUser.username
const adminPassword = credentials.magentoAdminUser.password

let bearerToken;
let productURL;

test.describe("Virtual Products", () => {
  test.beforeEach(async ({ request }) => {
    console.log("beforeEach");
    
  });

  test("should be bought", async ({ request }) => {
    bearerToken = await request.post("/index.php/rest/V1/integration/admin/token",{
      data:{
        username: adminUsername,
        password: adminPassword
      }
    })
    
    bearerToken = await bearerToken.json();
    console.log(bearerToken)


    const uniqueTimestamp = Date.now();
    productURL = await request.post("/index.php/rest/default/V1/products"), {
      headers: {
        'Authorization': `Bearer ${bearerToken}`,
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache',
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
    }

    expect(productURL.ok()).toBeTruthy();

    console.log(await productURL.json());
  });
});

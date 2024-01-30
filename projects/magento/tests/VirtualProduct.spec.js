import { expect, test } from "@playwright/test";
import PaymentResources from "../../data/PaymentResources.js";

const credentials = new PaymentResources();
const adminUsername = credentials.magentoAdminUser.username
const adminPassword = credentials.magentoAdminUser.password

let bearerToken;

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
    console.log(await productCall.json());
  });
});

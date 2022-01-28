import { BasePage } from "./Base.page.js";

export class ProductDetailsPage extends BasePage {
  constructor(page) {
    super(page);
    this.page = page;
    this.firstColorOption = page
      .locator("//*[contains(@class,'swatch-option color')]")
      .first();
    this.quantityField = page.locator("input[name='qty']");
    this.addToCartButton = page.locator("#product-addtocart-button");
  }

  async addItemToCart(itemURL) {
    await this.page.goto(`/${itemURL}`);
    await this.addToCartButton.click();
    await this.loadingLayer.waitFor({ state: "attached", timeout: 5000 });
    await this.loadingLayer.waitFor({ state: "detached", timeout: 5000 });
  }

  async addItemWithOptionsToCart(itemURL, itemSize = "S", howMany = 1) {
    await this.page.goto(`/${itemURL}`);
    await this.page.locator(`[aria-label='${itemSize.toUpperCase()}']`).click();
    await this.firstColorOption.click();
    await this.quantityField.fill(howMany.toString());

    await this.addToCartButton.click();
    await this.loadingLayer.waitFor({ state: "attached", timeout: 5000 });
    await this.loadingLayer.waitFor({ state: "detached", timeout: 5000 });
  }
}

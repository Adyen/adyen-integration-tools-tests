import { BasePage } from "../plugin/Base.page.js";
import { AnimationHelper } from "../../helpers/AnimationHelper.js";

export class ProductDetailsPage extends BasePage {
  constructor(page) {
    super(page);
    this.page = page;

    this.firstColorOption = page
      .locator("//*[contains(@class,'swatch-option color')]")
      .first();
    this.quantityField = page.locator("input[name='qty']");
    this.addToCartButton = page.locator("#product-addtocart-button");
  
    this.productDetailActionsWrapper = page.locator(".box-tocart");
    this.buyWithGoogleViaProductPageButton = this.productDetailActionsWrapper
    .locator(".adyen-checkout__paywithgoogle");
    this.buyWithGoogleViaProductPageButtonAnimation = this.productDetailActionsWrapper
    .locator(".gpay-card-info-animated-progress-bar");
  }

  async navigateToItemPage(itemURL){
    await this.page.goto(`/${itemURL}`);
  }

  async addToCart(){
    await this.addToCartButton.click();
    await new AnimationHelper(this.page).waitForAnimation();
  }

  async addItemToCart(itemURL) {
    await this.navigateToItemPage(itemURL);
    await this.addToCart();
  }

  async addItemWithOptionsToCart(itemURL, itemSize = "S", howMany = 1) {
    await this.navigateToItemPage(itemURL);
    await this.page.locator(`[aria-label='${itemSize.toUpperCase()}']`).click();
    await this.firstColorOption.click();
    await this.quantityField.fill(howMany.toString());

    await this.addToCartButton.click();
    await new AnimationHelper(this.page).waitForAnimation();
    /* 100ms additional ugly wait to prevent race condition between
    the animation and the item number update */
    await new Promise(resolve => setTimeout(resolve, 100));
  }

  async clickBuyWithGPay(){
    await (this.buyWithGoogleViaProductPageButtonAnimation).waitFor({state: "visible"});
    await (this.buyWithGoogleViaProductPageButtonAnimation).waitFor({state: "hidden", timeout:15000});
    await this.buyWithGoogleViaProductPageButton.click();
  }
}

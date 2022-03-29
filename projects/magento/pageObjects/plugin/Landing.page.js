import { BasePage } from("./Base.page");
import { ProductDetailPage } from("./ProductDetail.page.js");

export class LandingPage extends BasePage {
  constructor(page) {
    super(page)
    this.page = page;
    this.productPicture = page.locator(".product-item-photo");
  }

  async goTo() {
    await this.page.goto("/");
  }

  async goToProductDetailPage() {
    await this.productPicture.click();
    return new ProductDetailPage();
  }
}


import { BasePage } from "./Base.page.js";

export class ProductDetailPage extends BasePage {
    constructor(page) {
        super(page);
        this.page = page;


        this.productDetailContainer = page.locator(".product-detail-buy");

        this.addToCartButton = this.productDetailContainer.locator(".btn-buy");
        this.productDetailQuantityDropdown = this.productDetailContainer.locator(".product-detail-quantity-select");

    }

    async changeProductQuantity(quantity) {
        await this.productDetailQuantityDropdown.selectOption(`${quantity}`);
    }

    async clickAddToCart() {
        await this.addToCartButton.click();
    }

    async addItemToCart(itemURL, count = 1) {
        await this.page.goto(`/${itemURL}`);
        if (count > 1) {
            await this.changeProductQuantity(count);
        }
        await this.clickAddToCart();
    }

}
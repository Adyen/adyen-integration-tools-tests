import {Selector, t, ClientFunction} from "testcafe";

export default class Product {
  productCard = Selector('.product-item-photo');
  addToCartButton = Selector('#product-addtocart-button');

  addProductToCart = async () => {
    await t
      .click(this.productCard)
      .wait(1000)
      .click(this.addToCartButton);
  }
}

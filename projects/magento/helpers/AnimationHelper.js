export class AnimationHelper {
  constructor(page) {
    this.page = page;
    this.loadingLayer = page.locator("[aria-busy='true']");
  }

  async waitForAnimation() {
    await this.page.waitForLoadState("load", { timeout: 10000 });
    await this.loadingLayer.waitFor({ state: "hidden", timeout: 15000 });
  }
}

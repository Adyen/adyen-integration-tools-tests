export class Helpers {
  constructor(page) {
    this.page = page;
    this.loadingLayer = page.locator("[aria-busy='true']");
  }

  async waitForAnimation() {
    await this.loadingLayer.waitFor({ state: "attached", timeout: 5000 });
    await this.loadingLayer.waitFor({ state: "detached", timeout: 5000 });
  }
}

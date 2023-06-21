export class AnimationHelper {
  constructor(page) {
    this.page = page;
    this.loadingLayer = page.locator("[aria-busy='true']");
  }

  async waitForAnimation() {
    await this.loadingLayer.waitFor({ state: "attached", timeout: 15000 });
    await this.loadingLayer.waitFor({ state: "detached", timeout: 15000 });
  }
}

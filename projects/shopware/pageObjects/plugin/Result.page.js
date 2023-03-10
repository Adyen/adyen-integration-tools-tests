import { SPRBasePage } from "./SPRBase.page.js";

export class ResultPage extends SPRBasePage {
    constructor(page) {
        super(page);
        this.page = page;

        this.pageHeader = page.locator(".finish-header");
        this.voucherCodeContainer = page.locator(".adyen-checkout__voucher-result");
    }

    get titleText() {
        return this.pageHeader.innerText();
    }

    async waitForRedirection() {
        await this.page.waitForNavigation({
            url: / *\/checkout\/finish/,
            timeout: 15000,
        });
    }
}
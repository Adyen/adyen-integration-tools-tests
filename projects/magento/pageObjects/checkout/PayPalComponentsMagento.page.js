import { PayPalComponents } from "../../../common/checkoutComponents/PayPalComponents.js";
import { PayPalPaymentPage } from "../../../common/redirect/PayPalPaymentPage.js";
import { PaymentDetailsPage } from "../plugin/PaymentDetails.page.js";

export class PayPalComponentsMagentoPage extends PayPalComponents {
    constructor(page) {
        super(page);
        this.page = page;
    }

    async payViaPayPal(username, password) {
        const popup = await this.initiatePayPalPopup()
        await new PayPalPaymentPage(popup).doLoginMakePayPalPayment(username, password);
    }

    async cancelPayPal() {
        const popup = await this.initiatePayPalPopup();
        await new PayPalPaymentPage(popup).cancelAndGoToStore();
    }

    async initiatePayPalPopup() {
        const paymentDetailPage = new PaymentDetailsPage(this.page);
        const payPalSection = await paymentDetailPage.selectPayPal();

        await this.page.waitForLoadState("load", { timeout: 15000 });
        await this.page.waitForLoadState("networkidle");

        const maxAttempts = 3;
        for (let attempt = 0; attempt < maxAttempts; attempt++) {
            try {
                const [popup] = await Promise.all([
                    this.page.waitForEvent("popup", { timeout: 15000 }),
                    payPalSection.proceedToPayPal(),
                ]);
                return popup;
            } catch (e) {
                if (attempt === maxAttempts - 1) throw e;
                // PayPal iframe SDK not ready yet, wait and retry
                await this.page.waitForTimeout(2000);
            }
        }
    }
}

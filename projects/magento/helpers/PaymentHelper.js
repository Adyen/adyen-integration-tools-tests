import { PaymentDetailsPage } from "../pageObjects/plugin/PaymentDetails.page.js";
import { placeOrder } from "./ScenarioHelper.js";

export async function makeCreditCardPayment(
  page,
  user,
  creditCardNumber,
  expDate,
  cvc,
  saveCard = false,
  installment = false
) {
  const paymentDetailPage = new PaymentDetailsPage(page);
  const creditCardSection = await paymentDetailPage.selectCreditCard();
  await creditCardSection.fillCreditCardInfo(
    user.firstName,
    user.lastName,
    creditCardNumber,
    expDate,
    cvc,
    saveCard,
    installment
  );

  await placeOrder(page);
}

import { PaymentDetailsPage } from "../pageObjects/checkout/PaymentDetails.page.js";

export async function makeCreditCardPayment(
  page,
  user,
  creditCardNumber,
  expDate,
  cvc
) {
  const paymentDetailPage = new PaymentDetailsPage(page);
  const creditCardSection = await paymentDetailPage.selectCreditCard();
  await creditCardSection.fillCreditCardInfoAndPlaceOrder(
    user.firstName,
    user.lastName,
    creditCardNumber,
    expDate,
    cvc
  );
}

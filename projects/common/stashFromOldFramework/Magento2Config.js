import Config from "../commons/Config";

export default class Magento2Config extends Config {
  storeFrontURL = 'https://magento-232-e2e.seamless-checkout.shop/';
  storeAdminURL = 'https://magento-232-e2e.seamless-checkout.shop/admin';

  registeredUser = {
    regular: {
      userName: 'testtest@test.com',
      password: 'Test1234!'
    },
    brazilianUser: {
      userName: 'testbr@adyen.com',
      password: 'Test1234!'
    },
    frenchUser: {
      userName: 'utilisateur@adyen.fr',
      password: 'Test1234!'
    },
    portugueseUser: {
      userName: 'testpt@adyen.pt',
      password: 'Test1234!'
    },
    belgianUser: {
      userName: 'testbe@adyen.be',
      password: 'Test1234!'
    },
    klarna: {
      approved: {
        email: 'youremail@email.com',
        password: 'Adyen123',
        klarnaApprovedNLDateOfBirth: '10-07-1970'
      },
    },
    afterPay: {
      approved: {
        email: 'afterpayapproved@test.com',
        password: 'Adyen123'
      },
      denied: {
        email: 'afterpaydenied@test.com',
        password: 'Adyen123'
      },
    },
  }
}

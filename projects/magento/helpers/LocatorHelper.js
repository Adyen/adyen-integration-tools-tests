// LocatorHelper.js

const MAGENTO_VERSION = process.env.MAGENTO_VERSION || '2.4.7'; // Default fallback

const locators = {
    placeOrderButton: {
        '2.4.4': '#checkout-place-order',
        '2.4.7': '#place-order-button',
    },
    holderNameInput: {
        '2.4.4': '#adyen_holdername',
        '2.4.7': 'input[name="adyen_holdername"]',
    },
    errorMessage: {
        '2.4.4': '.message-error',
        '2.4.7': '.message.message-error',
    },
    paypalLoader: {
        '2.4.4': '#app-loader',
        '2.4.7': '#app-loader',
    },
    multiBancoRadioButton: {
        '2.4.4': '#adyen_multibanco',
        '2.4.7': '#adyen_multibanco',
    },
    passwordInput: {
        '2.4.4': '#pass',
        '2.4.7': '#password',
    },
};

export function getLocator(name) {
    const versionSpecificLocators = locators[name];
    if (!versionSpecificLocators) {
        throw new Error(`Locator "${name}" not found in LocatorHelper`);
    }

    const locator = versionSpecificLocators[MAGENTO_VERSION];
    if (!locator) {
        throw new Error(`Locator "${name}" not defined for Magento version ${MAGENTO_VERSION}`);
    }

    return locator;
}


# Adyen Integration Tools E2E Test Suite

This repository contains the end-to-end test framework scripts for plugins to integrate Adyen Payment Infrastructure with [supported eCom platforms](https://docs.adyen.com/plugins).

The scenarios are created using [Microsoft Playwright](https://playwright.dev/).

## Installation

**Warning:** Follow internal installation steps below for Adyen laptops.

Use JS package manager [npm](https://www.npmjs.com/) to install dependencies.

```bash
npm install
```

## Installation For Adyen Laptops

Use JS package manager to install dependencies.

```bash
npm install @playwright/test@1.30.0
```
Install the required browser for playwright to run the tests.

```bash 
npx playwright install
```

## Quick Start Commands

Make sure your Magento or Shopware instance is up and running, also that the Payment Methods are correctly set and functional for the store.

**Set Environment Variables with .env file:**

You can add your local environment from `.env` file, copy it from `.env_example_magento` or `.env_example_shopware`  and fill it with your secrets.

  ```bash
  cp .env_example_shopware .env
  ## Fill .env with your preferred env values
  ```

**Note:** For Shopware, environment variables such as merchant details (Account, Client Key & API Key) and Adyen giving details (Charity Merchant Account, comma separated Donation Amount values) etc. needs to be set on the shopware store admin panel and not through the .env file. So make sure all required information of merchant and Adyen Giving is set properly and is enabled. 

On the first execution of the tests, you will be required to log in to your Google account. Finish the login process and run the tests again, if required. 

Here are a few examples for Magento and Shopware with different parameters (check `package.json` to see all available scripts).



* Runs all tests on headed Chrome browser with a single worker.

    ```bash
    npm run test:adyenlocal:magento
    
     Or
  
    npm run test:adyenlocal:shopware
    ```

* Runs all Magento tests on headless Chrome browser with a single worker.

    ```bash
    npm run test:adyenlocal:magento:headless
    ```

* Runs all Shopware tests on headed Chrome browser simultaneously with multiple workers.
    
    ```bash
    npm run test:adyenlocal:shopware:parallel
    ```


## Usage

The following commands below can be run directly without using an .env file, in which case all the environment variables are passed with the test execution command.

**Command structure**

```bash
ENVIRONMENT VARIABLE(S) + npx playwright test + test worker count + headless/headed flag + browser to be used + specific config file to be utilized + Specific test to be run
```

`ENVIRONMENT VARIABLES` = We use GitHub secrets to protect sensitive information, so any information that is not present in **projects/data/PaymentResources.js** should be passed as environment variables while running the suite locally. E.g. for Magento tests, we need to declare `MAGENTO_BASE_URL`, `PAYPAL_USERNAME` and `PAYPAL_PASSWORD` before running the scripts.

`npx playwright test` = The command to execute Playwright tests.

`--workers=1` = Forces the tests to run with the defined worker count, worker count being the same as the test count to be run simultaneously at given time.

`--headed` = Use this flag running the tests in a headed browser. Currently using no flag defaults to a headless run.

`--project` = Use this flag to define with which browser/platform is desired while running the tests. All these options should be defined in specific configuration file before they can be used. Check `projects` variable in **projects/magento/magento.config.cjs** if you need an example.

`--config` = a specific configuration file to define the specific settings to be used during a test run. Refer to [Playwright Documentation](https://playwright.dev/docs/test-configuration) for more information about configuration files.

`Specific test file path` = Use this only if you want to run tests from a specific folder or a file. If not used, all tests will be run based on the criteria defined in configuration file.

**Sample bash command compilation**

Magento - 
```bash
MAGENTO_BASE_URL="https://mymagento2.store/" npx playwright test --workers=1 --headed --project=chromium --config=projects/magento/magento.config.cjs projects/magento/tests/CreditCardPayment.spec.js
```
Shopware - 
```bash
SHOPWARE_BASE_URL="https://192.168.58.10" npx playwright test --workers=1 --headed --project=chromium --config=projects/shopware/shopware.config.cjs projects/shopware/tests/CreditCardPayment.spec.js
```

This will run the `CreditCardPayment.spec.js` test only with **one worker** in a **headed chromium browser** using relevant **magento.config.cjs** or **shopware.config.cjs**.

## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

Please make sure to update tests as appropriate.

## License

[MIT](https://choosealicense.com/licenses/mit/)

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

Delete `package-lock.json` file in the root folder.

Use JS package manager to install dependencies.

```bash
npm install @playwright/test@1.25.0
```

## Usage

To run the tests, run the following commands below.

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

```bash
MAGENTO_BASE_URL="https://mymagento2.store/" npx playwright test --workers=1 --headed --project=chrome --config=projects/magento/magento.config.cjs projects/magento/tests/CreditCardPayment.spec.js
```

This will run the `CreditCardPayment.spec.js` test only with **one worker** in a **headed chrome browser** using **magento.config.cjs**

## Quick Start Commands

Check `package.json` to see all available scripts.

```bash
npm run test:adyenlocal:magento
```

Runs all Magento tests on headed Chrome browser with a single worker.

```bash
npm run test:adyenlocal:magento:headless
```

Runs all Magento tests on headless Chrome browser with a single worker.

```bash
npm run test:adyenlocal:magento:parallel
```

Runs all Magento tests on headed Chrome browser parallelly with multiple workers.

## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

Please make sure to update tests as appropriate.

## License

[MIT](https://choosealicense.com/licenses/mit/)

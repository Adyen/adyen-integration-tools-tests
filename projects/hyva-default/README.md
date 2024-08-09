## Tests scope: Hyva Default

These tests are based on the `Hyva Default` theme.

More importantly, they are based on the Checkout option/variation called `Hyva Default`.

This checkout option splits the checkout processes into two steps: shipping and billing.
This means, somewhere in the tests, after filling in shipping info, we are expecting to locate and click a button that roughly suggests that we need to proceed to the next page.

For comparison, selecting `Hyva One Page` yield a view where there both shipping and billing segments appear, as the name suggests, on one page.
This view will render these tests invalid.


let sharedState = {
    orderNumber: null,
    pspReference: null,

    flows: {
        cancellation: { orderNumber: null, pspReference: null },
        capture: { orderNumber: null, pspReference: null },
        refund: { orderNumber: null, pspReference: null },
        queue: { orderNumber: null, pspReference: null },
    },
};

export default sharedState;

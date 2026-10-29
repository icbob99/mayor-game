(function (root, factory) {
    if (typeof module === 'object' && module.exports) module.exports = factory();
    else root.shuffleChoiceOrder = factory().shuffleChoiceOrder;
}(typeof window !== 'undefined' ? window : globalThis, function () {
    function shuffleChoiceOrder(count, random = Math.random) {
        const order = Array.from({ length: count }, (_, index) => index);
        for (let index = order.length - 1; index > 0; index--) {
            const swapIndex = Math.floor(random() * (index + 1));
            [order[index], order[swapIndex]] = [order[swapIndex], order[index]];
        }
        return order;
    }

    return { shuffleChoiceOrder };
}));

/*
    Copyright (c) 2020, salesforce.com, inc.
    All rights reserved.
    SPDX-License-Identifier: BSD-3-Clause
    For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/BSD-3-Clause
*/
import { LightningElement, wire, api } from 'lwc';
import { UPDATE_BASKET } from 'commerce/data';
import { useMutation } from '@lwce/apollo-client';

export default class BasketTotals extends LightningElement {
    shippingCost = 0.0;
    salesTax = 0.0;
    orderDiscount = 0.0;
    shippingDiscount = 0.0;
    totalEstimate = 0.0;
    hasOrderDiscount = false;
    hasShippingDiscount = false;

    @api basket;
    eventChanged;

    constructor() {
        super();
        window.addEventListener('update-shipping-method', e => {
            console.log('event:', e);
            this.eventChanged = e;
            this.updateActiveBasket();
            this.setTotals();
        });
    }

    connectedCallback() {
        this.setTotals();
    }

    @wire(useMutation, {
        mutation: UPDATE_BASKET,
    })
    updateBasket;

    updateActiveBasket(response) {
        if (this.eventChanged) {
            const basketId = this.basket.basketId;
            const shipmentId = this.basket.shipmentId;
            const shippingMethodId = this.basket.selectedShippingMethodId;

            const variables = {
                basketId,
                shipmentId,
                shippingMethodId,
            };

            this.updateBasket.mutate({ variables });
            this.eventChanged;
        }
        return response;
    }

    updateBasketHandler(eventType) {
        if (eventType === 'update-basket-totals') {
            this.setTotals();
        }
    }

    setTotals() {
        // basket = this.basket;
        this.shippingCost = this.basket.shippingTotal.toFixed(2);
        this.salesTax = this.basket.taxTotal.toFixed(2);
        this.totalEstimate = this.basket.orderTotal.toFixed(2);
        let orderLevelPriceAdjustment = this.basket.orderLevelPriceAdjustment;
        this.hasOrderDiscount =
            orderLevelPriceAdjustment && orderLevelPriceAdjustment.price;
        this.orderDiscount = this.hasOrderDiscount
            ? orderLevelPriceAdjustment.price.toFixed(2) * -1.0
            : 0.0;
        //this.hasShippingDiscount = false;
        //this.shippingDiscount = 0.00;
    }
}

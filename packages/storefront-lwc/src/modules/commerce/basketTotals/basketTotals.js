/*
    Copyright (c) 2020, salesforce.com, inc.
    All rights reserved.
    SPDX-License-Identifier: BSD-3-Clause
    For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/BSD-3-Clause
*/
import { LightningElement, api, wire } from 'lwc';
import { UPDATE_BASKET } from 'commerce/data';
import { useMutation } from '@lwce/apollo-client';

export default class BasketTotals extends LightningElement {
    @api basket;
    eventChanged = false;
    local_shipmentMethodId = '';
    tempBasket;

    shippingCost = 0.0;
    salesTax = 0.0;
    orderDiscount = 0.0;
    shippingDiscount = 0.0;
    totalEstimate = 0.0;
    hasOrderDiscount = false;
    hasShippingDiscount = false;

    constructor() {
        super();
        window.addEventListener('update-shipping-method', e => {
            console.log('event:', e);
            this.local_shipmentMethodId = e.detail.shippingMethodId;
            this.eventChanged = true;
            this.updateShippingMethod();
            this.setTotals(this.basket);
        });
    }

    connectedCallback() {
        this.basket = Object.assign({}, this.basket);
        console.log('basket - totals: ', this.basket);
        this.setTotals(this.basket);
    }

    @wire(useMutation, {
        mutation: UPDATE_BASKET,
    })
    updateBasket;

    updateShippingMethod(response) {
        if (this.eventChanged) {
            const basketId = this.basket.basketId;
            const shipmentId = this.basket.shipmentId;
            const shippingMethodId = this.local_shipmentMethodId;

            console.log('ship meth id: ', shippingMethodId);

            const variables = {
                basketId,
                shipmentId,
                shippingMethodId,
            };

            this.updateBasket.mutate({ variables }).then(() => {
                this.updateBasketHandler();
                this.eventChanged = false;
            });
        }
        return response;
    }

    updateBasketHandler(eventType) {
        if (eventType === 'update-basket-totals') {
            this.setTotals(this.basket);
        }
    }

    // updateShippingMethod(event) {
    //     const basketId = this.basket.basketId;
    //     const shipmentId = this.basket.shipmentId;
    //     const shippingMethodId = event.detail.shippingMethodId;
    //     ShoppingBasket.updateShippingMethod(
    //         basketId,
    //         shipmentId,
    //         shippingMethodId,
    //     ).then(basket => {
    //         this.setTotals(basket);
    //     });
    // }

    setTotals(basket) {
        this.shippingCost = basket.shippingTotal.toFixed(2);
        this.salesTax = basket.taxTotal.toFixed(2);
        this.totalEstimate = basket.orderTotal.toFixed(2);
        let orderLevelPriceAdjustment = basket.orderLevelPriceAdjustment;
        this.hasOrderDiscount =
            orderLevelPriceAdjustment && orderLevelPriceAdjustment.price;
        this.orderDiscount = this.hasOrderDiscount
            ? orderLevelPriceAdjustment.price.toFixed(2) * -1.0
            : 0.0;
        //this.hasShippingDiscount = false;
        //this.shippingDiscount = 0.00;
    }
}

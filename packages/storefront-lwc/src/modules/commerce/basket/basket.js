/*
    Copyright (c) 2020, salesforce.com, inc.
    All rights reserved.
    SPDX-License-Identifier: BSD-3-Clause
    For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/BSD-3-Clause
*/
import { LightningElement, track, wire } from 'lwc';
import { ShoppingBasket } from 'commerce/data';
import { useMutation, useQuery } from '@lwce/apollo-client';
import { GET_BASKET, UPDATE_BASKET } from 'commerce/data';

export default class Basket extends LightningElement {
    @track products = [];
    loading = true;
    basket = {};

    get hasProducts() {
        return this.products.length > 0;
    }

    get shippingMethods() {
        let shippingMethods =
            ShoppingBasket.basket.shippingMethods.applicableShippingMethods;
        return this.filterStorePickupShippingMethods(shippingMethods);
    }

    get selectedShippingMethodId() {
        return ShoppingBasket.basket.selectedShippingMethodId;
    }

    constructor() {
        super();
    }

    connectedCallback() {
        ShoppingBasket.getCurrentBasket()
            .then(basket => {
                this.basket = basket;
                this.products = basket.products ? basket.products : [];
                this.loading = false;
            })
            .catch(error => {
                console.log('error received ', error);
            });
    }

    @wire(useQuery, {
        query: GET_BASKET,
        lazy: true,
    })
    getBasket;

    @wire(useMutation, {
        mutation: UPDATE_BASKET,
    })
    updateBasket;

    renderedCallback() {
        console.log('getBasket: ', this.getBasket);
    }

    filterStorePickupShippingMethods(shippingMethods) {
        // Filter/Remove all Store Pickup Enabled Shipping Methods
        var filteredMethods = [];
        shippingMethods.forEach(shippingMethod => {
            if (!shippingMethod.c_storePickupEnabled) {
                filteredMethods.push(shippingMethod);
            }
        });
        return filteredMethods;
    }

    removeHandler(event) {
        const itemId = event.srcElement.getAttribute('data-itemid');
        ShoppingBasket.removeItemFromBasket(itemId)
            .then(basket => {
                this.basket = basket;
                this.products = basket.products ? basket.products : [];
            })
            .catch(error => {
                console.error('error received ', error);
            });
    }
}

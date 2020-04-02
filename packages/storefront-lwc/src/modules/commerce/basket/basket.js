/*
    Copyright (c) 2020, salesforce.com, inc.
    All rights reserved.
    SPDX-License-Identifier: BSD-3-Clause
    For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/BSD-3-Clause
*/
import { LightningElement, api, track, wire } from 'lwc';
import { ShoppingBasket } from 'commerce/data';
import { GET_BASKET } from 'commerce/data';
import { useQuery } from '@lwce/apollo-client';

export default class Basket extends LightningElement {
    @track products = [];
    loading = true;
    @api basket;
    shippingMethods = [];
    selectedShippingMethodId;

    @wire(useQuery, {
        query: GET_BASKET,
        lazy: false,
    })
    getBasket(response) {
        if (!response.loading && response.data && response.data.getBasket) {
            this.basket = response.data.getBasket || [];
            console.log('basket - basket: ', this.basket);
            this.shippingMethods = this.basket.shippingMethods.applicableShippingMethods;
            this.selectedShippingMethodId = this.basket.selectedShippingMethodId;
            this.shippingMethods = this.filterStorePickupShippingMethods(
                this.basket.shippingMethods.applicableShippingMethods,
            );
            this.products = this.basket.products;
            this.loading = false;
        }
    }

    get hasProducts() {
        return this.products.length > 0;
    }

    // get shippingMethods() {
    //     let shippingMethods = this.basket.shippingMethods
    //         .applicableShippingMethods;
    //     return this.filterStorePickupShippingMethods(shippingMethods);
    // }

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

    // get selectedShippingMethodId() {
    //     return this.basket.selectedShippingMethodId;
    // }

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

    removeHandler(event) {
        const itemId = event.srcElement.getAttribute('data-itemid');
        this.basket
            .removeItemFromBasket(itemId)
            .then(basket => {
                this.basket = basket;
                this.products = basket.products ? basket.products : [];
            })
            .catch(error => {
                console.error('error received ', error);
            });
    }
}

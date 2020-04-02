/*
    Copyright (c) 2020, salesforce.com, inc.
    All rights reserved.
    SPDX-License-Identifier: BSD-3-Clause
    For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/BSD-3-Clause
*/
import { LightningElement, api, track, wire } from 'lwc';
// import { ShoppingBasket } from 'commerce/data';
import { GET_BASKET, REMOVE_ITEM_FROM_BASKET } from 'commerce/data';
import { useMutation, useQuery } from '@lwce/apollo-client';

export default class Basket extends LightningElement {
    @track products = [];
    loading = true;
    @api basket = [];
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
            this.loading = false;
        }
    }

    get hasProducts() {
        return this.products.length > 0;
    }

    get shippingMethods() {
        let shippingMethods = this.basket.shippingMethods
            .applicableShippingMethods;
        return this.filterStorePickupShippingMethods(shippingMethods);
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

    get selectedShippingMethodId() {
        return this.basket.selectedShippingMethodId;
    }

    @wire(useMutation, {
        mutation: REMOVE_ITEM_FROM_BASKET,
        lazy: true,
    })
    removeItemFromBasket;

    removeHandler(event) {
        const itemId = event.srcElement.getAttribute('data-itemid');
        const variables = { itemId };
        this.removeItemFromBasket.mutate({ variables }).then(() => {
            this.products.pop();
        });
    }
}

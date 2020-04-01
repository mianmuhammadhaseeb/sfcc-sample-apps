/*
    Copyright (c) 2020, salesforce.com, inc.
    All rights reserved.
    SPDX-License-Identifier: BSD-3-Clause
    For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/BSD-3-Clause
*/
import { LightningElement, api, wire } from 'lwc';
import { useMutation, useQuery } from '@lwce/apollo-client';
import { GET_BASKET, REMOVE_ITEM_FROM_BASKET } from 'commerce/data';

export default class Basket extends LightningElement {
    products = [];
    loading = true;
    @api activeBasket;

    @wire(useQuery, {
        query: GET_BASKET,
        lazy: false,
    })
    getActiveBasket(response) {
        if (!response.loading && response.data && response.data.getBasket) {
            this.activeBasket = response.data.getBasket || [];
            this.shippingMethods = this.filterStorePickupShippingMethods(
                this.activeBasket.shippingMethods.applicableShippingMethods,
            );
            this.selectedShippingMethodId = this.activeBasket.selectedShippingMethodId;
            this.products = this.activeBasket.products;
            this.loading = false;
        }
    }

    get hasProducts() {
        return this.products.length > 0;
    }

    // Filter/Remove all Store Pickup Enabled Shipping Methods
    filterStorePickupShippingMethods(shippingMethods) {
        var filteredMethods = [];
        shippingMethods.forEach(shippingMethod => {
            if (!shippingMethod.c_storePickupEnabled) {
                filteredMethods.push(shippingMethod);
            }
        });
        return filteredMethods;
    }

    @wire(useMutation, {
        mutation: REMOVE_ITEM_FROM_BASKET,
    })
    removeItem;

    removeHandler(event) {
        const itemId = event.srcElement.getAttribute('data-itemid');
        const variables = { itemId };
        this.removeItem.mutate({ variables }).then(result => {
            result = itemId;
            console.log('results here: ', result);
        });
        this.loading = false;
    }
}

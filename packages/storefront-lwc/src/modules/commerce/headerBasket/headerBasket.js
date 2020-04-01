/*
    Copyright (c) 2020, salesforce.com, inc.
    All rights reserved.
    SPDX-License-Identifier: BSD-3-Clause
    For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/BSD-3-Clause
*/
import { LightningElement, wire } from 'lwc';
import { GET_BASKET } from 'commerce/data';
import { useQuery } from '@lwce/apollo-client';
/**
 * Header basket component that should show up in the header
 */
export default class HeaderBasket extends LightningElement {
    quantity = 0;
    activeBasket = [];
    listeners = [];

    @wire(useQuery, {
        query: GET_BASKET,
        lazy: false,
    })
    getActiveBasket(response) {
        if (!response.loading && response.data && response.data.getBasket) {
            this.activeBasket = response.data.getBasket || [];
            this.quantity = this.activeBasket.totalProductsQuantity || 0;
        }
    }

    updateBasketHandler() {
        this.quantity = this.activeBasket.totalProductsQuantity || 0;
    }
}

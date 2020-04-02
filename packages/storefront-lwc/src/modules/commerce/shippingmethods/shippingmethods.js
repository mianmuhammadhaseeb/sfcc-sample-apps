/*
    Copyright (c) 2020, salesforce.com, inc.
    All rights reserved.
    SPDX-License-Identifier: BSD-3-Clause
    For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/BSD-3-Clause
*/
import { LightningElement, api } from 'lwc';
// import { GET_BASKET } from 'commerce/data';
// import { useQuery } from '@lwce/apollo-client';

export default class ShippingMethods extends LightningElement {
    @api basket;
    @api shippingLabel;
    @api shippingMethods;
    @api selectedShippingMethodId;

    // shipmethBasket = [];

    // @wire(useQuery, {
    //     query: GET_BASKET,
    //     lazy: false,
    // })
    // getShipMethBasket(response) {
    //     if (!response.loading && response.data && response.data.getBasket) {
    //         console.log('response: ', response.data);
    //         this.shipmethBasket = response.data.getBasket || [];
    //         this.shippingMethods = this.shipmethBasket.shippingMethods;
    //         this.selectedShippingMethodId = this.shipmethBasket.selectedShippingMethodId;
    //         console.log(('basket - shippingMethods: ', this.shippingMethods));
    //     }
    // }

    connectedCallback() {
        // this.basket = Object.assign({}, this.basket);
        // this.shippingMethods = Object.assign({}, this.basket.shippingMethods);
        // console.log('basket - shippingMethods: ', this.shippingMethods);
        // this.selectedShippingMethodId = this.basket.selectedShippingMethodId;
        // this.viewShippingMethods();
    }

    newShippingMethod = e => {
        this.selectedShippingMethodId = e.target.value;
        const event = new CustomEvent('update-shipping-method', {
            detail: {
                shippingMethodId: this.selectedShippingMethodId,
            },
        });
        window.dispatchEvent(event);
    };

    get viewShippingMethods() {
        return this.shippingMethods.map(shippingMethod => ({
            ...shippingMethod,
            selected: shippingMethod.id === this.selectedShippingMethodId,
        }));
    }
}

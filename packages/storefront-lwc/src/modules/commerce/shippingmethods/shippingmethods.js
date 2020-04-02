/*
    Copyright (c) 2020, salesforce.com, inc.
    All rights reserved.
    SPDX-License-Identifier: BSD-3-Clause
    For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/BSD-3-Clause
*/
import { LightningElement, api, wire } from 'lwc';
import { UPDATE_BASKET } from 'commerce/data';
import { useMutation } from '@lwce/apollo-client';

export default class ShippingMethods extends LightningElement {
    @api basket;
    @api shippingLabel;
    @api shippingMethods;
    @api selectedShippingMethodId;

    @wire(useMutation, {
        mutation: UPDATE_BASKET,
    })
    updateBasket;

    updateShippingMethod(selectedShippingMethod) {
        const basketId = this.basket.basketId;
        const shipmentId = this.basket.shipmentId;
        const shippingMethodId = selectedShippingMethod;

        console.log('ship meth id: ', shippingMethodId);

        const variables = {
            basketId,
            shipmentId,
            shippingMethodId,
        };

        this.updateBasket.mutate({ variables }).then(() => {
            this.dispatchUpdateBasketEvent();
        });
    }

    newShippingMethod = e => {
        this.updateShippingMethod(e.target.value);
    };

    dispatchUpdateBasketEvent = () => {
        const event = new CustomEvent('updateshippingmethod', {
            detail: {
                updatedBasket: this.updateBasket.data.updateShippingMethod,
            },
        });
        this.dispatchEvent(event);
    };

    get viewShippingMethods() {
        return this.shippingMethods.map(shippingMethod => ({
            ...shippingMethod,
            selected: shippingMethod.id === this.selectedShippingMethodId,
        }));
    }
}

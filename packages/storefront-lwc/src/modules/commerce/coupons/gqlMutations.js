import gql from 'graphql-tag';

const basketQuery = `
    basketId
    customerId
    getBasketMessage
    totalProductsQuantity
    shipmentId
    shipmentTotal
    selectedShippingMethodId
    products {
        productId
        itemId
        quantity
        productName
        price
        image
        }
    orderTotal
    orderLevelPriceAdjustment {
        itemText
        price
    }
    shippingTotal
    shippingTotalTax
    taxation
    taxTotal
    couponItems {
        valid
        code
        couponItemId
        statusCode
    }
`;

export const ADDCOUPONMUTATION = gql`
    mutation submitCoupon($couponCode: String!) {
        addCouponToBasket(couponCode: $couponCode) {
            ${basketQuery}
        }
    }
`;

export const REMOVECOUPONMUTATION = gql`
    mutation removeCoupon($couponItemId: String!) {
        removeCouponFromBasket(couponItemId: $couponItemId) {
            ${basketQuery}
        }
    }
`;

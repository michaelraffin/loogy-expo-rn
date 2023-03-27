import { createContext, useContext } from 'react';

export enum Theme {
    Items = [],
    DeliveryDetails = {},
}

export type CartContextType = {
    Details: {cartItems:Theme.Items,deliveryOption:Theme.DeliveryDetails};
    updateCart: (Details:Theme) => void;
}

export const CartContextAction = createContext<CartContextType>({ Details:{cartItems:Theme.Items,deliveryOption:Theme.DeliveryDetails}, updateCart: Details => console.warn('no theme provider')});
export const cart = () => useContext(CartContextAction)
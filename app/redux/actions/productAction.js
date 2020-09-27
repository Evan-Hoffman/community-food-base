import { FETCH_PRODUCTS } from './types';
import { getProducts } from '../../data';

export const fetchProducts = () => dispatch => {
    const foods = getProducts();
     dispatch({
        type: FETCH_PRODUCTS,
        payload: foods
    })
}
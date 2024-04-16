import axios from "axios";
import { Product } from "./interface";

const baseURL = 'http://localhost:8081/api/v1'


const ClientCtr = {
    getAllProducts: () => axios.get(baseURL + '/product'),
    getProduct: (id: number) => axios.get(baseURL + '/product/' + id),
    saveProduct: (p: Product) => axios.post(baseURL + '/product', p),
    deleteProductsById: (arr: number[]) => axios.delete(baseURL + '/product', {data: arr}),
    getAllCategories: () => axios.get(baseURL + '/category'),
    getProductsByNameContaining: (key: string) => axios.get(baseURL + '/product?key=' + key),
    getAllEmployees: () => axios.get(baseURL + '/employee'),
    getAllSuppliers: () => axios.get(baseURL + '/supplier'),
    getAllStatuses: () => axios.get(baseURL + '/status'),
}

export default ClientCtr;
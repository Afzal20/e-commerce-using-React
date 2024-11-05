// FatchData.js

// API Endpoints

const API_ENDPOINTS = {
    "districts": "http://127.0.0.1:8000/api/districts/?format=json",
    "categories": "http://127.0.0.1:8000/api/categories/?format=json",
    "itemTypes": "http://127.0.0.1:8000/api/item-types/?format=json",
    "sizes": "http://127.0.0.1:8000/api/sizes/?format=json",
    "ratings": "http://127.0.0.1:8000/api/ratings/?format=json",
    "colors": "http://127.0.0.1:8000/api/colors/?format=json",
    "items": "http://127.0.0.1:8000/api/items/?format=json",
    "itemImages": "http://127.0.0.1:8000/api/item-images/?format=json",
    "itemSizes": "http://127.0.0.1:8000/api/item-sizes/?format=json",
    "itemColors": "http://127.0.0.1:8000/api/item-colors/?format=json",
    "carts": "http://127.0.0.1:8000/api/carts/?format=json",
    "orderItems": "http://127.0.0.1:8000/api/order-items/?format=json",
    "orders": "http://127.0.0.1:8000/api/orders/?format=json",
    "sliders": "http://127.0.0.1:8000/api/sliders/?format=json",
    "billingAddresses": "http://127.0.0.1:8000/api/billing-addresses/?format=json",
    "payments": "http://127.0.0.1:8000/api/payments/?format=json",
    "coupons": "http://127.0.0.1:8000/api/coupons/?format=json",
    "refunds": "http://127.0.0.1:8000/api/refunds/?format=json"
  };

// Exportable fetch functions for each API endpoint
const API = {
    fetchUsers: () => fetch(API_ENDPOINTS.users).then(res => res.json()),
    fetchDistricts: () => fetch(API_ENDPOINTS.districts).then(res => res.json()),
    fetchCategories: () => fetch(API_ENDPOINTS.categories).then(res => res.json()),
    fetchItemTypes: () => fetch(API_ENDPOINTS.itemTypes).then(res => res.json()),
    fetchSizes: () => fetch(API_ENDPOINTS.sizes).then(res => res.json()),
    fetchRatings: () => fetch(API_ENDPOINTS.ratings).then(res => res.json()),
    fetchColors: () => fetch(API_ENDPOINTS.colors).then(res => res.json()),
    fetchItems: () => fetch(API_ENDPOINTS.items).then(res => res.json()),
    fetchItemImages: () => fetch(API_ENDPOINTS.itemImages).then(res => res.json()),
    fetchItemSizes: () => fetch(API_ENDPOINTS.itemSizes).then(res => res.json()),
    fetchItemColors: () => fetch(API_ENDPOINTS.itemColors).then(res => res.json()),
    fetchCarts: () => fetch(API_ENDPOINTS.carts).then(res => res.json()),
    fetchOrderItems: () => fetch(API_ENDPOINTS.orderItems).then(res => res.json()),
    fetchOrders: () => fetch(API_ENDPOINTS.orders).then(res => res.json()),
    fetchSliders: () => fetch(API_ENDPOINTS.sliders).then(res => res.json()),
    fetchBillingAddresses: () => fetch(API_ENDPOINTS.billingAddresses).then(res => res.json()),
    fetchPayments: () => fetch(API_ENDPOINTS.payments).then(res => res.json()),
    fetchCoupons: () => fetch(API_ENDPOINTS.coupons).then(res => res.json()),
    fetchRefunds: () => fetch(API_ENDPOINTS.refunds).then(res => res.json())
};

export default API;

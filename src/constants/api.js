import {BASE_URL} from '../utils/globalVariables';

const api = {
  //universal apis
  upload_image: BASE_URL + 'fileUpload/upload',
  send_email: BASE_URL + 'emailVerification/sendEmail',
  verify_otp: BASE_URL + 'emailVerification/verifyOTP',

  // auth
  login: BASE_URL + 'customer/login',
  register: BASE_URL + 'customer/register_user',
  update_password: BASE_URL + 'customer/updatePassword',
  reset_password: BASE_URL + 'customer/resetPassword',
  update_verification_status: BASE_URL + 'customer/updateVerificationStatus',
  update_profile: BASE_URL + 'customer/updateProfile',
  get_customer_by_id: BASE_URL + 'customer/view_user_profile?customer_id=',
  forgetPassword: BASE_URL + 'customer/forgetPassword',
  otpVerification: BASE_URL + 'customer/otpVerification',
  delete_customer: BASE_URL + 'customer/deleteUser?customer_id=',
  

  // cart
  get_customer_cart: BASE_URL + 'cart_items/getCustomerCart?customer_id=',
  add_item_to_cart: BASE_URL + 'cart_items/addItemIntoCart',
  remove_item_from_cart: BASE_URL + 'cart_items/remove_item_from_cart',
  update_cart_item_quantity: BASE_URL + 'cart_items/updateCartItemQuantity',
  get_cart_items: BASE_URL + 'cart_items/getAllItemsInTheCart?cart_id=',
  //
  get_all_categories: BASE_URL + 'category/getAllCategories',

  //search
  search_restaurant_by_location:
    BASE_URL + 'searches/search_restaurants_by_nearby_location',

  //cuisine
  add_cuisine: BASE_URL + 'cuisine/addCuisine',
  update_cuisine: BASE_URL + 'cuisine/update',
  delete_cuisine: BASE_URL + 'cuisine/deleteCuisine/?cuisine_id=',
  get_all_cuisines: BASE_URL + 'cuisine/getAllCuisines?page=1&limit=10',
  get_cuisine_detail: BASE_URL + 'cuisine/getCuisineById?cuisine_id=',
  get_all_cuisine_by_restaurant:
    BASE_URL + 'cuisine/getAllCuisinesByRestaurant_id?restaurant_id=',

  //item
  add_item: BASE_URL + 'item/addItem',
  update_item: BASE_URL + 'item/update',
  get_all_items: BASE_URL + 'item/getAllItems',
  get_all_item_by_cuisine:
    BASE_URL + 'item/getAllItemsByCuisine_id?cuisine_id=',
  get_all_items_by_restaurant:
    BASE_URL + 'item/getAllItemsByRestaurantId?restaurant_id=',
  get_item_detail: BASE_URL + 'item/getItemByItemId?item_id=',
  delete_item: BASE_URL + 'item/deleteItem?item_id=',
  search_item: BASE_URL + 'item/searchItem?item_name=',

  //deals
  add_deal: BASE_URL + 'deals/createDeal',
  update_deal: BASE_URL + 'deals/updateDeal',
  delete_deal: BASE_URL + 'deals/deleteDeal?deal_id=',
  get_all_deals: BASE_URL + 'deals/getAllDeals',
  get_all_deals_by_restaurant:
    BASE_URL + 'deals/getDealsByrestaurant_id?restaurant_id=',
  get_deal_detail: BASE_URL + 'deals/getDeal?deal_id=',
  get_near_by_deals: BASE_URL + 'deals/getnearByDeals',
  search_deal_by_name: BASE_URL + 'deals/search?text=',
  //restaurant
  get_all_restaurants: BASE_URL + 'restaurant/getAllRestaurants',
  get_restaurant_detail:
    BASE_URL + 'restaurant/view_user_profile?restaurant_id=',
  get_restaurant_top_selling_items:
    BASE_URL + 'restaurant/getTopRestaurantItems?restaurant_id=',
  update_restaurant: BASE_URL + 'restaurant/updateProfile',
  get_near_by_restaurant: BASE_URL + 'restaurant/getByLocation',
  search_restaurant_by_name: BASE_URL + 'restaurant/search?text=',
  //restaurant rating
  rate_restaurant: BASE_URL + 'restaurant/addRating',
  get_restaurant_rating: BASE_URL + 'restaurant/getByRestaurant?restaurant_id=',

  // rider rating
  rate_rider: BASE_URL + 'riderRating/addRating',

  //promocodes
  get_all_promocodes: BASE_URL + 'promoCode/getAllPromoCodes?page=1&limit=10',
  get_all_promocodes_of_restaurant:
    BASE_URL + 'promoCode/AllPromoCodesOfRestaurant?restaurant_id=',
  accept_promocode: BASE_URL + 'promoCode/approveRequest',
  reject_promocode: BASE_URL + 'promoCode/reject_request',

  verify_promo_code: BASE_URL + 'promoCode/verifyPromoCode',

  //shipping address/location
  add_location: BASE_URL + 'location/addLocation',
  update_location: BASE_URL + 'location/updateLocation',
  get_location_by_id: BASE_URL + 'location/getLocation?location_id=',
  get_customer_location: BASE_URL + 'location/getLocationsOfCustomer?customer_id=',
    delete_location : BASE_URL + 'location/deleteLocation?location_id=',

  // order
  create_order: BASE_URL + 'orders/createOrder',
  get_all_order_by_customer_Id:
    BASE_URL + 'orders/getAllOrdersByCustomer_id?customer_id=',
  get_order_by_id: BASE_URL + 'orders/getById?order_id=',
  search_order_by_user: BASE_URL + 'orders/searchwithUser',
  update_order_status: BASE_URL + 'orders/updateOrderStatus',
  calculatePreOrder : BASE_URL + 'orders/calculatePreOrder',

  // favorites
  add_item_to_favorites: BASE_URL + 'favourites/addItem_to_favourites',
  add_deal_to_favorites: BASE_URL + 'favourites/addDeal_to_favourites',
  add_restaurant_to_favorites: BASE_URL + 'favourites/addRestaurant',

  get_all_favorite_items: BASE_URL + 'favourites/getAllFavouriteItems',
  get_all_favorite_deals: BASE_URL + 'favourites/getAllFavouriteDeals',
  get_all_favorite_restaurant:
    BASE_URL + 'favourites/getAllFavouriteRestaurants',

  delete_item_from_favorites:
    BASE_URL + 'favourites/deleteFavouriteItems?favourite_item_id=',
  delete_deal_from_favorites:
    BASE_URL + 'favourites/deleteFavouriteDeals?favourite_deal_id=',
  delete_restaurant_from_favorites:
    BASE_URL + 'favourites/deleteFavouriteRestaurants?favourite_restaurant_id=',

  // complaint
  add_complaint: BASE_URL + 'complaint/addComplaint',

  update_receive_notification_status:
    BASE_URL + 'customer/updateNotificationStatus',
  update_receive_emails_status: BASE_URL + 'customer/updateEmailStatus',

  // wallet
  create_customer_wallet: BASE_URL + 'wallet/createCustomerWallet',
  get_available_payment_of_customer:
    BASE_URL + 'wallet/getAvaliablePaymentsOfCustomer?customer_id=',
  add_payment_to_customer_wallet:
    BASE_URL + 'wallet/addPayment_customer_wallet',

  make_order_payment_for_customer: BASE_URL + 'wallet/makeCustomerOrderPayment',

  // refunded orders
  get_refunded_orders_of_customer:
    BASE_URL + 'refund/getByCustomer?customer_id=',

  // notifications
  get_all_notifications:
    BASE_URL + 'notifications/getNotificationCustomer?customer_id=',
  add_rider_notification: BASE_URL + 'notifications/addNotificationRider',
  add_restaurant_notification:
    BASE_URL + 'notifications/addNotificationRestaurant',

  // delivery charges
  get_delivery_charges: BASE_URL + 'deliveryCharges/getByRegion?region=',
  // get_platform_fee: BASE_URL + 'platformFees/getActiveByRegion?region=',
  get_platform_fee: BASE_URL + 'platformFees/get',

  //restaurant timings
  get_restaurant_timings:
    BASE_URL + 'restaurantTiming/getByRestaurant?restaurant_id=',

  // stripe card

  create_customer_stripe_card:
    BASE_URL + 'payment/getCustomerStripeId?customer_id=',
  get_customer_stripe_cards:
    BASE_URL + 'payment/getPaymentMethods?stripe_customer_id=',
  setup_stripe_card:
    BASE_URL + 'payment/getCustomerStripeCard?stripe_customer_id=',

    // Manage Locations
    get_all_locations: BASE_URL + 'location/getAllLocations',
    get_location_by_id: BASE_URL + 'location/getLocationById?location_id=',
    add_location: BASE_URL + 'location/addLocation',
    update_location: BASE_URL + 'location/updateLocation',
    delete_location: BASE_URL + 'location/deleteLocation?location_id=',

    // Manage Orders
    get_all_orders: BASE_URL + 'orders/getAllOrders',
    get_order_by_id: BASE_URL + 'orders/getById?order_id=',
    update_order_status: BASE_URL + 'orders/updateOrderStatus',
    get_order_items_by_order_id:
      BASE_URL + 'orders/getOrderItemsByOrderId?order_id=',

    // Manage Categories
    get_all_categories: BASE_URL + 'location/getLocationsOfCustomer?customer_id=',
    add_location: BASE_URL + 'location/addLocation',
    update_location: BASE_URL + 'location/updateLocation',
    delete_location: BASE_URL + 'location/deleteLocation?location_id=',
};

export default api;

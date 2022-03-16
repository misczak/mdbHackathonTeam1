
# OVERVIEW

The kiosk application simulates the functionality of an instore
kiosk. The kiosk would be used by store customers to place an order
in the store. 

The application is a node js application built upon realm and realm
sync. The application uses and syncs two collections:

 * catalogMenu - the product catalog of available products
 * Cart - the shopping cart built by a customer while shopping

All queries and operations are performed using the local realm
database so the kiosk will run in disconnected mode. This includes
queries to identify the available product categories, identify the
customers currently active shopping cart, etc.

The kiosk implements the following functionality:

* authenticates with realm
* uses realm sync to download the catalog
* kiosk watch mode that notifies users when the product catalog changes
* Browse items by category (categories are dynamically calculated via
realm DB queries based upon the catalog data)
* you can select an item and put it in the shopping cart
the shopping carts are in the Carts collection
you can checkout. All checkout does it mark the cart at complete so the next time you start shopping it will create a new cart.
This means that the entire order history is Atlas and the kiosk will not lose any data across reboots or restarts.. Also, it will work in disconnected mode.

# SETUP




# DEMONSTRATION INSTRUCTIONS

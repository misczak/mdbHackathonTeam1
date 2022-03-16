
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

* Authenticates with realm
* Uses realm sync to download the catalog
* Kiosk watch mode that notifies users when the product catalog
  changes (items become unavailable)
* Browse items by category (categories are dynamically calculated via
realm DB queries based upon the catalog data)
* Add item in shopping cart (carts synced to Atlas Carts collection)
* Checkout. Checkout marks the cart as complete so the next time you
start shopping you begin with a new cart. (The entire order history is
Atlas and the kiosk will not lose any data across reboots or restarts.
* Works in disconnected mode and resyncs when connectivity is
  restored. 

# SETUP/INSTALLATION

## Prerequistes

Install the lastest versions of:

* nodejs
* realm-cli

## Install Realm Backend

1. Create a project API Key
2. Login into realm: `realm-cli login --api-key <public API key>
   --private-api-key <private API key>`
3. Got to backend directory: `cd <installationDir>/kiosk/realmBackend`
4. Create realm-app in Atlas: `realm-cli push`
5. In the Atlas interface, go to the Realm tab and note the
   application id of the app called 'realmcli'


## Install Kiosk App

1. Go to the kiosk app directory: `<installationDir>/kiosk/kioskapp`
2. Install nodejs dependencies: `npm install`
3. Edit config.js and entire the realm application id from step #5
   above. 
4. Start the kiosk app: `node index.js`


# DEMONSTRATION INSTRUCTIONS

## Kiosk Application Overview

When you start the kiosk application it will ask you to login. If this
is the first time you are using the app, register as a new user. Going
forward, you can log in using the user name and password you create in
the registration step. (Registration creates realm application users.)

The Kiosk Application consists of a set of hierarchical menus. The
main menu contains four items:

1. Review Shopping Cart/Checkout
2. Add Item to Cart
3. Turn On Catalog Change Notifications
4. Log out/Quit

### Review Shopping Cart/Checkout

This menu item displays the current shopping cart as a table. If you
checkout, then the cart is marked as complete. When you start shopping
the kiosk will create a new shopping cart. The users complete history
of carts is stored in the Atlas Cart collection.

### Add Item to Cart

This menu item enables a user to add items to their cart. It begins by
displaying a list of product categories to the user. The list of
product categories is built from the product catalog synced with Atlas
and uses Realm queries to identify the list of categories.

After a user selects a category, the list of available products in
that category is shown. The product availability is dependent upon the
global and store level availability settings. Availability is
calculated using realm queries.

When a user selects a product it is added to the shopping cart.


### Turn On Catalog Change Notifications

The Kiosk provides the ability to notify users when items become
available or unavailable. When this menu item is selected, the
notification functionality is turned on.

The notifications are displayed in white on the bottom line of the
Kiosk UI.


### Log out/Quit
Quits application.

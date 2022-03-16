# mdbHackathonTeam1

# Details

**Project** : Bodega Buddy 
**Team Number** : 1  
**Team Name** : Menu Maniacs  
**Demonstration Video** : https://github.com/misczak/mdbHackathonTeam1/blob/main/BodegaBuddyDemo.mp4  

# Overview

Bodega Buddy is a real-time inventory management system that allows kiosks to sync with Global headquarters and local stores for checking item availability.

# Justification

_Please explain why you decided to build the application/demonstration for this project. What inspired you? What problems does it solve or how will it make Presales activities easier?_

The demo created during this hackathon very closely emulates a current engagement one of our SAs has with a very large nationwide bodega or convenience store chain. It shows how MDB quickly and easily solves the challenges that many of these brick and mortar companies face when it comes to large distribution centers and real time availability from there to their stores and customer’s shopping carts.
It has been developed and designed in a way which can be easily reusable for other demos in the future with clear set up and configuration instructions.

_What MongoDB competitive differentiators (developer productivity, resiliency, scalability, etc.) does this demonstration showcase?_

Not only was Bodega Buddy designed and developed in a rapid pace within the 50 hour hackathon window, but it clearly shows many of MDBs latest technologies that enhance its core capabilities. With Realm sync, real time updates are reflected within the Realm database installed on the self-service kiosk at the current store. Additionally, Atlas Search allows for fuzzy, autocomplete full text search within the Global HQ app to quickly find items to mark as out-of-stock or in-stock. Furthermore, Atlas Search Geo was used to find stores close to a zip code specified by the GlobalHQ app user, so that they don’t have to memorize every store ID they are responsible for. The GlobalHQ App was built to operate entirely on MongoDB Realm App Services. The frontend is hosted as two static files, and all of the backend logic uses Realm Web SDK and Realm Functions. There is no application server involved to run this demo.


# Detailed Application Overview

_Describe the architecture of your application and include a diagram._

_List all the MongoDB components/products used in your demonstration._
_Describe what you application does and how it works_

![hackathonArchitecture](https://user-images.githubusercontent.com/45085638/158649880-9e1781a8-2b0f-4375-9c9a-07f83d0bb4d8.png)

## Products Used

This project uses the following MongoDB products and features:

* Atlas Search (Fuzzy Search, Autocomplete, Highlighting, GeoWithin)
* Realm Sync
* Realm App Services (Functions, Static Hosting)

## How It Works

There are three major components to this application: the Atlas cluster, the GlobalHQ web application, and the Kiosk app. 

The main Atlas cluster has two collections: catalogMenu and storeCatalog. 

The catalogMenu collection holds each unique menu item that can be ordered in a store, including its product ID, its category, 
its price, its ingredients, a brief description, and its current status - whether it is "in stock" or "out of stock" 
for the entire company.

The storeCatalog collection has a document for each individual store in the chain, with GeoJSON coordinates to represent 
its real world location. It also has an array of menu items that can be ordered in each store. A menu item's availability can be
changed unique to only a single store, in addition to the global availability. 

The GlobalHQ web application is the frontend for the admin functionality that the chain's headquarters will have access to. They can look 
up a menu item using Atlas Search and mark the item as unavailable across the board - in the case of a seasonal menu change or a particular
item being discontinued. The web applicaton also allows an admin user to look for stores close to a specified zip code and mark an item as either available
or unavailable for that particular store, in the event that a delivery is delayed or they are experiencing a shortage of ingredients. The web 
application is comprised of two static files hosted on Realm that make use of the Realm Web SDK and Realm functions to interact with the database. There is no usage
of an application server or MongoDB driver. 

The Kiosk app is built using the Realm NodeJS SDK and Realm Sync. This app represents the Kiosk interface that an in-store customer would see. They can add items to an order
and also get notified in real-time as items go in or out of stock. If an item is out of stock for the store that the customer is using the kiosk from, it will no longer appear
 in the menu for a customer to select, which will prevent confusion and customer service associates from having to cancel out orders after the fact. Every time the menu is navigated, the kiosk is only querying the local Realm database, instead of making a web request to Atlas.  

# Roles and Responsibilities

* Andrew Chaffin - Collection schema development
* Jay Runkel - Kiosk Application, Realm NodeJS application and Realm sync
* John Misczak - GlobalHQApp front end and Realm function logic
* Kamron Abtahi - Catalog Data generation, Data cleaning, Testing
* Rory Pruvot - Atlas Search Indexes and Geo Queries, Store Catalog Data Generation
* Samadnya Kalaskar -  Atlas Cluster management, Catalog Data modeling, Store Catalog Data cleaning

# Demonstration Script

## Setup

### GlobalHQ App

#### 1. Setup Atlas Cluster

Create an M10 Atlas cluster in us-east-1 (Virginia) and import the data. Create a database called `bodega_buddy`. Import the individual `.json` files from this 
repository into Atlas and create the following search indexes: 

##### Search Index 'menu_item'
Collection: catalogMenu
```json
{
  "mappings": {
    "dynamic": false,
    "fields": {
      "description": [
        {
          "type": "string"
        },
        {
          "type": "autocomplete"
        }
      ],
      "menuItemName": [
        {
          "type": "string"
        },
        {
          "type": "autocomplete"
        }
      ]
    }
  }
}
```

##### Search Index 'store_location'
Collection: storeCatalog
```json
{
  "mappings": {
    "dynamic": false,
    "fields": {
      "location": [
        {
          "dynamic": true,
          "type": "document"
        },
        {
          "indexShapes": true,
          "type": "geo"
        }
      ]
    }
  }
}
```



#### 2. Install `mongodb-realm-cli`

You can import the ready-made MongoDB Realm backend using the
`mongodb-realm-cli`, which you can install with npm:

```bash
npm install -g mongodb-realm-cli
```

#### 3. Sign up for a Mapbox API Key

This app uses Mapbox's places API to geocode a zipcode into a set of coordinates. Mapbox allows
 for 100,000 free requests, which should be enough for a demo. Sign up for an account and write down 
 the API Key you generate. 

#### 4. Clone this repository and insert Mapbox API Key

You will need to clone this repository to setup a local copy that can be used to import into Realm.
This can be done with the command:

```bash
git clone https://github.com/misczak/mdbHackathonTeam1
```

Once it is cloned, navigate to the GlobalHQApp/hosting/files and modify `index.html`. On line 234, 
replace `<INSERT MAPBOX ACCESS TOKEN HERE>` with the value of your Mapbox API key obtained in Step 2.

#### 5. Create an API Key and authenticate the CLI

To authenticate with the `realm-cli`, you must create an API key with **Project
Owner** permissions for your project in the **Project Access Manager** view.
Click the **Access Manager** at the top of the Atlas view to find it. Please
follow the [instructions on the MongoDB documentation
site](https://docs.mongodb.com/realm/deploy/realm-cli-reference/#authenticate-a-cli-user)
for more information.

Once created, pass the API keys to `realm-cli login` to log in:

```bash
realm-cli login --api-key=[public API key] --private-api-key=[private API key]
```

#### 6. Import the Realm backend app

If logged in successfully, you can now import the app. Start in the root directory of the local copy 
of the repository and run:

```bash
cd GlobalHQApp
realm-cli push
```

Follow the prompts and wait for the app to deploy.

You should now have a GlobalHQApp Realm application in your Atlas project. There should be two static
files imported under Hosting (index.html and css/styles.css) as well as six Realm functions. emonstration script should provide all the information required for another MongoDB SA to deliver your demonstration to a prospect. This should include:_


# Kiosk App Overview

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

The 3-minute demonstrate script consists of the following steps:

1. Give a quick tour of kiosk application to show how you can browse
   product categories, add items to the shopping cart, review the
   shopping items, etc. While you are navigating the app you should
   visit the "Danish" category and point out that "Strawberry
   Cheesecake" is currently available, but rumored to be in short
   supply due to a cream cheese shortage.  
2. Switch to the corporate app in a browser and search for
   "cheese". Point out the autocompletion and the highlighting in the
   product names. Tile the kiosk window and the browser window so that
   the kiosk window is visible. Make "Strawberry Cheesecake" globally
   unavailalbe. You should see a notification in the Kiosk app stating
   that the cheesecake is no longer available. If you mark it
   available, you will see a second notification in the kiosk. This
   shows the real-time sync capabilties of realm sync.
3. In the corporate app, enter 10019 in the zip code box for
   "Strawberry Cheesecake". This feature uses Atlas Search Geosearch
   to find the stores close to the zip code 10019. To the right of the
   zip code box, select 
   store 4927. Mark cheese case as being unavailable in store 4927. (It
   should be marked as globally available.)
4. Go back to the realm kiosk and try to purchase "Strawberry
   Cheesecake" under the "Pastries" category. It will not be
   listed. (If you go back to the corporate app and mark it available
   in store 4927, then it will show up in the Kiosk.)
5. The app was built using Realm App services. If you go to the realm
   tab in Atlas you will see to Realm applications: one for the
   corporate app and one for the kiosk. If you navigate to the
   corporate realm app and go to functions, you can review the search
   aggregation pipelines used to implement the corporate app.
   

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


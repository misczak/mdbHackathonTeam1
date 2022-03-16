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

The demo created during this hackathon very closely emulates a current engagement one of our SAs has with a very large nationwide bodega or convenance store chain. It shows how MDB quickly and easily solves the challenges that many of these brick and mortar companies face when it comes to large distribution centers and real time availability from there to their stores and customer’s shopping carts.
It has been developed and designed in a way which can be easily reusable for other demos in the future with clear set up and configuration instructions.

_What MongoDB competitive differentiators (developer productivity, resiliency, scalability, etc.) does this demonstration showcase?_

Not only was Bodega Buddys designed and developed in a rapid pace within the 50 hour hackathon window, but it clearly shows many of MDBs latest technologies that enhance its core capabilities. With Realm sync, real time updates are reflected within the Realm database installed on the self-service kiosk at the current store. Additionally, Atlas Search allows for fuzzy, autocomplete full text search within the Global HQ app to quickly find items to mark as out-of-stock or in-stock. Furthermore, Atlas Search was used to find stores close to a zip code specified by the GlobalHQApp user, so that they don’t have to memorize every store ID they are responsible for. The GlobalHQ App was built to operate entirely on MongoDB Realm App Services. The frontend is hosted as two static files, and all of the backend logic uses Realm Web SDK and Realm Functions. There is no application server involved to run this demo.


# Detailed Application Overview

_Describe the architecture of your application and include a diagram._

_List all the MongoDB components/products used in your demonstration._
_Describe what you application does and how it works_

![hackathonArchitecture](https://user-images.githubusercontent.com/45085638/158649880-9e1781a8-2b0f-4375-9c9a-07f83d0bb4d8.png)

# Roles and Responsibilities

* Andrew Chaffin - Collection schema development
* Jay Runkel - Kiosk Application, Realm NodeJS application and Realm sync
* John Misczak - GlobalHQApp front end and Realm function logic
* Kamron Abtahi - Catalog Data generation, Data cleaning, Testing
* Rory Pruvot - Atlas Search Indexes and Geo Queries, Store Catalog Data Ingestion
* Samadnya Kalaskar -  Atlas Cluster management, Catalog Data modeling, Store Catalog Data cleaning

# Demonstration Script

## Setup

### GlobalHQ App

#### 1. Install `mongodb-realm-cli`

You can import the ready-made MongoDB Realm backend using the
`mongodb-realm-cli`, which you can install with npm:

```bash
npm install -g mongodb-realm-cli
```

#### 2. Sign up for a Mapbox API Key

This app uses Mapbox's places API to geocode a zipcode into a set of coordinates. Mapbox allows
 for 100,000 free requests, which should be enough for a demo. Sign up for an account and write down 
 the API Key you generate. 

#### 3. Clone this repository and insert Mapbox API Key

You will need to clone this repository to setup a local copy that can be used to import into Realm.
This can be done with the command:

```bash
git clone https://github.com/misczak/mdbHackathonTeam1
```

Once it is cloned, navigate to the GlobalHQApp/hosting/files and modify `index.html`. On line 234, 
replace `<INSERT MAPBOX ACCESS TOKEN HERE>` with the value of your Mapbox API key obtained in Step 2.

#### 4. Create an API Key and authenticate the CLI

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

#### 5. Import the Realm backend app

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


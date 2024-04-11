# e-commerce-apis

## Getting Started

To run the project locally, follow these steps:

1. Clone the repository:

   ```bash
   git clone https://github.com/manishv2-0/e-commerce-apis.git

   ```

2. Install dependencies for all service folders:
   ```bash
    cd users-app
    npm install
    cd ../product-service
    npm install
    cd ../order-service
    npm install
    cd ..
    npm install

   ```
3. Set up environment variables:
   In the customer-service and product-service directories, find .env file and define the following variables:
   URI=<your-mongodb-uri>

4. Running the Services
   To start each service, run the following commands:
   cd users-app
   npm start
   cd ../product-service
   npm start
   cd ../order-service
   npm start
   cd ..
   npm start

## Usage

    Once the services are running, you can interact with them using HTTP requests. Here are the available endpoints:

    Customer(User) Service:
     http://localhost:8000/users/signup
     http://localhost:8000/users/signin
     http://localhost:8000/users/profile
     http://localhost:8000/users/profile
     http://localhost:8000/users/logout

    Product Service:
    http://localhost:8000/products
    http://localhost:8000/products/add-product
    http://localhost:8000/products/update-product/:productId
    http://localhost:8000/products/delete-product/:productId

    Order Service:
    http://localhost:8000/orders/add-order
    http://localhost:8000/orders
    http://localhost:8000/orders/:status
    http://localhost:8000/orders/get-order/:orderid
    http://localhost:8000/orders/update-order

    For a detailed guide on how to use each endpoint and their expected responses, refer to the Postman collection included in this repository: MICSER.postman_collection.json.
    Additionally, screenshots are api response are also included in this repository : SS.zip .

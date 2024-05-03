<h1 align="center">Simple & Basic Get Contracts APP </h1>
This is a very basic example of getting Contracts from Clients and getting some Job in Node.js and express framework . I have applied REST based API recommendations and my custom architecture .

I have also used eslint | prettier modules for finding and fixing problems/linting issues in my code .

As per business needs i have written basic cache lock mechanism for one API using redis cache.

I will write basic test cases(will update Readme) using testing framework Jest https://jestjs.io/ .


### Built With :

nodeJs , expressJs , redis-cache, Postman, jest, eslint etc


Getting Started :

i have use node version v16.15.0  & npm verion 8.5.5 .

### Prerequisites:

npm

Clone the repo  and checkout to anzar-solution branch & take git pull .

Install NPM packages

npm install ( npm i )

type nodemon in terminal

open your postman(preferred) 

And type: localhost:8000

My Postman API collection public link below : 
https://www.postman.com/gladiator-dev/workspace/anzar-dev/collection/5511458-04cfd33b-d038-4b42-85a7-9b4226dece26?action=share&creator=5511458


### API's :
Below is a list of the required API's for the application.

1. **_GET_** `/contracts/:id` - it should return the contract only if it belongs to the profile calling. better fix that!

1. **_GET_** `/contracts` - Returns a list of contracts belonging to a user (client or contractor), the list should only contain non terminated contracts.

1. **_GET_** `/jobs/unpaid` - Get all unpaid jobs for a user (**_either_** a client or contractor), for **_active contracts only_**.

1. **_POST_** `/jobs/:job_id/pay` - Pay for a job, a client can only pay if his balance >= the amount to pay. The amount should be moved from the client's balance to the contractor balance.

1. **_POST_** `/balances/deposit/:userId` - Deposits money into the the the balance of a client, a client can't deposit more than 25% his total of jobs to pay. (at the deposit moment)

1. **_GET_** `/admin/best-profession?start=<date>&end=<date>` - Returns the profession that earned the most money (sum of jobs paid) for any contactor that worked in the query time range.

1. **_GET_** `/admin/best-clients?start=<date>&end=<date>&limit=<integer>` - returns the clients the paid the most for jobs in the query time period. limit query parameter should be applied, default limit is 2.



if you want to change environment variables <here i have pushed my .env file too>

Contact Anzar Malik - anzarmalikcse@gmail.com

# Backend

## Installation

Run `npm install`, and then create an `.env` file in this root directory,
with the following contents:

```
host=...
user=...
password=...
database=...
```

## Running

To run the server, type `npm start`.

## API Documentation

All requests should be sent to http://localhost:3000

### Users

- POST `/register` (first_name: string, last_name: string, email: string, phone: string, password: string, location: string, is_deliverer: boolean)
- POST `/login` (email: string, password: string)
- POST `/logout`

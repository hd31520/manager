# Karkhana.shop - Setup Guide

## Prerequisites

- Node.js 18+ installed
- MongoDB installed and running (or MongoDB Atlas account)
- npm or yarn package manager

## Installation Steps

### 1. Install Server Dependencies

```bash
cd server
npm install
```

### 2. Install Client Dependencies

```bash
cd ../client
npm install
```

### 3. Environment Variables Setup

#### Server Environment Variables

Create a `.env` file in the `server` directory:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# MongoDB Configuration
MONGODB_URI=mongodb://localhost:27017/karkhana-shop
# Or use MongoDB Atlas:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/karkhana-shop

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRE=24h
JWT_REFRESH_SECRET=your-refresh-secret-key
JWT_REFRESH_EXPIRE=7d

# Frontend URL
FRONTEND_URL=http://localhost:5173

# Email Configuration (SMTP) - Optional
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password

# Cloudinary Configuration (for image uploads) - Optional
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

# Stripe Configuration (for payments) - Optional
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key

# Razorpay Configuration (alternative payment gateway) - Optional
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret

# App Name
APP_NAME=Karkhana.shop
```

#### Client Environment Variables

Create a `.env` file in the `client` directory:

```env
VITE_API_URL=http://localhost:5000/api
```

### 4. Start MongoDB

Make sure MongoDB is running:

```bash
# If using local MongoDB
mongod

# Or if using MongoDB as a service
sudo systemctl start mongod
```

### 5. Run the Application

#### Start Server (Terminal 1)

```bash
cd server
npm run dev
```

The server will start on `http://localhost:5000`

#### Start Client (Terminal 2)

```bash
cd client
npm run dev
```

The client will start on `http://localhost:5173`

## Quick Start (Minimal Setup)

For quick testing, you only need:

1. MongoDB connection string
2. JWT_SECRET (any random string)

Example minimal `.env` for server:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/karkhana-shop
JWT_SECRET=my-secret-key-12345
FRONTEND_URL=http://localhost:5173
```

## Testing the API

Once the server is running, test the health endpoint:

```bash
curl http://localhost:5000/api/health
```

You should get:
```json
{"status":"OK","message":"Server is running"}
```

## Common Issues

### MongoDB Connection Error

- Make sure MongoDB is running
- Check your MONGODB_URI is correct
- For MongoDB Atlas, whitelist your IP address

### Port Already in Use

- Change the PORT in `.env` file
- Or kill the process using the port:
  ```bash
  # Linux/Mac
  lsof -ti:5000 | xargs kill
  
  # Windows
  netstat -ano | findstr :5000
  taskkill /PID <PID> /F
  ```

### Module Not Found Errors

- Make sure you've run `npm install` in both server and client directories
- Delete `node_modules` and `package-lock.json`, then run `npm install` again

## Next Steps

1. Create your first admin user (you'll need to do this manually in MongoDB or create a seed script)
2. Register a company through the API
3. Start adding workers, products, etc.

## API Documentation

Once the server is running, you can test the API endpoints:

- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login
- `GET /api/companies` - Get companies (requires auth)
- And many more...

Check the routes files in `server/src/routes/` for all available endpoints.


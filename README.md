# 🌾 FarmConnect 

FarmConnect is a full-stack platform that directly connects farmers and consumers, enabling a simple, transparent, and efficient farm-to-home delivery experience.

---

## 📘 1. Overview

FarmConnect bridges the gap between producers and consumers by providing:

- Direct product listing by farmers
- Fresh produce delivered to consumers
- Real-time chat & notifications
- Easy checkout and order tracking

### User Roles

The system supports two distinct user roles:

- **Consumer** – Browse, order, chat, and track deliveries
- **Farmer** – Add products, manage orders, and communicate with buyers

---

## 🎯 2. Goals

### ✔ Primary Goals

- Allow farmers to sell directly to consumers
- Enable consumers to access fresh, local produce
- Provide simple tools for product and inventory management
- Enable seamless real-time communication
- Deliver a clean and intuitive shopping experience

### ✔ Secondary Goals

- Consumer and farmer dashboards
- Order analytics
- Notification system
- Location-based product discovery

---

## 👥 3. Target Users

### 🛒 Consumers

- Want fresh farm produce delivered directly
- Prefer transparent pricing and direct communication
- Seek reliable and convenient shopping experience

### 🚜 Farmers

- Need a platform to sell online
- Need simple order and product management tools
- Want direct access to buyers without middlemen

---

## 🧩 4. Core Features

### 4.1 Authentication

- Register/Login with JWT
- Role-based access control
- Secure session handling

### 4.2 Product Management

#### Farmer Capabilities

- Add products to catalog
- Edit and delete products
- Upload product images
- Manage stock levels and pricing

#### Consumer Capabilities

- Browse all available products
- View detailed product information
- Filter and search products
- View farmer profile and information

#### Product Fields

```
name, pricePerUnit, description, category, stock, farmerId, images, rating, location
```

### 4.3 Cart & Checkout

- Add/remove products from cart
- Update product quantities
- View price summary and totals
- Persistent cart (localStorage + context)
- Secure order placement
- Payment provider integration (Razorpay)

### 4.4 Orders

#### Order Stages

```
pending → paid → preparing → out_for_delivery → delivered → cancelled
```

#### Consumer Capabilities

- Create and place orders
- Cancel orders (if applicable)
- Track order status in real-time

#### Farmer Capabilities

- View all incoming orders
- Update order status
- Accept or reject orders

### 4.5 Real-Time Chat (Socket.io)

- One-to-one messaging between farmer and consumer
- Message delivery and seen status tracking
- Live push notifications
- Chat history stored in MongoDB

### 4.6 Dashboard & Analytics

#### 📊 Consumer Dashboard

- View active orders
- Access past order history
- Receive recommended products
- Save favorite items

#### 📈 Farmer Dashboard

- Track total sales
- Monitor total revenue
- View orders by status
- See count of products listed

### 4.7 Notifications

- Real-time order status updates
- Chat message notifications
- In-app live alerts

---

## 🛠 5. Tech Stack

### Frontend

- **React** (Vite) – Modern UI library with fast build tooling
- **Tailwind CSS** – Utility-first CSS framework
- **Context API** – State management
- **Socket.io Client** – Real-time communication
- **Lucide Icons** – Icon library

### Backend

- **Node.js / Express** – Server runtime and framework
- **MongoDB + Mongoose** – NoSQL database and ODM
- **Socket.io Server** – Real-time event handling
- **Cloudinary** – Image storage and optimization (optional)
- **JWT** – Secure authentication

---

## 🔐 6. Non-Functional Requirements

| Requirement | Description |
|-------------|-------------|
| **Performance** | Fast product loading, optimized database queries |
| **Security** | JWT authentication, input validation, role-based access checks |
| **Scalability** | Modular architecture, socket layer abstraction |
| **Availability** | Minimal downtime, robust error handling |
| **UI/UX** | Clean design, minimal interface, mobile-friendly responsive layout |

---

## 🚀 7. Future Enhancements

- AI-powered personalized product recommendations
- GPS-based live delivery tracking
- Digital wallet and UPI payment options
- Farmer verification and trust badges
- Admin dashboard for platform management
- Reviews and ratings system
- Subscription-based recurring orders

---

## 📝 8. Acceptance Criteria

- **Consumer Flow**: Consumer can browse products → add to cart → place order → chat with farmer → track order
- **Farmer Flow**: Farmer can add products → manage stock → update order status → communicate with buyers
- **Real-Time Features**: Chat and notifications work seamlessly via Socket.io
- **Analytics**: Dashboard displays accurate and up-to-date statistics
- **Responsiveness**: Platform works smoothly on both mobile and desktop devices
- **Error Handling**: Graceful error messages for failed operations
- **Loading States**: Clear loading indicators during async operations

---

## 📦 Getting Started

### Prerequisites

- Node.js (v14+)
- npm or yarn
- MongoDB instance
- Razorpay account (for payments)

### Installation

1. Clone the repository
   ```bash
   git clone <repository-url>
   cd farmconnect
   ```

2. Install backend dependencies
   ```bash
   cd server
   npm install
   ```

3. Install frontend dependencies
   ```bash
   cd client
   npm install
   ```

### Environment Variables

Create `.env` files for both backend and frontend with necessary configurations:

**Backend** (`.env`)
```
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
RAZORPAY_KEY_ID=your_razorpay_key
RAZORPAY_KEY_SECRET=your_razorpay_secret
CLOUDINARY_URL=your_cloudinary_url (optional)
PORT=5000
```

**Frontend** (`.env`)
```
VITE_API_URL=http://localhost:5000
VITE_SOCKET_URL=http://localhost:5000
```

### Running the Application

1. Start the backend server
   ```bash
   cd server
   npm run server
   ```

2. Start the frontend development server
   ```bash
   cd client
   npm run dev
   ```

3. Open your browser and navigate to `http://localhost:5173`

---

## 🤝 Contributing

We welcome contributions to FarmConnect! Please follow these guidelines:

1. Create a feature branch (`git checkout -b feature/your-feature`)
2. Make your changes and commit (`git commit -m 'Add your feature'`)
3. Push to the branch (`git push origin feature/your-feature`)
4. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License – see the LICENSE file for details.

---

## 💬 Support

For questions or issues, please open an issue on GitHub or contact the development team.

---

## 🌟 Vision

FarmConnect empowers farmers to reach customers directly, eliminating unnecessary intermediaries while ensuring consumers get the freshest produce at fair prices. Together, we're building a more sustainable and transparent food supply chain.

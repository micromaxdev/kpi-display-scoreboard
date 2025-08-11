# KPI Display Scoreboard - Backend API

A powerful and flexible Node.js/Express REST API designed for dynamic MongoDB collection access with advanced querying, pagination, and filtering capabilities. Built specifically for KPI dashboards and data visualization applications.

## 🚀 Features

- **🔄 Dynamic Collection Access**: Query any MongoDB collection without predefined schemas
- **📊 Advanced Filtering**: Support for MongoDB operators and complex queries
- **📄 Smart Pagination**: Built-in pagination with metadata and performance optimization
- **🔍 Flexible Sorting**: Multi-field sorting with ascending/descending order
- **📅 Intelligent Date Handling**: Automatic date format normalization and filtering
- **⚡ Performance Optimized**: Lean queries, model caching, and efficient indexing
- **🛠️ RESTful Design**: Clean, intuitive API endpoints
- **🔒 Error Handling**: Comprehensive error handling and validation
- **📋 Schema Discovery**: Automatic collection and field discovery

## 📋 Table of Contents

- [Quick Start](#quick-start)
- [API Endpoints](#api-endpoints)
- [Advanced Filtering](#advanced-filtering)
- [Date Handling](#date-handling)
- [Response Formats](#response-formats)
- [Architecture](#architecture)
- [Development](#development)
- [Deployment](#deployment)

## 🚀 Quick Start

### Prerequisites

- **Node.js** v16 or higher
- **MongoDB** 4.4 or higher
- **Yarn** package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/micromaxdev/kpi-display-scoreboard.git
   cd kpi-display-scoreboard/backend
   ```

2. **Install dependencies**
   ```bash
   yarn install
   ```

3. **Environment Configuration**
   Create a `.env` file in the root directory:
   ```env
   # Database Configuration
   MONGO_URI=mongodb://localhost:27017/kpi_scoreboard
   
   # Server Configuration
   PORT=5000
   NODE_ENV=development
   
   # Optional: Email Configuration (if using email features)
   EMAIL_HOST=smtp.gmail.com
   EMAIL_PORT=587
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASS=your-app-password
   ```

4. **Start the server**
   ```bash
   # Development mode (with auto-reload)
   yarn dev
   
   # Production mode
   yarn start
   ```

5. **Verify installation**
   ```bash
   curl http://localhost:5000
   # Expected response: {"message": "Hello World! Welcome to the API"}
   ```

## 🛠️ API Endpoints

### 📊 Collection Data Operations

#### 1. Get Paginated Collection Data
```http
GET /api/find/:collectionName
```

**Description**: Retrieve paginated data from any MongoDB collection with advanced filtering and sorting.

**Parameters**:
| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `page` | number | 1 | Page number (1-based) |
| `limit` | number | 50 | Documents per page (limit = 0 Get all)|
| `sortBy` | string | '_id' | Field to sort by |
| `sortOrder` | string | 'desc' | Sort direction ('asc' or 'desc') |
| `[fieldName]` | any | - | Field-specific filters (supports MongoDB operators) |

**Examples**:
```bash
# Basic pagination
GET /api/find/users?page=1&limit=20

# Sorted by creation date
GET /api/find/tasks?sortBy=createdAt&sortOrder=asc

# Filtered by status
GET /api/find/orders?status=completed&sortBy=totalAmount&sortOrder=desc
```

**Response**:
```json
{
  "success": true,
  "data": [
    {
      "_id": "64f1234567890abcdef12345",
      "name": "John Doe",
      "email": "john@example.com",
      "status": "active",
      "createdAt": "2024-08-09T10:30:00.000Z",
      "updatedAt": "2024-08-09T10:30:00.000Z"
    }
  ],
  "pagination": {
    "currentPage": 1,
    "totalPages": 5,
    "totalDocuments": 250,
    "limit": 50,
    "hasNextPage": true,
    "hasPrevPage": false
  },
  "collectionName": "users"
}
```

#### 2. Get Collections List
```http
GET /api/collectionList
```

**Description**: Retrieve all available collections in the database.

**Response**:
```json
{
  "success": true,
  "collections": [
    "users",
    "tasks",
    "projects", 
    "orders",
    "analytics"
  ],
  "totalCollections": 5
}
```

#### 3. Get Collection Schema
```http
GET /api/collectionFields/:collectionName
```

**Description**: Discover field names and structure of a collection by analyzing sample documents.

**Response**:
```json
{
  "success": true,
  "fields": [
    "_id",
    "name",
    "email", 
    "status",
    "priority",
    "dueDate",
    "createdAt",
    "updatedAt"
  ],
  "collectionName": "tasks"
}
```

## 🔍 Advanced Filtering

The API supports the full range of MongoDB query operators for sophisticated data filtering.

### Comparison Operators

```bash
# Greater than
GET /api/find/products?price={"$gt":100}

# Less than or equal to
GET /api/find/users?age={"$lte":65}

# Not equal to
GET /api/find/tasks?status={"$ne":"cancelled"}

# Range queries
GET /api/find/orders?totalAmount={"$gte":50,"$lte":500}
```

### Array and Inclusion Operators

```bash
# Value in array
GET /api/find/users?role={"$in":["admin","manager","supervisor"]}

# Value not in array
GET /api/find/products?category={"$nin":["discontinued","draft"]}

# Array contains all elements
GET /api/find/tasks?tags={"$all":["urgent","bug"]}
```

### Pattern Matching and Text Search

```bash
# Case-insensitive regex search
GET /api/find/users?name={"$regex":"john","$options":"i"}

# Text search (requires text index)
GET /api/find/articles?title={"$text":{"$search":"mongodb nodejs"}}

# Field existence
GET /api/find/users?phoneNumber={"$exists":true}
```

### Complex Logical Operations

```bash
# Multiple conditions (AND)
GET /api/find/tasks?status=active&priority=high&assignedTo=user123

# OR operations
GET /api/find/tasks?{"$or":[{"status":"urgent"},{"dueDate":{"$lt":"2024-08-10"}}]}

# Complex nested queries
GET /api/find/orders?{"$and":[{"status":"shipped"},{"$or":[{"priority":"high"},{"totalAmount":{"$gt":1000}}]}]}
```

## 📅 Date Handling

The API includes intelligent date processing with automatic format normalization.

### Supported Date Formats

The system automatically handles various date formats:
- **dd/mm/yy**: "09/08/24" (primary format)
- **dd/mm/yyyy**: "09/08/2024" 
- **ISO format**: "2024-08-09T10:30:00.000Z"
- **US format**: "08/09/2024" (auto-detected and converted)

### Date Filtering Examples

```bash
# Exact date match
GET /api/find/tasks?dueDate="09/08/24"

# Date range (this week)
GET /api/find/tasks?dueDate={"$gte":"05/08/24","$lte":"11/08/24"}

# Multiple specific dates
GET /api/find/events?eventDate={"$in":["09/08/24","10/08/24","11/08/24"]}

# This month (August 2024)
GET /api/find/tasks?dueDate={"$regex":"^[0-9]{2}/08/24$"}

# Overdue tasks (before today)
GET /api/find/tasks?dueDate={"$lt":"09/08/24"}&status={"$ne":"completed"}

# Next 7 days
GET /api/find/tasks?dueDate={"$gte":"09/08/24","$lte":"16/08/24"}

# Tasks without due dates
GET /api/find/tasks?dueDate={"$exists":false}
```

### Business Logic Examples

```bash
# High priority overdue tasks
GET /api/find/tasks?priority=high&dueDate={"$lt":"09/08/24"}&status=pending

# Weekly team performance
GET /api/find/completedTasks?completedAt={"$gte":"05/08/24","$lte":"11/08/24"}&teamId=team123

# Monthly revenue analysis
GET /api/find/orders?orderDate={"$regex":"^[0-9]{2}/08/24$"}&status=completed

# Quarterly KPI tracking
GET /api/find/metrics?reportDate={"$regex":"^[0-9]{2}/(06|07|08)/24$"}
```

## 📋 Response Formats

### Success Response Structure

```json
{
  "success": true,
  "data": [...],
  "pagination": {
    "currentPage": 1,
    "totalPages": 10,
    "totalDocuments": 500,
    "limit": 50,
    "hasNextPage": true,
    "hasPrevPage": false
  },
  "collectionName": "collection_name"
}
```

### Error Response Structure

```json
{
  "success": false,
  "message": "Human-readable error message",
  "error": "Detailed technical error information",
  "statusCode": 400
}
```

### Common HTTP Status Codes

- **200**: Success
- **400**: Bad Request (invalid query parameters)
- **404**: Collection/Document not found  
- **500**: Internal Server Error

## 🏗️ Architecture

### Project Structure

```
backend/
├── 📁 config/
│   ├── db.js                    # MongoDB connection setup
│   └── join.js                  # Aggregation pipeline utilities
├── 📁 controllers/
│   └── dynamicModelController.js # Main API request handlers
├── 📁 middleware/
│   ├── authMiddleware.js        # Authentication middleware
│   └── errorMiddleware.js       # Global error handling
├── 📁 models/
│   └── dynamicModel.js          # Dynamic Mongoose model generator
├── 📁 routes/
│   └── dynamicModelRoutes.js    # API route definitions
├── 📁 services/
│   ├── dataService.js           # Core data operations
│   ├── queryService.js          # Query building utilities  
│   └── dateService.js           # Date formatting and normalization
├── 📄 server.js                 # Application entry point
├── 📄 package.json              # Dependencies and scripts
└── 📄 .env                      # Environment configuration
```

### Service Layer Architecture

#### DataService (`dataService.js`)
- **Primary Functions**: CRUD operations, pagination, aggregation
- **Key Methods**: 
  - `getPaginatedDataFromCollection()`
  - `getCollectionFields()`
  - `getCountFromCollection()`

#### QueryService (`queryService.js`) 
- **Primary Functions**: Query building, parameter extraction, pagination metadata
- **Key Methods**:
  - `buildQuery()` - Converts request params to MongoDB queries
  - `buildSortOptions()` - Handles sorting configuration
  - `buildPaginationInfo()` - Generates pagination metadata
  - `extractQueryParams()` - Validates and processes request parameters

#### DateService (`dateService.js`)
- **Primary Functions**: Date format detection and normalization
- **Key Methods**:
  - `normalizeDateFormat()` - Converts various date formats to standard format
  - `isLikelyDate()` - Intelligent date string detection

### Performance Optimizations

- **🏷️ Model Caching**: Dynamic Mongoose models are cached to prevent recreation
- **⚡ Lean Queries**: Returns plain JavaScript objects instead of Mongoose documents
- **📇 Automatic Indexing**: Indexes on `createdAt` and `updatedAt` fields
- **🔍 Query Optimization**: Efficient skip/limit pagination
- **🛡️ Schema Flexibility**: No predefined schemas, accepts any data structure

## 🛠️ Development

### Development Scripts

```bash
# Start development server with auto-reload
yarn dev

# Start production server
yarn start

# Install dependencies
yarn install

# Check for outdated packages
yarn outdated
```

### Development Guidelines

1. **Code Style**: Use ES6+ modules and modern JavaScript features
2. **Error Handling**: Always use try-catch blocks in async functions
3. **Validation**: Validate input parameters in service functions
4. **Logging**: Use `console.error()` for error logging with context
5. **Testing**: Test endpoints with various query combinations

### Environment Variables

| Variable | Description | Default | Required |
|----------|-------------|---------|----------|
| `MONGO_URI` | MongoDB connection string | - | ✅ |
| `PORT` | Server port | 5000 | ❌ |
| `NODE_ENV` | Environment mode | development | ❌ |
| `EMAIL_HOST` | SMTP server host | - | ❌ |
| `EMAIL_PORT` | SMTP server port | 587 | ❌ |
| `EMAIL_USER` | Email username | - | ❌ |
| `EMAIL_PASS` | Email password | - | ❌ |

## 🚀 Deployment

### Production Deployment

1. **Environment Setup**
   ```bash
   # Set production environment
   export NODE_ENV=production
   export PORT=3000
   export MONGO_URI="mongodb+srv://user:pass@cluster.mongodb.net/kpi_prod"
   ```

2. **Build and Start**
   ```bash
   yarn install --production
   yarn start
   ```

3. **Process Management** (using PM2)
   ```bash
   npm install -g pm2
   pm2 start server.js --name "kpi-api"
   pm2 startup
   pm2 save
   ```

### Docker Deployment

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN yarn install --production
COPY . .
EXPOSE 5000
CMD ["node", "server.js"]
```

### Health Check Endpoint

The API provides a health check endpoint:
```bash
GET /
# Response: {"message": "Hello World! Welcome to the API"}
```

## 📦 Dependencies

### Production Dependencies

- **express** ^5.1.0 - Web application framework
- **mongoose** ^8.17.0 - MongoDB object modeling
- **cors** ^2.8.5 - Cross-origin resource sharing
- **dotenv** ^16.3.1 - Environment variable management
- **moment** ^2.30.1 - Date manipulation library
- **bcryptjs** ^2.4.3 - Password hashing
- **jsonwebtoken** ^9.0.2 - JWT token handling
- **express-async-handler** ^1.2.0 - Async error handling
- **nodemailer** ^6.9.7 - Email sending capabilities
- **mongodb** ^6.3.0 - Native MongoDB driver

### Development Dependencies

- **nodemon** ^3.1.10 - Development server with auto-reload

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📞 Support

For support and questions:
- **Repository**: [kpi-display-scoreboard](https://github.com/micromaxdev/kpi-display-scoreboard)
- **Issues**: [GitHub Issues](https://github.com/micromaxdev/kpi-display-scoreboard/issues)

---

Built with ❤️ by [Micromax Dev](https://github.com/micromaxdev)

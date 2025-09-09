# KPI Display Scoreboard - Backend API

A powerful and flexible Node.js/Express REST API designed for dynamic MongoDB collection access with advanced querying, pagination, and filtering capabilities. Built specifically for KPI dashboards and data visualization applications with comprehensive threshold management, display configuration, screen management, and file upload features.

## 🚀 Features

- **🔄 Dynamic Collection Access**: Query any MongoDB collection without predefined schemas
- **📊 Advanced Filtering**: Support for MongoDB operators and complex queries
- **📄 Smart Pagination**: Built-in pagination with metadata and performance optimization
- **🔍 Flexible Sorting**: Multi-field sorting with ascending/descending order
- **📅 Intelligent Date Handling**: Automatic date format normalization and filtering
- **📈 KPI Analysis**: Built-in RAG (Red-Amber-Green) categorization for KPI tracking
- **⚙️ Threshold Management**: Dynamic threshold configuration and monitoring
- **🖥️ Display Configuration**: Customizable display settings and layouts
- **📺 Screen Management**: Multi-screen configuration and routing support
- **📁 File Upload & Processing**: Excel/CSV file upload with data cleaning and validation
- **⚡ Performance Optimized**: Lean queries, model caching, and efficient indexing
- **🛠️ RESTful Design**: Clean, intuitive API endpoints
- **🔒 Error Handling**: Comprehensive error handling and validation
- **📋 Schema Discovery**: Automatic collection and field discovery

## 📋 Table of Contents

- [Quick Start](#quick-start)
- [API Endpoints](#api-endpoints)
- [Advanced Filtering](#advanced-filtering)
- [Date Handling](#date-handling)
- [File Upload](#file-upload)
- [Response Formats](#response-formats)
- [Architecture](#architecture)
- [Development](#development)
- [Deployment](#deployment)

## 🚀 Quick Start

### Prerequisites

- **Node.js** v18 or higher
- **MongoDB** 4.4 or higher
- **Yarn** package manager v4.9.2+

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
   MONGO_URI=your-mongodb-uri

   # Server Configuration
   PORT=5000
   NODE_ENV=development

   # CORS Configuration
   ALLOWED_ORIGINS=http://localhost:3000,http://localhost:5173

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

### 📊 Dynamic Collection Operations

#### 1. Get Paginated Collection Data
```http
GET /api/find/:collectionName
```

#### 2. Get Collections List
```http
GET /api/collectionList
```

#### 3. Get Collection Schema
```http
GET /api/collectionFields/:collectionName
```

### 📈 KPI Analysis Operations

#### 4. Analyze KPI Data
```http
POST /kpi-api/analyze
```

### ⚙️ Threshold Management

#### 5. Threshold Operations
```http
GET /threshold-api/thresholds
POST /threshold-api/thresholds
PUT /threshold-api/thresholds/:id
DELETE /threshold-api/thresholds/:id
```

### 🖥️ Display Configuration

#### 6. Display Operations
```http
GET /display-api/displays
POST /display-api/displays
PUT /display-api/displays/:id
DELETE /display-api/displays/:id
```

### 📺 Screen Management

#### 7. Screen Operations
```http
GET /screen-api/screens
POST /screen-api/screens
GET /screen-api/:screenName
PUT /screen-api/:screenName
DELETE /screen-api/:screenName
```

### 📁 File Upload Operations

#### 8. File Upload Operations
```http
POST /file-api/upload/:collectionName
POST /file-api/preview
```

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

#### 4. Analyze KPI Data
```http
POST /kpi-api/analyze
```

**Description**: Analyze a collection for KPI RAG (Red-Amber-Green) categorization.

**Request Body**:
```json
{
  "collectionName": "tasks",
  "field": "dueDate",
  "greenThreshold": 7,
  "amberThreshold": 14,
  "direction": "lower"
}
```

**Response**:
```json
{
  "success": true,
  "collection": "tasks",
  "thresholds": {
    "green": 7,
    "amber": 14,
    "direction": "lower"
  },
  "countsByCategory": {
    "green": 10,
    "amber": 5,
    "red": 2,
    "total": 17
  },
  "topItems": {
    "green": [...],
    "amber": [...],
    "red": [...]
  }
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

## 📁 File Upload

The API supports file upload and processing capabilities for importing data into MongoDB collections.

### Supported File Formats

- **CSV Files** (`.csv`)
- **Excel Files** (`.xlsx`, `.xls`)

### Upload to Collection

```http
POST /file-api/upload/:collectionName
Content-Type: multipart/form-data

Form Data:
- file: [Excel/CSV file]
```

**Example**:
```bash
curl -X POST \
  http://localhost:5000/file-api/upload/products \
  -H 'Content-Type: multipart/form-data' \
  -F 'file=@products.xlsx'
```

**Response**:
```json
{
  "success": true,
  "message": "File uploaded and processed successfully",
  "result": {
    "totalRows": 150,
    "insertedCount": 145,
    "errors": 5,
    "collectionName": "products"
  }
}
```

### File Preview (without uploading)

```http
POST /file-api/preview
Content-Type: multipart/form-data

Form Data:
- file: [Excel/CSV file]
```

**Response**:
```json
{
  "success": true,
  "preview": [
    {
      "name": "Product A",
      "price": 29.99,
      "category": "Electronics",
      "createdAt": "09/08/24"
    }
  ],
  "totalRows": 150,
  "columns": ["name", "price", "category", "createdAt"]
}
```

### Data Processing Features

- **🧹 Data Cleaning**: Automatic removal of empty rows and string trimming
- **🔢 Type Conversion**: Automatic number conversion where appropriate
- **📅 Date Formatting**: Standardized date formatting to dd/mm/yy format
- **✅ Validation**: File type and size validation
- **🗂️ Metadata Addition**: Automatic addition of upload timestamps and metadata
- **⚠️ Error Handling**: Detailed error reporting for invalid data rows

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
│   └── db.js                    # MongoDB connection setup
├── 📁 controllers/
│   ├── displayController.js     # Display configuration handlers
│   ├── dynamicModelController.js # Dynamic collection API handlers
│   ├── fileUploadController.js  # File upload and processing handlers
│   ├── kpiController.js         # KPI analysis handlers
│   ├── screenController.js      # Screen management handlers
│   └── thresholdController.js   # Threshold management handlers
├── 📁 middleware/
│   ├── errorMiddleware.js       # Global error handling middleware
│   └── uploadMiddleware.js      # File upload middleware (Multer)
├── 📁 models/
│   ├── displayModel.js          # Display configuration schema
│   ├── dynamicModel.js          # Dynamic Mongoose model generator
│   ├── screenModel.js           # Screen configuration schema
│   └── thresholdModel.js        # Threshold configuration schema
├── 📁 routes/
│   ├── displayRoutes.js         # Display API routes
│   ├── dynamicModelRoutes.js    # Dynamic collection API routes
│   ├── fileUploadRoutes.js      # File upload API routes
│   ├── kpiRoutes.js             # KPI analysis routes
│   ├── screenRoutes.js          # Screen management routes
│   └── thresholdRoutes.js       # Threshold management routes
├── 📁 services/
│   ├── dataService.js           # Core data operations and file upload
│   ├── displayService.js        # Display business logic
│   ├── kpiService.js            # KPI analysis business logic
│   ├── queryService.js          # Query building utilities
│   ├── screenService.js         # Screen management business logic
│   └── thresholdService.js      # Threshold business logic
├── 📁 uploads/
│   └── temp/                    # Temporary file storage for uploads
├── 📁 utils/
│   ├── dateUtils.js             # Date formatting and utilities
│   ├── excelUtils.js            # Excel file processing utilities
│   ├── fileUploadUtils.js       # File upload processing utilities
│   ├── kpiUtils.js              # KPI calculation utilities
│   └── ragCategoryUtils.js      # RAG categorization utilities
├── 📄 server.js                 # Application entry point
├── 📄 package.json              # Dependencies and scripts
└── 📄 .env                      # Environment configuration
```

### Service Layer Architecture

#### DataService (`dataService.js`)
- **Primary Functions**: CRUD operations, pagination, aggregation, file upload processing
- **Key Methods**: 
  - `getPaginatedDataFromCollection()`
  - `getCollectionFields()`
  - `getCountFromCollection()`
  - `uploadDataToCollection()`

#### QueryService (`queryService.js`) 
- **Primary Functions**: Query building, parameter extraction, pagination metadata
- **Key Methods**:
  - `buildQuery()` - Converts request params to MongoDB queries
  - `buildSortOptions()` - Handles sorting configuration
  - `buildPaginationInfo()` - Generates pagination metadata
  - `extractQueryParams()` - Validates and processes request parameters

#### KpiService (`kpiService.js`)
- **Primary Functions**: KPI analysis, RAG categorization, threshold evaluation
- **Key Methods**:
  - `analyzeKpiData()` - Performs KPI analysis with RAG categorization
  - `calculateThresholds()` - Calculates performance thresholds
  - `categorizeItems()` - Applies RAG categorization logic

#### ThresholdService (`thresholdService.js`)
- **Primary Functions**: Threshold management, configuration validation
- **Key Methods**:
  - `createThreshold()` - Creates new threshold configurations
  - `updateThreshold()` - Updates existing thresholds
  - `validateThresholdConfig()` - Validates threshold parameters

#### DisplayService (`displayService.js`)
- **Primary Functions**: Display configuration management, layout settings
- **Key Methods**:
  - `createDisplay()` - Creates new display configurations
  - `updateDisplay()` - Updates display settings
  - `getDisplayConfig()` - Retrieves display configurations

#### ScreenService (`screenService.js`)
- **Primary Functions**: Screen management, screen configuration, routing
- **Key Methods**:
  - `createScreen()` - Creates new screen configurations
  - `updateScreen()` - Updates screen settings
  - `getScreenByName()` - Retrieves screen configuration by name
  - `getAllScreens()` - Gets all available screens
  - `deleteScreen()` - Removes screen configurations
- **Key Methods**:
  - `createDisplay()` - Creates new display configurations
  - `updateDisplay()` - Updates display settings
  - `getDisplayConfig()` - Retrieves display configurations

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
| `ALLOWED_ORIGINS` | CORS allowed origins (comma-separated) | * | ❌ |
| `JWT_SECRET` | Secret key for JWT authentication | - | ✅ |
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
- **exceljs** ^4.4.0 - Excel file generation and parsing
- **multer** ^2.0.2 - File upload handling middleware

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

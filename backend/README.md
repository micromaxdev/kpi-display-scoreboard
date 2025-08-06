# Dynamic Collection API

A flexible Node.js/Express API that provides dynamic access to MongoDB collections with advanced querying, pagination, and filtering capabilities.

## Features

- **Dynamic Collection Access**: Query any MongoDB collection without predefined schemas
- **Advanced Filtering**: Support for MongoDB operators and complex queries
- **Pagination**: Built-in pagination with customizable page size
- **Sorting**: Flexible sorting by any field with ascending/descending order
- **Performance Optimized**: Uses lean queries and caching for better performance
- **RESTful API**: Clean REST endpoints for data retrieval

## Quick Start

### Prerequisites

- Node.js (v14 or higher)
- MongoDB database
- Yarn package manager

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   yarn install
   ```

3. Create a `.env` file with your MongoDB connection:
   ```env
   MONGO_URI=mongodb://localhost:27017/your_database
   PORT=5000
   ```

4. Start the server:
   ```bash
   node server.js
   ```

## API Endpoints

### Get Collection Data

**Endpoint:** `GET /api/:collectionName`

Retrieves data from any MongoDB collection with pagination, filtering, and sorting.

#### Query Parameters

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `page` | number | 1 | Page number for pagination |
| `limit` | number | 50 | Number of documents per page (0 = no limit) |
| `sortBy` | string | '_id' | Field to sort by |
| `sortOrder` | string | 'desc' | Sort order ('asc' or 'desc') |
| `[field]` | any | - | Any field filter (supports MongoDB operators) |

#### Examples

**Basic Query:**
```bash
GET /api/users
```

**With Pagination:**
```bash
GET /api/users?page=2&limit=10
```

**With Sorting:**
```bash
GET /api/users?sortBy=createdAt&sortOrder=asc
```

**With Filters:**
```bash
# Simple field filter
GET /api/users?role=admin

# MongoDB operator filter (JSON encoded)
GET /api/users?age={"$gt":25}

# Multiple filters
GET /api/users?role=admin&status={"$in":["active","pending"]}
```

#### Response Format

```json
{
  "success": true,
  "data": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "name": "John Doe",
      "email": "john@example.com",
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
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

### Hello World Endpoints

**Root:** `GET /`
```json
{
  "message": "Hello World! Welcome to the API"
}
```

**API Hello:** `GET /api/hello`
```json
{
  "message": "Hello World from API!"
}
```

## Advanced Filtering

The API supports MongoDB operators for complex queries. All operator values must be JSON-encoded:

### Comparison Operators
```bash
# Greater than
GET /api/users?age={"$gt":25}

# Less than or equal
GET /api/users?price={"$lte":100}

# Not equal
GET /api/users?status={"$ne":"inactive"}
```

### Logical Operators
```bash
# In array
GET /api/users?role={"$in":["admin","moderator"]}

# Not in array
GET /api/users?category={"$nin":["spam","deleted"]}

# And operator
GET /api/users?age={"$gte":18}&status=active

# Or operator (requires JSON encoding)
GET /api/users?{"$or":[{"age":{"$gte":18}},{"status":"active"}]}
```

### Text Search
```bash
# Text search (if text index exists)
GET /api/articles?title={"$regex":"javascript","$options":"i"}
```

### Date-Based Filtering (duedate examples)
**Note: Dates are stored in dd/mm/yy format as strings**

```bash
# Find tasks due today (15/01/24)
GET /api/tasks?duedate="15/01/24"

# Find overdue tasks (past due date)
GET /api/tasks?duedate={"$lt":"15/01/24"}

# Find tasks due in the next 7 days
GET /api/tasks?duedate={"$in":["16/01/24","17/01/24","18/01/24","19/01/24","20/01/24","21/01/24","22/01/24"]}

# Find tasks due this month (January 2024)
GET /api/tasks?duedate={"$regex":"^[0-9]{2}/01/24$"}

# Find tasks due between specific dates
GET /api/tasks?duedate={"$in":["15/01/24","16/01/24","17/01/24","18/01/24","19/01/24","20/01/24","21/01/24","22/01/24","23/01/24","24/01/24","25/01/24","26/01/24","27/01/24","28/01/24","29/01/24","30/01/24","31/01/24"]}

# Find tasks with no due date (null or missing)
GET /api/tasks?duedate={"$exists":false}

# Find tasks with due date set (not null)
GET /api/tasks?duedate={"$exists":true}

# Find tasks due in the past week
GET /api/tasks?duedate={"$in":["08/01/24","09/01/24","10/01/24","11/01/24","12/01/24","13/01/24","14/01/24"]}

# Find urgent tasks (due today or tomorrow)
GET /api/tasks?duedate={"$in":["15/01/24","16/01/24"]}

# Find tasks due this quarter (Q1 2024)
GET /api/tasks?duedate={"$regex":"^[0-9]{2}/(01|02|03)/24$"}

# Find tasks due next year (2025)
GET /api/tasks?duedate={"$regex":"^[0-9]{2}/[0-9]{2}/25$"}

# Find tasks with specific due date
GET /api/tasks?duedate="15/01/24"

# Find tasks due on weekends (Saturday or Sunday) - specific dates
GET /api/tasks?duedate={"$in":["13/01/24","14/01/24","20/01/24","21/01/24"]}

# Find tasks due in the last 30 days (using regex for date range)
GET /api/tasks?duedate={"$regex":"^[0-9]{2}/(12|01)/24$"}

### Combined Filtering with duedate
```bash
# Find high priority tasks due this week
GET /api/tasks?priority=high&duedate={"$in":["15/01/24","16/01/24","17/01/24","18/01/24","19/01/24","20/01/24","21/01/24"]}

# Find overdue tasks assigned to specific user
GET /api/tasks?assignedTo=user123&duedate={"$lt":"15/01/24"}

# Find completed tasks due in the past month
GET /api/tasks?status=completed&duedate={"$regex":"^[0-9]{2}/(12|01)/24$"}

# Find urgent tasks (high priority + due today)
GET /api/tasks?priority=urgent&duedate="15/01/24"

# Find tasks due this week for specific project
GET /api/tasks?projectId=project456&duedate={"$in":["15/01/24","16/01/24","17/01/24","18/01/24","19/01/24","20/01/24","21/01/24"]}

# Find overdue tasks with specific tags
GET /api/tasks?tags={"$in":["bug","critical"]}&duedate={"$lt":"15/01/24"}

# Find tasks due tomorrow that are not assigned
GET /api/tasks?assignedTo={"$exists":false}&duedate="16/01/24"

# Find tasks due this quarter with estimated hours > 8
GET /api/tasks?duedate={"$regex":"^[0-9]{2}/(01|02|03)/24$"}&estimatedHours={"$gt":8}
```

### Date Formatting Tips

**Date Format:**
- **Stored Format**: `dd/mm/yy` (e.g., "15/01/24" for January 15, 2024)
- **String-based**: All dates are stored as strings, not Date objects

**Filtering Strategies:**
- **Exact match**: Use direct string comparison for specific dates
- **Date ranges**: Use `$in` operator with array of date strings
- **Pattern matching**: Use regex for month/year filtering
- **Lexicographical comparison**: Use `$lt`, `$gt` for chronological order

**Best Practices:**
- Use exact date strings for specific date queries
- Use `$in` arrays for date ranges (more reliable than lexicographical comparison)
- Use regex patterns for month/year filtering
- Always include leading zeros for single-digit days/months

**Common Date Patterns:**
```bash
# Today's date (exact match)
GET /api/tasks?duedate="15/01/24"

# This week (using $in array)
GET /api/tasks?duedate={"$in":["15/01/24","16/01/24","17/01/24","18/01/24","19/01/24","20/01/24","21/01/24"]}

# This month (using regex pattern)
GET /api/tasks?duedate={"$regex":"^[0-9]{2}/01/24$"}

# Date range (lexicographical comparison)
GET /api/tasks?duedate={"$gte":"01/01/24","$lte":"31/01/24"}
```

## Performance Features

- **Model Caching**: Dynamic models are cached to avoid recreation
- **Lean Queries**: Returns plain JavaScript objects instead of Mongoose documents
- **Indexing**: Automatic indexing on `createdAt` and `updatedAt` fields
- **Pagination**: Efficient skip/limit pagination
- **Flexible Schema**: No predefined fields, accepts any data structure

## Error Handling

The API returns consistent error responses:

```json
{
  "success": false,
  "message": "Error retrieving data",
  "error": "Detailed error message"
}
```

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `MONGO_URI` | MongoDB connection string | Required |
| `PORT` | Server port | 5000 |

## Development

### Running in Development Mode
```bash
nodemon server.js
```

### Project Structure
```
backend/
├── config/
│   ├── db.js              # Database connection
│   └── join.js            # MongoDB aggregation utilities
├── controllers/
│   └── dynamicModelController.js  # Main API logic
├── middleware/
│   ├── authMiddleware.js   # Authentication middleware
│   └── errorMiddleware.js  # Error handling middleware
├── models/
│   └── dynamicModel.js     # Dynamic model generator
├── routes/
│   └── dynamicModelRoutes.js  # API routes
├── services/
│   ├── emailService.js     # Email functionality
│   └── webService.js       # Web service utilities
└── server.js               # Main server file
```

## Dependencies

- **express**: Web framework
- **mongoose**: MongoDB ODM
- **cors**: Cross-origin resource sharing
- **dotenv**: Environment variable management
- **bcryptjs**: Password hashing
- **jsonwebtoken**: JWT authentication
- **express-async-handler**: Async error handling
- **nodemailer**: Email sending
- **mongodb**: MongoDB driver

## License

This project is licensed under the MIT License.

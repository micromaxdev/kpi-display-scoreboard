# KPI Display Scoreboard

A comprehensive, full-stack web application for dynamic KPI (Key Performance Indicator) dashboard creation and management. This system enables users to configure custom KPI displays with intelligent threshold management, real-time data analysis, and responsive visualization.

## 🚀 Overview

The KPI Display Scoreboard is a modern web application that transforms raw MongoDB data into meaningful KPI dashboards with Red-Amber-Green (RAG) categorization. Users can dynamically configure thresholds, analyze performance metrics, and create beautiful, responsive dashboards without writing code.

### 🎯 Key Capabilities

- **🔄 Dynamic Data Access**: Connect to any MongoDB collection without predefined schemas
- **⚙️ Smart Configuration**: Intelligent threshold suggestions based on data analysis
- **📊 RAG Analysis**: Automated Red-Amber-Green categorization for performance tracking
- **📱 Responsive Design**: Mobile-optimized dashboards that work on any device
- **⚡ Real-time Updates**: Live data refresh and dynamic threshold cycling
- **📈 Advanced Analytics**: Statistical analysis and trend identification
- **🎨 Modern UI/UX**: Smooth animations and intuitive user interface
- **📊 Export Capabilities**: Excel export functionality for reports and analysis

## 🏗️ System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    KPI Display Scoreboard                   │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌─────────────────┐    API Calls    ┌─────────────────┐   │
│  │                 │◄──────────────► │                 │   │
│  │    Frontend     │                 │     Backend     │   │
│  │   (React 19)    │                 │  (Node.js +     │   │
│  │                 │                 │   Express)      │   │
│  │  • Vite         │                 │                 │   │
│  │  • React Router │                 │  • RESTful API  │   │
│  │  • Styled Comp. │                 │  • Mongoose ODM │   │
│  │  • Framer Motion│                 │  • JWT Auth     │   │
│  └─────────────────┘                 └─────────────────┘   │
│           │                                   │             │
│           │                                   │             │
│           ▼                                   ▼             │
│  ┌─────────────────┐                 ┌─────────────────┐   │
│  │   User Interface│                 │    Database     │   │
│  │                 │                 │   (MongoDB)     │   │
│  │  • Config Forms │                 │                 │   │
│  │  • KPI Dashboards                 │  • Collections  │   │
│  │  • Data Tables  │                 │  • Documents    │   │
│  │  • Preview Mode │                 │  • Indexes      │   │
│  └─────────────────┘                 └─────────────────┘   │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

## 📁 Project Structure

```
kpi-display-scoreboard/
├── 📁 backend/                      # Node.js/Express API Server
│   ├── 📁 config/                   # Database and configuration
│   ├── 📁 controllers/              # API request handlers
│   ├── 📁 middleware/               # Authentication and error handling
│   ├── 📁 models/                   # Mongoose data models
│   ├── 📁 routes/                   # API route definitions
│   ├── 📁 services/                 # Business logic layer
│   ├── 📁 utils/                    # Utility functions
│   ├── 📄 server.js                 # Application entry point
│   ├── 📄 package.json              # Backend dependencies
│   └── 📄 README.md                 # Backend documentation
│
├── 📁 frontend/                     # React Application
│   ├── 📁 src/
│   │   ├── 📁 components/           # React components
│   │   ├── 📁 hooks/                # Custom React hooks
│   │   ├── 📁 services/             # API integration
│   │   ├── 📁 styles/               # Styled components
│   │   └── 📁 utils/                # Frontend utilities
│   ├── 📄 package.json              # Frontend dependencies
│   └── 📄 README.md                 # Frontend documentation
│
├── 📄 LICENSE                       # MIT License
└── 📄 README.md                     # This file - System overview
```

## 🚀 Quick Start

### Prerequisites

- **Node.js** v18 or higher
- **MongoDB** 4.4 or higher
- **Yarn** package manager v4.9.2+

### 1. Clone the Repository

```bash
git clone https://github.com/micromaxdev/kpi-display-scoreboard.git
cd kpi-display-scoreboard
```

### 2. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install dependencies
yarn install

# Configure environment variables
cp .env.example .env
# Edit .env with your MongoDB URI and other settings

# Start the backend server
yarn dev
```

The backend API will be available at `http://localhost:5000`

### 3. Frontend Setup

```bash
# Navigate to frontend directory
cd ../frontend

# Install dependencies
yarn install

# Configure environment variables
echo "VITE_API_BASE_URL=http://localhost:5000" > .env

# Start the frontend development server
yarn dev
```

The frontend application will be available at `http://localhost:5173`

### 4. Verify Installation

1. Open `http://localhost:5173` in your browser
2. You should see the KPI Threshold Configuration form
3. Test the connection by selecting a MongoDB collection

## 🛠️ Technology Stack

### Backend Technologies

| Technology | Version | Purpose |
|------------|---------|---------|
| **Node.js** | v18+ | JavaScript runtime environment |
| **Express.js** | ^5.1.0 | Web application framework |
| **MongoDB** | ^6.3.0 | NoSQL database |
| **Mongoose** | ^8.17.0 | MongoDB object modeling |
| **Moment.js** | ^2.30.1 | Date manipulation and formatting |
| **ExcelJS** | ^4.4.0 | Excel file generation |

### Frontend Technologies

| Technology | Version | Purpose |
|------------|---------|---------|
| **React** | ^19.1.1 | User interface library |
| **Vite** | ^7.1.0 | Build tool and development server |
| **Styled Components** | ^6.1.19 | CSS-in-JS styling |
| **Framer Motion** | ^12.23.12 | Animation and transitions |
| **React Router** | Latest | Client-side routing |

## 🎯 Features & Functionality

### 📊 KPI Dashboard Creation

- **Dynamic Collection Access**: Connect to any MongoDB collection
- **Field Auto-Discovery**: Automatic detection of available fields and data types
- **Smart Threshold Suggestions**: recommendations for performance thresholds
- **RAG Categorization**: Automated Red-Amber-Green performance classification
- **Real-time Analysis**: Live data processing and visualization

### ⚙️ Threshold Management

- **Intuitive Configuration**: User-friendly forms for setting up KPI thresholds
- **Direction Intelligence**: Automatic detection of whether higher or lower values are better
- **Validation**: Real-time validation of threshold configurations
- **Preview Mode**: Test configurations before deployment
- **Bulk Operations**: Manage multiple thresholds efficiently

### 📱 User Experience

- **Responsive Design**: Optimized for desktop, tablet, and mobile devices
- **Modern UI**: Clean, intuitive interface with smooth animations
- **Progressive Loading**: Efficient data loading with pagination
- **Error Handling**: Graceful error handling with user-friendly messages
- **Accessibility**: ARIA compliant and keyboard navigable

### 📈 Data Analysis

- **Advanced Filtering**: Support for complex MongoDB queries
- **Statistical Analysis**: Built-in statistical functions for threshold calculation
- **Export Capabilities**: Excel export for reports and further analysis
- **Historical Tracking**: Performance tracking over time
- **Trend Analysis**: Identify performance trends and patterns

## 🔧 Configuration

### Environment Variables

#### Backend (.env)
```env
# Database
MONGO_URI=mongodb://localhost:27017/kpi_database

# Server
PORT=5000
NODE_ENV=development

# CORS
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:5173

# Authentication
JWT_SECRET=your_super_secure_jwt_secret

# Email (Optional)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
```

#### Frontend (.env)
```env
# API Configuration
VITE_API_BASE_URL=http://localhost:5000
```

## 🚀 Deployment

### Development Deployment
```bash
# Backend
cd backend
yarn install
yarn dev

# Frontend  
cd frontend
yarn install
yarn dev
```

### Production Deployment

#### Backend Production
```bash
cd backend
yarn install --production
NODE_ENV=production yarn start
```

#### Frontend Production
```bash
cd frontend
yarn build
# Deploy the dist/ folder to your static hosting service
# (Netlify, Vercel, Apache, Nginx, etc.)
```

### Hosting Recommendations

- **Frontend**: Netlify, Vercel, GitHub Pages, or any static host
- **Backend**: Railway, Render, Heroku, or any Node.js hosting service  
- **Database**: MongoDB Atlas, or self-hosted MongoDB instance

## 📚 API Documentation

### Core Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/collectionList` | Get all available collections |
| `GET` | `/api/find/:collection` | Get paginated collection data |
| `GET` | `/api/collectionFields/:collection` | Get collection field schema |
| `POST` | `/kpi-api/analyze` | Perform KPI analysis |
| `GET/POST/PUT/DELETE` | `/threshold-api/thresholds` | Threshold CRUD operations |
| `GET/POST/PUT/DELETE` | `/display-api/displays` | Display configuration CRUD |

For detailed API documentation, see [Backend README](./backend/README.md)

## 🧪 Testing

### Backend Testing
```bash
cd backend
# Run API tests
yarn test

# Run integration tests
yarn test:integration
```

### Frontend Testing
```bash
cd frontend
# Run component tests
yarn test

# Run E2E tests
yarn test:e2e
```

### Development Guidelines

- **Code Style**: Follow ESLint configurations for both frontend and backend
- **Commit Messages**: Use conventional commit format
- **Documentation**: Update README files for significant changes
- **Testing**: Add tests for new features and bug fixes
- **Security**: Follow security best practices for both client and server code

## 📞 Support & Resources

### Documentation
- **Backend API**: [Backend README](./backend/README.md)
- **Frontend App**: [Frontend README](./frontend/README.md)
- **API Reference**: Available at `/api/docs` when backend is running

### Getting Help
- **Issues**: [GitHub Issues](https://github.com/micromaxdev/kpi-display-scoreboard/issues)
- **Discussions**: [GitHub Discussions](https://github.com/micromaxdev/kpi-display-scoreboard/discussions)
- **Wiki**: [Project Wiki](https://github.com/micromaxdev/kpi-display-scoreboard/wiki)

### Community
- **Repository**: [kpi-display-scoreboard](https://github.com/micromaxdev/kpi-display-scoreboard)
- **License**: [MIT License](./LICENSE)
- **Changelog**: [CHANGELOG.md](./CHANGELOG.md)

## 🏆 Acknowledgments

- Built with modern web technologies and best practices
- Inspired by the need for dynamic, user-configurable KPI dashboards
- Thanks to the open-source community for the amazing tools and libraries

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

**Built with ❤️ by [Micromax Dev](https://github.com/micromaxdev)**

*Transform your data into actionable insights with KPI Display Scoreboard*

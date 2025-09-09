# KPI Display Scoreboard

A comprehensive, full-stack web application for dynamic KPI (Key Performance Indicator) dashboard creation and management. This system enables users to configure custom KPI displays with intelligent threshold management, real-time data analysis, and responsive visualization across multiple screens and playlists.

## 🚀 Overview

The KPI Display Scoreboard is a modern web application that transforms raw MongoDB data into meaningful KPI dashboards with Red-Amber-Green (RAG) categorization. Users can dynamically configure thresholds, analyze performance metrics, create displays, manage screens, and configure playlists for automated presentations - all without writing code.

### 🎯 Key Capabilities

- **🔄 Dynamic Data Access**: Connect to any MongoDB collection without predefined schemas
- **⚙️ Smart Configuration**: Intelligent threshold suggestions based on data analysis
- **📊 RAG Analysis**: Automated Red-Amber-Green categorization for performance tracking
- **📱 Responsive Design**: Mobile-optimized dashboards that work on any device
- **⚡ Real-time Updates**: Live data refresh and dynamic threshold cycling
- **📈 Advanced Analytics**: Statistical analysis and trend identification
- **🎨 Modern UI/UX**: Smooth animations and intuitive user interface with Framer Motion
- **📊 Export Capabilities**: Excel export functionality for reports and analysis
- **🖥️ Multi-Screen Management**: Configure and manage multiple display screens
- **🎵 Playlist Configuration**: Automated playlist management for cycling through displays
- **📄 File Upload**: Support for file uploads and data import functionality

## 🏗️ System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    KPI Display Scoreboard                   │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌─────────────────┐    REST API     ┌─────────────────┐   │
│  │                 │◄──────────────► │                 │   │
│  │    Frontend     │                 │     Backend     │   │
│  │   (React 19)    │                 │  (Node.js +     │   │
│  │                 │                 │   Express)      │   │
│  │  • Vite 7.1     │                 │                 │   │
│  │  • React Router │                 │  • RESTful API  │   │
│  │  • Styled Comp. │                 │  • Mongoose ODM │   │
│  │  • Framer Motion│                 │  • File Upload  │   │
│  └─────────────────┘                 └─────────────────┘   │
│           │                                   │             │
│           │                                   │             │
│           ▼                                   ▼             │
│  ┌─────────────────┐                 ┌─────────────────┐   │
│  │   User Interface│                 │    Database     │   │
│  │                 │                 │   (MongoDB)     │   │
│  │  • Threshold Config               │                 │   │
│  │  • KPI Dashboards                 │  • Collections  │   │
│  │  • Screen Management               │  • Documents    │   │
│  │  • Playlist Config                │  • Thresholds   │   │
│  │  • Preview Mode │                 │  • Displays     │   │
│  │  • Data Tables  │                 │  • Screens      │   │
│  └─────────────────┘                 └─────────────────┘   │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

## 📁 Project Structure

```
kpi-display-scoreboard/
├── 📁 backend/                      # Node.js/Express API Server
│   ├── 📁 config/                   # Database configuration
│   ├── 📁 controllers/              # API request handlers
│   ├── 📁 middleware/               # Express middleware
│   ├── 📁 models/                   # Mongoose data models
│   ├── 📁 routes/                   # API route definitions
│   ├── 📁 services/                 # Business logic layer
│   ├── 📁 uploads/                  # File upload directory
│   │   └── temp/                   # Temporary file storage
│   ├── 📁 utils/                    # Utility functions
│   ├── 📄 server.js                 # Application entry point
│   ├── 📄 package.json              # Backend dependencies
│   └── 📄 README.md                 # Backend documentation
│
├── 📁 frontend/                     # React Application
│   ├── 📁 src/
│   │   ├── 📁 components/           # React components
│   │   │   ├── 📁 config/          # Configuration components
│   │   │   ├── 📁 data/            # Data display components
│   │   │   ├── 📁 forms/           # Form components
│   │   │   ├── 📁 layout/          # Layout components
│   │   │   ├── 📁 modals/          # Modal components
│   │   │   ├── 📁 pages/           # Page components
│   │   │   └── 📁 selectors/       # Selector components
│   │   ├── 📁 hooks/                # Custom React hooks
│   │   ├── 📁 services/             # API integration
│   │   ├── 📁 styles/               # Styled components
│   │   └── 📁 utils/                # Frontend utilities
│   ├── 📄 package.json              # Frontend dependencies
│   ├── 📄 vite.config.js            # Vite configuration
│   ├── 📄 eslint.config.js          # ESLint configuration
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
2. You should see the Threshold Configuration form with navigation
3. Test the connection by:
   - Selecting a MongoDB collection from the dropdown
   - Configuring thresholds for different fields
   - Navigating to different pages (Preview, Screens, Playlist)
   - Testing the KPI analysis functionality

## 🛠️ Technology Stack

### Backend Technologies

| Technology | Version | Purpose |
|------------|---------|---------|
| **Node.js** | v18+ | JavaScript runtime environment |
| **Express.js** | ^5.1.0 | Web application framework |
| **MongoDB** | ^6.3.0 | NoSQL database driver |
| **Mongoose** | ^8.17.0 | MongoDB object modeling |
| **Moment.js** | ^2.30.1 | Date manipulation and formatting |
| **ExcelJS** | ^4.4.0 | Excel file generation and processing |
| **Multer** | ^2.0.2 | File upload handling middleware |
| **bcryptjs** | ^2.4.3 | Password hashing and encryption |
| **CORS** | ^2.8.5 | Cross-Origin Resource Sharing |
| **Nodemon** | ^3.1.10 | Development server with auto-reload |

### Frontend Technologies

| Technology | Version | Purpose |
|------------|---------|---------|
| **React** | ^19.1.1 | User interface library |
| **React DOM** | ^19.1.1 | React DOM rendering |
| **Vite** | ^7.1.0 | Build tool and development server |
| **React Router DOM** | ^7.8.2 | Client-side routing and navigation |
| **Styled Components** | ^6.1.19 | CSS-in-JS styling solution |
| **Framer Motion** | ^12.23.12 | Animation and transitions library |
| **ESLint** | ^9.32.0 | JavaScript linting and code quality |

## 🎯 Features & Functionality

### 📊 KPI Dashboard Creation

- **Dynamic Collection Access**: Connect to any MongoDB collection without predefined schemas
- **Field Auto-Discovery**: Automatic detection of available fields and data types
- **Smart Threshold Suggestions**: AI-powered recommendations for performance thresholds
- **RAG Categorization**: Automated Red-Amber-Green performance classification
- **Real-time Analysis**: Live data processing and visualization
- **Custom KPI Configuration**: Flexible threshold and display configuration

### 🖥️ Screen & Display Management

- **Multi-Screen Support**: Configure and manage multiple display screens
- **Display Configuration**: Customizable display settings and layouts
- **Screen Routing**: Dynamic routing to different screen configurations
- **Preview Mode**: Test configurations before deployment
- **Responsive Design**: Optimized for various screen sizes and orientations

### 🎵 Playlist & Automation

- **Playlist Configuration**: Automated playlist management for cycling through displays
- **Time-based Controls**: Configure display timing and rotation intervals
- **Automated Cycling**: Seamless transitions between different KPI displays
- **Playback Controls**: Start, stop, and manage playlist playback

### ⚙️ Threshold Management

- **Intuitive Configuration**: User-friendly forms for setting up KPI thresholds
- **Direction Intelligence**: Automatic detection of whether higher or lower values are better
- **Validation**: Real-time validation of threshold configurations
- **Bulk Operations**: Manage multiple thresholds efficiently
- **Historical Tracking**: Track threshold changes over time

### 📱 User Experience

- **Modern UI/UX**: Clean, intuitive interface with smooth Framer Motion animations
- **Progressive Loading**: Efficient data loading with pagination and virtual scrolling
- **Error Handling**: Graceful error handling with user-friendly messages
- **Accessibility**: ARIA compliant and keyboard navigable interface
- **Mobile Responsive**: Full functionality across desktop, tablet, and mobile devices

### 📈 Data Analysis & Export

- **Advanced Filtering**: Support for complex MongoDB queries and filters
- **Statistical Analysis**: Built-in statistical functions for threshold calculation
- **Excel Export**: Export KPI data and analysis results to Excel format
- **File Upload**: Support for importing data via file uploads
- **Data Visualization**: Interactive tables with sorting, filtering, and pagination

## 🔧 Configuration

### Environment Variables

#### Backend (.env)
```env
# Database Configuration
MONGO_URI=mongodb://localhost:27017/kpi_database

# Server Configuration
PORT=5000
NODE_ENV=development

# CORS Configuration
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:5173

# Optional: Authentication (if implemented)
JWT_SECRET=your_super_secure_jwt_secret

# Optional: Email Configuration (for notifications)
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
| `GET` | `/api/collectionList` | Get all available MongoDB collections |
| `GET` | `/api/find/:collection` | Get paginated collection data with filtering |
| `GET` | `/api/collectionFields/:collection` | Get collection field schema and metadata |
| `POST` | `/kpi-api/analyze` | Perform KPI analysis with RAG categorization |
| `GET/POST/PUT/DELETE` | `/threshold-api/thresholds` | Threshold CRUD operations |
| `GET/POST/PUT/DELETE` | `/display-api/displays` | Display configuration CRUD operations |
| `GET/POST/PUT/DELETE` | `/screen-api/screens` | Screen management CRUD operations |
| `POST` | `/file-api/upload` | File upload and processing |

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
- **Commit Messages**: Use conventional commit format for better project history
- **Documentation**: Update README files and inline documentation for significant changes
- **Testing**: Add comprehensive tests for new features and bug fixes
- **Security**: Follow security best practices for both client and server code
- **Performance**: Optimize queries and component rendering for better performance
- **Accessibility**: Ensure all new UI components meet accessibility standards

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

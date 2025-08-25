# KPI Display Scoreboard - Frontend

A modern, responsive React application for KPI (Key Performance Indicator) dashboard visualization with dynamic threshold management and real-time data analysis. Built with React 19, Vite, Styled Components, and Framer Motion for smooth animations.

## 🚀 Features

- **📊 Dynamic KPI Dashboards**: Interactive scoreboard displays with real-time data visualization
- **⚙️ Threshold Configuration**: Intuitive form-based threshold setup with intelligent suggestions
- **🎯 RAG Analysis**: Red-Amber-Green categorization for performance monitoring
- **📈 Data Visualization**: Interactive data tables with sorting, filtering, and pagination
- **🎨 Modern UI/UX**: Responsive design with smooth animations and transitions
- **🔄 Live Preview**: Real-time preview of KPI configurations before deployment
- **📱 Mobile Responsive**: Optimized for desktop, tablet, and mobile devices
- **🎭 Framer Motion**: Smooth page transitions and micro-interactions
- **💾 Local Storage**: Persistent data storage for configuration states
- **📊 Excel Export**: Export KPI data and analysis results to Excel format
- **🚀 Fast Development**: Hot Module Replacement (HMR) with Vite
- **🔍 Smart Field Detection**: Automatic field type detection and threshold suggestions

## 📋 Table of Contents

- [Quick Start](#quick-start)
- [Project Structure](#project-structure)
- [Components](#components)
- [Routing](#routing)
- [Styling](#styling)
- [API Integration](#api-integration)
- [Development](#development)
- [Build & Deployment](#build--deployment)
- [Contributing](#contributing)

## 🚀 Quick Start

### Prerequisites

- **Node.js** v18 or higher
- **Yarn** package manager v4.9.2+
- Backend API server running (see backend README)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/micromaxdev/kpi-display-scoreboard.git
   cd kpi-display-scoreboard/frontend
   ```

2. **Install dependencies**
   ```bash
   yarn install
   ```

3. **Environment Configuration**
   Create a `.env` file in the root directory:
   ```env
   # Backend API URL
   VITE_API_BASE_URL=http://localhost:5000
   ```

4. **Start the development server**
   ```bash
   yarn dev
   ```
   The application will be available at `http://localhost:5173`

5. **Verify installation**
   - Open your browser to `http://localhost:5173`
   - You should see the Threshold Configuration form

## 🏗️ Project Structure

```
frontend/
├── 📁 public/
│   └── vite.svg                     # Vite logo
├── 📁 src/
│   ├── 📄 main.jsx                  # Application entry point
│   ├── 📄 App.jsx                   # Main App component with routing
│   ├── 📄 App.css                   # Global application styles
│   ├── 📄 index.css                 # Base CSS styles
│   │
│   ├── 📁 assets/
│   │   └── react.svg                # React logo
│   │
│   ├── 📁 components/
│   │   ├── ThresholdForm.jsx        # Main threshold configuration form
│   │   ├── KPIAnalysisPage.jsx      # KPI analysis dashboard page
│   │   ├── KPIAnalysisLayout.jsx    # Layout component for KPI display
│   │   ├── PreviewPage.jsx          # Preview page for configurations
│   │   └── CollectionDataTable.jsx  # Data table with advanced features
│   │
│   ├── 📁 hooks/
│   │   └── useThresholdForm.js      # Custom hook for form state management
│   │
│   ├── 📁 services/
│   │   └── apiService.js            # API integration and HTTP requests
│   │
│   ├── 📁 styles/
│   │   ├── CollectionDataTable.styled.js  # Styled components for data table
│   │   ├── KpiLayout.styled.js            # Styled components for KPI layout
│   │   └── ThresholdForm.styled.js        # Styled components for forms
│   │
│   └── 📁 utils/
│       ├── fieldUtils.js            # Field type detection and utilities
│       └── formUtils.js             # Form validation and formatting utilities
│
├── 📄 package.json                  # Dependencies and scripts
├── 📄 vite.config.js                # Vite configuration
├── 📄 eslint.config.js              # ESLint configuration
├── 📄 index.html                    # Main HTML template
├── 📄 .env                          # Environment variables
└── 📄 README.md                     # Project documentation
```

## 🧩 Components

### Core Components

#### 🎯 `ThresholdForm.jsx`
The main component for configuring KPI thresholds:
- **Collection Selection**: Choose from available MongoDB collections
- **Field Selection**: Automatic field discovery and type detection
- **Threshold Configuration**: Set Green/Amber thresholds with intelligent suggestions
- **Direction Selection**: Choose performance direction (higher/lower is better)
- **Live Data Preview**: Real-time data table with filtering and sorting
- **Smart Suggestions**: AI-powered threshold and direction recommendations

#### 📊 `KPIAnalysisPage.jsx`
Dynamic KPI dashboard page:
- **Real-time Analysis**: Live KPI performance analysis with RAG categorization
- **Responsive Layout**: Adaptive grid layout for different screen sizes
- **Data Refresh**: Automatic and manual data refresh capabilities
- **URL Parameters**: Dynamic routing based on display configuration names

#### 🎨 `KPIAnalysisLayout.jsx`
Reusable layout component for KPI displays:
- **Grid System**: Responsive grid layout for KPI cards
- **Animation Support**: Smooth transitions with Framer Motion
- **Category Grouping**: Organize KPIs by Red, Amber, Green categories
- **Customizable Styling**: Theme-aware styling with styled-components

#### 📋 `CollectionDataTable.jsx`
Advanced data table component:
- **Sorting**: Multi-column sorting with visual indicators
- **Pagination**: Efficient pagination for large datasets
- **Search/Filter**: Real-time search and filtering capabilities
- **Responsive Design**: Mobile-optimized table layout
- **Animation**: Smooth row transitions and loading states

#### 👀 `PreviewPage.jsx`
Preview component for testing configurations:
- **Live Preview**: Real-time preview of KPI configurations
- **Export Functionality**: Excel export of analysis results
- **Navigation**: Easy navigation back to configuration form

### Utility Components

#### 🔧 Custom Hooks
- **`useThresholdForm.js`**: Manages complex form state, validation, and API interactions

#### 🛠️ Utilities
- **`fieldUtils.js`**: Field type detection, direction suggestions, data type analysis
- **`formUtils.js`**: Form validation, formatting, and placeholder text generation

## 🛣️ Routing

The application uses React Router for navigation:

```jsx
// Route Configuration
<Routes>
  <Route path="/" element={<ThresholdForm />} />
  <Route path="/preview" element={<PreviewPage />} />
  <Route path="/:displayName" element={<KPIAnalysisPage />} />
</Routes>
```

### Route Details

| Route | Component | Description |
|-------|-----------|-------------|
| `/` | `ThresholdForm` | Main configuration page for setting up KPI thresholds |
| `/preview` | `PreviewPage` | Preview page for testing configurations before saving |
| `/:displayName` | `KPIAnalysisPage` | Dynamic KPI dashboard based on saved display configuration |

## 🎨 Styling

### Styled Components Architecture

The application uses **styled-components** for CSS-in-JS styling:

- **`ThresholdForm.styled.js`**: Form components, input fields, buttons, and layout
- **`KpiLayout.styled.js`**: KPI dashboard layouts, cards, and responsive grids
- **`CollectionDataTable.styled.js`**: Data table styling, pagination, and interactive elements

### Design System

- **Colors**: Consistent color palette with theme support
- **Typography**: Responsive typography scales
- **Spacing**: Consistent spacing using styled-components props
- **Animations**: Framer Motion integration for smooth transitions

### Responsive Design

- **Mobile First**: Progressive enhancement from mobile to desktop
- **Breakpoints**: Responsive breakpoints for tablet and desktop layouts
- **Grid System**: CSS Grid and Flexbox for adaptive layouts

## 🔌 API Integration

### API Service (`apiService.js`)

Centralized API service for backend communication:

```javascript
// Key API Functions
- fetchCollections()          // Get available MongoDB collections
- fetchCollectionFields()     // Get fields for a specific collection
- analyzeKPIData()           // Perform KPI analysis with thresholds
- fetchDisplayConfig()       // Get saved display configurations
- downloadExcel()            // Export data to Excel format
```

### Error Handling

- **Network Errors**: Graceful handling of connection issues
- **Validation Errors**: User-friendly error messages
- **Loading States**: Visual feedback during API calls
- **Retry Logic**: Automatic retry for failed requests

## 🛠️ Development

### Available Scripts

```bash
# Start development server with HMR
yarn dev

# Build for production
yarn build

# Preview production build locally
yarn preview

# Run ESLint linting
yarn lint
```

### Development Guidelines

1. **Component Structure**: Use functional components with hooks
2. **Styling**: Use styled-components for component-specific styles
3. **State Management**: Utilize React hooks and custom hooks for state
4. **API Calls**: Use the centralized `apiService.js` for all backend communication
5. **Error Handling**: Implement proper error boundaries and user feedback
6. **Performance**: Use React.memo and useMemo for optimization where needed

### Environment Variables

| Variable | Description | Default | Required |
|----------|-------------|---------|----------|
| `VITE_API_BASE_URL` | Backend API base URL | `http://localhost:5000` | ✅ |

### Hot Module Replacement (HMR)

Vite provides fast HMR for instant development feedback:
- **React Fast Refresh**: Preserves component state during development
- **CSS Hot Reload**: Instant style updates without page refresh
- **Asset Hot Reload**: Automatic asset refresh on changes

## 🚀 Build & Deployment

### Production Build

```bash
# Create optimized production build
yarn build

# Preview production build locally
yarn preview
```

### Build Output

The build process generates:
- **Optimized JavaScript**: Minified and tree-shaken bundles
- **CSS Extraction**: Optimized CSS files
- **Asset Optimization**: Compressed images and static assets
- **Modern Bundles**: ES2020+ modules for modern browsers

### Deployment Options

#### Static Hosting (Recommended)
```bash
# Build and deploy to any static host
yarn build
# Upload the 'dist' folder to your hosting provider
```
#### Environment-Specific Builds
```bash
# Development build
VITE_API_BASE_URL=http://localhost:5000 yarn build

# Production build
VITE_API_BASE_URL=https://api.yourprodurl.com yarn build
```

## 📦 Dependencies

### Production Dependencies

- **react** ^19.1.1 - React library for building user interfaces
- **react-dom** ^19.1.1 - React DOM rendering
- **styled-components** ^6.1.19 - CSS-in-JS styling solution
- **framer-motion** ^12.23.12 - Animation library for React

### Development Dependencies

- **@vitejs/plugin-react** ^4.7.0 - Vite React plugin with Fast Refresh
- **vite** ^7.1.0 - Next generation frontend build tool
- **eslint** ^9.32.0 - JavaScript/React linting
- **eslint-plugin-react-hooks** ^5.2.0 - React Hooks linting rules
- **eslint-plugin-react-refresh** ^0.4.20 - React Fast Refresh linting
- **@types/react** ^19.1.9 - TypeScript definitions for React
- **@types/react-dom** ^19.1.7 - TypeScript definitions for React DOM

### Code Style

- Use ESLint configuration provided
- Follow React best practices and hooks rules
- Use styled-components for styling
- Write descriptive component and function names
- Add comments for complex logic

## 📞 Support

For support and questions:
- **Repository**: [kpi-display-scoreboard](https://github.com/micromaxdev/kpi-display-scoreboard)
- **Issues**: [GitHub Issues](https://github.com/micromaxdev/kpi-display-scoreboard/issues)
- **Frontend Issues**: Use the `frontend` label when creating issues

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](../LICENSE) file for details.

---

Built with ❤️ using React 19, Vite, and modern web technologies by [Micromax Dev](https://github.com/micromaxdev)

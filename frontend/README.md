# KPI Display Scoreboard - Frontend

A modern, responsive React application for KPI (Key Performance Indicator) dashboard visualization with dynamic threshold management, screen configuration, playlist management, and real-time data analysis. Built with React 19, Vite, React Router, Styled Components, and Framer Motion for smooth animations.

## 🚀 Features

- **📊 Dynamic KPI Dashboards**: Interactive scoreboard displays with real-time data visualization
- **⚙️ Threshold Configuration**: Intuitive form-based threshold setup with intelligent suggestions
- **🎯 RAG Analysis**: Red-Amber-Green categorization for performance monitoring
- **📈 Data Visualization**: Interactive data tables with sorting, filtering, and pagination
- **🎨 Modern UI/UX**: Responsive design with smooth animations and transitions
- **🔄 Live Preview**: Real-time preview of KPI configurations before deployment
- **📺 Screen Management**: Configure and manage multiple display screens
- **🎵 Playlist Configuration**: Automated playlist management for cycling through displays
- **� File Upload**: Upload and process Excel/CSV files for data import
- **�📱 Mobile Responsive**: Optimized for desktop, tablet, and mobile devices
- **🎭 Framer Motion**: Smooth page transitions and micro-interactions
- **💾 Local Storage**: Persistent data storage for configuration states
- **📊 Excel Export**: Export KPI data and analysis results to Excel format
- **🚀 Fast Development**: Hot Module Replacement (HMR) with Vite
- **🔍 Smart Field Detection**: Automatic field type detection and threshold suggestions
- **🧭 Dynamic Navigation**: Context-aware navigation with conditional rendering

## 📋 Table of Contents

- [Quick Start](#quick-start)
- [Project Structure](#project-structure)
- [Components](#components)
- [Pages](#pages)
- [Routing](#routing)
- [Styling](#styling)
- [API Integration](#api-integration)
- [Custom Hooks](#custom-hooks)
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
   - You should see the Threshold Configuration form with navigation
   - Test navigation between different pages:
     - **Main Page (/)**: Threshold configuration form
     - **Preview (/show-preview)**: Preview configured thresholds
     - **Screens (/screens)**: Screen configuration and management
     - **Playlist (/playlist)**: Playlist configuration and automation
   - Test collection selection and threshold configuration
   - Verify modal functionality (file upload, create screen, etc.)

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
│   │   ├── 📁 config/              # Configuration components
│   │   │   ├── ThresholdConfig.jsx         # Threshold configuration
│   │   │   └── TimeSettings.jsx            # Time-based settings
│   │   ├── 📁 data/                # Data display components
│   │   │   ├── CollectionDataTable.jsx    # Data table with advanced features
│   │   │   ├── SavedThresholdsList.jsx    # Saved thresholds list
│   │   │   ├── ThresholdInfoPanel.jsx     # Threshold information panel
│   │   │   └── ThresholdsList.jsx         # Thresholds list component
│   │   ├── 📁 forms/               # Form components
│   │   │   ├── DisplayActions.jsx          # Display action controls
│   │   │   ├── FormActions.jsx             # Generic form actions
│   │   │   └── ThresholdForm.jsx           # Main threshold configuration form
│   │   ├── 📁 layout/              # Layout components
│   │   │   ├── KPIAnalysisLayout.jsx       # Layout component for KPI display
│   │   │   └── Navigation.jsx              # Navigation component
│   │   ├── 📁 modals/              # Modal components
│   │   │   ├── CreateDisplayModal.jsx      # Create display modal
│   │   │   ├── CreateScreenModal.jsx       # Create screen modal
│   │   │   ├── DeleteDisplayModal.jsx      # Delete display modal
│   │   │   ├── DeleteScreenModal.jsx       # Delete screen modal
│   │   │   ├── DeleteThresholdModal.jsx    # Delete threshold modal
│   │   │   ├── ExcludedFieldsModal.jsx     # Excluded fields modal
│   │   │   └── FileUploadModal.jsx         # File upload modal
│   │   ├── 📁 pages/               # Page components
│   │   │   ├── KPIAnalysisPage.jsx         # KPI analysis dashboard page
│   │   │   ├── PlaylistConfigPage.jsx      # Playlist configuration page
│   │   │   ├── PreviewPage.jsx             # Preview page for configurations
│   │   │   └── ScreenConfigPage.jsx        # Screen configuration page
│   │   └── 📁 selectors/           # Selector components
│   │       ├── CollectionSelector.jsx      # Collection selector
│   │       ├── DisplaySelector.jsx         # Display selector
│   │       └── FieldSelector.jsx           # Field selector
│   │
│   ├── 📁 hooks/                    # Custom React hooks
│   │   ├── useConfirmationModal.js         # Confirmation modal hook
│   │   ├── useControlledDisplay.js         # Display control hook
│   │   ├── useDisplayManagement.js         # Display management hook
│   │   ├── useDisplayOptions.js            # Display options hook
│   │   ├── useDisplaySelector.js           # Display selector hook
│   │   ├── useDisplayTime.js               # Display time hook
│   │   └── useThresholdForm.js             # Threshold form state management
│   │
│   ├── 📁 services/                 # API integration
│   │   ├── apiService.js                   # Main API service for backend communication
│   │   └── displayService.js               # Display-specific services
│   │
│   ├── 📁 styles/                   # Styled components
│   │   ├── CollectionDataTable.styled.js  # Data table styles
│   │   ├── DisplaySelector.styled.js      # Display selector styles
│   │   ├── ExcludedFieldsModal.styled.js  # Excluded fields modal styles
│   │   ├── FileUploadModal.styled.js      # File upload modal styles
│   │   ├── KpiLayout.styled.js            # KPI layout styles
│   │   ├── ScreenConfig.styled.js         # Screen configuration styles
│   │   └── ThresholdForm.styled.js        # Threshold form styles
│   │
│   └── 📁 utils/                    # Frontend utilities
│       ├── fieldUtils.js                  # Field type detection and utilities
│       └── formUtils.js                   # Form validation and formatting utilities
│
├── 📄 package.json                  # Dependencies and scripts
├── 📄 vite.config.js                # Vite configuration
├── 📄 eslint.config.js              # ESLint configuration
├── 📄 index.html                    # Main HTML template
├── 📄 .env                          # Environment variables
└── 📄 README.md                     # Project documentation
```
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

### Core Form Components

#### 🎯 `ThresholdForm.jsx` (forms/)
The main component for configuring KPI thresholds:
- **Collection Selection**: Choose from available MongoDB collections
- **Field Selection**: Automatic field discovery and type detection
- **Threshold Configuration**: Set Green/Amber thresholds with intelligent suggestions
- **Direction Selection**: Choose performance direction (higher/lower is better)
- **Live Data Preview**: Real-time data table with filtering and sorting
- **Smart Suggestions**: AI-powered threshold and direction recommendations

#### 🎛️ `DisplayActions.jsx` (forms/)
Action controls for display management:
- **Save Display**: Save current configuration as a display
- **Load Display**: Load existing display configurations
- **Display Navigation**: Navigate to saved displays

#### 🔧 `FormActions.jsx` (forms/)
Generic form action components:
- **Submit Buttons**: Standardized submit and cancel actions
- **Validation Feedback**: Real-time form validation display
- **Loading States**: Visual feedback during form submission

### Configuration Components

#### ⚙️ `ThresholdConfig.jsx` (config/)
Advanced threshold configuration:
- **Threshold Management**: Create, edit, and delete thresholds
- **Bulk Operations**: Manage multiple thresholds simultaneously
- **Configuration Validation**: Real-time validation of threshold settings

#### ⏰ `TimeSettings.jsx` (config/)
Time-based configuration settings:
- **Display Timing**: Configure rotation intervals for displays
- **Time Zones**: Handle different time zone configurations
- **Scheduling**: Set up automated display schedules

### Data Display Components

#### 📋 `CollectionDataTable.jsx` (data/)
Advanced data table component:
- **Sorting**: Multi-column sorting with visual indicators
- **Pagination**: Efficient pagination for large datasets
- **Search/Filter**: Real-time search and filtering capabilities
- **Responsive Design**: Mobile-optimized table layout
- **Animation**: Smooth row transitions and loading states

#### 📊 `SavedThresholdsList.jsx` (data/)
Display component for saved threshold configurations:
- **Threshold List**: Display all saved threshold configurations
- **Quick Actions**: Edit, delete, and duplicate thresholds
- **Search and Filter**: Find specific threshold configurations

#### ℹ️ `ThresholdInfoPanel.jsx` (data/)
Information panel for threshold details:
- **Threshold Details**: Display comprehensive threshold information
- **Performance Metrics**: Show threshold performance statistics
- **Historical Data**: Display threshold usage over time

#### 📋 `ThresholdsList.jsx` (data/)
List component for threshold management:
- **Active Thresholds**: Display currently active thresholds
- **Status Indicators**: Visual status indicators for threshold health
- **Quick Edit**: Inline editing capabilities

### Layout Components

#### �️ `KPIAnalysisLayout.jsx` (layout/)
Reusable layout component for KPI displays:
- **Grid System**: Responsive grid layout for KPI cards
- **Animation Support**: Smooth transitions with Framer Motion
- **Category Grouping**: Organize KPIs by Red, Amber, Green categories
- **Customizable Styling**: Theme-aware styling with styled-components

#### 🧭 `Navigation.jsx` (layout/)
Main navigation component:
- **Route Navigation**: Navigation between different application pages
- **Conditional Rendering**: Context-aware navigation display
- **Responsive Design**: Mobile-optimized navigation menu
- **Active State**: Visual indication of current page

### Modal Components

#### 🆕 `CreateDisplayModal.jsx` (modals/)
Modal for creating new display configurations:
- **Display Creation**: Form for creating new displays
- **Validation**: Real-time validation of display settings
- **Preview**: Preview display before saving

#### 📺 `CreateScreenModal.jsx` (modals/)
Modal for screen configuration:
- **Screen Setup**: Configure new screen settings
- **URL Configuration**: Set up screen URLs and routing
- **Screen Management**: Manage multiple screen configurations

#### 🗑️ `DeleteDisplayModal.jsx` (modals/)
Confirmation modal for display deletion:
- **Confirmation**: Confirm display deletion with safety checks
- **Dependency Check**: Check for dependencies before deletion
- **Batch Delete**: Support for deleting multiple displays

#### �️ `DeleteScreenModal.jsx` (modals/)
Confirmation modal for screen deletion:
- **Screen Deletion**: Safely delete screen configurations
- **Impact Assessment**: Show impact of screen deletion
- **Confirmation**: Multi-step confirmation process

#### 🗑️ `DeleteThresholdModal.jsx` (modals/)
Confirmation modal for threshold deletion:
- **Threshold Deletion**: Safely remove threshold configurations
- **Usage Check**: Check if threshold is currently in use
- **Backup Options**: Option to backup before deletion

#### 🚫 `ExcludedFieldsModal.jsx` (modals/)
Modal for managing excluded fields:
- **Field Management**: Select fields to exclude from analysis
- **Field Preview**: Preview impact of field exclusion
- **Bulk Actions**: Exclude/include multiple fields at once

#### 📁 `FileUploadModal.jsx` (modals/)
Modal for file upload functionality:
- **File Upload**: Upload Excel/CSV files for data import
- **File Validation**: Validate file format and structure
- **Preview**: Preview file data before import
- **Progress Tracking**: Show upload progress with status updates

### Selector Components

#### � `CollectionSelector.jsx` (selectors/)
Component for selecting MongoDB collections:
- **Collection List**: Display available collections
- **Search**: Search through collections
- **Metadata**: Show collection information and document counts

#### �️ `DisplaySelector.jsx` (selectors/)
Component for selecting display configurations:
- **Display List**: Show all available displays
- **Quick Preview**: Preview display configurations
- **Recent Displays**: Show recently used displays

#### 🏷️ `FieldSelector.jsx` (selectors/)
Component for selecting collection fields:
- **Field List**: Display available fields with type information
- **Field Preview**: Preview field data and statistics
- **Multi-Select**: Select multiple fields for analysis

## 📄 Pages

### 📊 `KPIAnalysisPage.jsx` (pages/)
Dynamic KPI dashboard page:
- **Real-time Analysis**: Live KPI performance analysis with RAG categorization
- **Responsive Layout**: Adaptive grid layout for different screen sizes
- **Data Refresh**: Automatic and manual data refresh capabilities
- **URL Parameters**: Dynamic routing based on display configuration names
- **Category Display**: Organized display of Red, Amber, Green KPI categories

### 🎵 `PlaylistConfigPage.jsx` (pages/)
Playlist configuration and management page:
- **Playlist Creation**: Create and configure automated playlists
- **Display Scheduling**: Schedule displays for automatic rotation
- **Timing Controls**: Configure rotation intervals and timing
- **Playlist Management**: Edit, delete, and organize playlists

### 👀 `PreviewPage.jsx` (pages/)
Preview page for testing configurations:
- **Live Preview**: Real-time preview of KPI configurations
- **Export Functionality**: Excel export of analysis results
- **Navigation**: Easy navigation back to configuration form
- **Configuration Testing**: Test threshold configurations before saving

### 📺 `ScreenConfigPage.jsx` (pages/)
Screen configuration and management page:
- **Screen Management**: Create, edit, and delete screen configurations
- **URL Configuration**: Set up screen URLs and routing parameters
- **Display Assignment**: Assign displays to specific screens
- **Screen Monitoring**: Monitor screen status and performance

## 🛣️ Routing

The application uses React Router DOM v7.8.2 for navigation:

```jsx
// Route Configuration
<Routes>
  <Route path="/" element={<ThresholdForm />} />
  <Route path="/show-preview" element={<PreviewPage />} />
  <Route path="/screens" element={<ScreenConfigPage />} />
  <Route path="/playlist" element={<PlaylistConfigPage />} />
  <Route path="/shows/:displayName" element={<AnalyzePage />} />
</Routes>
```

### Route Details

| Route | Component | Description |
|-------|-----------|-------------|
| `/` | `ThresholdForm` | Main configuration page for setting up KPI thresholds |
| `/show-preview` | `PreviewPage` | Preview page for testing configurations before saving |
| `/screens` | `ScreenConfigPage` | Screen configuration and management page |
| `/playlist` | `PlaylistConfigPage` | Playlist configuration and automated rotation setup |
| `/shows/:displayName` | `KPIAnalysisPage` | Dynamic KPI dashboard based on saved display configuration |

### Navigation Features

- **Conditional Navigation**: Navigation component only shows on specific pages
- **Dynamic Parameters**: URL parameters for display-specific routing
- **Context-Aware**: Navigation adapts based on current page context
- **Responsive**: Mobile-optimized navigation with adaptive menu

## 🎨 Styling

### Styled Components Architecture

The application uses **styled-components** v6.1.19 for CSS-in-JS styling:

- **`CollectionDataTable.styled.js`**: Data table styling, pagination, and interactive elements
- **`DisplaySelector.styled.js`**: Display selector components and dropdown styling
- **`ExcludedFieldsModal.styled.js`**: Excluded fields modal styling and field selection
- **`FileUploadModal.styled.js`**: File upload modal, progress indicators, and file preview
- **`KpiLayout.styled.js`**: KPI dashboard layouts, cards, and responsive grids
- **`ScreenConfig.styled.js`**: Screen configuration page styling and form elements
- **`ThresholdForm.styled.js`**: Form components, input fields, buttons, and layout

### Design System

- **Colors**: Consistent color palette with theme support and RAG categorization colors
- **Typography**: Responsive typography scales with proper font hierarchy
- **Spacing**: Consistent spacing using styled-components props and theme values
- **Components**: Reusable styled components for consistent UI elements
- **Animations**: Framer Motion integration for smooth transitions

### Responsive Design

- **Mobile First**: Progressive enhancement from mobile to desktop
- **Breakpoints**: Responsive breakpoints for tablet and desktop layouts
- **Grid System**: CSS Grid and Flexbox for adaptive layouts

## 🔌 API Integration

### API Services

#### `apiService.js`
Centralized API service for backend communication:

```javascript
// Key API Functions
- fetchCollections()              // Get available MongoDB collections
- fetchCollectionFields()         // Get fields for a specific collection
- analyzeKPIData()               // Perform KPI analysis with thresholds
- fetchDisplayConfig()           // Get saved display configurations
- downloadExcel()                // Export data to Excel format
- fetchScreenConfig()            // Get screen configuration by name
- uploadFile()                   // Upload files for data import
```

#### `displayService.js`
Display-specific API services:

```javascript
// Display Management Functions
- createDisplay()                // Create new display configurations
- updateDisplay()                // Update existing displays
- deleteDisplay()                // Remove display configurations
- getAllDisplays()               // Get all available displays
```

### Error Handling

- **Network Errors**: Graceful handling of connection issues with retry logic
- **Validation Errors**: User-friendly error messages with field-specific feedback
- **Loading States**: Visual feedback during API calls with progress indicators
- **Retry Logic**: Automatic retry for failed requests with exponential backoff
- **Error Boundaries**: React error boundaries for graceful error recovery

## 🪝 Custom Hooks

### State Management Hooks

#### `useThresholdForm.js`
Manages complex threshold form state, validation, and API interactions:
- **Form State**: Centralized state management for threshold configuration
- **Validation**: Real-time validation with error handling
- **API Integration**: Seamless integration with backend services
- **Data Persistence**: Local storage integration for form data

#### `useDisplayManagement.js`
Handles display configuration and management:
- **Display CRUD**: Create, read, update, delete operations for displays
- **State Synchronization**: Keep display state synchronized across components
- **Error Handling**: Comprehensive error handling for display operations

#### `useDisplaySelector.js`
Manages display selection and navigation:
- **Display Selection**: Handle display selection logic
- **Navigation**: Programmatic navigation to selected displays
- **State Management**: Maintain selected display state

#### `useDisplayTime.js`
Manages time-related display functionality:
- **Time Tracking**: Track display timing and rotation intervals
- **Scheduling**: Handle automated display scheduling
- **Timer Management**: Manage countdown timers and intervals

#### `useDisplayOptions.js`
Handles display configuration options:
- **Options Management**: Manage display configuration options
- **Settings Persistence**: Persist display settings across sessions
- **Default Values**: Provide sensible defaults for display options

### UI Interaction Hooks

#### `useConfirmationModal.js`
Manages confirmation modal state and interactions:
- **Modal State**: Control modal visibility and content
- **Confirmation Logic**: Handle user confirmation for critical actions
- **Callback Management**: Manage confirmation and cancellation callbacks

#### `useControlledDisplay.js`
Handles controlled display functionality:
- **Display Control**: Control display start, stop, and pause operations
- **State Management**: Manage controlled display state
- **Event Handling**: Handle display control events and user interactions

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
- **react-router-dom** ^7.8.2 - Declarative routing for React applications
- **styled-components** ^6.1.19 - CSS-in-JS styling solution
- **framer-motion** ^12.23.12 - Animation library for React

### Development Dependencies

- **@vitejs/plugin-react** ^4.7.0 - Vite React plugin with Fast Refresh
- **vite** ^7.1.0 - Next generation frontend build tool
- **eslint** ^9.32.0 - JavaScript/React linting
- **eslint-plugin-react-hooks** ^5.2.0 - React Hooks linting rules
- **eslint-plugin-react-refresh** ^0.4.20 - React Fast Refresh linting
- **@eslint/js** ^9.32.0 - ESLint JavaScript configuration
- **@types/react** ^19.1.9 - TypeScript definitions for React
- **@types/react-dom** ^19.1.7 - TypeScript definitions for React DOM
- **globals** ^16.3.0 - Global variables for various environments

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

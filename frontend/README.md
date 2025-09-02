# Air Quality Prediction Frontend

A modern React-based frontend for the Air Quality Prediction system, featuring an intuitive dashboard, prediction forms, and real-time model monitoring.

## Features

- **📊 Interactive Dashboard**: Visualize air quality data with charts and statistics
- **🔮 Prediction Interface**: User-friendly form for inputting environmental parameters
- **⚙️ Model Management**: Train models and monitor system status
- **📱 Responsive Design**: Works seamlessly on desktop and mobile devices
- **🎨 Modern UI**: Built with Tailwind CSS for a beautiful, professional appearance

## Technology Stack

- **React 18**: Modern React with hooks and functional components
- **Tailwind CSS**: Utility-first CSS framework for rapid UI development
- **Recharts**: Beautiful and responsive charts for data visualization
- **React Hook Form**: Performant forms with easy validation
- **React Hot Toast**: Elegant notifications and user feedback

## Getting Started

### Prerequisites

- Node.js 16+
- npm or yarn package manager
- Backend API running on `http://localhost:5000`

### Installation

1. **Install dependencies:**

   ```bash
   npm install
   ```

2. **Start the development server:**

   ```bash
   npm start
   ```

3. **Open your browser:**
   Navigate to `http://localhost:3000`

### Building for Production

```bash
npm run build
```

The build artifacts will be stored in the `build/` directory.

## Project Structure

```
frontend/
├── public/                 # Static files
│   └── index.html         # Main HTML template
├── src/                   # Source code
│   ├── components/        # React components
│   │   ├── Header.js     # Navigation header
│   │   ├── Dashboard.js  # Main dashboard view
│   │   ├── PredictionForm.js # Prediction interface
│   │   ├── ModelStatus.js # Model monitoring
│   │   └── Footer.js     # Page footer
│   ├── App.js            # Main application component
│   ├── index.js          # Application entry point
│   └── index.css         # Global styles and Tailwind
├── package.json          # Dependencies and scripts
├── tailwind.config.js    # Tailwind CSS configuration
└── postcss.config.js     # PostCSS configuration
```

## Component Overview

### Header

- Navigation tabs (Dashboard, Predict, Model Status)
- Model status indicator
- Responsive design with mobile support

### Dashboard

- Welcome section with system overview
- Quick stats cards for pollutants
- Interactive charts (time series, feature importance)
- System features showcase

### PredictionForm

- Model training and dataset download
- Input form for environmental parameters
- Real-time prediction results
- Pollutant status indicators

### ModelStatus

- System health monitoring
- Model information and performance metrics
- Training history and accuracy data
- System requirements documentation

### Footer

- Project information and links
- Technology stack overview
- Social and documentation links

## API Integration

The frontend communicates with the backend API through the following endpoints:

- `GET /health` - Check API health and model status
- `GET /model-info` - Get detailed model information
- `POST /train` - Train the machine learning model
- `POST /predict` - Make air quality predictions
- `POST /download-dataset` - Download training dataset

## Styling

The application uses Tailwind CSS with custom component classes:

- `.btn-primary` - Primary action buttons
- `.btn-secondary` - Secondary action buttons
- `.btn-danger` - Destructive action buttons
- `.input-field` - Form input fields
- `.card` - Content containers
- `.card-header` - Card headers with titles

## Customization

### Colors

The color scheme can be customized in `tailwind.config.js`:

```javascript
colors: {
  primary: { /* Custom primary colors */ },
  secondary: { /* Custom secondary colors */ },
  danger: { /* Custom danger colors */ }
}
```

### Components

All components are modular and can be easily customized or extended. The styling is consistent and follows a design system approach.

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Development

### Code Style

- Functional components with hooks
- Consistent naming conventions
- Responsive design principles
- Accessibility considerations

### Adding New Features

1. Create new component in `src/components/`
2. Add routing in `App.js` if needed
3. Update navigation in `Header.js`
4. Add any new dependencies to `package.json`

## Troubleshooting

### Common Issues

1. **Backend Connection Error**

   - Ensure backend is running on port 5000
   - Check CORS configuration
   - Verify API endpoints

2. **Build Errors**

   - Clear `node_modules` and reinstall
   - Check Node.js version compatibility
   - Verify all dependencies are installed

3. **Styling Issues**
   - Ensure Tailwind CSS is properly configured
   - Check PostCSS configuration
   - Verify CSS imports in `index.css`

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support and questions:

- Check the documentation
- Review the code comments
- Open an issue on GitHub
- Contact the development team

# BaggageTrack Pro - Smart Baggage Tracking System

A modern, futuristic baggage tracking system built with NextJS and Python FastAPI, designed for deployment on Azure.

## Features

### 🎯 Core Features
- **Modern Landing Page**: Futuristic design with animated elements
- **Role-based Authentication**: Admin and User roles with different capabilities
- **Real-time Baggage Tracking**: Track baggage by ID or PNR
- **QR Code Generation & Scanning**: Generate QR codes for baggage and scan for updates
- **Admin Dashboard**: Comprehensive management interface
- **User Dashboard**: Simple tracking interface for passengers
- **Flight Management**: View baggage by flight
- **Analytics Dashboard**: Real-time statistics and metrics

### 👨‍💼 Admin Features
- Register baggage with QR code generation
- Bulk baggage registration
- QR code scanning (web-based camera)
- Manual baggage status updates
- Baggage lookup and management
- Flight baggage overview
- Analytics and reporting

### 👤 User Features
- Track baggage by Baggage ID or PNR
- View real-time status updates
- Journey progress visualization
- Tracking history

## Tech Stack

### Frontend
- **NextJS 14** with App Router
- **TypeScript** for type safety
- **Tailwind CSS** for styling
- **Shadcn/ui** + **Aceternity UI** for components
- **Framer Motion** for animations
- **Zustand** for state management

### Backend
- **Python FastAPI** for API
- **In-memory database** (Python dictionaries)
- **JWT authentication**
- **QR code generation** with qrcode library
- **CORS enabled** for frontend integration

## Setup Instructions

### Prerequisites
- Node.js 18+ and npm
- Python 3.8+
- Modern web browser with camera access (for QR scanning)

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Create a virtual environment:
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

3. Install dependencies:
```bash
pip install -r requirements.txt
```

4. Start the FastAPI server:
```bash
python main.py
```

The backend will be available at `http://localhost:8000`

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd baggage-tracking-system
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

The frontend will be available at `http://localhost:3000`

## Default Admin Credentials

The system comes with 10 pre-configured admin users:

| Email | Password | Location | Role |
|-------|----------|----------|------|
| john.smith@airport.com | admin123 | Check-in Counter 1 Delhi Airport | check_in |
| sarah.johnson@airport.com | admin123 | Security Gate A Mumbai Airport | security |
| mike.chen@airport.com | admin123 | Boarding Gate 12 Bangalore Airport | boarding |
| lisa.wang@airport.com | admin123 | Baggage Claim 3 Chennai Airport | baggage_claim |
| david.brown@airport.com | admin123 | Check-in Counter 2 Delhi Airport | check_in |
| emma.davis@airport.com | admin123 | Security Gate B Mumbai Airport | security |
| alex.wilson@airport.com | admin123 | Boarding Gate 8 Bangalore Airport | boarding |
| maria.garcia@airport.com | admin123 | Baggage Claim 1 Chennai Airport | baggage_claim |
| tom.anderson@airport.com | admin123 | Supervisor Office Delhi Airport | supervisor |
| jennifer.lee@airport.com | admin123 | Supervisor Office Mumbai Airport | supervisor |

## Usage Guide

### For Admins

1. **Login**: Use any of the admin credentials above
2. **Register Baggage**: 
   - Go to "Register" tab
   - Enter PNR, passenger details, and flight
   - Add multiple bags if needed
   - Generate QR codes
3. **Scan QR Codes**:
   - Go to "Scan" tab
   - Use camera or manual entry
   - Status updates automatically based on your location
4. **Lookup Baggage**:
   - Search by Baggage ID or PNR
   - Update status manually
   - View tracking history
5. **Flight Management**:
   - View all baggage for specific flights
   - Monitor status distribution
6. **Analytics**:
   - View real-time statistics
   - Monitor system performance

### For Users

1. **Create Account**: Admins can create user accounts
2. **Track Baggage**: 
   - Enter Baggage ID or PNR
   - View real-time status
   - See journey progress
   - Check tracking history

### Public Tracking

- Visit `/track` for public baggage tracking
- No login required
- Enter Baggage ID or PNR to track

## API Endpoints

### Authentication
- `POST /auth/login` - User login
- `POST /users` - Create user (admin only)

### Baggage Management
- `POST /baggage` - Create baggage (admin only)
- `POST /track` - Track baggage (public)
- `POST /scan/{baggage_id}` - Scan baggage (admin only)
- `PUT /baggage/{baggage_id}` - Update baggage (admin only)

### Flight Management
- `GET /flights` - Get all flights
- `GET /flight/{flight_number}/baggage` - Get flight baggage (admin only)

### Analytics
- `GET /dashboard/stats` - Get dashboard statistics (admin only)

## Deployment on Azure

### Frontend (Azure Static Web Apps)
1. Build the NextJS app:
```bash
npm run build
```

2. Deploy to Azure Static Web Apps
3. Configure environment variables for API URL

### Backend (Azure App Service)
1. Create Azure App Service for Python
2. Deploy FastAPI application
3. Configure environment variables
4. Set up CORS for frontend domain

### Optional Enhancements for Production
- Use Azure Cache for Redis for persistent storage
- Implement Azure Communication Services for email notifications
- Add Azure Application Insights for monitoring
- Use Azure Blob Storage for QR code images

## Development Notes

- The system uses in-memory storage, so data resets on server restart
- QR code scanning uses camera simulation in development
- Email notifications are not implemented (placeholder for future)
- Flight data is mock data for demonstration

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.
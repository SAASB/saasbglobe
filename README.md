# SAAS-B Track - Enterprise Location Tracking Platform

> A world-class, consent-based location tracking platform with subscription management, real-time tracking, comprehensive activity logging, and enterprise-grade features.

## 🌟 Features

### 👥 User Management
- User registration with explicit consent verification
- Profile management
- Multi-device support
- Role-based access control (User, Family Admin, Enterprise Admin)
- Account settings and preferences

### 📍 Real-Time Location Tracking
- Live GPS location updates (configurable intervals)
- Geofencing with alerts
- Location history with map visualization
- Battery status monitoring
- Device connectivity status
- Speed tracking
- Movement alerts

### 📊 Comprehensive Activity Logging & Monitoring
- **All Activities Dashboard** - View complete activity timeline
- **Location Events** - Every location update logged with timestamp
- **Device Events** - Battery changes, connectivity, system events
- **User Actions** - App launches, screen views, button clicks
- **Geofence Events** - Entry/exit events with timestamps
- **Payment Events** - All transaction history
- **Account Events** - Login, logout, password changes, settings updates
- **Consent Events** - Consent grants/revokes with audit trail
- **System Events** - App updates, permission changes
- **Export Activities** - Download activity reports (CSV, PDF)
- **Real-time Activity Feed** - Live activity stream
- **Advanced Filtering** - Filter by date, event type, user, device
- **Activity Analytics** - Charts and statistics
- **Admin Activity Audit Log** - All admin actions tracked

### 💳 Subscription & Payment System
- Multiple subscription tiers (Free, Premium, Enterprise)
- Stripe payment integration
- Payment verification and proof of payment
- Automated billing cycles
- Invoice generation and history
- Payment activity logging
- Refund tracking

### 🛡️ Security & Privacy
- End-to-end encryption for location data
- OAuth 2.0 authentication
- Multi-factor authentication (MFA)
- GDPR/CCPA compliance
- Consent management system
- Data retention policies
- Audit logs
- Activity encryption
- Secure activity transmission

### 👨‍💼 Admin Dashboard
- User and subscription management
- Payment verification
- Pricing tier configuration
- Complete activity monitoring for all users
- Analytics and reporting
- Support ticket management
- System monitoring
- Activity log export
- User activity audit trails

### 📱 Mobile Applications
- iOS app (React Native)
- Android app (React Native)
- Real-time location sharing
- Geofencing alerts
- Battery optimization
- Offline mode
- Activity logging on device
- Activity view

### 🔔 Notifications
- Push notifications for alerts
- Email notifications
- SMS alerts (optional)
- In-app notifications
- Activity notifications

### 📊 Analytics & Reporting
- Location history reports
- Usage analytics
- Billing reports
- Custom reports for enterprise
- Activity statistics
- User behavior analytics

## 🏗️ Architecture

```
SAAS-B-Track/
├── backend/                    # Node.js/Express API
│   ├── src/
│   │   ├── routes/            # API routes
│   │   │   ├── auth.js
│   │   │   ├── users.js
│   │   │   ├── devices.js
│   │   │   ├── locations.js
│   │   │   ├── activities.js  # Activity logging routes
│   │   │   ├── subscriptions.js
│   │   │   ├── payments.js
│   │   │   ├── geofences.js
│   │   │   └── admin.js
│   │   ├── controllers/        # Business logic
│   │   │   ├── authController.js
│   │   │   ├── userController.js
│   │   │   ├── deviceController.js
│   │   │   ├── locationController.js
│   │   │   ├── activityController.js
│   │   │   ├── subscriptionController.js
│   │   │   ├── paymentController.js
│   │   │   ├── geofenceController.js
│   │   │   └── adminController.js
│   │   ├── models/            # Database models
│   │   │   ├── User.js
│   │   │   ├── Device.js
│   │   │   ├── Location.js
│   │   │   ├── Activity.js    # Activity model
│   │   │   ├── Subscription.js
│   │   │   ├── Payment.js
│   │   │   ├── Geofence.js
│   │   │   ├── Consent.js
│   │   │   └── AuditLog.js
│   │   ├── middleware/        # Auth, validation
│   │   │   ├── auth.js
│   │   │   ├── errorHandler.js
│   │   │   ├── validation.js
│   │   │   └── activityLogger.js
│   │   ├── services/          # Business services
│   │   │   ├── authService.js
│   │   │   ├── locationService.js
│   │   │   ├── activityService.js
│   │   │   ├── paymentService.js
│   │   │   ├── subscriptionService.js
│   │   │   ├── geofenceService.js
│   │   │   └── notificationService.js
│   │   ├── utils/             # Utilities
│   │   │   ├── encryption.js
│   │   │   ├── validators.js
│   │   │   ├── logger.js
│   │   │   └── helpers.js
│   │   └── config/            # Configuration
│   │       ├── database.js
│   │       ├── redis.js
│   │       └── stripe.js
│   ├── tests/                 # Unit & integration tests
│   ├── .env.example           # Environment variables
│   └── package.json
├── frontend/                   # React Admin Dashboard
│   ├── src/
│   │   ├── components/        # React components
│   │   │   ├── ActivityLog.jsx
│   │   │   ├── ActivityTimeline.jsx
│   │   │   ├── ActivityFilter.jsx
│   │   │   ├── UserActivityMonitor.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Map.jsx
│   │   │   ├── PaymentForm.jsx
│   │   │   └── ...
│   │   ├── pages/             # Page components
│   │   │   ├── ActivityPage.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── UsersPage.jsx
│   │   │   ├── PaymentsPage.jsx
│   │   │   ├── SettingsPage.jsx
│   │   │   └── ...
│   │   ├── services/          # API services
│   │   │   ├── api.js
│   │   │   ├── activityService.js
│   │   │   ├── userService.js
│   │   │   └── ...
│   │   ├── hooks/             # Custom hooks
│   │   │   ├── useAuth.js
│   │   │   ├── useActivity.js
│   │   │   └── ...
│   │   ├── context/           # React context
│   │   │   ├── AuthContext.js
│   │   │   ├── ActivityContext.js
│   │   │   └── ...
│   │   └── styles/            # CSS/SCSS
│   └── package.json
├── mobile/                     # React Native Apps
│   ├── ios/                   # iOS configuration
│   ├── android/               # Android configuration
│   ├── src/
│   │   ├── screens/           # App screens
│   │   │   ├── HomeScreen.js
│   │   │   ├── LocationScreen.js
│   │   │   ├── ActivityScreen.js
│   │   │   ├── SettingsScreen.js
│   │   │   └── ...
│   │   ├── components/        # Components
│   │   │   ├── Map.js
│   │   │   ├── ActivityList.js
│   │   │   ├── LocationCard.js
│   │   │   └── ...
│   │   ├── services/          # API services
│   │   │   ├── api.js
│   │   │   ├── activityService.js
│   │   │   ├── locationService.js
│   │   │   └── ...
│   │   ├── utils/             # Utilities
│   │   │   ├── logger.js
│   │   │   ├── storage.js
│   │   │   ��── ...
│   │   └── navigation/        # Navigation setup
│   └── package.json
├── database/                   # Database schemas
│   ├── migrations/            # Schema migrations
│   │   ├── 001_create_users_table.sql
│   │   ├── 002_create_devices_table.sql
│   │   ├── 003_create_locations_table.sql
│   │   ├── 004_create_activities_table.sql
│   │   ├── 005_create_subscriptions_table.sql
│   │   ├── 006_create_payments_table.sql
│   │   ├── 007_create_geofences_table.sql
│   │   ├── 008_create_consent_table.sql
│   │   └── 009_create_audit_logs_table.sql
│   ├── seeds/                 # Seed data
│   ├── schema.sql             # Complete schema
│   └── indexes.sql            # Performance indexes
├── docker/                     # Docker configuration
│   ├── Dockerfile.backend
│   ├── Dockerfile.frontend
│   ├── Dockerfile.mobile
│   └── docker-compose.yml
├── .github/workflows/          # GitHub Actions
│   ├── ci.yml                 # Testing
│   ├── deploy.yml             # Deployment
│   └── mobile-build.yml       # Mobile builds
└── docs/                       # Documentation
    ├── API.md                 # API documentation
    ├── SETUP.md               # Setup guide
    ├── DEPLOYMENT.md          # Deployment guide
    ├── ARCHITECTURE.md        # Architecture docs
    ├── ACTIVITY_LOGGING.md    # Activity logging guide
    ├── PRIVACY.md             # Privacy policy
    └── TERMS.md               # Terms of service
```

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- PostgreSQL 14+
- Redis 7+
- Xcode (for iOS development)
- Android Studio (for Android development)
- Stripe account
- AWS/Cloud provider account (optional)

### Installation

#### 1. Clone and Setup
```bash
git clone https://github.com/SAASB/saasbglobe.git
cd saasbglobe
cp .env.example .env
```

#### 2. Backend Setup
```bash
cd backend
npm install
npm run migrate
npm run seed
npm start
```

#### 3. Frontend Setup
```bash
cd frontend
npm install
npm start
# Opens http://localhost:3000
```

#### 4. Mobile Setup
```bash
cd mobile
npm install

# iOS
cd ios && pod install && cd ..
npm run ios

# Android
npm run android
```

## 📖 Documentation

- [API Documentation](./docs/API.md)
- [Setup Guide](./docs/SETUP.md)
- [Deployment Guide](./docs/DEPLOYMENT.md)
- [Architecture](./docs/ARCHITECTURE.md)
- [Activity Logging Guide](./docs/ACTIVITY_LOGGING.md)

## 💳 Payment Integration

This platform integrates with **Stripe** for secure payment processing:

- **PCI Compliance**: All payments handled through Stripe
- **Webhook Verification**: Secure webhook signature validation
- **Payment Methods**: Credit cards, digital wallets
- **Recurring Billing**: Automatic subscription renewals
- **Invoice Management**: Automated invoice generation
- **Payment Activity Logging**: All transactions logged

### Setting Up Stripe

1. Create a Stripe account at https://stripe.com
2. Get your API keys from the dashboard
3. Add to `.env`:
   ```
   STRIPE_SECRET_KEY=sk_live_...
   STRIPE_PUBLISHABLE_KEY=pk_live_...
   STRIPE_WEBHOOK_SECRET=whsec_...
   ```

## 🔐 Security

- **Data Encryption**: AES-256 encryption for sensitive data
- **Transport Security**: TLS 1.3 for all connections
- **Authentication**: OAuth 2.0 + JWT tokens
- **MFA**: TOTP-based two-factor authentication
- **Rate Limiting**: API rate limiting and DDoS protection
- **Consent Tracking**: Detailed consent audit logs
- **GDPR Compliance**: Data export, deletion, privacy controls
- **Activity Encryption**: All activities encrypted at rest
- **Secure Activity Transmission**: HTTPS for all activity data

## 📄 License

MIT License - see LICENSE file for details

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature')`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📞 Support

- Email: support@saas-b-track.com
- Documentation: https://docs.saas-b-track.com
- Issues: https://github.com/SAASB/saasbglobe/issues

## ⚖️ Legal & Compliance

### Consent Management
This platform is designed with **explicit user consent** as a core principle:
- Users must actively opt-in to location tracking
- Clear consent dialogs before any tracking begins
- Users can revoke consent at any time
- Detailed tracking of all consent changes

### Privacy Policy
- See `PRIVACY.md` for complete privacy policy
- GDPR, CCPA, and other regulations compliance
- Data retention and deletion policies

### Terms of Service
- See `TERMS.md` for complete terms of service
- Acceptable use policy
- Liability limitations

---

**Built with ❤️ for enterprises that value privacy and security.**
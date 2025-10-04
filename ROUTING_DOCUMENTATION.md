# Routing Documentation - Klinik System

## Overview

Sistem routing lengkap untuk aplikasi klinik dengan SPA React frontend dan Laravel API backend.

## Web Routes (`routes/web.php`)

### 🔧 System Routes

-   **GET `/health`** - Health check endpoint untuk monitoring
-   **GET `/api/docs`** - API documentation endpoint

### 🎯 SPA Fallback

-   **GET `/{any}`** - Catch-all route untuk React SPA
    -   Pattern: `.*` (matches any path)
    -   Returns: `welcome.blade.php` view
    -   Purpose: Enables React Router to handle client-side routing

## API Routes (`routes/api.php`)

### 🔐 Public Routes (No Authentication)

```php
POST /api/register          # User registration
POST /api/login             # User login
POST /api/forgot-password   # Password reset request
POST /api/reset-password    # Password reset confirmation
GET  /api/health           # API health check
GET  /api/doctors/available # List available doctors
GET  /api/specializations  # Medical specializations
```

### 🛡️ Protected Routes (Requires Authentication)

#### **Authentication & Profile**

```php
POST /api/logout           # Logout user
GET  /api/user            # Get current user info
PUT  /api/profile         # Update user profile
POST /api/change-password # Change password
```

#### **Dashboard Routes (Role-specific)**

```php
GET /api/dashboard                # General dashboard
GET /api/dashboard/stats         # Dashboard statistics
GET /api/dashboard/admin         # Admin dashboard data
GET /api/dashboard/doctor        # Doctor dashboard data
GET /api/dashboard/nurse         # Nurse dashboard data
GET /api/dashboard/pharmacist    # Pharmacist dashboard data
```

#### **Patient Management**

```php
GET    /api/patients                    # List patients
POST   /api/patients                    # Create patient
GET    /api/patients/{id}              # Get patient details
PUT    /api/patients/{id}              # Update patient
DELETE /api/patients/{id}              # Delete patient
POST   /api/patients/{id}/verify       # Verify patient (Admin only)
GET    /api/patients/{id}/medical-history # Patient medical history
GET    /api/patients/search/{term}     # Search patients
GET    /api/patients/{id}/medical-records # Patient medical records
```

#### **Appointment Management**

```php
GET /api/appointments                           # List appointments
POST /api/appointments                          # Create appointment
GET /api/appointments/{id}                     # Get appointment details
PUT /api/appointments/{id}                     # Update appointment
DELETE /api/appointments/{id}                  # Delete appointment
GET /api/appointments/queue/today              # Today's appointment queue
PUT /api/appointments/{id}/status              # Update appointment status
GET /api/appointments/doctor/{doctor}/today    # Doctor's today appointments
```

#### **Screening Management (Nurse + Admin)**

```php
GET  /api/screenings                        # List screenings
POST /api/screenings                        # Create screening
GET  /api/screenings/{id}                  # Get screening details
PUT  /api/screenings/{id}                  # Update screening
DELETE /api/screenings/{id}                # Delete screening
GET  /api/queue/screening                  # Screening queue
POST /api/screenings/{id}/vital-signs     # Record vital signs
```

#### **Examination Management (Doctor + Admin)**

```php
GET  /api/examinations                     # List examinations
POST /api/examinations                     # Create examination
GET  /api/examinations/{id}               # Get examination details
PUT  /api/examinations/{id}               # Update examination
DELETE /api/examinations/{id}             # Delete examination
GET  /api/queue/examination               # Examination queue
POST /api/examinations/{id}/sick-leave    # Generate sick leave
GET  /api/examinations/doctor/queue       # Doctor's examination queue
```

#### **Prescription Management**

```php
GET /api/prescriptions                    # List prescriptions
POST /api/prescriptions                   # Create prescription (Doctor)
GET /api/prescriptions/{id}              # Get prescription details
PUT /api/prescriptions/{id}              # Update prescription
DELETE /api/prescriptions/{id}           # Delete prescription
PUT /api/prescriptions/{id}/dispense     # Dispense prescription (Pharmacist)
GET /api/prescriptions/pending           # Pending prescriptions (Pharmacist)
```

#### **Medicine Management**

```php
GET /api/medicines                # List medicines
POST /api/medicines               # Create medicine
GET /api/medicines/{id}          # Get medicine details
PUT /api/medicines/{id}          # Update medicine
DELETE /api/medicines/{id}       # Delete medicine
GET /api/medicines/low-stock     # Low stock medicines (Pharmacist)
GET /api/medicines/expired       # Expired medicines (Pharmacist)
GET /api/medicines/search/{term} # Search medicines
```

#### **Pharmacy Management (Pharmacist + Admin)**

```php
GET  /api/pharmacy/transactions          # Pharmacy transactions
POST /api/pharmacy/dispense             # Dispense medication
GET  /api/pharmacy/pending-prescriptions # Pending prescriptions
GET  /api/pharmacy/daily-sales          # Daily sales report
GET  /api/pharmacy/inventory-report     # Inventory report
```

#### **Medical Records**

```php
GET /api/medical-records        # List medical records
GET /api/medical-records/{id}   # Get medical record details
```

#### **PDF Generation**

```php
GET /api/medical-records/{id}/pdf              # Generate medical record PDF
GET /api/prescriptions/{id}/pdf                # Generate prescription PDF
GET /api/examinations/{id}/sick-leave-pdf      # Generate sick leave PDF
```

#### **Notifications**

```php
GET  /api/notifications           # Get user notifications
POST /api/notifications/mark-read # Mark notifications as read
```

#### **Admin Only Routes**

```php
GET    /api/users                    # List all users
POST   /api/users                    # Create user
PUT    /api/users/{id}              # Update user
DELETE /api/users/{id}              # Delete user
GET    /api/roles                    # List roles
GET    /api/reports/system-overview  # System overview report
GET    /api/reports/user-activity    # User activity report
GET    /api/reports/financial        # Financial report
```

## Role-based Access Control

### 🔐 Middleware Groups

-   **`auth:sanctum`** - Requires authentication
-   **`role:admin`** - Admin only access
-   **`role:doctor`** - Doctor access (includes admin)
-   **`role:nurse`** - Nurse access (includes admin)
-   **`role:pharmacist`** - Pharmacist access (includes admin)

### 📋 Role Permissions Matrix

| Feature             | Admin   | Doctor              | Nurse          | Pharmacist    |
| ------------------- | ------- | ------------------- | -------------- | ------------- |
| Dashboard           | ✅ All  | ✅ Doctor           | ✅ Nurse       | ✅ Pharmacist |
| Patient Management  | ✅ Full | ✅ Read/Update      | ✅ Create/Read | ❌            |
| Appointments        | ✅ Full | ✅ Own appointments | ✅ Scheduling  | ❌            |
| Screening           | ✅ Full | ❌                  | ✅ Full        | ❌            |
| Examination         | ✅ Full | ✅ Full             | ❌             | ❌            |
| Prescriptions       | ✅ Full | ✅ Create/Read      | ❌             | ✅ Dispense   |
| Medicine Inventory  | ✅ Full | ❌                  | ❌             | ✅ Full       |
| Pharmacy Operations | ✅ Full | ❌                  | ❌             | ✅ Full       |
| User Management     | ✅ Only | ❌                  | ❌             | ❌            |
| Reports             | ✅ All  | ✅ Medical          | ❌             | ✅ Pharmacy   |

## Error Handling

### 🚨 Standard HTTP Response Codes

-   **200** - Success
-   **201** - Created
-   **400** - Bad Request
-   **401** - Unauthorized
-   **403** - Forbidden (Role access denied)
-   **404** - Not Found
-   **422** - Validation Error
-   **500** - Server Error

### 📋 API Response Format

```json
{
    "success": true,
    "data": {},
    "message": "Operation successful",
    "errors": null
}
```

## Rate Limiting

-   **API Routes**: 60 requests per minute per user
-   **Auth Routes**: 5 login attempts per minute per IP

## CORS Configuration

-   **Allowed Origins**: Frontend domain(s)
-   **Allowed Methods**: GET, POST, PUT, DELETE, OPTIONS
-   **Allowed Headers**: Content-Type, Authorization, X-Requested-With

## Testing Routes

### 🧪 Development Testing

```bash
# Test API health
curl http://localhost:8000/api/health

# Test web health
curl http://localhost:8000/health

# Test SPA fallback
curl http://localhost:8000/admin/dashboard
# Should return welcome.blade.php content
```

### 🔧 Route Debugging

```bash
# List all routes
php artisan route:list

# Filter API routes
php artisan route:list --path=api

# Show route details
php artisan route:show api.patients.index
```

## Security Considerations

### 🛡️ Authentication

-   Uses Laravel Sanctum for API token authentication
-   Tokens expire after inactivity
-   Secure token storage on frontend

### 🔐 Authorization

-   Role-based middleware protection
-   Resource-level permissions
-   Admin override capabilities

### 🛡️ Data Protection

-   Input validation on all endpoints
-   SQL injection protection via Eloquent
-   XSS protection on outputs
-   CSRF protection for web routes

## Performance Optimization

### ⚡ Caching Strategy

-   Route caching in production
-   Database query caching
-   API response caching for static data

### 📊 Monitoring

-   Health check endpoints for uptime monitoring
-   API usage tracking
-   Performance metrics collection

This routing configuration provides a complete, secure, and scalable foundation for the clinic management system with proper separation between web and API concerns.

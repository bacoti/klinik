# Authentication System Test Guide

## 🔐 Test Authentication System

### 📋 Data Test yang Tersedia:

-   **Admin**: admin@klinik.com
-   **Doctor**: dokter@klinik.com
-   **Nurse**: perawat@klinik.com
-   **Pharmacist**: apoteker@klinik.com
-   **Password Default**: password123

### 🧪 Test Scenarios:

#### 1. Test API Endpoints (menggunakan curl atau Postman)

##### Register New Patient:

```bash
curl -X POST http://localhost:8000/api/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test Patient",
    "email": "patient@test.com",
    "password": "password123",
    "password_confirmation": "password123",
    "phone": "081234567890",
    "gender": "male"
  }'
```

##### Login Existing User:

```bash
curl -X POST http://localhost:8000/api/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@klinik.com",
    "password": "password123"
  }'
```

##### Test Protected Route (replace TOKEN with actual token from login):

```bash
curl -X GET http://localhost:8000/api/user \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json"
```

##### Test Role-based Access:

```bash
# This should work for admin
curl -X GET http://localhost:8000/api/users \
  -H "Authorization: Bearer ADMIN_TOKEN" \
  -H "Content-Type: application/json"

# This should fail for patient token
curl -X GET http://localhost:8000/api/users \
  -H "Authorization: Bearer PATIENT_TOKEN" \
  -H "Content-Type: application/json"
```

#### 2. Test Browser Interface

##### Steps:

1. Buka http://localhost:8000
2. Klik "Daftar Sebagai Pasien" untuk test register
3. Isi form dengan data valid
4. Test login dengan:
    - Email: admin@klinik.com
    - Password: password123
5. Verifikasi dashboard muncul dengan role-based navigation
6. Test logout functionality

### ✅ Expected Results:

#### API Tests:

-   ✅ Register: Returns user data + token with role "patient"
-   ✅ Login: Returns user data + token with correct role
-   ✅ Protected routes: Work with valid token, fail without token
-   ✅ Role middleware: Allow access based on role, deny inappropriate access

#### Browser Tests:

-   ✅ Register form: Creates new patient account
-   ✅ Login form: Authenticates existing users
-   ✅ Dashboard: Shows role-appropriate navigation and quick actions
-   ✅ Auto-redirect: Unauthenticated users → login, authenticated → dashboard

### 🐛 Common Issues to Check:

-   CORS errors (should be handled by Laravel)
-   Token storage in localStorage
-   Middleware role checking
-   API response format consistency
-   React Router navigation

### 🔧 Debug Commands:

```bash
# Check current users
php artisan tinker -c "User::with('role')->get(['email', 'name'])"

# Check roles
php artisan tinker -c "Role::all(['name', 'display_name'])"

# Check routes
php artisan route:list --path=api

# Check logs
tail -f storage/logs/laravel.log
```

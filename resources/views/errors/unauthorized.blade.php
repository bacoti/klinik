<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Unauthorized Access - Klinik</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            color: #333;
        }

        .container {
            text-align: center;
            background: white;
            padding: 3rem 2rem;
            border-radius: 15px;
            box-shadow: 0 20px 40px rgba(0,0,0,0.1);
            max-width: 500px;
            width: 90%;
        }

        .error-icon {
            font-size: 4rem;
            color: #e74c3c;
            margin-bottom: 1rem;
        }

        h1 {
            font-size: 2rem;
            color: #2c3e50;
            margin-bottom: 1rem;
        }

        p {
            color: #7f8c8d;
            margin-bottom: 2rem;
            line-height: 1.6;
        }

        .buttons {
            display: flex;
            gap: 1rem;
            justify-content: center;
            flex-wrap: wrap;
        }

        .btn {
            padding: 12px 24px;
            border: none;
            border-radius: 8px;
            text-decoration: none;
            font-weight: 600;
            cursor: pointer;
            transition: transform 0.2s, box-shadow 0.2s;
        }

        .btn:hover {
            transform: translateY(-2px);
            box-shadow: 0 5px 15px rgba(0,0,0,0.2);
        }

        .btn-primary {
            background: #3498db;
            color: white;
        }

        .btn-secondary {
            background: #95a5a6;
            color: white;
        }

        .error-message {
            background: #ffe6e6;
            border: 1px solid #ffcccb;
            color: #d8000c;
            padding: 12px;
            border-radius: 6px;
            margin-bottom: 1rem;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="error-icon">🚫</div>
        <h1>Access Denied</h1>

        @if(session('error'))
            <div class="error-message">
                {{ session('error') }}
            </div>
        @endif

        <p>
            You don't have permission to access this page. Please contact your administrator
            if you believe this is an error, or return to your dashboard.
        </p>

        <div class="buttons">
            <a href="{{ url()->previous() }}" class="btn btn-secondary">Go Back</a>
            @auth
                @if(auth()->user()->role->name === 'nurse')
                    <a href="{{ route('nurse.dashboard') }}" class="btn btn-primary">Go to Dashboard</a>
                @elseif(auth()->user()->role->name === 'doctor')
                    <a href="{{ route('doctor.dashboard') }}" class="btn btn-primary">Go to Dashboard</a>
                @elseif(auth()->user()->role->name === 'admin')
                    <a href="{{ route('admin.dashboard') }}" class="btn btn-primary">Go to Dashboard</a>
                @else
                    <a href="{{ route('login') }}" class="btn btn-primary">Login</a>
                @endif
            @else
                <a href="{{ route('login') }}" class="btn btn-primary">Login</a>
            @endauth
        </div>
    </div>
</body>
</html>

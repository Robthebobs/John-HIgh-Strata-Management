<?php
// Start session
session_start();

// Check if already logged in
if (isset($_SESSION['user_id'])) {
    header('Location: /document-upload');
    exit();
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Login</title>
    <link rel="stylesheet" href="/styles/global.css">
    <style>
        .login-container {
            max-width: 400px;
            margin: 2rem auto;
            padding: 2rem;
            background-color: white;
            border-radius: 8px;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }
        
        .login-header {
            text-align: center;
            margin-bottom: 2rem;
        }
        
        .login-form {
            display: flex;
            flex-direction: column;
            gap: 1.5rem;
        }
        
        .form-group {
            display: flex;
            flex-direction: column;
            gap: 0.5rem;
        }
        
        .form-group label {
            color: #333;
            font-weight: 500;
        }
        
        .form-group input {
            padding: 0.75rem;
            border: 1px solid #ddd;
            border-radius: 8px;
            background-color: #f0f9f0;
            font-size: 1rem;
        }
        
        .form-group input:focus {
            outline: none;
            border-color: #4CAF50;
            background-color: #fff;
        }
        
        .login-btn {
            padding: 0.8rem;
            background-color: #4CAF50;
            color: white;
            border: none;
            border-radius: 4px;
            font-size: 1rem;
            cursor: pointer;
            transition: background-color 0.3s;
        }
        
        .login-btn:hover {
            background-color: #45a049;
        }
        
        .login-btn:disabled {
            background-color: #9e9e9e;
            cursor: not-allowed;
        }
        
        .login-footer {
            text-align: center;
            margin-top: 1.5rem;
        }
        
        .signup-link {
            color: #4CAF50;
            text-decoration: none;
        }
        
        .signup-link:hover {
            text-decoration: underline;
        }
        
        .status-message {
            margin-top: 1rem;
            padding: 1rem;
            border-radius: 4px;
            display: none;
        }
        
        .error {
            background-color: #f8d7da;
            color: #721c24;
            border: 1px solid #f5c6cb;
        }
    </style>
</head>
<body>
    <div class="login-container">
        <div class="login-header">
            <h1>Login</h1>
            <p>Please enter your credentials</p>
        </div>
        
        <form id="loginForm" class="login-form">
            <div class="form-group">
                <label for="email">Email</label>
                <input type="email" id="email" name="email" required>
            </div>
            
            <div class="form-group">
                <label for="password">Password</label>
                <input type="password" id="password" name="password" required>
            </div>
            
            <div class="status-message error" id="errorMessage"></div>
            
            <button type="submit" id="loginButton" class="login-btn">Log In</button>
            
            <div class="login-footer">
                <p>Don't have an account? <a href="/signup.php" class="signup-link">Sign up</a></p>
            </div>
        </form>
    </div>
    
    <script>
        document.addEventListener('DOMContentLoaded', function() {
            const form = document.getElementById('loginForm');
            const errorMessage = document.getElementById('errorMessage');
            const loginButton = document.getElementById('loginButton');
            
            form.addEventListener('submit', function(e) {
                e.preventDefault();
                
                const email = document.getElementById('email').value;
                const password = document.getElementById('password').value;
                
                // Disable button and hide previous errors
                loginButton.disabled = true;
                loginButton.textContent = 'Logging in...';
                errorMessage.style.display = 'none';
                
                // Send login request
                fetch('/api/auth', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        email: email,
                        password: password
                    })
                })
                .then(response => response.json())
                .then(data => {
                    if (data.success) {
                        // Redirect to document upload page on success
                        window.location.href = '/document-upload';
                    } else {
                        throw new Error(data.error || 'Login failed');
                    }
                })
                .catch(error => {
                    // Show error message
                    errorMessage.textContent = error.message || 'An error occurred during login';
                    errorMessage.style.display = 'block';
                    
                    // Re-enable login button
                    loginButton.disabled = false;
                    loginButton.textContent = 'Log In';
                });
            });
        });
    </script>
</body>
</html> 
import React, { useState } from 'react';
import './styles.css';

function Login({ onLogin }) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [isRegistering, setIsRegistering] = useState(false); // State to toggle between login and register
    const [loading, setLoading] = useState(false); // State to handle loading
    const [error, setError] = useState(''); // State for error messages

    // Handle login
    const handleLogin = async (e) => {
        e.preventDefault();
        if (!username || !password) {
            alert('Please fill in both fields.');
            return;
        }
        
        setLoading(true); // Start loading
        setError(''); // Reset error state

        try {
            const response = await fetch('http://localhost:5300/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password })
            });
            const data = await response.json();
            if (response.ok) {
                onLogin(); // Calls the parent component's login function
                alert(data.message);
                setUsername(''); // Clear input fields
                setPassword('');
            } else {
                setError(data.error || 'Login failed. Please try again.');
            }
        } catch (error) {
            console.error(error);
            setError('Login failed. Please check your connection and try again.');
        } finally {
            setLoading(false); // End loading
        }
    };

    // Handle registration
    const handleRegister = async (e) => {
        e.preventDefault();
        if (!username || !password) {
            alert('Please fill in both fields.');
            return;
        }

        setLoading(true); // Start loading
        setError(''); // Reset error state

        try {
            const response = await fetch('http://localhost:5300/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password })
            });
            const data = await response.json();
            if (response.ok) {
                alert(data.message);
                setIsRegistering(false); // Switch back to login mode
                setUsername(''); // Clear input fields
                setPassword('');
            } else {
                setError(data.error || 'Registration failed. Please try again.');
            }
        } catch (error) {
            console.error(error);
            setError('Registration failed. Please check your connection and try again.');
        } finally {
            setLoading(false); // End loading
        }
    };

    return (
        <section id="login">
            <h2>{isRegistering ? 'Register' : 'Login'}</h2>
            <form onSubmit={isRegistering ? handleRegister : handleLogin}>
                <input
                    type="text"
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                <button type="submit" disabled={loading}>
                    {loading ? 'Loading...' : isRegistering ? 'Register' : 'Login'}
                </button>
            </form>
            {error && <p className="error-message">{error}</p>}
            <button onClick={() => setIsRegistering(!isRegistering)}>
                {isRegistering ? 'Have an account? Login' : 'No account? Register'}
            </button>
        </section>
    );
}

export default Login;

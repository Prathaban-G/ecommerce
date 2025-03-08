import React, { useState } from 'react';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { app } from './firebase';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const auth = getAuth(app);
  
  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      await signInWithEmailAndPassword(auth, email, password);
      // Redirect to another component on successful login
      window.location.href = '/dashboard'; // Change this to your desired route
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const styles = {
    container: {
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(to bottom right, #7e22ce, #4338ca)'
    },
    loginCard: {
      maxWidth: '400px',
      width: '100%',
      padding: '40px',
      backgroundColor: 'white',
      borderRadius: '16px',
      boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)'
    },
    header: {
      marginBottom: '40px',
      textAlign: 'center'
    },
    avatarCircle: {
      height: '80px',
      width: '80px',
      backgroundColor: '#7e22ce',
      borderRadius: '50%',
      margin: '0 auto 16px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    },
    headingText: {
      fontSize: '24px',
      fontWeight: 'bold',
      color: '#1f2937'
    },
    subheadingText: {
      fontSize: '14px',
      color: '#6b7280',
      marginTop: '8px'
    },
    errorBox: {
      marginBottom: '24px',
      padding: '16px',
      backgroundColor: '#fef2f2',
      borderLeft: '4px solid #ef4444',
      color: '#b91c1c',
      borderRadius: '4px'
    },
    formControl: {
      marginBottom: '24px'
    },
    label: {
      display: 'block',
      fontSize: '14px',
      fontWeight: '600',
      color: '#374151',
      marginBottom: '8px'
    },
    input: {
      width: '100%',
      padding: '12px 16px',
      borderRadius: '8px',
      backgroundColor: '#f9fafb',
      border: '1px solid #d1d5db',
      fontSize: '14px',
      outline: 'none'
    },
    submitButton: {
      width: '100%',
      padding: '12px',
      borderRadius: '8px',
      backgroundColor: '#7e22ce',
      color: 'white',
      fontWeight: '600',
      border: 'none',
      cursor: 'pointer',
      transition: 'background-color 0.2s',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center'
    },
    loadingSpinner: {
      animation: 'spin 1s linear infinite',
      marginRight: '8px',
      height: '20px',
      width: '20px'
    }
  };
  
  return (
    <div style={styles.container}>
      <div style={styles.loginCard}>
        <div style={styles.header}>
          <div style={styles.avatarCircle}>
            <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 20 20" fill="white">
              <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
            </svg>
          </div>
          <h2 style={styles.headingText}>Welcome Back</h2>
          <p style={styles.subheadingText}>Sign in to access your account</p>
        </div>
        
        {error && (
          <div style={styles.errorBox}>
            <p style={{fontWeight: 'medium'}}>Login Error</p>
            <p style={{fontSize: '14px'}}>{error}</p>
          </div>
        )}
        
        <form onSubmit={handleLogin}>
          <div style={styles.formControl}>
            <label style={styles.label} htmlFor="email">
              Email Address
            </label>
            <input
              id="email"
              type="email"
              style={styles.input}
              placeholder="ballu@gmai.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          
          <div style={styles.formControl}>
            <label style={styles.label} htmlFor="password">
              Password
            </label>
            <input
              id="password"
              type="password"
              style={styles.input}
              placeholder="••••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          
          <button
            type="submit"
            style={{
              ...styles.submitButton,
              opacity: loading ? 0.7 : 1
            }}
            disabled={loading}
          >
            {loading ? (
              <>
                <svg style={styles.loadingSpinner} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle style={{opacity: 0.25}} cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path style={{opacity: 0.75}} fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Signing in...
              </>
            ) : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
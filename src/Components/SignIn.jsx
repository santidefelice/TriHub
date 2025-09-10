import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';

const SignIn = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { user, signInWithEmail, signUpWithEmail, signInWithProvider } = useAuth();
  const loadingRef = useRef(false);

  // Navigate to home when user is authenticated
  useEffect(() => {
    console.log('User state changed:', user);
    if (user) {
      console.log('User authenticated, navigating to home');
      setLoading(false);
      loadingRef.current = false;
      navigate('/');
    }
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    loadingRef.current = true;
    
    try {
      console.log('Starting authentication...', { email, isSignUp });
      
      let result;
      if (isSignUp) {
        console.log('Attempting sign up...');
        result = await signUpWithEmail(email, password);
        console.log('Sign up result:', result);
      } else {
        console.log('Attempting sign in...');
        result = await signInWithEmail(email, password);
        console.log('Sign in result:', result);
      }
      
      console.log('Auth function completed, waiting for user state update...');
      
      // Add a timeout fallback in case user state doesn't update
      setTimeout(() => {
        if (loadingRef.current) {
          console.log('Auth completed but user state not updated after 3s');
          console.log('Current user state:', user);
          setLoading(false);
          loadingRef.current = false;
          navigate('/');
        }
      }, 3000);
      
    } catch (err) {
      console.error('Authentication error details:', {
        message: err.message,
        code: err.code,
        status: err.status,
        fullError: err
      });
      setError(err.message || 'Authentication failed');
      setLoading(false);
      loadingRef.current = false;
    }
  };

  const handleProviderSignIn = async (provider) => {
    setError('');
    try {
      await signInWithProvider(provider);
      // Navigation will happen automatically via useEffect when user state updates
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="create-post">
      <h2 style={{ marginBottom: '1rem', textAlign: 'center' }}>
        {isSignUp ? 'Sign Up' : 'Sign In'}
      </h2>
      
      {error && (
        <div style={{ 
          color: 'var(--button-delete)', 
          marginBottom: '1rem', 
          padding: '0.5rem',
          backgroundColor: 'var(--bg-tertiary)',
          borderRadius: '0.25rem',
          textAlign: 'center'
        }}>
          {error}
        </div>
      )}

      
      
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Enter your email"
          required
          className="form-input"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Enter your password"
          required
          className="form-input"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button 
          className="button primary-button" 
          disabled={loading}
          style={{ width: '100%' }}
        >
          {loading ? 'Loading...' : (isSignUp ? 'Sign Up' : 'Sign In')}
        </button>
      </form>
      
      <div style={{ textAlign: 'center', margin: '1rem 0' }}>
        <button 
          type="button" 
          onClick={() => setIsSignUp(!isSignUp)}
          className="button"
          style={{ background: 'transparent', border: 'none', color: 'var(--accent-color)' }}
        >
          {isSignUp ? 'Already have an account? Sign In' : "Don't have an account? Sign Up"}
        </button>
      </div>
      
      <div style={{ textAlign: 'center', margin: '1rem 0' }}>
        <span style={{ color: 'var(--text-secondary)' }}>or</span>
      </div>
      
      <button 
        type="button" 
        onClick={() => handleProviderSignIn('github')} 
        className="button secondary-button"
        style={{ width: '100%' }}
      >
        Sign in with GitHub
      </button>
    </div>
  );
};

export default SignIn;



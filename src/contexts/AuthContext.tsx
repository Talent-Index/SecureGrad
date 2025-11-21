import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { ethers } from 'ethers';

// Admin wallet address - Replace with your actual admin address
const ADMIN_ADDRESS = '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb1';

interface AuthContextType {
  isAuthenticated: boolean;
  isAdmin: boolean;
  account: string;
  provider: ethers.BrowserProvider | null;
  signer: ethers.Signer | null;
  login: () => Promise<void>;
  logout: () => void;
  isLoading: boolean;
  error: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [account, setAccount] = useState('');
  const [provider, setProvider] = useState<ethers.BrowserProvider | null>(null);
  const [signer, setSigner] = useState<ethers.Signer | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // Check if wallet is already connected on mount
  useEffect(() => {
    checkConnection();
  }, []);

  // Check existing connection
  const checkConnection = async () => {
    if (!window.ethereum) return;

    try {
      const web3Provider = new ethers.BrowserProvider(window.ethereum);
      const accounts = await web3Provider.listAccounts();
      
      if (accounts.length > 0) {
        const web3Signer = await web3Provider.getSigner();
        const address = await web3Signer.getAddress();
        
        setProvider(web3Provider);
        setSigner(web3Signer);
        setAccount(address);
        setIsAuthenticated(true);
        setIsAdmin(address.toLowerCase() === ADMIN_ADDRESS.toLowerCase());
      }
    } catch (err) {
      console.error('Error checking connection:', err);
    }
  };

  // Login function - connects wallet
  const login = async () => {
    if (!window.ethereum) {
      setError('Core Wallet not detected. Please install Core Wallet extension.');
      return;
    }

    try {
      setIsLoading(true);
      setError('');

      const web3Provider = new ethers.BrowserProvider(window.ethereum);
      const accounts = await web3Provider.send('eth_requestAccounts', []);
      const web3Signer = await web3Provider.getSigner();
      const address = accounts[0];

      setProvider(web3Provider);
      setSigner(web3Signer);
      setAccount(address);
      setIsAuthenticated(true);
      setIsAdmin(address.toLowerCase() === ADMIN_ADDRESS.toLowerCase());

      // Listen for account changes
      window.ethereum.on('accountsChanged', handleAccountsChanged);
      window.ethereum.on('chainChanged', handleChainChanged);
    } catch (err: any) {
      setError(err.message || 'Failed to connect wallet');
      setIsAuthenticated(false);
    } finally {
      setIsLoading(false);
    }
  };

  // Logout function - clears session
  const logout = () => {
    setIsAuthenticated(false);
    setIsAdmin(false);
    setAccount('');
    setProvider(null);
    setSigner(null);
    setError('');

    // Remove event listeners
    if (window.ethereum) {
      window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
      window.ethereum.removeListener('chainChanged', handleChainChanged);
    }
  };

  // Handle account changes
  const handleAccountsChanged = async (accounts: string[]) => {
    if (accounts.length === 0) {
      logout();
    } else {
      const newAddress = accounts[0];
      setAccount(newAddress);
      setIsAdmin(newAddress.toLowerCase() === ADMIN_ADDRESS.toLowerCase());
    }
  };

  // Handle chain changes
  const handleChainChanged = () => {
    window.location.reload();
  };

  const value = {
    isAuthenticated,
    isAdmin,
    account,
    provider,
    signer,
    login,
    logout,
    isLoading,
    error
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
// auth files
// Custom hook to use auth context
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

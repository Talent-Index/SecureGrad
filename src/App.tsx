import { useState, useEffect } from 'react';
import { IssueCertificate } from './components/IssueCertificate';
import { VerifyCertificate } from './components/VerifyCertificate';
import { ethers } from 'ethers';
import { Shield, CheckCircle2 } from 'lucide-react';

declare global {
  interface Window {
    ethereum?: any;
  }
}

export default function App() {
  const [activeTab, setActiveTab] = useState<'issue' | 'verify'>('issue');
  const [provider, setProvider] = useState<ethers.BrowserProvider | null>(null);
  const [signer, setSigner] = useState<ethers.Signer | null>(null);
  const [account, setAccount] = useState<string>('');
  const [isConnecting, setIsConnecting] = useState(false);
  const [connectionError, setConnectionError] = useState<string>('');

  useEffect(() => {
    connectWallet();
  }, []);

  const connectWallet = async () => {
    if (!window.ethereum) {
      setConnectionError('Core Wallet not detected Error!. Please install Core Wallet extension.');
      return;
    }

    try {
      setIsConnecting(true);
      setConnectionError('');

      const web3Provider = new ethers.BrowserProvider(window.ethereum);
      const accounts = await web3Provider.send('eth_requestAccounts', []);
      const web3Signer = await web3Provider.getSigner();

      setProvider(web3Provider);
      setSigner(web3Signer);
      setAccount(accounts[0]);

      // Listen for account changes
      window.ethereum.on('accountsChanged', (accounts: string[]) => {
        if (accounts.length > 0) {
          setAccount(accounts[0]);
        } else {
          setAccount('');
        }
      });
    } catch (error: any) {
      setConnectionError(error.message || 'Failed to connect wallet');
    } finally {
      setIsConnecting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f9f9f9] py-8 px-4">
      <div className="max-w-[800px] mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Shield className="w-10 h-10 text-blue-600" />
            <h1 className="text-4xl text-gray-900">Campus Certificate Verification</h1>
          </div>
          <p className="text-gray-600">Blockchain-powered certificate verification on Avalanche C-Chain</p>
        </div>

        {/* Wallet Connection Status */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          {!account ? (
            <div>
              <p className="text-gray-700 mb-4">Connect your Core Wallet to get started</p>
              <button
                onClick={connectWallet}
                disabled={isConnecting}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors cursor-pointer disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                {isConnecting ? 'Connecting...' : 'Connect Core Wallet'}
              </button>
              {connectionError && (
                <p className="text-red-600 mt-4">{connectionError}</p>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <CheckCircle2 className="w-5 h-5 text-green-600" />
              <div>
                <p className="text-gray-700">Connected: <span className="font-mono text-sm">{account.slice(0, 6)}...{account.slice(-4)}</span></p>
                <p className="text-sm text-gray-500">Avalanche C-Chain</p>
              </div>
            </div>
          )}
        </div>

        {/* Tab Navigation */}
        {account && (
          <>
            <div className="flex gap-4 mb-6">
              <button
                onClick={() => setActiveTab('issue')}
                className={`flex-1 py-3 px-6 rounded-lg transition-colors cursor-pointer ${
                  activeTab === 'issue'
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-100'
                }`}
              >
                Issue Certificate
              </button>
              <button
                onClick={() => setActiveTab('verify')}
                className={`flex-1 py-3 px-6 rounded-lg transition-colors cursor-pointer ${
                  activeTab === 'verify'
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-100'
                }`}
              >
                Verify Certificate
              </button>
            </div>

            {/* Content */}
            <div className="bg-white rounded-lg shadow-md p-6">
              {activeTab === 'issue' ? (
                <IssueCertificate signer={signer} account={account} />
              ) : (
                <VerifyCertificate provider={provider} />
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

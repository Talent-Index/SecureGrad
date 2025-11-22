import { useAuth } from '../contexts/AuthContext';
import { Wallet, Shield, CheckCircle2, Loader2 } from 'lucide-react';

export function Login() {
  const { login, isLoading, error } = useAuth();

  return (
    <div className="min-h-screen bg-[#f9f9f9] flex items-center justify-center px-4">
      <div className="max-w-[500px] w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Shield className="w-12 h-12 text-blue-600" />
            <h1 className="text-4xl text-gray-900">Campus Certificate Issaunce</h1>
          </div>
          <p className="text-gray-600">Blockchain-powered certificate verification</p>
        </div>

        {/* Login Card */}
        <div className="bg-white rounded-lg shadow-md p-8">
          <h2 className="text-2xl text-gray-900 mb-6 text-center">Connect Your Wallet</h2>
          
          <div className="space-y-6">
            {/* Features List */}
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-gray-900">Secure Authentication</p>
                  <p className="text-sm text-gray-600">Connect using Core Wallet on Avalanche C-Chain</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                <div>
  <p className="text-gray-900">Verify Certificates</p>
  <p className="text-sm text-gray-600">
    Access certificate verification instantly
  </p>
  <p className="text-xs text-gray-500 mt-1">
    Our blockchain-powered system ensures that every certificate is authentic,
    tamper-proof, and verifiable in real time. Students, employers, and institutions
    can instantly confirm legitimacy with a single click.
  </p>
</div>

              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-gray-900">Admin Access</p>
                  <p className="text-sm text-gray-600">Issue and manage certificates with admin privileges</p>
                </div>
              </div>
            </div>

            {/* Connect Button */}
            <button
              onClick={login}
              disabled={isLoading}
              className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors cursor-pointer disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-3"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Connecting...
                </>
              ) : (
                <>
                  <Wallet className="w-5 h-5" />
                  Connect Core Wallet
                </>
              )}
            </button>

            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            {/* Info Box */}
            <div className="bg-blue-50 border border-blue-200 px-4 py-3 rounded-lg">
              <p className="text-sm text-blue-800">
                <strong>Note:</strong> Make sure you have Core Wallet installed and configured for Avalanche C-Chain.
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-6">
          <p className="text-sm text-gray-600">
            Don't have Core Wallet? <a href="https://core.app/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-700 underline">Download here</a>
          </p>
        </div>
      </div>
    </div>
  );
}

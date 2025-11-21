import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { Upload, Loader2, CheckCircle2, XCircle, AlertCircle } from 'lucide-react';
import { CONTRACT_ADDRESS, CONTRACT_ABI } from '../utils/contract';

interface VerifyCertificateProps {
  provider: ethers.BrowserProvider | null;
}

interface CertificateData {
  studentName: string;
  regNumber: string;
  courseName: string;
  completionDate: number;
  pdfHash: string;
  issuer: string;
  isValid: boolean;
}

export function VerifyCertificate({ provider }: VerifyCertificateProps) {
  const [certificateId, setCertificateId] = useState('');
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [uploadedHash, setUploadedHash] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isHashing, setIsHashing] = useState(false);
  const [certificateData, setCertificateData] = useState<CertificateData | null>(null);
  const [error, setError] = useState('');
  const [hashMatch, setHashMatch] = useState<boolean | null>(null);

  // Check URL params for certificate ID on mount
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const idFromUrl = params.get('id');
    if (idFromUrl) {
      setCertificateId(idFromUrl);
    }
  }, []);

  const handlePdfUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type !== 'application/pdf') {
      setError('Please upload a PDF file');
      return;
    }

    setPdfFile(file);
    setIsHashing(true);
    setError('');
    setHashMatch(null);

    try {
      // Generate SHA-256 hash using Web Crypto API
      const arrayBuffer = await file.arrayBuffer();
      const hashBuffer = await crypto.subtle.digest('SHA-256', arrayBuffer);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      const hashHex = '0x' + hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
      
      setUploadedHash(hashHex);

      // If certificate data already loaded, compare hashes
      if (certificateData) {
        setHashMatch(hashHex.toLowerCase() === certificateData.pdfHash.toLowerCase());
      }
    } catch (err) {
      setError('Failed to generate PDF hash');
    } finally {
      setIsHashing(false);
    }
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!certificateId.trim()) {
      setError('Please enter a certificate ID');
      return;
    }

    if (!provider) {
      setError('Provider not connected');
      return;
    }

    setIsLoading(true);
    setError('');
    setCertificateData(null);
    setHashMatch(null);

    try {
      const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, provider);
      
      // Call getCertificate function
      const certificate = await contract.getCertificate(certificateId);

      // Check if certificate exists (assuming first field wouldn't be empty for valid cert)
      if (!certificate[0] || certificate[0] === '') {
        setError('Certificate not found. Please check the certificate ID.');
        return;
      }

      const certData: CertificateData = {
        studentName: certificate[0],
        regNumber: certificate[1],
        courseName: certificate[2],
        completionDate: Number(certificate[3]),
        pdfHash: certificate[4],
        issuer: certificate[5],
        isValid: certificate[6]
      };

      setCertificateData(certData);

      // If PDF was already uploaded, compare hashes
      if (uploadedHash) {
        setHashMatch(uploadedHash.toLowerCase() === certData.pdfHash.toLowerCase());
      }
    } catch (err: any) {
      if (err.message.includes('invalid certificate ID') || err.message.includes('Certificate not found')) {
        setError('Certificate not found. Please check the certificate ID.');
      } else {
        setError(err.message || 'Failed to verify certificate');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp * 1000).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div>
      <h2 className="text-2xl text-gray-900 mb-6">Verify Certificate</h2>

      <form onSubmit={handleVerify} className="space-y-5">
        <div>
          <label className="block text-gray-700 mb-2">Certificate ID</label>
          <input
            type="text"
            value={certificateId}
            onChange={(e) => setCertificateId(e.target.value)}
            className="w-full px-3 py-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm"
            placeholder="Enter certificate ID or transaction hash"
            disabled={isLoading}
          />
        </div>

        <div>
          <label className="block text-gray-700 mb-2">Upload PDF to Verify Hash (Optional)</label>
          <div className="relative">
            <input
              type="file"
              accept="application/pdf"
              onChange={handlePdfUpload}
              className="hidden"
              id="verify-pdf-upload"
              disabled={isLoading || isHashing}
            />
            <label
              htmlFor="verify-pdf-upload"
              className="flex items-center gap-3 w-full px-3 py-2.5 border border-gray-300 rounded-md cursor-pointer hover:bg-gray-50 transition-colors"
            >
              <Upload className="w-5 h-5 text-gray-500" />
              <span className="text-gray-700">
                {pdfFile ? pdfFile.name : 'Upload PDF file (optional)'}
              </span>
            </label>
          </div>
          {isHashing && (
            <p className="text-sm text-blue-600 mt-2 flex items-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin" />
              Generating hash...
            </p>
          )}
          {uploadedHash && (
            <p className="text-sm text-gray-600 mt-2 break-all">
              Hash: {uploadedHash}
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={isLoading || isHashing}
          className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors cursor-pointer disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Verifying...
            </>
          ) : (
            'Verify Certificate'
          )}
        </button>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-start gap-3">
            <XCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {certificateData && (
          <div className="space-y-4">
            {/* Certificate Status */}
            <div className={`border-2 p-4 rounded-lg ${
              certificateData.isValid 
                ? 'bg-green-50 border-green-300' 
                : 'bg-red-50 border-red-300'
            }`}>
              <div className="flex items-center gap-3">
                {certificateData.isValid ? (
                  <>
                    <CheckCircle2 className="w-6 h-6 text-green-600" />
                    <span className="text-green-700">Certificate is Valid</span>
                  </>
                ) : (
                  <>
                    <XCircle className="w-6 h-6 text-red-600" />
                    <span className="text-red-700">Certificate is Invalid or Revoked</span>
                  </>
                )}
              </div>
            </div>

            {/* Certificate Details */}
            <div className="bg-gray-50 border border-gray-300 p-6 rounded-lg space-y-4">
              <h3 className="text-gray-900 mb-4">Certificate Details</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Student Name</p>
                  <p className="text-gray-900">{certificateData.studentName}</p>
                </div>

                <div>
                  <p className="text-sm text-gray-600 mb-1">Registration Number</p>
                  <p className="text-gray-900">{certificateData.regNumber}</p>
                </div>

                <div>
                  <p className="text-sm text-gray-600 mb-1">Course Name</p>
                  <p className="text-gray-900">{certificateData.courseName}</p>
                </div>

                <div>
                  <p className="text-sm text-gray-600 mb-1">Completion Date</p>
                  <p className="text-gray-900">{formatDate(certificateData.completionDate)}</p>
                </div>
              </div>

              <div>
                <p className="text-sm text-gray-600 mb-1">Issuer Address</p>
                <p className="text-gray-900 font-mono text-sm break-all">{certificateData.issuer}</p>
              </div>

              <div>
                <p className="text-sm text-gray-600 mb-1">Certificate Hash</p>
                <p className="text-gray-900 font-mono text-sm break-all">{certificateData.pdfHash}</p>
              </div>
            </div>

            {/* Hash Comparison Result */}
            {hashMatch !== null && (
              <div className={`border-2 p-4 rounded-lg flex items-start gap-3 ${
                hashMatch 
                  ? 'bg-green-50 border-green-300' 
                  : 'bg-red-50 border-red-300'
              }`}>
                {hashMatch ? (
                  <>
                    <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-green-700">PDF Hash Matches!</p>
                      <p className="text-sm text-green-600 mt-1">
                        The uploaded PDF is authentic and matches the on-chain certificate.
                      </p>
                    </div>
                  </>
                ) : (
                  <>
                    <XCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-red-700">PDF Hash Does Not Match!</p>
                      <p className="text-sm text-red-600 mt-1">
                        The uploaded PDF does not match the certificate on the blockchain. This may be a forged document.
                      </p>
                    </div>
                  </>
                )}
              </div>
            )}

            {!uploadedHash && (
              <div className="bg-yellow-50 border border-yellow-300 p-4 rounded-lg flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-yellow-700">Upload the PDF to verify its authenticity</p>
                  <p className="text-sm text-yellow-600 mt-1">
                    To ensure the certificate document is authentic, upload the PDF file to compare its hash.
                  </p>
                </div>
              </div>
            )}
          </div>
        )}
      </form>
    </div>
  );
}

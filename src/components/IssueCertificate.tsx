import { useState, useRef } from 'react';
import { ethers } from 'ethers';
import { QRCodeSVG } from 'qrcode.react';
import { Upload, Loader2, CheckCircle2, Download } from 'lucide-react';
import { CONTRACT_ADDRESS, CONTRACT_ABI } from '../utils/contract';

interface IssueCertificateProps {
  signer: ethers.Signer | null;
  account: string;
}

export function IssueCertificate({ signer, account }: IssueCertificateProps) {
  const [studentName, setStudentName] = useState('');
  const [regNumber, setRegNumber] = useState('');
  const [courseName, setCourseName] = useState('');
  const [completionDate, setCompletionDate] = useState('');
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [pdfHash, setPdfHash] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isHashing, setIsHashing] = useState(false);
  const [certificateId, setCertificateId] = useState<string>('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const qrRef = useRef<HTMLDivElement>(null);

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

    try {
      // Generate SHA-256 hash using Web Crypto API
      const arrayBuffer = await file.arrayBuffer();
      const hashBuffer = await crypto.subtle.digest('SHA-256', arrayBuffer);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      const hashHex = '0x' + hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
      
      setPdfHash(hashHex);
    } catch (err) {
      setError('Failed to generate PDF hash');
    } finally {
      setIsHashing(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!studentName || !regNumber || !courseName || !completionDate || !pdfHash) {
      setError('Please fill all fields and upload a PDF');
      return;
    }

    if (!signer) {
      setError('Wallet not connected');
      return;
    }

    setIsLoading(true);
    setError('');
    setSuccess('');
    setCertificateId('');

    try {
      const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);
      
      // Convert date to timestamp
      const timestamp = Math.floor(new Date(completionDate).getTime() / 1000);
      
      // Call issueCertificate function
      const tx = await contract.issueCertificate(
        studentName,
        regNumber,
        courseName,
        timestamp,
        pdfHash
      );

      // Wait for transaction confirmation
      const receipt = await tx.wait();
      
      // Get certificate ID from event logs
      const event = receipt.logs.find((log: any) => {
        try {
          const parsed = contract.interface.parseLog(log);
          return parsed?.name === 'CertificateIssued';
        } catch {
          return false;
        }
      });

      let certId = '';
      if (event) {
        const parsed = contract.interface.parseLog(event);
        certId = parsed?.args[0].toString();
      } else {
        // Fallback: use transaction hash as certificate ID
        certId = receipt.hash;
      }

      setCertificateId(certId);
      setSuccess(`Certificate issued successfully! Transaction: ${receipt.hash}`);
      
      // Reset form
      setStudentName('');
      setRegNumber('');
      setCourseName('');
      setCompletionDate('');
      setPdfFile(null);
      setPdfHash('');
    } catch (err: any) {
      setError(err.message || 'Failed to issue certificate');
    } finally {
      setIsLoading(false);
    }
  };

  const downloadQRCode = () => {
    if (!qrRef.current) return;

    const svg = qrRef.current.querySelector('svg');
    if (!svg) return;

    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();

    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx?.drawImage(img, 0, 0);
      const pngFile = canvas.toDataURL('image/png');

      const downloadLink = document.createElement('a');
      downloadLink.download = `certificate-${certificateId}.png`;
      downloadLink.href = pngFile;
      downloadLink.click();
    };

    img.src = 'data:image/svg+xml;base64,' + btoa(svgData);
  };

  const verificationUrl = certificateId 
    ? `${window.location.origin}${window.location.pathname}?id=${certificateId}`
    : '';

  return (
    <div>
      <h2 className="text-2xl text-gray-900 mb-6">Issue New Certificate</h2>
      
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-gray-700 mb-2">Student Name</label>
          <input
            type="text"
            value={studentName}
            onChange={(e) => setStudentName(e.target.value)}
            className="w-full px-3 py-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter student name"
            disabled={isLoading}
          />
        </div>

        <div>
          <label className="block text-gray-700 mb-2">Registration Number</label>
          <input
            type="text"
            value={regNumber}
            onChange={(e) => setRegNumber(e.target.value)}
            className="w-full px-3 py-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter registration number"
            disabled={isLoading}
          />
        </div>

        <div>
          <label className="block text-gray-700 mb-2">Course Name</label>
          <input
            type="text"
            value={courseName}
            onChange={(e) => setCourseName(e.target.value)}
            className="w-full px-3 py-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter course name"
            disabled={isLoading}
          />
        </div>

        <div>
          <label className="block text-gray-700 mb-2">Completion Date</label>
          <input
            type="date"
            value={completionDate}
            onChange={(e) => setCompletionDate(e.target.value)}
            className="w-full px-3 py-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={isLoading}
          />
        </div>

        <div>
          <label className="block text-gray-700 mb-2">Certificate PDF</label>
          <div className="relative">
            <input
              type="file"
              accept="application/pdf"
              onChange={handlePdfUpload}
              className="hidden"
              id="pdf-upload"
              disabled={isLoading || isHashing}
            />
            <label
              htmlFor="pdf-upload"
              className="flex items-center gap-3 w-full px-3 py-2.5 border border-gray-300 rounded-md cursor-pointer hover:bg-gray-50 transition-colors"
            >
              <Upload className="w-5 h-5 text-gray-500" />
              <span className="text-gray-700">
                {pdfFile ? pdfFile.name : 'Upload PDF file'}
              </span>
            </label>
          </div>
          {isHashing && (
            <p className="text-sm text-blue-600 mt-2 flex items-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin" />
              Generating hash...
            </p>
          )}
          {pdfHash && (
            <p className="text-sm text-green-600 mt-2 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4" />
              Hash: {pdfHash.slice(0, 10)}...{pdfHash.slice(-8)}
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={isLoading || isHashing || !pdfHash}
          className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors cursor-pointer disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Issuing Certificate...
            </>
          ) : (
            'Issue Certificate'
          )}
        </button>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        {success && (
          <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg">
            {success}
          </div>
        )}

        {certificateId && (
          <div className="bg-blue-50 border border-blue-200 p-6 rounded-lg space-y-4">
            <div>
              <p className="text-gray-700 mb-2">Certificate ID:</p>
              <p className="font-mono text-sm bg-white px-3 py-2 rounded border border-blue-300 break-all">
                {certificateId}
              </p>
            </div>

            <div className="flex flex-col items-center gap-4">
              <p className="text-gray-700">QR Code for Verification:</p>
              <div ref={qrRef} className="bg-white p-4 rounded-lg border border-blue-300">
                <QRCodeSVG value={verificationUrl} size={200} level="H" />
              </div>
              <button
                type="button"
                onClick={downloadQRCode}
                className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors cursor-pointer"
              >
                <Download className="w-4 h-4" />
                Download QR Code
              </button>
            </div>
          </div>
        )}
      </form>
    </div>
  );
}

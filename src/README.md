# Campus Certificate Verification System

A blockchain-based certificate verification system built on Avalanche C-Chain with Core Wallet integration.

## Features

### Issue Certificate
- Form inputs for student details (name, registration number, course, completion date)
- PDF upload with automatic SHA-256 hash generation
- Smart contract integration via ethers.js
- Transaction confirmation with loading states
- QR code generation for easy verification
- Downloadable QR code image

### Verify Certificate
- Certificate ID input with URL parameter support
- Optional PDF upload for hash verification
- Fetch certificate details from blockchain
- Display comprehensive certificate information
- Visual validation status (Valid/Invalid)
- Hash comparison with clear feedback

## Technology Stack

- **React** with TypeScript
- **Tailwind CSS** for styling
- **ethers.js** for blockchain interaction
- **Core Wallet** for Avalanche C-Chain
- **qrcode.react** for QR code generation
- **Web Crypto API** for SHA-256 hashing

## Setup Instructions

### Prerequisites

1. Install [Core Wallet](https://core.app/) browser extension
2. Configure Core Wallet to connect to Avalanche C-Chain
3. Ensure you have AVAX tokens for gas fees

### Smart Contract Deployment

1. Deploy the provided Solidity contract (see `/utils/contract.ts`) to Avalanche C-Chain using:
   - [Remix IDE](https://remix.ethereum.org/)
   - Hardhat
   - Truffle

2. Update `/utils/contract.ts` with your deployed contract address:
   ```typescript
   export const CONTRACT_ADDRESS = 'YOUR_DEPLOYED_CONTRACT_ADDRESS';
   ```

### Network Configuration

Configure Core Wallet with Avalanche C-Chain:
- **Network Name**: Avalanche C-Chain
- **RPC URL**: https://api.avax.network/ext/bc/C/rpc
- **Chain ID**: 43114
- **Symbol**: AVAX
- **Explorer**: https://snowtrace.io/

## Usage

### Issuing a Certificate

1. Connect your Core Wallet
2. Navigate to "Issue Certificate" tab
3. Fill in student details:
   - Student Name
   - Registration Number
   - Course Name
   - Completion Date
4. Upload the certificate PDF (hash is generated automatically)
5. Click "Issue Certificate"
6. Confirm the transaction in Core Wallet
7. Wait for blockchain confirmation
8. Download the generated QR code

### Verifying a Certificate

1. Navigate to "Verify Certificate" tab or scan QR code
2. Enter the Certificate ID
3. (Optional) Upload the PDF to verify its authenticity
4. Click "Verify Certificate"
5. Review the certificate details and validation status
6. Check hash comparison if PDF was uploaded

## Smart Contract Interface

```solidity
// Issue a new certificate
function issueCertificate(
    string memory _studentName,
    string memory _regNumber,
    string memory _courseName,
    uint256 _completionDate,
    bytes32 _pdfHash
) public returns (uint256)

// Get certificate details
function getCertificate(uint256 _certificateId) 
    public view returns (
        string memory studentName,
        string memory regNumber,
        string memory courseName,
        uint256 completionDate,
        bytes32 pdfHash,
        address issuer,
        bool isValid
    )

// Revoke a certificate (only issuer)
function revokeCertificate(uint256 _certificateId) public
```

## Security Features

- PDF hash stored on blockchain (immutable)
- Certificate issuer tracked via wallet address
- Hash comparison for document authenticity
- Certificate revocation capability
- Transparent verification process

## Responsive Design

- Maximum container width: 800px
- Fully responsive on mobile and desktop
- Clean, modern UI with Tailwind CSS
- Loading states and error handling
- Success/error messages

## Development

```bash
# Install dependencies
npm install ethers qrcode.react lucide-react

# Run development server
npm run dev
```

## Important Notes

- This system is for educational/campus use
- Ensure proper access control for certificate issuance
- Keep private keys secure
- Test on Avalanche Fuji Testnet before mainnet deployment
- Gas fees are required for issuing certificates (not for verification)

## License

MIT

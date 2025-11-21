# 🎓 Campus Certificate Verification System

A decentralized certificate issuance and verification system built on **Avalanche C-Chain** using **Core Wallet**. This application enables educational institutions to issue tamper-proof digital certificates on the blockchain and allows anyone to verify their authenticity.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Avalanche](https://img.shields.io/badge/blockchain-Avalanche-red.svg)
![React](https://img.shields.io/badge/react-18.x-blue.svg)
![TypeScript](https://img.shields.io/badge/typescript-5.x-blue.svg)

## 📋 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Prerequisites](#-prerequisites)
- [Installation](#-installation)
- [Configuration](#-configuration)
- [Usage](#-usage)
- [Smart Contract](#-smart-contract)
- [Project Structure](#-project-structure)
- [Deployment](#-deployment)
- [Contributing](#-contributing)
- [License](#-license)

## ✨ Features

### 🔐 Core Features
- **Blockchain-Based Certificates**: Immutable certificate storage on Avalanche C-Chain
- **Core Wallet Integration**: Seamless connection with Core Wallet browser extension
- **PDF Hash Verification**: SHA-256 hash generation and verification for certificate authenticity
- **QR Code Generation**: Automatic QR code creation for easy certificate sharing
- **Real-time Verification**: Instant certificate validation via certificate ID
- **Responsive Design**: Fully responsive UI that works on desktop and mobile devices

### 🎯 User Features
- **Issue Certificates**: Authorized users can issue certificates with student details and PDF uploads
- **Verify Certificates**: Anyone can verify certificate authenticity using certificate ID
- **PDF Hash Matching**: Upload original PDF to verify if it matches the blockchain record
- **Copy & Share**: One-click copy of certificate IDs and QR code download
- **URL-based Verification**: Direct verification via URL parameters (QR code scanning)

### 🛡️ Security Features
- **Immutable Records**: Certificates stored permanently on blockchain
- **SHA-256 Hashing**: Cryptographic hash ensures PDF integrity
- **Wallet Authentication**: Only connected wallets can issue certificates
- **Network Validation**: Automatic Avalanche network detection and switching

## 🛠️ Tech Stack

- **Frontend Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **Blockchain Library**: ethers.js v6
- **Styling**: Plain CSS (no frameworks)
- **QR Code Generation**: qrcode library
- **Blockchain Network**: Avalanche C-Chain (Fuji Testnet / Mainnet)
- **Wallet**: Core Wallet browser extension

## 📦 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18 or higher) - [Download](https://nodejs.org/)
- **npm** or **yarn** package manager
- **Core Wallet** browser extension - [Install](https://core.app/)
- **AVAX tokens** (for Fuji testnet, get free tokens from [Avalanche Faucet](https://faucet.avax.network/))

## 🚀 Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/campus-certificate-verification.git
   cd campus-certificate-verification
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Install required packages**
   ```bash
   npm install ethers qrcode
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to `http://localhost:5173` (or the port shown in terminal)

## ⚙️ Configuration

### 1. Deploy Smart Contract

First, deploy your smart contract to Avalanche Fuji testnet. Here's a sample Solidity contract:

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract CertificateVerification {
    struct Certificate {
        string studentName;
        string regNumber;
        string course;
        string completionDate;
        string pdfHash;
        address issuer;
        uint256 timestamp;
    }
    
    mapping(uint256 => Certificate) public certificates;
    uint256 public certificateCounter;
    
    event CertificateIssued(uint256 indexed certificateId, string studentName, address issuer);
    
    function issueCertificate(
        string memory studentName,
        string memory regNumber,
        string memory course,
        string memory completionDate,
        string memory pdfHash
    ) public returns (uint256) {
        certificateCounter++;
        
        certificates[certificateCounter] = Certificate({
            studentName: studentName,
            regNumber: regNumber,
            course: course,
            completionDate: completionDate,
            pdfHash: pdfHash,
            issuer: msg.sender,
            timestamp: block.timestamp
        });
        
        emit CertificateIssued(certificateCounter, studentName, msg.sender);
        
        return certificateCounter;
    }
    
    function getCertificate(uint256 certificateId) public view returns (
        string memory studentName,
        string memory regNumber,
        string memory course,
        string memory completionDate,
        string memory pdfHash,
        address issuer,
        uint256 timestamp
    ) {
        Certificate memory cert = certificates[certificateId];
        return (
            cert.studentName,
            cert.regNumber,
            cert.course,
            cert.completionDate,
            cert.pdfHash,
            cert.issuer,
            cert.timestamp
        );
    }
}
```

### 2. Update Contract Configuration

Edit `/contractConfig.ts` and replace the placeholder with your deployed contract address:

```typescript
export const CONTRACT_ADDRESS = "0xYourActualContractAddressHere";
```

### 3. Network Configuration

The application is configured for **Avalanche Fuji Testnet** by default:
- Chain ID: 43113
- RPC URL: https://api.avax-test.network/ext/bc/C/rpc
- Explorer: https://testnet.snowtrace.io/

To use **Avalanche Mainnet**, update the chain ID check in `/App.tsx`:
```typescript
// Change from 43113 to 43114 for mainnet
if (chainId !== 43114) {
  // Update chainId to '0xa86a' (43114 in hex)
}
```

## 📖 Usage

### For Certificate Issuers

1. **Connect Core Wallet**
   - Click "Connect Core Wallet" button
   - Approve the connection in Core Wallet popup
   - Ensure you're on Avalanche Fuji Testnet

2. **Issue a Certificate**
   - Fill in student details (Name, Registration Number, Course)
   - Select completion date
   - Upload PDF certificate (SHA-256 hash generated automatically)
   - Click "Issue Certificate"
   - Confirm transaction in Core Wallet
   - Wait for blockchain confirmation

3. **Share Certificate**
   - Copy the generated Certificate ID
   - Download the QR code
   - Share with the student

### For Certificate Verifiers

1. **Verify by Certificate ID**
   - Navigate to "Verify Certificate" section
   - Enter the Certificate ID
   - Click "Verify Certificate"
   - View certificate details

2. **Verify by QR Code**
   - Scan QR code with camera
   - Application auto-loads certificate details

3. **Verify PDF Authenticity** (Optional)
   - Upload the original PDF certificate
   - System compares SHA-256 hash
   - Green checkmark = Valid, Red X = Invalid

## 📜 Smart Contract

### Contract Functions

#### `issueCertificate()`
Issues a new certificate on the blockchain.

**Parameters:**
- `studentName` (string): Full name of the student
- `regNumber` (string): Registration/enrollment number
- `course` (string): Course name
- `completionDate` (string): Date of completion
- `pdfHash` (string): SHA-256 hash of the certificate PDF

**Returns:** Certificate ID (uint256)

#### `getCertificate()`
Retrieves certificate details by ID.

**Parameters:**
- `certificateId` (uint256): The certificate ID to query

**Returns:** Certificate struct with all details

## 📁 Project Structure

```
campus-certificate-verification/
├── src/
│   ├── components/
│   │   ├── IssueCertificate.tsx      # Certificate issuance component
│   │   └── VerifyCertificate.tsx     # Certificate verification component
│   ├── styles/
│   │   ├── App.css                   # Main application styles
│   │   ├── IssueCertificate.css      # Issue form styles
│   │   └── VerifyCertificate.css     # Verify form styles
│   ├── types/
│   │   └── index.ts                  # TypeScript type definitions
│   ├── utils/
│   │   └── pdfHasher.ts              # SHA-256 hash utility
│   ├── contractConfig.ts             # Contract address & ABI
│   ├── App.tsx                       # Main app component
│   └── main.tsx                      # Application entry point
├── public/
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
└── README.md
```

## 🌐 Deployment

### Deploy to Vercel

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

2. **Connect to Vercel**
   - Visit [vercel.com](https://vercel.com)
   - Import your GitHub repository
   - Configure build settings:
     - Build Command: `npm run build`
     - Output Directory: `dist`
   - Deploy!

### Deploy to Netlify

1. **Build the project**
   ```bash
   npm run build
   ```

2. **Deploy to Netlify**
   ```bash
   npm install -g netlify-cli
   netlify deploy --prod --dir=dist
   ```

### Environment Variables

No environment variables are required for basic operation. All configuration is in `contractConfig.ts`.

## 🔧 Development

### Available Scripts

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Type checking
npm run type-check
```

### Code Style

This project uses:
- **TypeScript** for type safety
- **Inline comments** for code documentation
- **Plain CSS** with BEM-like naming conventions
- **Functional React components** with hooks

## 🐛 Troubleshooting

### Common Issues

1. **Core Wallet Not Detected**
   - Ensure Core Wallet extension is installed
   - Refresh the page after installation
   - Check if wallet is unlocked

2. **Transaction Failed**
   - Ensure you have sufficient AVAX for gas fees
   - Check if you're on the correct network (Fuji testnet)
   - Verify contract address is correct

3. **Certificate Not Found**
   - Double-check the certificate ID
   - Ensure the certificate was successfully issued
   - Verify you're connected to the same network

4. **PDF Hash Not Generating**
   - Ensure you're uploading a valid PDF file
   - Check browser console for errors
   - Try a different PDF file

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Avalanche](https://www.avax.network/) - Blockchain platform
- [Core](https://core.app/) - Wallet provider
- [ethers.js](https://docs.ethers.org/) - Ethereum library
- [React](https://react.dev/) - UI framework
- [Vite](https://vitejs.dev/) - Build tool

## 📞 Support

For support, email your-email@example.com or open an issue in the GitHub repository.

## 🔗 Links

- **Live Demo**: [Your deployed URL]
- **Smart Contract Explorer**: [Snowtrace link to your contract]
- **Documentation**: [Link to detailed docs if any]

---

**Built with ❤️ for secure and transparent certificate verification**

⭐ Star this repository if you find it helpful!

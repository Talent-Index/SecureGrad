// Smart Contract Configuration
// Replace with your deployed contract address on Avalanche C-Chain
export const CONTRACT_ADDRESS = '0x1234567890123456789012345678901234567890';

// Smart Contract ABI
// This is an example ABI for the Certificate Verification Contract
export const CONTRACT_ABI = [
  {
    "inputs": [
      { "internalType": "string", "name": "_studentName", "type": "string" },
      { "internalType": "string", "name": "_regNumber", "type": "string" },
      { "internalType": "string", "name": "_courseName", "type": "string" },
      { "internalType": "uint256", "name": "_completionDate", "type": "uint256" },
      { "internalType": "bytes32", "name": "_pdfHash", "type": "bytes32" }
    ],
    "name": "issueCertificate",
    "outputs": [
      { "internalType": "uint256", "name": "", "type": "uint256" }
    ],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      { "internalType": "uint256", "name": "_certificateId", "type": "uint256" }
    ],
    "name": "getCertificate",
    "outputs": [
      { "internalType": "string", "name": "studentName", "type": "string" },
      { "internalType": "string", "name": "regNumber", "type": "string" },
      { "internalType": "string", "name": "courseName", "type": "string" },
      { "internalType": "uint256", "name": "completionDate", "type": "uint256" },
      { "internalType": "bytes32", "name": "pdfHash", "type": "bytes32" },
      { "internalType": "address", "name": "issuer", "type": "address" },
      { "internalType": "bool", "name": "isValid", "type": "bool" }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      { "internalType": "uint256", "name": "_certificateId", "type": "uint256" }
    ],
    "name": "revokeCertificate",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "anonymous": false,
    "inputs": [
      { "indexed": true, "internalType": "uint256", "name": "certificateId", "type": "uint256" },
      { "indexed": false, "internalType": "string", "name": "studentName", "type": "string" },
      { "indexed": false, "internalType": "string", "name": "regNumber", "type": "string" },
      { "indexed": true, "internalType": "address", "name": "issuer", "type": "address" }
    ],
    "name": "CertificateIssued",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      { "indexed": true, "internalType": "uint256", "name": "certificateId", "type": "uint256" },
      { "indexed": true, "internalType": "address", "name": "revokedBy", "type": "address" }
    ],
    "name": "CertificateRevoked",
    "type": "event"
  }
];

/*
 * EXAMPLE SOLIDITY CONTRACT FOR REFERENCE:
 * 
 * // SPDX-License-Identifier: MIT
 * pragma solidity ^0.8.0;
 * 
 * contract CampusCertificateVerification {
 *     struct Certificate {
 *         string studentName;
 *         string regNumber;
 *         string courseName;
 *         uint256 completionDate;
 *         bytes32 pdfHash;
 *         address issuer;
 *         bool isValid;
 *     }
 *     
 *     mapping(uint256 => Certificate) public certificates;
 *     uint256 public certificateCount;
 *     
 *     event CertificateIssued(
 *         uint256 indexed certificateId,
 *         string studentName,
 *         string regNumber,
 *         address indexed issuer
 *     );
 *     
 *     event CertificateRevoked(
 *         uint256 indexed certificateId,
 *         address indexed revokedBy
 *     );
 *     
 *     function issueCertificate(
 *         string memory _studentName,
 *         string memory _regNumber,
 *         string memory _courseName,
 *         uint256 _completionDate,
 *         bytes32 _pdfHash
 *     ) public returns (uint256) {
 *         certificateCount++;
 *         
 *         certificates[certificateCount] = Certificate({
 *             studentName: _studentName,
 *             regNumber: _regNumber,
 *             courseName: _courseName,
 *             completionDate: _completionDate,
 *             pdfHash: _pdfHash,
 *             issuer: msg.sender,
 *             isValid: true
 *         });
 *         
 *         emit CertificateIssued(
 *             certificateCount,
 *             _studentName,
 *             _regNumber,
 *             msg.sender
 *         );
 *         
 *         return certificateCount;
 *     }
 *     
 *     function getCertificate(uint256 _certificateId) 
 *         public 
 *         view 
 *         returns (
 *             string memory studentName,
 *             string memory regNumber,
 *             string memory courseName,
 *             uint256 completionDate,
 *             bytes32 pdfHash,
 *             address issuer,
 *             bool isValid
 *         ) 
 *     {
 *         require(_certificateId > 0 && _certificateId <= certificateCount, "Invalid certificate ID");
 *         Certificate memory cert = certificates[_certificateId];
 *         
 *         return (
 *             cert.studentName,
 *             cert.regNumber,
 *             cert.courseName,
 *             cert.completionDate,
 *             cert.pdfHash,
 *             cert.issuer,
 *             cert.isValid
 *         );
 *     }
 *     
 *     function revokeCertificate(uint256 _certificateId) public {
 *         require(_certificateId > 0 && _certificateId <= certificateCount, "Invalid certificate ID");
 *         require(certificates[_certificateId].issuer == msg.sender, "Only issuer can revoke");
 *         
 *         certificates[_certificateId].isValid = false;
 *         
 *         emit CertificateRevoked(_certificateId, msg.sender);
 *     }
 * }
 * 
 * DEPLOYMENT INSTRUCTIONS FOR YOU:
 * 1. Deploy this contract to Avalanche C-Chain using Remix, Hardhat, or Truffle
 * 2. Replace CONTRACT_ADDRESS above with your deployed contract address
 * 3. Configure Core Wallet to connect to Avalanche C-Chain (https://api.avax.network/ext/bc/C/rpc)
 * 4. Ensure you have AVAX tokens for gas fees
 */

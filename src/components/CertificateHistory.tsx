import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { FileText, Search, Filter, Copy, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner@2.0.3';

// Mock data for certificate history (replace with blockchain event data in production)
const mockCertificates = [
  {
    id: '1',
    studentName: 'John Doe',
    regNumber: 'MUT-2025-001',
    course: 'Computer Science',
    completionDate: '2025-05-15',
    issuer: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb1',
    timestamp: '2025-11-20 10:30:00'
  },
  {
    id: '2',
    studentName: 'Jane Smith',
    regNumber: 'MUT-2025-002',
    course: 'Business Administration',
    completionDate: '2025-06-20',
    issuer: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb1',
    timestamp: '2025-11-20 11:45:00'
  },
  {
    id: '3',
    studentName: 'Mike Johnson',
    regNumber: 'MUT-2025-003',
    course: 'Data Science',
    completionDate: '2025-07-10',
    issuer: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb1',
    timestamp: '2025-11-20 14:20:00'
  },
  {
    id: '4',
    studentName: 'Sarah Williams',
    regNumber: 'MUT-2025-004',
    course: 'Computer Science',
    completionDate: '2025-08-05',
    issuer: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb1',
    timestamp: '2025-11-21 09:15:00'
  },
  {
    id: '5',
    studentName: 'David Brown',
    regNumber: 'MUT-2025-005',
    course: 'Artificial Intelligence',
    completionDate: '2025-09-12',
    issuer: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb1',
    timestamp: '2025-11-21 13:30:00'
  }
];

// Mock data for verification attempts
const mockVerifications = [
  {
    id: '1',
    certificateId: '1',
    verifier: '0x8626f6940E2eb28930eFb4CeF49B2d1F2C9C1199',
    timestamp: '2025-11-21 15:00:00',
    isValid: true
  },
  {
    id: '2',
    certificateId: '2',
    verifier: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb1',
    timestamp: '2025-11-21 15:30:00',
    isValid: true
  },
  {
    id: '3',
    certificateId: '1',
    verifier: '0xdD2FD4581271e230360230F9337D5c0430Bf44C0',
    timestamp: '2025-11-21 16:00:00',
    isValid: true
  },
  {
    id: '4',
    certificateId: '3',
    verifier: '0x8626f6940E2eb28930eFb4CeF49B2d1F2C9C1199',
    timestamp: '2025-11-21 16:30:00',
    isValid: true
  }
];

export function CertificateHistory() {
  const { isAdmin } = useAuth();
  const [activeTab, setActiveTab] = useState<'issued' | 'verified'>('issued');
  const [searchTerm, setSearchTerm] = useState('');
  const [courseFilter, setCourseFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');

  // Filter certificates based on search and filters
  const filteredCertificates = mockCertificates.filter((cert) => {
    const matchesSearch = 
      cert.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cert.regNumber.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCourse = courseFilter === 'all' || cert.course === courseFilter;
    
    const matchesDate = dateFilter === 'all' || cert.completionDate.startsWith(dateFilter);
    
    return matchesSearch && matchesCourse && matchesDate;
  });

  // Get unique courses for filter
  const uniqueCourses = Array.from(new Set(mockCertificates.map(c => c.course)));

  // Copy to clipboard function
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard!');
  };

  if (!isAdmin) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
        Access Denied: Only administrators can view certificate history.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl text-gray-900">Certificate History</h2>
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <FileText className="w-4 h-4" />
          <span>Total: {mockCertificates.length} certificates</span>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex gap-4">
        <button
          onClick={() => setActiveTab('issued')}
          className={`px-6 py-2 rounded-lg transition-colors cursor-pointer ${
            activeTab === 'issued'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          Issued Certificates
        </button>
        <button
          onClick={() => setActiveTab('verified')}
          className={`px-6 py-2 rounded-lg transition-colors cursor-pointer ${
            activeTab === 'verified'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          Verification Attempts
        </button>
      </div>

      {/* Issued Certificates Tab */}
      {activeTab === 'issued' && (
        <>
          {/* Search and Filters */}
          <div className="bg-white rounded-lg shadow-md p-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Search Input */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search by name or reg number..."
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Course Filter */}
              <div className="relative">
                <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <select
                  value={courseFilter}
                  onChange={(e) => setCourseFilter(e.target.value)}
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none"
                >
                  <option value="all">All Courses</option>
                  {uniqueCourses.map((course) => (
                    <option key={course} value={course}>{course}</option>
                  ))}
                </select>
              </div>

              {/* Date Filter */}
              <div>
                <select
                  value={dateFilter}
                  onChange={(e) => setDateFilter(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">All Dates</option>
                  <option value="2025-05">May 2025</option>
                  <option value="2025-06">June 2025</option>
                  <option value="2025-07">July 2025</option>
                  <option value="2025-08">August 2025</option>
                  <option value="2025-09">September 2025</option>
                </select>
              </div>
            </div>
          </div>

          {/* Certificates Table */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm text-gray-700">ID</th>
                    <th className="px-4 py-3 text-left text-sm text-gray-700">Student Name</th>
                    <th className="px-4 py-3 text-left text-sm text-gray-700">Reg Number</th>
                    <th className="px-4 py-3 text-left text-sm text-gray-700">Course</th>
                    <th className="px-4 py-3 text-left text-sm text-gray-700">Completion Date</th>
                    <th className="px-4 py-3 text-left text-sm text-gray-700">Issued At</th>
                    <th className="px-4 py-3 text-left text-sm text-gray-700">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredCertificates.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="px-4 py-8 text-center text-gray-500">
                        No certificates found matching your filters.
                      </td>
                    </tr>
                  ) : (
                    filteredCertificates.map((cert) => (
                      <tr key={cert.id} className="hover:bg-gray-50">
                        <td className="px-4 py-3 text-sm text-gray-900">{cert.id}</td>
                        <td className="px-4 py-3 text-sm text-gray-900">{cert.studentName}</td>
                        <td className="px-4 py-3 text-sm text-gray-900 font-mono">{cert.regNumber}</td>
                        <td className="px-4 py-3 text-sm text-gray-900">{cert.course}</td>
                        <td className="px-4 py-3 text-sm text-gray-900">{cert.completionDate}</td>
                        <td className="px-4 py-3 text-sm text-gray-600">{cert.timestamp}</td>
                        <td className="px-4 py-3">
                          <button
                            onClick={() => copyToClipboard(cert.id)}
                            className="text-blue-600 hover:text-blue-700 flex items-center gap-1 text-sm"
                          >
                            <Copy className="w-3 h-3" />
                            Copy ID
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {/* Verification Attempts Tab */}
      {activeTab === 'verified' && (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-4 py-3 text-left text-sm text-gray-700">Certificate ID</th>
                  <th className="px-4 py-3 text-left text-sm text-gray-700">Verifier Address</th>
                  <th className="px-4 py-3 text-left text-sm text-gray-700">Timestamp</th>
                  <th className="px-4 py-3 text-left text-sm text-gray-700">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {mockVerifications.map((verification) => (
                  <tr key={verification.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm text-gray-900">{verification.certificateId}</td>
                    <td className="px-4 py-3 text-sm text-gray-900 font-mono">
                      {verification.verifier.slice(0, 6)}...{verification.verifier.slice(-4)}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">{verification.timestamp}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        {verification.isValid ? (
                          <>
                            <CheckCircle2 className="w-4 h-4 text-green-600" />
                            <span className="text-sm text-green-600">Valid</span>
                          </>
                        ) : (
                          <>
                            <span className="text-sm text-red-600">Invalid</span>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

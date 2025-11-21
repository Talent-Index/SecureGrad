import { useAuth } from '../contexts/AuthContext';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { TrendingUp, Award, Calendar, BookOpen } from 'lucide-react';

// Mock data for analytics
const certificatesByCourse = [
  { course: 'Computer Science', count: 45 },
  { course: 'Business Admin', count: 32 },
  { course: 'Data Science', count: 28 },
  { course: 'AI & ML', count: 23 },
  { course: 'Cybersecurity', count: 18 },
  { course: 'Web Development', count: 15 }
];

const certificatesByMonth = [
  { month: 'Jan', count: 12 },
  { month: 'Feb', count: 18 },
  { month: 'Mar', count: 25 },
  { month: 'Apr', count: 22 },
  { month: 'May', count: 30 },
  { month: 'Jun', count: 28 },
  { month: 'Jul', count: 35 },
  { month: 'Aug', count: 32 },
  { month: 'Sep', count: 38 },
  { month: 'Oct', count: 40 },
  { month: 'Nov', count: 25 }
];

const verificationsByMonth = [
  { month: 'Jan', count: 8 },
  { month: 'Feb', count: 15 },
  { month: 'Mar', count: 20 },
  { month: 'Apr', count: 18 },
  { month: 'May', count: 25 },
  { month: 'Jun', count: 22 },
  { month: 'Jul', count: 30 },
  { month: 'Aug', count: 28 },
  { month: 'Sep', count: 35 },
  { month: 'Oct', count: 38 },
  { month: 'Nov', count: 30 }
];

const summaryStats = {
  totalCertificates: 305,
  totalVerifications: 269,
  activeCourses: 6,
  averagePerMonth: 28
};

export function AnalyticsDashboard() {
  const { isAdmin } = useAuth();

  if (!isAdmin) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
        Access Denied: Only administrators can view analytics dashboard.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl text-gray-900 mb-2">Analytics Dashboard</h2>
        <p className="text-gray-600">Overview of certificate issuance and verification trends</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-2">
            <div className="bg-blue-100 p-3 rounded-lg">
              <Award className="w-6 h-6 text-blue-600" />
            </div>
            <TrendingUp className="w-5 h-5 text-green-600" />
          </div>
          <p className="text-sm text-gray-600 mb-1">Total Certificates</p>
          <p className="text-3xl text-gray-900">{summaryStats.totalCertificates}</p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-2">
            <div className="bg-green-100 p-3 rounded-lg">
              <TrendingUp className="w-6 h-6 text-green-600" />
            </div>
            <TrendingUp className="w-5 h-5 text-green-600" />
          </div>
          <p className="text-sm text-gray-600 mb-1">Total Verifications</p>
          <p className="text-3xl text-gray-900">{summaryStats.totalVerifications}</p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-2">
            <div className="bg-purple-100 p-3 rounded-lg">
              <BookOpen className="w-6 h-6 text-purple-600" />
            </div>
          </div>
          <p className="text-sm text-gray-600 mb-1">Active Courses</p>
          <p className="text-3xl text-gray-900">{summaryStats.activeCourses}</p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-2">
            <div className="bg-orange-100 p-3 rounded-lg">
              <Calendar className="w-6 h-6 text-orange-600" />
            </div>
          </div>
          <p className="text-sm text-gray-600 mb-1">Avg per Month</p>
          <p className="text-3xl text-gray-900">{summaryStats.averagePerMonth}</p>
        </div>
      </div>

      {/* Certificates by Course - Bar Chart */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-gray-900 mb-4">Certificates Issued by Course</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={certificatesByCourse}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="course" 
              angle={-45}
              textAnchor="end"
              height={100}
              tick={{ fontSize: 12 }}
            />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="count" fill="#3b82f6" name="Certificates" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Certificates by Month - Line Chart */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-gray-900 mb-4">Certificates Issued by Month</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={certificatesByMonth}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line 
              type="monotone" 
              dataKey="count" 
              stroke="#3b82f6" 
              strokeWidth={2}
              name="Certificates Issued"
              dot={{ r: 4 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Verifications by Month - Line Chart */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-gray-900 mb-4">Certificate Verifications by Month</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={verificationsByMonth}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line 
              type="monotone" 
              dataKey="count" 
              stroke="#10b981" 
              strokeWidth={2}
              name="Verifications"
              dot={{ r: 4 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Comparison Chart */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-gray-900 mb-4">Issuance vs Verification Comparison</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={certificatesByMonth.map((item, index) => ({
            month: item.month,
            issued: item.count,
            verified: verificationsByMonth[index]?.count || 0
          }))}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line 
              type="monotone" 
              dataKey="issued" 
              stroke="#3b82f6" 
              strokeWidth={2}
              name="Issued"
              dot={{ r: 4 }}
            />
            <Line 
              type="monotone" 
              dataKey="verified" 
              stroke="#10b981" 
              strokeWidth={2}
              name="Verified"
              dot={{ r: 4 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Insights Section */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h3 className="text-gray-900 mb-3">Key Insights</h3>
        <div className="space-y-2 text-sm text-gray-700">
          <p>• Computer Science has the highest number of certificates issued with 45 certificates.</p>
          <p>• Certificate issuance peaked in October with 40 certificates.</p>
          <p>• Verification rate is approximately 88% of issued certificates.</p>
          <p>• Average monthly issuance has been steady at 28 certificates per month.</p>
        </div>
      </div>
    </div>
  );
}

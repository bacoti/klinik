import React from 'react';

// Simple fallback components untuk testing jika ada error dengan complex components
export const SimpleDashboard: React.FC<{ title: string; role: string }> = ({ title, role }) => {
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{title}</h1>
          <p className="text-gray-600">Welcome to the {role} dashboard!</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Stats 1</h3>
            <p className="text-3xl font-bold text-blue-600">125</p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Stats 2</h3>
            <p className="text-3xl font-bold text-green-600">89</p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Stats 3</h3>
            <p className="text-3xl font-bold text-yellow-600">42</p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Stats 4</h3>
            <p className="text-3xl font-bold text-purple-600">67</p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
              Action 1
            </button>
            <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors">
              Action 2
            </button>
            <button className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors">
              Action 3
            </button>
            <button className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition-colors">
              Action 4
            </button>
          </div>
        </div>

        <div className="mt-6 text-center text-gray-500 text-sm">
          <p>Dashboard untuk {role} • React Router berjalan dengan baik ✅</p>
        </div>
      </div>
    </div>
  );
};
import React, { useState, useEffect } from 'react';

const Audit = () => {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [auditLogs, setAuditLogs] = useState([]);
  const [error, setError] = useState(null);

  // Fetch real data from the Golang Audit Service (REST Adapter)
  const fetchLogs = async () => {
    setIsRefreshing(true);
    setError(null);
    try {
      // Assuming your Go service is exposed on port 8080 via Docker or Local
      const response = await fetch('http://localhost:8080/api/audit');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setAuditLogs(data);
    } catch (err) {
      console.error("Failed to fetch audit logs:", err);
      setError("Failed to connect to Audit Service. Is the Golang backend running?");
    } finally {
      setIsRefreshing(false);
    }
  };

  // Load logs when the component mounts
  useEffect(() => {
    fetchLogs();
  }, []);

  const getStatusStyle = (eventType) => {
    // Dynamic styling based on Kafka event topics
    if (eventType.includes('failed') || eventType.includes('error')) {
      return 'bg-red-100 text-red-800';
    }
    if (eventType.includes('warning') || eventType.includes('alert')) {
      return 'bg-yellow-100 text-yellow-800';
    }
    return 'bg-green-100 text-green-800'; // Default success
  };

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Security Audit Logs</h1>
          <p className="text-gray-500 mt-2">Immutable record of system events processed by Kafka & Cassandra.</p>
        </div>
        <button 
          onClick={fetchLogs}
          disabled={isRefreshing}
          className={`px-4 py-2 rounded-md font-semibold text-gray-700 border border-gray-300 transition-all ${
            isRefreshing ? 'bg-gray-100 cursor-not-allowed' : 'bg-white hover:bg-gray-50 shadow-sm'
          }`}
        >
          {isRefreshing ? '🔄 Syncing with Go Server...' : '🔄 Refresh Logs'}
        </button>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 text-red-600 rounded-md">
          {error}
        </div>
      )}

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-900">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Event ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Timestamp</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Source</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Event Topic</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Payload (JSON)</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {auditLogs.length === 0 && !isRefreshing && !error ? (
              <tr>
                <td colSpan="5" className="px-6 py-8 text-center text-gray-500">
                  No audit logs found in Cassandra database yet.
                </td>
              </tr>
            ) : (
              auditLogs.map((log) => (
                <tr key={log.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-500">{log.id.substring(0, 8)}...</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {new Date(log.timestamp).toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-700">{log.source}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-3 py-1 inline-flex text-xs leading-5 font-bold rounded-full ${getStatusStyle(log.event_type)}`}>
                      {log.event_type}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate" title={log.payload}>
                    {log.payload}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Audit;
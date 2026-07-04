import React, { useState } from 'react';

const Backups = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [backups, setBackups] = useState([
    { id: '1', fileName: 'db_backup_20260701_100000.sql', size: '15 MB', status: 'COMPLETED', date: '2026-07-01 10:00 AM' },
    { id: '2', fileName: 'db_backup_20260702_100000.sql', size: '15.2 MB', status: 'COMPLETED', date: '2026-07-02 10:00 AM' },
  ]);

  const handleTriggerBackup = () => {
    setIsProcessing(true);
    
    // Simulate API call to the Gateway (which will publish to RabbitMQ)
    setTimeout(() => {
      const newBackup = {
        id: Date.now().toString(),
        fileName: `db_backup_${new Date().toISOString().replace(/[-:T.]/g, '').slice(0, 14)}.sql`,
        size: '15.5 MB',
        status: 'COMPLETED',
        date: new Date().toLocaleString(),
      };
      
      setBackups([newBackup, ...backups]);
      setIsProcessing(false);
      alert('✅ Backup triggered and completed successfully!');
    }, 3000);
  };

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">System Backups</h1>
          <p className="text-gray-500 mt-2">Manage and trigger automated database backups.</p>
        </div>
        <button 
          onClick={handleTriggerBackup}
          disabled={isProcessing}
          className={`px-6 py-3 rounded-md font-semibold text-white transition-all ${
            isProcessing ? 'bg-blue-300 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 shadow-md'
          }`}
        >
          {isProcessing ? '⏳ Processing Backup...' : '☁️ Trigger Manual Backup'}
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">File Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Size</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {backups.map((backup) => (
              <tr key={backup.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{backup.fileName}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{backup.date}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{backup.size}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                    {backup.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Backups;
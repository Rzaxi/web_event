import React from 'react';
import { Award } from 'lucide-react';

const CertificatesTab = ({ certificates }) => {
  return (
    <div className="bg-white rounded-2xl p-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">My Certificates</h2>
      
      {certificates.length === 0 ? (
        <div className="text-center py-12">
          <Award className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 text-lg">No certificates yet</p>
          <p className="text-gray-400 text-sm mt-2">Complete events to earn certificates</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {certificates.map((cert) => (
            <div key={cert.id} className="border border-gray-200 rounded-xl p-4 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 mb-2">{cert.event_name}</h3>
                  <p className="text-sm text-gray-600 mb-3">Issued on {new Date(cert.issued_date).toLocaleDateString()}</p>
                </div>
                <Award className="w-8 h-8 text-yellow-500" />
              </div>
              <button className="w-full mt-3 py-2 px-4 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors text-sm font-medium">
                Download Certificate
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CertificatesTab;

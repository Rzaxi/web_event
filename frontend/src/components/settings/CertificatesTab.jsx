import React from 'react';
import { Award, Download, Calendar, MapPin, FileText, CheckCircle } from 'lucide-react';
import { toast } from 'react-toastify';
import api from '../../services/api';

const CertificatesTab = ({ certificates }) => {
  
  const handleDownload = async (certificateId, certNumber) => {
    try {
      toast.info('Mengunduh sertifikat...', { autoClose: 2000 });
      
      const response = await api.get(`/certificates/${certificateId}/download`, {
        responseType: 'blob'
      });
      
      // Create blob link to download
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `Certificate-${certNumber}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      
      toast.success('Sertifikat berhasil didownload!');
    } catch (error) {
      console.error('Error downloading certificate:', error);
      toast.error('Gagal mendownload sertifikat');
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  return (
    <div className="bg-white rounded-2xl p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Sertifikat Saya</h2>
          <p className="text-gray-600 mt-1">Sertifikat pelatihan yang telah Anda selesaikan</p>
        </div>
        <div className="bg-blue-50 px-4 py-2 rounded-lg">
          <span className="text-2xl font-bold text-blue-600">{certificates.length}</span>
          <span className="text-sm text-gray-600 ml-2">Sertifikat</span>
        </div>
      </div>
      
      {certificates.length === 0 ? (
        <div className="text-center py-16 border-2 border-dashed border-gray-200 rounded-2xl">
          <Award className="w-20 h-20 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Belum Ada Sertifikat</h3>
          <p className="text-gray-500">Ikuti dan selesaikan pelatihan untuk mendapatkan sertifikat</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {certificates.map((cert) => (
            <div key={cert.id} className="border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-all hover:border-blue-300 bg-gradient-to-br from-white to-gray-50">
              {/* Certificate Icon */}
              <div className="flex items-start justify-between mb-4">
                <div className="p-3 bg-yellow-50 rounded-xl">
                  <Award className="w-8 h-8 text-yellow-500" />
                </div>
                <div className="bg-green-100 px-3 py-1 rounded-full">
                  <CheckCircle className="w-4 h-4 text-green-600 inline mr-1" />
                  <span className="text-xs font-medium text-green-700">Terverifikasi</span>
                </div>
              </div>

              {/* Event Info - DYNAMIC FROM DATABASE */}
              <div className="mb-4">
                <h3 className="font-bold text-gray-900 text-lg mb-2 line-clamp-2">
                  {cert.event?.judul || 'Event Title'}
                </h3>
                
                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex items-center">
                    <FileText className="w-4 h-4 mr-2 text-gray-400" />
                    <span className="font-mono text-xs">{cert.certificate_number}</span>
                  </div>
                  
                  <div className="flex items-center">
                    <Calendar className="w-4 h-4 mr-2 text-gray-400" />
                    <span>{formatDate(cert.issued_date)}</span>
                  </div>
                  
                  {cert.event?.penyelenggara && (
                    <div className="flex items-center">
                      <MapPin className="w-4 h-4 mr-2 text-gray-400" />
                      <span>{cert.event.penyelenggara}</span>
                    </div>
                  )}

                  {cert.event?.durasi_hari && cert.event.durasi_hari > 1 && (
                    <div className="bg-blue-50 px-2 py-1 rounded-md inline-flex items-center mt-2">
                      <span className="text-xs text-blue-700 font-medium">
                        {cert.event.durasi_hari} Hari Pelatihan
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Download Stats */}
              {cert.download_count > 0 && (
                <div className="text-xs text-gray-500 mb-3">
                  <Download className="w-3 h-3 inline mr-1" />
                  Diunduh {cert.download_count}x
                </div>
              )}

              {/* Download Button */}
              <button 
                onClick={() => handleDownload(cert.id, cert.certificate_number)}
                className="w-full py-3 px-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all font-medium flex items-center justify-center space-x-2 shadow-md hover:shadow-lg"
              >
                <Download className="w-4 h-4" />
                <span>Download PDF</span>
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CertificatesTab;

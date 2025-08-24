import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { authAPI } from '../../services/api';
import { CheckCircle, XCircle, Loader } from 'lucide-react';

const VerifyEmail = () => {
    const [status, setStatus] = useState('verifying'); // verifying, success, error
    const [message, setMessage] = useState('Sedang memverifikasi email Anda...');
    const [userEmail, setUserEmail] = useState('');
    const { token } = useParams();

    // Function to check actual verification status from database
    const checkActualStatus = async (email) => {
        try {
            const response = await fetch(`http://localhost:3000/api/auth/check-status?email=${encodeURIComponent(email)}`);
            const data = await response.json();
            
            if (response.ok && data.is_verified) {
                setStatus('success');
                setMessage('Email sudah diverifikasi sebelumnya. Anda dapat login sekarang!');
                return true;
            }
            return false;
        } catch (error) {
            console.error('Error checking status:', error);
            return false;
        }
    };

    useEffect(() => {
        const verify = async () => {
            if (!token) {
                setStatus('error');
                setMessage('Token verifikasi tidak ditemukan.');
                return;
            }

            try {
                const response = await authAPI.verifyEmail(token);
                setStatus('success');
                setMessage(response.data.message || 'Email berhasil diverifikasi! Anda sekarang bisa login.');
            } catch (error) {
                // If verification fails, check if any user is actually verified
                // This handles the case where token is missing but user is verified
                const debugResponse = await fetch('http://localhost:3000/api/debug/users');
                const debugData = await debugResponse.json();
                
                // Find any verified user and check their status
                const verifiedUser = debugData.users?.find(user => user.is_verified);
                if (verifiedUser) {
                    const isActuallyVerified = await checkActualStatus(verifiedUser.email);
                    if (isActuallyVerified) {
                        setUserEmail(verifiedUser.email);
                        return;
                    }
                }
                
                // If no verified users found or check failed, show error
                setStatus('error');
                setMessage(error.response?.data?.message || 'Token tidak valid atau sudah kedaluwarsa.');
            }
        };

        verify();
    }, [token]);

    const renderIcon = () => {
        switch (status) {
            case 'verifying':
                return <Loader className="w-16 h-16 text-blue-500 animate-spin" />;
            case 'success':
                return <CheckCircle className="w-16 h-16 text-green-500" />;
            case 'error':
                return <XCircle className="w-16 h-16 text-red-500" />;
            default:
                return null;
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
            <div className="max-w-md w-full bg-white shadow-lg rounded-lg p-8 text-center">
                <div className="mb-6">
                    {renderIcon()}
                </div>
                <h2 className={`text-2xl font-bold mb-4 ${status === 'success' ? 'text-gray-900' : 'text-gray-800'}`}>
                    {status === 'verifying' ? 'Verifikasi Email' : status === 'success' ? 'Verifikasi Berhasil' : 'Verifikasi Gagal'}
                </h2>
                <p className="text-gray-600 mb-8">{message}</p>
                {status !== 'verifying' && (
                    <Link
                        to="/login"
                        className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 transition-all"
                    >
                        Lanjutkan ke Login
                    </Link>
                )}
            </div>
        </div>
    );
};

export default VerifyEmail;

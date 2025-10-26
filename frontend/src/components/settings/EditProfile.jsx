import React from 'react';
import { User, Camera, MapPin, Mail, Phone, GraduationCap } from 'lucide-react';

const EditProfile = ({ profile, setProfile, handleProfileUpdate, isSaving }) => {
  return (
    <div className="bg-white rounded-2xl p-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Edit profile</h2>
      
      <form onSubmit={handleProfileUpdate} className="space-y-6">
        {/* Avatar Section */}
        <div className="flex flex-col items-center mb-8">
          <div className="relative">
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-3xl font-bold">
              {profile.nama_lengkap?.charAt(0) || 'U'}
            </div>
            <button
              type="button"
              className="absolute bottom-0 right-0 bg-white rounded-full p-2 shadow-lg border-2 border-gray-100 hover:bg-gray-50 transition-colors"
            >
              <Camera className="w-4 h-4 text-gray-600" />
            </button>
          </div>
          <button type="button" className="mt-3 text-sm text-blue-600 hover:text-blue-700 font-medium">
            Upload new image
          </button>
          <p className="text-xs text-gray-500 mt-1">At least 400 x 400 px recommended. JPG or PNG is allowed</p>
        </div>

        {/* Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Name
          </label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              name="nama_lengkap"
              value={profile.nama_lengkap || ''}
              onChange={(e) => setProfile({ ...profile, nama_lengkap: e.target.value })}
              placeholder="Username or name"
              className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            />
          </div>
        </div>

        {/* Location */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Location
          </label>
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              name="alamat"
              value={profile.alamat || ''}
              onChange={(e) => setProfile({ ...profile, alamat: e.target.value })}
              placeholder="San Gus, Vietnam"
              className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            />
          </div>
        </div>

        {/* Email */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Email
          </label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="email"
              name="email"
              value={profile.email || ''}
              disabled
              className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl bg-gray-50 text-gray-500 cursor-not-allowed"
            />
          </div>
        </div>

        {/* Phone */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Phone Number
          </label>
          <div className="relative">
            <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="tel"
              name="no_handphone"
              value={profile.no_handphone || ''}
              onChange={(e) => setProfile({ ...profile, no_handphone: e.target.value })}
              placeholder="+62 xxx xxx xxxx"
              className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            />
          </div>
        </div>

        {/* Education */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Education
          </label>
          <div className="relative">
            <GraduationCap className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              name="pendidikan_terakhir"
              value={profile.pendidikan_terakhir || ''}
              onChange={(e) => setProfile({ ...profile, pendidikan_terakhir: e.target.value })}
              placeholder="Your education level"
              className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            />
          </div>
        </div>

        {/* Bio */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Bio
          </label>
          <textarea
            rows="4"
            placeholder="Short bio..."
            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
          />
          <p className="text-xs text-gray-500 mt-2">275 characters left</p>
        </div>

        {/* Save Button */}
        <button
          type="submit"
          disabled={isSaving}
          className="w-full bg-blue-600 text-white py-3 rounded-xl font-medium hover:bg-blue-700 transition-colors disabled:bg-blue-400 disabled:cursor-not-allowed"
        >
          {isSaving ? 'Saving...' : 'Save changes'}
        </button>
      </form>
    </div>
  );
};

export default EditProfile;

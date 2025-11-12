import React, { useState, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { auth, db } from '../config/firebase';
import { updateProfile, sendPasswordResetEmail } from 'firebase/auth';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { toast } from 'react-toastify';

const schema = yup.object({
  name: yup.string().required('Name is required').min(2, 'Name must be at least 2 characters'),
  department: yup.string().required('Department is required'),
  phone: yup.string().matches(/^[0-9]{10}$/, 'Phone must be 10 digits'),
}).required();

export default function ProfileSettings() {
  const [loading, setLoading] = useState(false);
  const [userData, setUserData] = useState(null);
  const [avatarUrl, setAvatarUrl] = useState('');
  const [uploadingAvatar, setUploadingAvatar] = useState(false);

  const { register, handleSubmit, formState: { errors }, setValue } = useForm({
    resolver: yupResolver(schema)
  });

  useEffect(() => {
    fetchUserData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchUserData = async () => {
    try {
      const user = auth.currentUser;
      if (!user) return;

      const userDoc = await getDoc(doc(db, 'users', user.uid));
      if (userDoc.exists()) {
        const data = userDoc.data();
        setUserData(data);
        setValue('name', data.name || user.displayName || '');
        setValue('department', data.department || '');
        setValue('phone', data.phone || '');
        setAvatarUrl(data.photoURL || user.photoURL || '');
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
      toast.error('Failed to load profile data');
    }
  };

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const user = auth.currentUser;
      if (!user) throw new Error('No user logged in');

      // Update Firebase Auth profile
      await updateProfile(user, {
        displayName: data.name,
        photoURL: avatarUrl || user.photoURL
      });

      // Update Firestore user document
      await updateDoc(doc(db, 'users', user.uid), {
        name: data.name,
        department: data.department,
        phone: data.phone,
        photoURL: avatarUrl || user.photoURL,
        updatedAt: new Date().toISOString()
      });

      toast.success('Profile updated successfully!');
      fetchUserData();
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handleAvatarChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Please upload an image file');
      return;
    }

    // Validate file size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      toast.error('Image must be less than 2MB');
      return;
    }

    setUploadingAvatar(true);
    try {
      // For MVP, convert to base64 and store in Firestore
      // In production, use Firebase Storage
      const reader = new FileReader();
      reader.onload = async (event) => {
        const base64String = event.target?.result;
        setAvatarUrl(base64String);
        
        // Update immediately
        const user = auth.currentUser;
        if (user) {
          await updateDoc(doc(db, 'users', user.uid), {
            photoURL: base64String,
            updatedAt: new Date().toISOString()
          });
          toast.success('Avatar updated!');
        }
        setUploadingAvatar(false);
      };
      reader.onerror = () => {
        toast.error('Failed to read image');
        setUploadingAvatar(false);
      };
      reader.readAsDataURL(file);
    } catch (error) {
      console.error('Error uploading avatar:', error);
      toast.error('Failed to upload avatar');
      setUploadingAvatar(false);
    }
  };

  const handlePasswordReset = async () => {
    try {
      const user = auth.currentUser;
      if (!user?.email) throw new Error('No email found');

      await sendPasswordResetEmail(auth, user.email);
      toast.success('Password reset email sent! Check your inbox.');
    } catch (error) {
      console.error('Error sending password reset:', error);
      toast.error('Failed to send password reset email');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold bg-gradient-to-r from-green-400 to-emerald-500 bg-clip-text text-transparent">
          Profile Settings
        </h2>
        <p className="text-gray-400 mt-1">Update your personal information and preferences</p>
      </div>

      {/* Avatar Section */}
      <div className="bg-gradient-to-br from-gray-900/50 to-gray-800/50 backdrop-blur-xl p-6 rounded-2xl border border-green-500/20">
        <h3 className="text-lg font-semibold text-white mb-4">Profile Picture</h3>
        <div className="flex items-center gap-6">
          <div className="relative">
            {avatarUrl ? (
              <img
                src={avatarUrl}
                alt="Profile"
                className="w-24 h-24 rounded-full object-cover border-2 border-green-500"
              />
            ) : (
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center text-white text-3xl font-bold border-2 border-green-500">
                {auth.currentUser?.displayName?.charAt(0).toUpperCase() || 'U'}
              </div>
            )}
            {uploadingAvatar && (
              <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center">
                <div className="w-8 h-8 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              </div>
            )}
          </div>
          <div className="flex-1">
            <label
              htmlFor="avatar-upload"
              className="inline-block px-4 py-2 bg-green-500/20 hover:bg-green-500/30 text-green-400 rounded-lg font-medium cursor-pointer transition-all"
            >
              Change Avatar
            </label>
            <input
              id="avatar-upload"
              type="file"
              accept="image/*"
              onChange={handleAvatarChange}
              className="hidden"
              disabled={uploadingAvatar}
            />
            <p className="text-gray-400 text-sm mt-2">JPG, PNG or GIF (max 2MB)</p>
          </div>
        </div>
      </div>

      {/* Profile Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="bg-gradient-to-br from-gray-900/50 to-gray-800/50 backdrop-blur-xl p-6 rounded-2xl border border-green-500/20">
        <h3 className="text-lg font-semibold text-white mb-4">Personal Information</h3>
        
        <div className="space-y-4">
          {/* Email (Read-only) */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Email Address
            </label>
            <input
              type="email"
              value={auth.currentUser?.email || ''}
              disabled
              className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg text-gray-400 cursor-not-allowed"
            />
            <p className="text-gray-500 text-xs mt-1">Email cannot be changed</p>
          </div>

          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Full Name <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              {...register('name')}
              className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-green-500 transition-colors"
              placeholder="John Doe"
            />
            {errors.name && (
              <p className="text-red-400 text-sm mt-1">{errors.name.message}</p>
            )}
          </div>

          {/* Department */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Department <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              {...register('department')}
              className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-green-500 transition-colors"
              placeholder="Computer Science"
            />
            {errors.department && (
              <p className="text-red-400 text-sm mt-1">{errors.department.message}</p>
            )}
          </div>

          {/* Phone */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Phone Number
            </label>
            <input
              type="tel"
              {...register('phone')}
              className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-green-500 transition-colors"
              placeholder="1234567890"
            />
            {errors.phone && (
              <p className="text-red-400 text-sm mt-1">{errors.phone.message}</p>
            )}
          </div>

          {/* Role (Read-only) */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Role
            </label>
            <input
              type="text"
              value={userData?.role?.toUpperCase() || 'STUDENT'}
              disabled
              className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg text-gray-400 cursor-not-allowed"
            />
            <p className="text-gray-500 text-xs mt-1">Contact admin to change role</p>
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full mt-6 px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              Saving...
            </>
          ) : (
            <>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Save Changes
            </>
          )}
        </button>
      </form>

      {/* Security Section */}
      <div className="bg-gradient-to-br from-gray-900/50 to-gray-800/50 backdrop-blur-xl p-6 rounded-2xl border border-green-500/20">
        <h3 className="text-lg font-semibold text-white mb-4">Security</h3>
        <div className="flex items-start justify-between">
          <div>
            <p className="text-white font-medium">Password</p>
            <p className="text-gray-400 text-sm mt-1">Change your password via email link</p>
          </div>
          <button
            onClick={handlePasswordReset}
            className="px-4 py-2 bg-yellow-500/20 hover:bg-yellow-500/30 text-yellow-400 rounded-lg font-medium transition-all flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
            </svg>
            Reset Password
          </button>
        </div>
      </div>

      {/* Danger Zone */}
      <div className="bg-gradient-to-br from-red-900/20 to-red-800/20 backdrop-blur-xl p-6 rounded-2xl border border-red-500/20">
        <h3 className="text-lg font-semibold text-red-400 mb-2">Danger Zone</h3>
        <p className="text-gray-400 text-sm mb-4">
          Contact administrator to deactivate or delete your account
        </p>
        <button
          disabled
          className="px-4 py-2 bg-red-500/20 text-red-400 rounded-lg font-medium opacity-50 cursor-not-allowed"
        >
          Delete Account
        </button>
      </div>
    </div>
  );
}

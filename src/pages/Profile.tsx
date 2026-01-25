import { useState, useEffect } from 'react';
import { User, Mail, Phone, Edit2, X, Check } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import toast from 'react-hot-toast';
import { getStaffProfile, updateStaffProfile } from '../services/api';
import type { StaffResponse } from '../services/api';

const profileSchema = z.object({
  fullName: z.string().min(2, 'Full name must be at least 2 characters').max(100),
  phoneNumber: z.string().regex(/^[0-9]{10,20}$/, 'Invalid phone number').optional().or(z.literal('')),
});

type ProfileFormData = z.infer<typeof profileSchema>;

export const Profile = () => {
  const [profile, setProfile] = useState<StaffResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);

  const { register, handleSubmit, reset, formState: { errors } } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
  });

  const fetchProfile = async () => {
    try {
      const response = await getStaffProfile();
      if (response.success) {
        setProfile(response.data);
        reset({
          fullName: response.data.fullName,
          phoneNumber: response.data.phoneNumber || '',
        });
      }
    } catch (error) {
      toast.error('Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const onSubmit = async (data: ProfileFormData) => {
    setSaving(true);
    try {
      await updateStaffProfile({
        fullName: data.fullName,
        phoneNumber: data.phoneNumber || undefined,
      });
      toast.success('Profile updated successfully');
      setIsEditing(false);
      fetchProfile();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    if (profile) {
      reset({
        fullName: profile.fullName,
        phoneNumber: profile.phoneNumber || '',
      });
    }
    setIsEditing(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600 dark:text-gray-400">Failed to load profile</p>
      </div>
    );
  }

  const initials = profile.fullName.split(' ').map(n => n[0]).join('').toUpperCase();

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">My Profile</h1>
          <p className="text-gray-600 dark:text-gray-400">Manage your personal information</p>
        </div>
        {!isEditing && (
          <button
            onClick={() => setIsEditing(true)}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors"
          >
            <Edit2 className="h-4 w-4" />
            Edit Profile
          </button>
        )}
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
        {/* Header Section */}
        <div className="px-6 py-8 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-6">
            <div className="h-24 w-24 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-600 dark:text-indigo-400 font-bold text-2xl">
              {initials}
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{profile.fullName}</h2>
              <p className="text-gray-600 dark:text-gray-400">@{profile.username}</p>
              <div className="flex items-center gap-2 mt-2">
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  profile.role === 'ADMIN'
                    ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300'
                    : 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'
                }`}>
                  {profile.role}
                </span>
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  profile.status === 'ACTIVE'
                    ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300'
                    : 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300'
                }`}>
                  {profile.status}
                </span>
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  profile.privileges === 'UPDATE' ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300' :
                  profile.privileges === 'CREATE' ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300' :
                  'bg-gray-100 dark:bg-gray-900/30 text-gray-700 dark:text-gray-300'
                }`}>
                  {profile.privileges}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Form Section */}
        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
          {/* Email (Read-only) */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Email Address
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="email"
                value={profile.email}
                disabled
                className="w-full pl-10 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700/50 text-gray-900 dark:text-white opacity-75 cursor-not-allowed"
              />
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Email cannot be changed
            </p>
          </div>

          {/* Full Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Full Name
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <User className="h-5 w-5 text-gray-400" />
              </div>
              <input
                {...register('fullName')}
                disabled={!isEditing}
                className={`w-full pl-10 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white ${
                  !isEditing ? 'opacity-75 cursor-not-allowed' : ''
                }`}
              />
            </div>
            {errors.fullName && (
              <p className="text-red-600 text-sm mt-1">{errors.fullName.message}</p>
            )}
          </div>

          {/* Phone Number */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Phone Number
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Phone className="h-5 w-5 text-gray-400" />
              </div>
              <input
                {...register('phoneNumber')}
                disabled={!isEditing}
                placeholder="Enter phone number"
                className={`w-full pl-10 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white ${
                  !isEditing ? 'opacity-75 cursor-not-allowed' : ''
                }`}
              />
            </div>
            {errors.phoneNumber && (
              <p className="text-red-600 text-sm mt-1">{errors.phoneNumber.message}</p>
            )}
          </div>

          {/* Action Buttons (only show when editing) */}
          {isEditing && (
            <div className="flex gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
              <button
                type="button"
                onClick={handleCancel}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                <X className="h-4 w-4" />
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Check className="h-4 w-4" />
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          )}
        </form>

        {/* Additional Info Section */}
        <div className="px-6 py-4 bg-gray-50 dark:bg-gray-900/50 border-t border-gray-200 dark:border-gray-700">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-600 dark:text-gray-400">Account Created:</span>
              <span className="ml-2 text-gray-900 dark:text-white">
                {new Date(profile.createdAt).toLocaleDateString()}
              </span>
            </div>
            {profile.lastLogin && (
              <div>
                <span className="text-gray-600 dark:text-gray-400">Last Login:</span>
                <span className="ml-2 text-gray-900 dark:text-white">
                  {new Date(profile.lastLogin).toLocaleString()}
                </span>
              </div>
            )}
            <div>
              <span className="text-gray-600 dark:text-gray-400">Email Verified:</span>
              <span className="ml-2 text-gray-900 dark:text-white">
                {profile.emailVerified ? 'Yes' : 'No'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

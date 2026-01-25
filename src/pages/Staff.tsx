import { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, X, Ban, CheckCircle, KeyRound } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import toast from 'react-hot-toast';
import { getAllStaffs, createStaff, updateStaff, updateStaffRolePrivileges, updateStaffStatus, deleteStaff, resetStaffPassword } from '../services/api';
import type { StaffResponse, CreateStaffRequest, UpdateStaffRequest, StaffStatus } from '../services/api';
import { useAuth } from '../contexts/AuthContext';

const userSchema = z.object({
  username: z.string().min(3, 'Username must be at least 3 characters').max(50),
  email: z.string().email('Invalid email address'),
  fullName: z.string().min(2, 'Full name must be at least 2 characters').max(100),
  phoneNumber: z.string().regex(/^[0-9]{10,20}$/, 'Invalid phone number').optional().or(z.literal('')),
  role: z.enum(['ADMIN', 'STAFF']),
  privileges: z.enum(['READ', 'CREATE', 'UPDATE']),
});

type StaffFormData = z.infer<typeof userSchema>;

export const Staff = () => {
  const [staffs, setStaffs] = useState<StaffResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingStaff, setEditingStaff] = useState<StaffResponse | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<StaffResponse | null>(null);
  const { hasPrivilege } = useAuth();

  const { register, handleSubmit, reset, formState: { errors } } = useForm<StaffFormData>({
    resolver: zodResolver(userSchema),
  });

  const fetchStaffs = async () => {
    try {
      const response = await getAllStaffs();
      if (response.success) {
        setStaffs(response.data);
      }
    } catch (error) {
      toast.error('Failed to fetch staffs');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStaffs();
  }, []);

  const onSubmit = async (data: StaffFormData) => {
    try {
      if (editingStaff) {
        // Update basic details (email, fullName, phoneNumber)
        const updateDetailsPayload: UpdateStaffRequest = {
          email: data.email,
          fullName: data.fullName,
          phoneNumber: data.phoneNumber || undefined,
        };
        await updateStaff(editingStaff.userId, updateDetailsPayload);

        // Update role and privileges separately
        await updateStaffRolePrivileges(editingStaff.userId, {
          role: data.role,
          privileges: data.privileges,
        });

        toast.success('Staff updated successfully');
      } else {
        const createPayload: CreateStaffRequest = {
          username: data.username,
          email: data.email,
          fullName: data.fullName,
          phoneNumber: data.phoneNumber || undefined,
          role: data.role,
          privileges: data.privileges,
        };
        await createStaff(createPayload);
        toast.success('Staff created successfully. Password sent via email.');
      }

      setShowModal(false);
      setEditingStaff(null);
      reset();
      fetchStaffs();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Operation failed');
    }
  };

  const handleEdit = (user: StaffResponse) => {
    setEditingStaff(user);
    reset({
      username: user.username,
      email: user.email,
      fullName: user.fullName,
      phoneNumber: user.phoneNumber || '',
      role: user.role,
      privileges: user.privileges,
    });
    setShowModal(true);
  };

  const handleDelete = async (user: StaffResponse) => {
    try {
      await deleteStaff(user.userId);
      toast.success('Staff deleted successfully');
      setDeleteConfirm(null);
      fetchStaffs();
    } catch (error) {
      toast.error('Failed to delete user');
    }
  };

  const handleToggleStatus = async (user: StaffResponse) => {
    try {
      const newStatus: StaffStatus = user.status === 'ACTIVE' ? 'BLOCKED' : 'ACTIVE';
      await updateStaffStatus(user.userId, newStatus);
      toast.success(`Staff ${newStatus === 'BLOCKED' ? 'blocked' : 'unblocked'} successfully`);
      fetchStaffs();
    } catch (error) {
      toast.error('Failed to update user status');
    }
  };

  const handleResetPassword = async (user: StaffResponse) => {
    if (!window.confirm(`Send password reset email to ${user.email}?`)) return;

    try {
      await resetStaffPassword(user.userId);
      toast.success(`Password reset email sent to ${user.email}`);
    } catch (error) {
      toast.error('Failed to send password reset email');
    }
  };

  const canCreate = hasPrivilege('CREATE');
  const canUpdate = hasPrivilege('UPDATE');

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Staff Management</h1>
          <p className="text-gray-600 dark:text-gray-400">Manage system staffs and permissions</p>
        </div>
        {canCreate && (
          <button
            onClick={() => { setEditingStaff(null); reset(); setShowModal(true); }}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors"
          >
            <Plus className="h-5 w-5" />
            Add User
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {staffs.map((user) => {
          const initials = user.fullName.split(' ').map(n => n[0]).join('').toUpperCase();
          return (
            <div key={user.userId} className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-600 dark:text-indigo-400 font-semibold">
                    {initials}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">{user.fullName}</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">@{user.username}</p>
                  </div>
                </div>
              </div>

              <div className="space-y-2 text-sm">
                <p className="text-gray-600 dark:text-gray-400">{user.email}</p>
                {user.phoneNumber && <p className="text-gray-600 dark:text-gray-400">{user.phoneNumber}</p>}

                <div className="flex items-center gap-2 pt-2 flex-wrap">
                  <span className={`px-2 py-1 rounded text-xs font-medium ${user.role === 'ADMIN' ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300' : 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'}`}>
                    {user.role}
                  </span>
                  <span className={`px-2 py-1 rounded text-xs font-medium ${user.status === 'ACTIVE' ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300' : 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300'}`}>
                    {user.status}
                  </span>
                  <span className={`px-2 py-1 rounded text-xs font-medium ${
                    user.privileges === 'UPDATE' ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300' :
                    user.privileges === 'CREATE' ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300' :
                    'bg-gray-100 dark:bg-gray-900/30 text-gray-700 dark:text-gray-300'
                  }`}>
                    {user.privileges}
                  </span>
                </div>
              </div>

              {canUpdate && (
                <div className="space-y-2 mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(user)}
                      className="flex-1 flex items-center justify-center gap-2 px-3 py-2 text-sm bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 rounded hover:bg-indigo-100 dark:hover:bg-indigo-900/30"
                    >
                      <Edit2 className="h-4 w-4" />
                      Edit
                    </button>
                    <button
                      onClick={() => setDeleteConfirm(user)}
                      className="flex-1 flex items-center justify-center gap-2 px-3 py-2 text-sm bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded hover:bg-red-100 dark:hover:bg-red-900/30"
                    >
                      <Trash2 className="h-4 w-4" />
                      Delete
                    </button>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => handleToggleStatus(user)}
                      className={`flex items-center justify-center gap-2 px-3 py-2 text-sm rounded ${
                        user.status === 'ACTIVE'
                          ? 'bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400 hover:bg-orange-100 dark:hover:bg-orange-900/30'
                          : 'bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 hover:bg-green-100 dark:hover:bg-green-900/30'
                      }`}
                    >
                      {user.status === 'ACTIVE' ? (
                        <>
                          <Ban className="h-4 w-4" />
                          Block
                        </>
                      ) : (
                        <>
                          <CheckCircle className="h-4 w-4" />
                          Unblock
                        </>
                      )}
                    </button>
                    <button
                      onClick={() => handleResetPassword(user)}
                      className="flex items-center justify-center gap-2 px-3 py-2 text-sm bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400 rounded hover:bg-purple-100 dark:hover:bg-purple-900/30"
                    >
                      <KeyRound className="h-4 w-4" />
                      Reset PWD
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                {editingStaff ? 'Edit User' : 'Add New User'}
              </h2>
              <button onClick={() => { setShowModal(false); setEditingStaff(null); }} className="text-gray-400 hover:text-gray-600">
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Username</label>
                <input {...register('username')} disabled className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white disabled:opacity-50" />
                {errors.username && <p className="text-red-600 text-sm mt-1">{errors.username.message}</p>}
                {editingStaff && <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Username cannot be changed</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email</label>
                <input {...register('email')} type="email" className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white" />
                {errors.email && <p className="text-red-600 text-sm mt-1">{errors.email.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Full Name</label>
                <input {...register('fullName')} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white" />
                {errors.fullName && <p className="text-red-600 text-sm mt-1">{errors.fullName.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Phone Number (Optional)</label>
                <input {...register('phoneNumber')} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white" />
                {errors.phoneNumber && <p className="text-red-600 text-sm mt-1">{errors.phoneNumber.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Role</label>
                <select {...register('role')} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
                  <option value="STAFF">Staff</option>
                  <option value="ADMIN">Admin</option>
                </select>
                {errors.role && <p className="text-red-600 text-sm mt-1">{errors.role.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Privileges</label>
                <select {...register('privileges')} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
                  <option value="READ">Read Only</option>
                  <option value="CREATE">Create</option>
                  <option value="UPDATE">Update (Full Access)</option>
                </select>
                {errors.privileges && <p className="text-red-600 text-sm mt-1">{errors.privileges.message}</p>}
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Update includes Create and Read permissions
                </p>
              </div>

              <div className="flex gap-3 pt-4">
                <button type="button" onClick={() => { setShowModal(false); setEditingStaff(null); }} className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700">
                  Cancel
                </button>
                <button type="submit" className="flex-1 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg">
                  {editingStaff ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full p-6">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Delete User</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Are you sure you want to delete <strong>{deleteConfirm.fullName}</strong>? This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteConfirm(null)} className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700">
                Cancel
              </button>
              <button onClick={() => handleDelete(deleteConfirm)} className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg">
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

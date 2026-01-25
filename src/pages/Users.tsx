import { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, X, Ban, CheckCircle } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import toast from 'react-hot-toast';
import { getAllCustomers, createCustomer, updateCustomer, toggleCustomerStatus, deleteCustomer } from '../services/api';
import type { CustomerResponse, CustomerRequest } from '../services/api';
import { useAuth } from '../contexts/AuthContext';

const customerSchema = z.object({
  customerName: z.string().min(2, 'Name must be at least 2 characters').max(100),
  customerEmail: z.string().email('Invalid email address'),
  phoneNumber: z.string().min(10, 'Phone number must be at least 10 digits').optional().or(z.literal('')),
  gstNumber: z.string().min(15, 'GST number must be 15 characters').max(15).optional().or(z.literal('')),
  address: z.string().min(5, 'Address must be at least 5 characters'),
  city: z.string().min(2, 'City must be at least 2 characters'),
  state: z.string().min(2, 'State must be at least 2 characters'),
  pincode: z.number().int().min(100000, 'Invalid pincode').max(999999, 'Invalid pincode'),
});

type CustomerFormData = z.infer<typeof customerSchema>;

export const Users = () => {
  const [customers, setCustomers] = useState<CustomerResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<CustomerResponse | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<CustomerResponse | null>(null);
  const { hasPrivilege } = useAuth();

  const { register, handleSubmit, reset, formState: { errors } } = useForm<CustomerFormData>({
    resolver: zodResolver(customerSchema),
  });

  const fetchCustomers = async () => {
    try {
      const response = await getAllCustomers();
      if (response.success) {
        setCustomers(response.data);
      }
    } catch (error) {
      toast.error('Failed to fetch customers');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  const onSubmit = async (data: CustomerFormData) => {
    try {
      const payload: CustomerRequest = {
        customerName: data.customerName,
        customerEmail: data.customerEmail,
        phoneNumber: data.phoneNumber || undefined,
        gstNumber: data.gstNumber || undefined,
        address: data.address,
        city: data.city,
        state: data.state,
        pincode: data.pincode,
      };

      if (editingCustomer) {
        await updateCustomer(editingCustomer.customerId, payload);
        toast.success('Customer updated successfully');
      } else {
        await createCustomer(payload);
        toast.success('Customer created successfully');
      }

      setShowModal(false);
      setEditingCustomer(null);
      reset();
      fetchCustomers();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Operation failed');
    }
  };

  const handleEdit = (customer: CustomerResponse) => {
    setEditingCustomer(customer);
    reset({
      customerName: customer.customerName,
      customerEmail: customer.customerEmail,
      phoneNumber: customer.phoneNumber || '',
      gstNumber: customer.gstNumber || '',
      address: customer.address,
      city: customer.city,
      state: customer.state,
      pincode: customer.pincode,
    });
    setShowModal(true);
  };

  const handleDelete = async (customer: CustomerResponse) => {
    try {
      await deleteCustomer(customer.customerId);
      toast.success('Customer deleted successfully');
      setDeleteConfirm(null);
      fetchCustomers();
    } catch (error) {
      toast.error('Failed to delete customer');
    }
  };

  const handleToggleStatus = async (customer: CustomerResponse) => {
    try {
      await toggleCustomerStatus(customer.customerId);
      const newStatus = customer.status === 'WHITELISTED' ? 'BLACKLISTED' : 'WHITELISTED';
      toast.success(`Customer ${newStatus === 'BLACKLISTED' ? 'blacklisted' : 'whitelisted'} successfully`);
      fetchCustomers();
    } catch (error) {
      toast.error('Failed to update customer status');
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
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Customer Management</h1>
          <p className="text-gray-600 dark:text-gray-400">Manage customers and their information</p>
        </div>
        {canCreate && (
          <button
            onClick={() => { setEditingCustomer(null); reset(); setShowModal(true); }}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors"
          >
            <Plus className="h-5 w-5" />
            Add Customer
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {customers.map((customer) => {
          const initials = customer.customerName.split(' ').map(n => n[0]).join('').toUpperCase();
          return (
            <div key={customer.customerId} className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-600 dark:text-indigo-400 font-semibold">
                    {initials}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">{customer.customerName}</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{customer.city}, {customer.state}</p>
                  </div>
                </div>
              </div>

              <div className="space-y-2 text-sm">
                <p className="text-gray-600 dark:text-gray-400">{customer.customerEmail}</p>
                {customer.phoneNumber && <p className="text-gray-600 dark:text-gray-400">{customer.phoneNumber}</p>}
                {customer.gstNumber && <p className="text-gray-600 dark:text-gray-400 font-mono text-xs">GST: {customer.gstNumber}</p>}
                <p className="text-gray-600 dark:text-gray-400 text-xs">{customer.address}</p>
                <p className="text-gray-600 dark:text-gray-400 text-xs">Pincode: {customer.pincode}</p>

                <div className="flex items-center gap-2 pt-2">
                  <span className={`px-2 py-1 rounded text-xs font-medium ${customer.status === 'WHITELISTED' ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300' : 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300'}`}>
                    {customer.status}
                  </span>
                </div>
              </div>

              {canUpdate && (
                <div className="space-y-2 mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(customer)}
                      className="flex-1 flex items-center justify-center gap-2 px-3 py-2 text-sm bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 rounded hover:bg-indigo-100 dark:hover:bg-indigo-900/30"
                    >
                      <Edit2 className="h-4 w-4" />
                      Edit
                    </button>
                    <button
                      onClick={() => setDeleteConfirm(customer)}
                      className="flex-1 flex items-center justify-center gap-2 px-3 py-2 text-sm bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded hover:bg-red-100 dark:hover:bg-red-900/30"
                    >
                      <Trash2 className="h-4 w-4" />
                      Delete
                    </button>
                  </div>
                  <button
                    onClick={() => handleToggleStatus(customer)}
                    className={`w-full flex items-center justify-center gap-2 px-3 py-2 text-sm rounded ${
                      customer.status === 'WHITELISTED'
                        ? 'bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400 hover:bg-orange-100 dark:hover:bg-orange-900/30'
                        : 'bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 hover:bg-green-100 dark:hover:bg-green-900/30'
                    }`}
                  >
                    {customer.status === 'WHITELISTED' ? (
                      <>
                        <Ban className="h-4 w-4" />
                        Blacklist Customer
                      </>
                    ) : (
                      <>
                        <CheckCircle className="h-4 w-4" />
                        Whitelist Customer
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                {editingCustomer ? 'Edit Customer' : 'Add New Customer'}
              </h2>
              <button onClick={() => { setShowModal(false); setEditingCustomer(null); }} className="text-gray-400 hover:text-gray-600">
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Customer Name *</label>
                  <input {...register('customerName')} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white" />
                  {errors.customerName && <p className="text-red-600 text-sm mt-1">{errors.customerName.message}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email *</label>
                  <input {...register('customerEmail')} type="email" className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white" />
                  {errors.customerEmail && <p className="text-red-600 text-sm mt-1">{errors.customerEmail.message}</p>}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Phone Number</label>
                  <input {...register('phoneNumber')} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white" />
                  {errors.phoneNumber && <p className="text-red-600 text-sm mt-1">{errors.phoneNumber.message}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">GST Number</label>
                  <input {...register('gstNumber')} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white" />
                  {errors.gstNumber && <p className="text-red-600 text-sm mt-1">{errors.gstNumber.message}</p>}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Address *</label>
                <textarea {...register('address')} rows={2} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white" />
                {errors.address && <p className="text-red-600 text-sm mt-1">{errors.address.message}</p>}
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">City *</label>
                  <input {...register('city')} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white" />
                  {errors.city && <p className="text-red-600 text-sm mt-1">{errors.city.message}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">State *</label>
                  <input {...register('state')} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white" />
                  {errors.state && <p className="text-red-600 text-sm mt-1">{errors.state.message}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Pincode *</label>
                  <input {...register('pincode', { valueAsNumber: true })} type="number" className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white" />
                  {errors.pincode && <p className="text-red-600 text-sm mt-1">{errors.pincode.message}</p>}
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <button type="button" onClick={() => { setShowModal(false); setEditingCustomer(null); }} className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700">
                  Cancel
                </button>
                <button type="submit" className="flex-1 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg">
                  {editingCustomer ? 'Update' : 'Create'}
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
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Delete Customer</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Are you sure you want to delete <strong>{deleteConfirm.customerName}</strong>? This action cannot be undone.
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

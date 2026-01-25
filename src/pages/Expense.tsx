import { Wallet, Plus } from 'lucide-react';

export const Expense = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Expense Tracking</h1>
          <p className="text-gray-600 dark:text-gray-400">Monitor and manage business expenses</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors">
          <Plus className="h-5 w-5" />
          Add Expense
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <p className="text-sm font-medium text-gray-600 dark:text-gray-400">This Month</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white mt-2">$12,345</p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Last Month</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white mt-2">$10,890</p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Year to Date</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white mt-2">$145,670</p>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <Wallet className="h-12 w-12 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-600 dark:text-gray-400">Expense tracking features coming soon...</p>
          </div>
        </div>
      </div>
    </div>
  );
};

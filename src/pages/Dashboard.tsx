import { LayoutDashboard, TrendingUp, Users, DollarSign } from 'lucide-react';

export const Dashboard = () => {
  const stats = [
    { name: 'Total Revenue', value: '$45,231', icon: DollarSign, change: '+20.1%', changeType: 'positive' },
    { name: 'Active Users', value: '2,345', icon: Users, change: '+12.5%', changeType: 'positive' },
    { name: 'Sales Today', value: '156', icon: TrendingUp, change: '+8.2%', changeType: 'positive' },
    { name: 'Inventory Items', value: '892', icon: LayoutDashboard, change: '-2.4%', changeType: 'negative' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
        <p className="text-gray-600 dark:text-gray-400">Overview of your business metrics</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.name} className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{stat.name}</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white mt-2">{stat.value}</p>
                  <p className={`text-sm mt-2 ${stat.changeType === 'positive' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                    {stat.change} from last month
                  </p>
                </div>
                <div className="h-12 w-12 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg flex items-center justify-center">
                  <Icon className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Recent Activity</h2>
        <p className="text-gray-600 dark:text-gray-400">Activity feed will appear here...</p>
      </div>
    </div>
  );
};

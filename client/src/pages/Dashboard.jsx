import { useEffect, useState } from 'react';
import axios from 'axios';
import { Users, UserPlus, CheckCircle, BarChart } from 'lucide-react';

export default function Dashboard() {
    const [metrics, setMetrics] = useState({
        total: 0,
        new: 0,
        contacted: 0,
        converted: 0,
        conversionRate: 0
    });

    useEffect(() => {
        const fetchLeads = async () => {
            try {
                const res = await axios.get('http://localhost:5000/api/leads');
                const leads = res.data;
                const total = leads.length;
                const newLeads = leads.filter(l => l.status === 'New').length;
                const contacted = leads.filter(l => l.status === 'Contacted').length;
                const converted = leads.filter(l => l.status === 'Converted').length;

                setMetrics({
                    total,
                    new: newLeads,
                    contacted,
                    converted,
                    conversionRate: total > 0 ? ((converted / total) * 100).toFixed(1) : 0
                });
            } catch (err) {
                console.error('Failed to fetch dashboard data', err);
            }
        };
        fetchLeads();
    }, []);

    const stats = [
        { name: 'Total Leads', value: metrics.total, icon: Users, color: 'bg-blue-500' },
        { name: 'New Leads', value: metrics.new, icon: UserPlus, color: 'bg-yellow-500' },
        { name: 'Converted', value: metrics.converted, icon: CheckCircle, color: 'bg-green-500' },
        { name: 'Conversion Rate', value: `${metrics.conversionRate}%`, icon: BarChart, color: 'bg-purple-500' },
    ];

    return (
        <div>
            <h1 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
                Dashboard
            </h1>

            <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
                {stats.map((item) => (
                    <div key={item.name} className="overflow-hidden rounded-lg bg-white shadow">
                        <div className="p-5">
                            <div className="flex items-center">
                                <div className="flex-shrink-0">
                                    <div className={`flex h-12 w-12 items-center justify-center rounded-md ${item.color} text-white`}>
                                        <item.icon className="h-6 w-6" aria-hidden="true" />
                                    </div>
                                </div>
                                <div className="ml-5 w-0 flex-1">
                                    <dl>
                                        <dt className="truncate text-sm font-medium text-gray-500">{item.name}</dt>
                                        <dd>
                                            <div className="text-lg font-medium text-gray-900">{item.value}</div>
                                        </dd>
                                    </dl>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Recent activity or charts could go here */}
        </div>
    );
}

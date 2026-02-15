import { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { Plus, Search } from 'lucide-react';

export default function Leads() {
    const [leads, setLeads] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('All');

    useEffect(() => {
        fetchLeads();
    }, []);

    const fetchLeads = async () => {
        try {
            const res = await axios.get('http://localhost:5000/api/leads');
            setLeads(res.data);
        } catch (err) {
            console.error('Error fetching leads:', err);
        } finally {
            setLoading(false);
        }
    };

    const filteredLeads = filter === 'All' ? leads : leads.filter(lead => lead.status === filter);

    const getStatusColor = (status) => {
        switch (status) {
            case 'New': return 'bg-blue-100 text-blue-800';
            case 'Contacted': return 'bg-yellow-100 text-yellow-800';
            case 'Converted': return 'bg-green-100 text-green-800';
            case 'Lost': return 'bg-gray-100 text-gray-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <div>
            <div className="sm:flex sm:items-center">
                <div className="sm:flex-auto">
                    <h1 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">Leads</h1>
                    <p className="mt-2 text-sm text-gray-700">
                        A list of all your leads including their name, email, source, and current status.
                    </p>
                </div>
                <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
                    <Link
                        to="/leads/new"
                        className="block rounded-md bg-blue-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
                    >
                        <Plus className="inline-block h-4 w-4 mr-1" />
                        Add Lead
                    </Link>
                </div>
            </div>

            <div className="mt-8 flex justify-between items-center bg-white p-4 rounded-t-lg border-b border-gray-200">
                <div className="flex items-center space-x-2">
                    <span className="text-sm font-medium text-gray-700">Filter by Status:</span>
                    <select
                        value={filter}
                        onChange={(e) => setFilter(e.target.value)}
                        className="rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-blue-600 sm:text-sm sm:leading-6"
                    >
                        <option>All</option>
                        <option>New</option>
                        <option>Contacted</option>
                        <option>Converted</option>
                        <option>Lost</option>
                    </select>
                </div>
            </div>

            <div className="overflow-hidden bg-white shadow ring-1 ring-black ring-opacity-5 sm:rounded-b-lg">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-300">
                        <thead className="bg-gray-50">
                            <tr>
                                <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">Name</th>
                                <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Email</th>
                                <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Source</th>
                                <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Status</th>
                                <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Date</th>
                                <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                                    <span className="sr-only">Edit</span>
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 bg-white">
                            {filteredLeads.map((lead) => (
                                <tr key={lead._id}>
                                    <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">{lead.name}</td>
                                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{lead.email}</td>
                                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{lead.source}</td>
                                    <td className="whitespace-nowrap px-3 py-4 text-sm">
                                        <span className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${getStatusColor(lead.status)}`}>
                                            {lead.status}
                                        </span>
                                    </td>
                                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{new Date(lead.createdAt).toLocaleDateString()}</td>
                                    <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                                        <Link to={`/leads/${lead._id}`} className="text-blue-600 hover:text-blue-900">View</Link>
                                    </td>
                                </tr>
                            ))}
                            {filteredLeads.length === 0 && !loading && (
                                <tr>
                                    <td colSpan="6" className="py-10 text-center text-gray-500">No leads found.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

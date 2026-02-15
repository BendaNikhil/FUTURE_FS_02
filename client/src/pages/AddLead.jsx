import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { ArrowLeft } from 'lucide-react';

export default function AddLead() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        source: 'Website',
        status: 'New'
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            await axios.post('http://localhost:5000/api/leads', formData);
            navigate('/leads');
        } catch (err) {
            console.error('Error adding lead:', err);
            setError(err.response?.data?.msg || 'Failed to add lead');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <div className="mb-6 flex items-center">
                <Link to="/leads" className="mr-4 text-gray-500 hover:text-gray-700">
                    <ArrowLeft className="h-6 w-6" />
                </Link>
                <h1 className="text-2xl font-bold text-gray-900">Add New Lead</h1>
            </div>

            <div className="bg-white shadow sm:rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                    {error && (
                        <div className="mb-4 bg-red-50 border-l-4 border-red-400 p-4">
                            <div className="flex">
                                <div className="ml-3">
                                    <p className="text-sm text-red-700">{error}</p>
                                </div>
                            </div>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                            <div className="sm:col-span-3">
                                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                                    Full Name
                                </label>
                                <div className="mt-1">
                                    <input
                                        type="text"
                                        name="name"
                                        id="name"
                                        required
                                        value={formData.name}
                                        onChange={handleChange}
                                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm border p-2"
                                    />
                                </div>
                            </div>

                            <div className="sm:col-span-3">
                                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                                    Email
                                </label>
                                <div className="mt-1">
                                    <input
                                        type="email"
                                        name="email"
                                        id="email"
                                        required
                                        value={formData.email}
                                        onChange={handleChange}
                                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm border p-2"
                                    />
                                </div>
                            </div>

                            <div className="sm:col-span-3">
                                <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                                    Phone
                                </label>
                                <div className="mt-1">
                                    <input
                                        type="text"
                                        name="phone"
                                        id="phone"
                                        value={formData.phone}
                                        onChange={handleChange}
                                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm border p-2"
                                    />
                                </div>
                            </div>

                            <div className="sm:col-span-3">
                                <label htmlFor="source" className="block text-sm font-medium text-gray-700">
                                    Source
                                </label>
                                <div className="mt-1">
                                    <select
                                        id="source"
                                        name="source"
                                        value={formData.source}
                                        onChange={handleChange}
                                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm border p-2"
                                    >
                                        <option>Website</option>
                                        <option>Social Media</option>
                                        <option>Referral</option>
                                        <option>Other</option>
                                    </select>
                                </div>
                            </div>

                            <div className="sm:col-span-3">
                                <label htmlFor="status" className="block text-sm font-medium text-gray-700">
                                    Status
                                </label>
                                <div className="mt-1">
                                    <select
                                        id="status"
                                        name="status"
                                        value={formData.status}
                                        onChange={handleChange}
                                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm border p-2"
                                    >
                                        <option>New</option>
                                        <option>Contacted</option>
                                        <option>Converted</option>
                                        <option>Lost</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        <div className="flex justify-end">
                            <button
                                type="button"
                                onClick={() => navigate('/leads')}
                                className="rounded-md border border-gray-300 bg-white py-2 px-4 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 mr-3"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={loading}
                                className="inline-flex justify-center rounded-md border border-transparent bg-blue-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                            >
                                {loading ? 'Saving...' : 'Save Lead'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

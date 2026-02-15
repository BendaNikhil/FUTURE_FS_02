import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ArrowLeft, Send } from 'lucide-react';

export default function LeadDetails() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [lead, setLead] = useState(null);
    const [loading, setLoading] = useState(true);
    const [note, setNote] = useState('');
    const [status, setStatus] = useState('');

    useEffect(() => {
        fetchLead();
    }, [id]);

    const fetchLead = async () => {
        try {
            const res = await axios.get(`http://localhost:5000/api/leads/${id}`);
            setLead(res.data);
            setStatus(res.data.status);
        } catch (err) {
            console.error('Error fetching lead:', err);
        } finally {
            setLoading(false);
        }
    };

    const handlStatusChange = async (e) => {
        const newStatus = e.target.value;
        setStatus(newStatus);
        try {
            await axios.put(`http://localhost:5000/api/leads/${id}`, { status: newStatus });
            fetchLead(); // Refresh to get updated timestamps/data
        } catch (err) {
            console.error('Error updating status:', err);
        }
    };

    const handleAddNote = async (e) => {
        e.preventDefault();
        if (!note.trim()) return;

        try {
            await axios.post(`http://localhost:5000/api/leads/${id}/notes`, { content: note });
            setNote('');
            fetchLead();
        } catch (err) {
            console.error('Error adding note:', err);
        }
    };

    if (loading) return <div>Loading...</div>;
    if (!lead) return <div>Lead not found</div>;

    return (
        <div>
            <div className="mb-6 flex items-center justify-between">
                <div className="flex items-center space-x-4">
                    <button onClick={() => navigate('/leads')} className="text-gray-500 hover:text-gray-700">
                        <ArrowLeft className="h-6 w-6" />
                    </button>
                    <h1 className="text-2xl font-bold text-gray-900">{lead.name}</h1>
                    <span className="inline-flex items-center rounded-md bg-white px-2 py-1 text-xs font-medium text-gray-700 ring-1 ring-inset ring-gray-300">
                        {lead.email}
                    </span>
                </div>
                <div className="flex items-center space-x-2">
                    <label htmlFor="status" className="block text-sm font-medium leading-6 text-gray-900">
                        Status:
                    </label>
                    <select
                        id="status"
                        value={status}
                        onChange={handlStatusChange}
                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
                    >
                        <option>New</option>
                        <option>Contacted</option>
                        <option>Converted</option>
                        <option>Lost</option>
                    </select>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                {/* Lead Info */}
                <div className="rounded-lg bg-white p-6 shadow">
                    <h2 className="text-lg font-medium text-gray-900 mb-4">Lead Information</h2>
                    <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
                        <div className="sm:col-span-1">
                            <dt className="text-sm font-medium text-gray-500">Full name</dt>
                            <dd className="mt-1 text-sm text-gray-900">{lead.name}</dd>
                        </div>
                        <div className="sm:col-span-1">
                            <dt className="text-sm font-medium text-gray-500">Email address</dt>
                            <dd className="mt-1 text-sm text-gray-900">{lead.email}</dd>
                        </div>
                        <div className="sm:col-span-1">
                            <dt className="text-sm font-medium text-gray-500">Phone</dt>
                            <dd className="mt-1 text-sm text-gray-900">{lead.phone || 'N/A'}</dd>
                        </div>
                        <div className="sm:col-span-1">
                            <dt className="text-sm font-medium text-gray-500">Source</dt>
                            <dd className="mt-1 text-sm text-gray-900">{lead.source}</dd>
                        </div>
                        <div className="sm:col-span-1">
                            <dt className="text-sm font-medium text-gray-500">Created At</dt>
                            <dd className="mt-1 text-sm text-gray-900">{new Date(lead.createdAt).toLocaleString()}</dd>
                        </div>
                    </dl>
                </div>

                {/* Notes */}
                <div className="rounded-lg bg-white p-6 shadow flex flex-col h-full">
                    <h2 className="text-lg font-medium text-gray-900 mb-4">Notes & Activity</h2>

                    <div className="flex-1 overflow-y-auto max-h-96 mb-4 space-y-4">
                        {lead.notes && lead.notes.length > 0 ? (
                            lead.notes.map((note, idx) => (
                                <div key={idx} className="relative flex gap-x-3">
                                    <div className="flex-auto rounded-md p-3 ring-1 ring-inset ring-gray-200">
                                        <div className="flex justify-between gap-x-4">
                                            <div className="py-0.5 text-xs leading-5 text-gray-500">
                                                <span className="font-medium text-gray-900">{note.author}</span> commented
                                            </div>
                                            <time dateTime={note.createdAt} className="flex-none py-0.5 text-xs leading-5 text-gray-500">
                                                {new Date(note.createdAt).toLocaleString()}
                                            </time>
                                        </div>
                                        <p className="text-sm leading-6 text-gray-500">{note.content}</p>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p className="text-gray-500 text-sm italic">No notes yet.</p>
                        )}
                    </div>

                    <form onSubmit={handleAddNote} className="relative">
                        <div className="overflow-hidden rounded-lg shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-blue-600">
                            <label htmlFor="note" className="sr-only">Add a note</label>
                            <textarea
                                rows={3}
                                name="note"
                                id="note"
                                className="block w-full resize-none border-0 bg-transparent py-1.5 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6 p-2"
                                placeholder="Add a note..."
                                value={note}
                                onChange={(e) => setNote(e.target.value)}
                            />
                            <div className="py-2" aria-hidden="true">
                                <div className="py-px">
                                    <div className="h-9" />
                                </div>
                            </div>
                        </div>
                        <div className="absolute inset-x-0 bottom-0 flex justify-between py-2 pl-3 pr-2">
                            <div />
                            <button
                                type="submit"
                                className="inline-flex items-center rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
                            >
                                Post
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

import React, { useState } from 'react';
import Card from '../components/Card';
import Modal from '../components/Modal';
import Tooltip from '../components/Tooltip';
import { useAuth } from '../hooks/useAuth';
import { CollegeApplication, ApplicationStatus } from '../types';

const getStatusBadgeClass = (status: ApplicationStatus) => {
  switch (status) {
    case ApplicationStatus.ACCEPTED: return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
    case ApplicationStatus.REJECTED: return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
    case ApplicationStatus.WAITLISTED: return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
    case ApplicationStatus.APPLIED: return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
    default: return 'bg-gray-100 text-gray-800 dark:bg-gray-600 dark:text-gray-200';
  }
};

const ApplicationTrackerPage: React.FC = () => {
    const { user, addApplication, updateApplication, deleteApplication } = useAuth();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingApp, setEditingApp] = useState<CollegeApplication | null>(null);
    const [formData, setFormData] = useState<Omit<CollegeApplication, 'id'>>({
        collegeName: '',
        status: ApplicationStatus.PLANNING,
        deadline: '',
        notes: ''
    });

    const openAddModal = () => {
        setEditingApp(null);
        setFormData({ collegeName: '', status: ApplicationStatus.PLANNING, deadline: '', notes: '' });
        setIsModalOpen(true);
    };

    const openEditModal = (app: CollegeApplication) => {
        setEditingApp(app);
        setFormData({ ...app, deadline: app.deadline ? app.deadline.split('T')[0] : '' });
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setEditingApp(null);
    };

    const handleDelete = (appId: string) => {
        if (window.confirm('Are you sure you want to delete this application entry?')) {
            deleteApplication(appId);
        }
    };
    
    const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleFormSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.collegeName) return;

        if (editingApp) {
            updateApplication({ ...formData, id: editingApp.id });
        } else {
            addApplication(formData);
        }
        closeModal();
    };

    const applications = user?.applications || [];

    return (
        <div>
            <h1 className="text-4xl font-bold mb-6">College Application Tracker</h1>
            <Card>
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-bold">Your Applications ({applications.length})</h2>
                    <Tooltip text="Add a new college application to your tracker.">
                    <button onClick={openAddModal} className="bg-primary text-white font-bold py-2 px-4 rounded-md hover:bg-indigo-700 transition-colors">
                        Add Application
                    </button>
                    </Tooltip>
                </div>
                {applications.length > 0 ? (
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200 dark:divide-neutral-600">
                            <thead className="bg-gray-50 dark:bg-neutral-800">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">College Name</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Deadline</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                             <tbody className="bg-white dark:bg-neutral-700 divide-y divide-gray-200 dark:divide-neutral-600">
                                {applications.map(app => (
                                    <tr key={app.id}>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">{app.collegeName}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm"><span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeClass(app.status)}`}>{app.status}</span></td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{app.deadline ? new Date(app.deadline).toLocaleDateString() : 'N/A'}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                                            <Tooltip text="Edit this application."><button onClick={() => openEditModal(app)} className="text-indigo-600 hover:text-indigo-900">Edit</button></Tooltip>
                                            <Tooltip text="Delete this application."><button onClick={() => handleDelete(app.id)} className="text-red-600 hover:text-red-900">Delete</button></Tooltip>
                                        </td>
                                    </tr>
                                ))}
                             </tbody>
                        </table>
                    </div>
                ) : (
                    <div className="text-center py-10">
                        <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" /></svg>
                        <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">No applications yet!</h3>
                        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Click 'Add Application' to start tracking your college journey.</p>
                    </div>
                )}
            </Card>

            <Modal isOpen={isModalOpen} onClose={closeModal} title={editingApp ? 'Edit Application' : 'Add Application'}>
                <form onSubmit={handleFormSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="collegeName" className="block text-sm font-medium text-gray-700">College Name</label>
                        <input type="text" name="collegeName" value={formData.collegeName} onChange={handleFormChange} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary" />
                    </div>
                     <div>
                        <label htmlFor="status" className="block text-sm font-medium text-gray-700">Status</label>
                        <select name="status" value={formData.status} onChange={handleFormChange} className="mt-1 block w-full pl-3 pr-10 py-2 border border-gray-300 bg-white rounded-md focus:outline-none focus:ring-primary focus:border-primary sm:text-sm">
                            {Object.values(ApplicationStatus).map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                    </div>
                    <div>
                        <label htmlFor="deadline" className="block text-sm font-medium text-gray-700">Application Deadline</label>
                        <input type="date" name="deadline" value={formData.deadline} onChange={handleFormChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"/>
                    </div>
                     <div>
                        <label htmlFor="notes" className="block text-sm font-medium text-gray-700">Notes</label>
                        <textarea name="notes" value={formData.notes} onChange={handleFormChange} rows={3} placeholder="e.g., Required essays, interview date..." className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"/>
                    </div>
                    <div className="mt-6 flex justify-end space-x-2">
                        <button type="button" onClick={closeModal} className="bg-gray-200 text-gray-800 font-bold py-2 px-4 rounded-md hover:bg-gray-300 transition-colors">Cancel</button>
                        <button type="submit" className="bg-primary text-white font-bold py-2 px-4 rounded-md hover:bg-indigo-700 transition-colors">{editingApp ? 'Save Changes' : 'Add Application'}</button>
                    </div>
                </form>
            </Modal>
        </div>
    );
};

export default ApplicationTrackerPage;
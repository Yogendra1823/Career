import React, { useState, useMemo } from 'react';
import Card from '../../components/Card';
import { User, UserRole } from '../../types';
import { useAuth } from '../../hooks/useAuth';
import Modal from '../../components/Modal';
import Tooltip from '../../components/Tooltip';

const getRoleBadgeClass = (role: UserRole) => {
  switch (role) {
    case UserRole.ADMIN: return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
    case UserRole.COUNSELOR: return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
    case UserRole.STUDENT: return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
    default: return 'bg-gray-100 text-gray-800 dark:bg-gray-600 dark:text-gray-200';
  }
};

const ROLE_DESCRIPTIONS: Record<UserRole, string> = {
    [UserRole.ADMIN]: "Full administrative access to the platform.",
    [UserRole.STUDENT]: "Standard student account with access to quizzes and recommendations.",
    [UserRole.COUNSELOR]: "Can view student progress and provide guidance (future feature)."
}

type SortKey = 'name' | 'email' | 'role';
type SortDirection = 'asc' | 'desc';

const UserManagementPage: React.FC = () => {
  const { users, user: currentUser, addUser, editUser, deleteUser } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [formData, setFormData] = useState({ name: '', email: '', role: UserRole.STUDENT });
  const [sortConfig, setSortConfig] = useState<{ key: SortKey; direction: SortDirection } | null>({ key: 'name', direction: 'asc' });

  const sortedUsers = useMemo(() => {
    let sortableUsers = [...users];
    if (sortConfig !== null) {
      sortableUsers.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) return sortConfig.direction === 'asc' ? -1 : 1;
        if (a[sortConfig.key] > b[sortConfig.key]) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
      });
    }
    return sortableUsers;
  }, [users, sortConfig]);
  
  const requestSort = (key: SortKey) => {
    let direction: SortDirection = 'asc';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };
  
  const openAddModal = () => {
    setEditingUser(null);
    setFormData({ name: '', email: '', role: UserRole.STUDENT });
    setIsModalOpen(true);
  };

  const openEditModal = (user: User) => {
    setEditingUser(user);
    setFormData({ name: user.name, email: user.email, role: user.role });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingUser(null);
  };

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingUser) {
      editUser(editingUser.id, formData);
    } else {
      addUser(formData as Omit<User, 'id' | 'verified'>);
    }
    closeModal();
  };
  
  const handleDelete = (userId: string) => {
      if (userId === currentUser?.id) {
          alert("You cannot delete your own account.");
          return;
      }
      if (window.confirm('Are you sure you want to delete this user?')) {
          deleteUser(userId);
      }
  };

  const availableRoles = Object.values(UserRole).filter(role => role !== UserRole.ADMIN);

  return (
    <div>
      <h1 className="text-4xl font-bold mb-6">User Management</h1>
      <Card>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">All Users ({users.length})</h2>
          <Tooltip text="Add a new user to the platform.">
            <button
              onClick={openAddModal}
              className="bg-primary text-white font-bold py-2 px-4 rounded-md hover:bg-indigo-700 transition-colors"
            >
              Add New User
            </button>
          </Tooltip>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-neutral-600">
            <thead className="bg-gray-50 dark:bg-neutral-800">
              <tr>
                <th scope="col" onClick={() => requestSort('name')} className="cursor-pointer px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th scope="col" onClick={() => requestSort('email')} className="cursor-pointer px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                <th scope="col" onClick={() => requestSort('role')} className="cursor-pointer px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-neutral-700 divide-y divide-gray-200 dark:divide-neutral-600">
              {sortedUsers.map((user) => (
                <tr key={user.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        {user.avatar ? 
                          <img className="h-10 w-10 rounded-full object-cover" src={user.avatar} alt={user.name} /> :
                          <div className="h-10 w-10 rounded-full bg-gray-200 dark:bg-neutral-600 flex items-center justify-center">
                            <span className="font-medium text-gray-600 dark:text-gray-300">{user.name.charAt(0).toUpperCase()}</span>
                          </div>
                        }
                      </div>
                      <div className="ml-4"><div className="text-sm font-medium text-gray-900 dark:text-white">{user.name}</div></div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap"><div className="text-sm text-gray-500 dark:text-gray-300">{user.email}</div></td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Tooltip text={ROLE_DESCRIPTIONS[user.role]}>
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getRoleBadgeClass(user.role)}`}>{user.role}</span>
                    </Tooltip>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                    <Tooltip text="Edit user details">
                      <button onClick={() => openEditModal(user)} className="text-indigo-600 hover:text-indigo-900 font-medium disabled:text-gray-400 disabled:cursor-not-allowed">Edit</button>
                    </Tooltip>
                    <Tooltip text="Delete this user">
                      <button onClick={() => handleDelete(user.id)} className="text-red-600 hover:text-red-900 font-medium disabled:text-gray-400 disabled:cursor-not-allowed" disabled={user.id === currentUser?.id}>Delete</button>
                    </Tooltip>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
      
      <Modal isOpen={isModalOpen} onClose={closeModal} title={editingUser ? 'Edit User' : 'Add New User'}>
        <form onSubmit={handleFormSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">Full Name</label>
            <input type="text" id="name" name="name" value={formData.name} onChange={handleFormChange} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"/>
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email Address</label>
            <input type="email" id="email" name="email" value={formData.email} onChange={handleFormChange} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"/>
          </div>
          <div>
            <label htmlFor="role" className="block text-sm font-medium text-gray-700">Role</label>
            <select
              id="role"
              name="role"
              value={formData.role}
              onChange={handleFormChange}
              required
              disabled={editingUser?.id === currentUser?.id}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary disabled:bg-gray-200 disabled:cursor-not-allowed"
            >
              {editingUser?.role === UserRole.ADMIN ? (
                 <option value={UserRole.ADMIN}>Admin</option>
              ) : (
                availableRoles.map(role => (
                    <option key={role} value={role}>{role.charAt(0).toUpperCase() + role.slice(1)}</option>
                ))
              )}
            </select>
            {editingUser?.id === currentUser?.id && <p className="text-xs text-gray-500 mt-1">Admins cannot change their own role.</p>}
          </div>
          <div className="mt-6 flex justify-end space-x-2">
            <button type="button" onClick={closeModal} className="bg-gray-200 text-gray-800 font-bold py-2 px-4 rounded-md hover:bg-gray-300 transition-colors">Cancel</button>
            <button type="submit" className="bg-primary text-white font-bold py-2 px-4 rounded-md hover:bg-indigo-700 transition-colors">{editingUser ? 'Save Changes' : 'Add User'}</button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default UserManagementPage;
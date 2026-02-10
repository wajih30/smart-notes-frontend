import React from 'react';
import { UserRole, UserStatus } from '../../types';
import type { UserAdminView } from '../../types';
import { Button } from '../ui/Button';
import { Modal } from '../ui/Modal';

interface UserTableProps {
  users: UserAdminView[];
  onRoleChange: (userId: string, role: UserRole) => void;
  onStatusChange: (userId: string, status: UserStatus) => void;
}

export const UserTable: React.FC<UserTableProps> = ({
  users,
  onRoleChange,
  onStatusChange,
}) => {
  const [selectedUser, setSelectedUser] = React.useState<UserAdminView | null>(null);
  const [isRoleModalOpen, setIsRoleModalOpen] = React.useState(false);
  const [isStatusModalOpen, setIsStatusModalOpen] = React.useState(false);
  const [newRole, setNewRole] = React.useState<UserRole>(UserRole.USER);
  const [newStatus, setNewStatus] = React.useState<UserStatus>(UserStatus.ACTIVE);

  const handleRoleClick = (user: UserAdminView) => {
    setSelectedUser(user);
    setNewRole(user.role);
    setIsRoleModalOpen(true);
  };

  const handleStatusClick = (user: UserAdminView) => {
    setSelectedUser(user);
    setNewStatus(user.status);
    setIsStatusModalOpen(true);
  };

  const handleRoleSubmit = () => {
    if (selectedUser) {
      onRoleChange(selectedUser.id, newRole);
      setIsRoleModalOpen(false);
    }
  };

  const handleStatusSubmit = () => {
    if (selectedUser) {
      onStatusChange(selectedUser.id, newStatus);
      setIsStatusModalOpen(false);
    }
  };

  return (
    <>
      <div className="card overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="text-left py-3 px-4 font-semibold text-gray-700">Email</th>
              <th className="text-left py-3 px-4 font-semibold text-gray-700">Name</th>
              <th className="text-left py-3 px-4 font-semibold text-gray-700">Role</th>
              <th className="text-left py-3 px-4 font-semibold text-gray-700">Status</th>
              <th className="text-left py-3 px-4 font-semibold text-gray-700">Verified</th>
              <th className="text-left py-3 px-4 font-semibold text-gray-700">Notes</th>
              <th className="text-left py-3 px-4 font-semibold text-gray-700">Created</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id} className="border-b border-gray-100 hover:bg-gray-50">
                <td className="py-3 px-4">{user.email}</td>
                <td className="py-3 px-4">{user.full_name || '-'}</td>
                <td className="py-3 px-4">
                  <button
                    onClick={() => handleRoleClick(user)}
                    className={`px-2 py-1 rounded text-xs font-medium ${
                      user.role === UserRole.ADMIN
                        ? 'bg-purple-100 text-purple-700'
                        : 'bg-gray-100 text-gray-700'
                    } hover:opacity-80`}
                  >
                    {user.role}
                  </button>
                </td>
                <td className="py-3 px-4">
                  <button
                    onClick={() => handleStatusClick(user)}
                    className={`px-2 py-1 rounded text-xs font-medium ${
                      user.status === UserStatus.ACTIVE
                        ? 'bg-green-100 text-green-700'
                        : 'bg-red-100 text-red-700'
                    } hover:opacity-80`}
                  >
                    {user.status}
                  </button>
                </td>
                <td className="py-3 px-4">
                  <span
                    className={`px-2 py-1 rounded text-xs ${
                      user.is_email_verified
                        ? 'bg-green-100 text-green-700'
                        : 'bg-yellow-100 text-yellow-700'
                    }`}
                  >
                    {user.is_email_verified ? 'Yes' : 'No'}
                  </span>
                </td>
                <td className="py-3 px-4">{user.notes_count}</td>
                <td className="py-3 px-4 text-sm text-gray-600">
                  {new Date(user.created_at).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal
        isOpen={isRoleModalOpen}
        onClose={() => setIsRoleModalOpen(false)}
        title="Change User Role"
      >
        <div className="space-y-4">
          <p className="text-sm text-gray-600">
            Change role for: <strong>{selectedUser?.email}</strong>
          </p>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Role</label>
            <select
              value={newRole}
              onChange={(e) => setNewRole(e.target.value as UserRole)}
              className="input-field"
            >
              <option value={UserRole.USER}>User</option>
              <option value={UserRole.ADMIN}>Admin</option>
            </select>
          </div>
          <div className="flex justify-end gap-3">
            <Button variant="secondary" onClick={() => setIsRoleModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleRoleSubmit}>Save</Button>
          </div>
        </div>
      </Modal>

      <Modal
        isOpen={isStatusModalOpen}
        onClose={() => setIsStatusModalOpen(false)}
        title="Change User Status"
      >
        <div className="space-y-4">
          <p className="text-sm text-gray-600">
            Change status for: <strong>{selectedUser?.email}</strong>
          </p>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
            <select
              value={newStatus}
              onChange={(e) => setNewStatus(e.target.value as UserStatus)}
              className="input-field"
            >
              <option value={UserStatus.ACTIVE}>Active</option>
              <option value={UserStatus.INACTIVE}>Inactive</option>
            </select>
          </div>
          <div className="flex justify-end gap-3">
            <Button variant="secondary" onClick={() => setIsStatusModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleStatusSubmit}>Save</Button>
          </div>
        </div>
      </Modal>
    </>
  );
};

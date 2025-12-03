import { useState, useEffect } from 'react';
import { Shield, Crown, User as UserIcon, Check } from 'lucide-react';

interface UserRole {
  username: string;
  role: 'superadmin' | 'admin' | 'user';
  assignedDate: string;
}

interface RoleManagementPageProps {
  currentUser: string;
  currentUserRole: 'superadmin' | 'admin' | 'user';
  onRoleChange: (role: 'superadmin' | 'admin' | 'user') => void;
}

export function RoleManagementPage({ currentUser, currentUserRole, onRoleChange }: RoleManagementPageProps) {
  const [users, setUsers] = useState<UserRole[]>([]);
  const [showMessage, setShowMessage] = useState('');

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = () => {
    const saved = localStorage.getItem('userRoles');
    if (saved) {
      setUsers(JSON.parse(saved));
    } else {
      // Initialize with default admin
      const initialUsers: UserRole[] = [
        {
          username: 'admin',
          role: 'superadmin',
          assignedDate: new Date().toISOString(),
        },
      ];
      localStorage.setItem('userRoles', JSON.stringify(initialUsers));
      setUsers(initialUsers);
    }
  };

  const saveUsers = (users: UserRole[]) => {
    localStorage.setItem('userRoles', JSON.stringify(users));
    setUsers(users);
  };

  const getUserRole = (username: string): 'superadmin' | 'admin' | 'user' => {
    const user = users.find(u => u.username === username);
    return user?.role || 'user';
  };

  const handleRoleChange = (username: string, newRole: 'superadmin' | 'admin' | 'user') => {
    // Only superadmin can change roles
    if (currentUserRole !== 'superadmin') {
      setShowMessage('권한이 없습니다. 최고관리자만 권한을 변경할 수 있습니다.');
      setTimeout(() => setShowMessage(''), 3000);
      return;
    }

    // Can't change own role
    if (username === currentUser) {
      setShowMessage('자신의 권한은 변경할 수 없습니다.');
      setTimeout(() => setShowMessage(''), 3000);
      return;
    }

    const userIndex = users.findIndex(u => u.username === username);
    let updatedUsers;

    if (userIndex >= 0) {
      // Update existing user
      updatedUsers = users.map(u =>
        u.username === username
          ? { ...u, role: newRole, assignedDate: new Date().toISOString() }
          : u
      );
    } else {
      // Add new user
      updatedUsers = [
        ...users,
        {
          username,
          role: newRole,
          assignedDate: new Date().toISOString(),
        },
      ];
    }

    saveUsers(updatedUsers);
    setShowMessage(`${username}의 권한이 변경되었습니다.`);
    setTimeout(() => setShowMessage(''), 3000);

    // If current user's role changed, update it
    if (username === currentUser) {
      onRoleChange(newRole);
    }
  };

  const addNewUser = () => {
    const username = prompt('사용자 이름을 입력하세요:');
    if (!username) return;

    if (users.some(u => u.username === username)) {
      alert('이미 등록된 사용자입니다.');
      return;
    }

    const newUser: UserRole = {
      username,
      role: 'user',
      assignedDate: new Date().toISOString(),
    };

    saveUsers([...users, newUser]);
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'superadmin':
        return <Crown className="text-red-600" size={20} />;
      case 'admin':
        return <Shield className="text-blue-600" size={20} />;
      default:
        return <UserIcon className="text-gray-600" size={20} />;
    }
  };

  const getRoleName = (role: string) => {
    switch (role) {
      case 'superadmin':
        return '최고관리자';
      case 'admin':
        return '관리자';
      default:
        return '일반 사용자';
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'superadmin':
        return 'bg-red-100 dark:bg-red-900/30 text-red-600 border-red-200 dark:border-red-800';
      case 'admin':
        return 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 border-blue-200 dark:border-blue-800';
      default:
        return 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 border-gray-200 dark:border-gray-600';
    }
  };

  const canManageRoles = currentUserRole === 'superadmin';

  return (
    <div className="p-4 pb-24">
      {/* Message Toast */}
      {showMessage && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 bg-green-600 text-white px-6 py-3 rounded-xl shadow-lg z-50 animate-slideDown">
          {showMessage}
        </div>
      )}

      {/* Header */}
      <div className="bg-gradient-to-br from-purple-400 to-purple-600 rounded-2xl p-6 text-white mb-6">
        <div className="flex items-center gap-3 mb-2">
          <Shield size={32} />
          <h2>권한 관리</h2>
        </div>
        <p className="text-sm opacity-90">사용자 권한을 관리합니다</p>
      </div>

      {/* Current User Info */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 border border-gray-200 dark:border-gray-700 mb-6">
        <h3 className="dark:text-white mb-4">내 권한</h3>
        <div className="flex items-center gap-3">
          {getRoleIcon(currentUserRole)}
          <div className="flex-1">
            <p className="dark:text-white">{currentUser}</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">{getRoleName(currentUserRole)}</p>
          </div>
          <span className={`px-3 py-1 rounded-full text-sm border ${getRoleColor(currentUserRole)}`}>
            {getRoleName(currentUserRole)}
          </span>
        </div>
      </div>

      {/* Role Descriptions */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 border border-gray-200 dark:border-gray-700 mb-6">
        <h3 className="dark:text-white mb-4">권한 안내</h3>
        <div className="space-y-3">
          <div className="flex items-start gap-3 p-3 bg-red-50 dark:bg-red-900/10 rounded-xl">
            <Crown className="text-red-600 flex-shrink-0 mt-0.5" size={20} />
            <div>
              <p className="text-sm dark:text-white mb-1">최고관리자</p>
              <p className="text-xs text-gray-600 dark:text-gray-400">
                모든 권한 보유, 사용자 권한 관리 가능, 공지사항 작성 가능
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3 p-3 bg-blue-50 dark:bg-blue-900/10 rounded-xl">
            <Shield className="text-blue-600 flex-shrink-0 mt-0.5" size={20} />
            <div>
              <p className="text-sm dark:text-white mb-1">관리자</p>
              <p className="text-xs text-gray-600 dark:text-gray-400">
                공지사항 작성 가능, 커뮤니티 관리 권한
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-xl">
            <UserIcon className="text-gray-600 flex-shrink-0 mt-0.5" size={20} />
            <div>
              <p className="text-sm dark:text-white mb-1">일반 사용자</p>
              <p className="text-xs text-gray-600 dark:text-gray-400">
                기본 기능 이용 가능
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* User List */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="p-5 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
          <h3 className="dark:text-white">사용자 목록</h3>
          {canManageRoles && (
            <button
              onClick={addNewUser}
              className="px-3 py-1.5 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 transition-colors"
            >
              + 사용자 추가
            </button>
          )}
        </div>

        <div className="divide-y divide-gray-200 dark:divide-gray-700">
          {users.map((user) => (
            <div key={user.username} className="p-5">
              <div className="flex items-center gap-3 mb-3">
                {getRoleIcon(user.role)}
                <div className="flex-1">
                  <p className="dark:text-white">{user.username}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    권한 부여일: {new Date(user.assignedDate).toLocaleDateString('ko-KR')}
                  </p>
                </div>
              </div>

              {canManageRoles && user.username !== currentUser ? (
                <div className="flex gap-2">
                  <button
                    onClick={() => handleRoleChange(user.username, 'superadmin')}
                    className={`flex-1 py-2 px-3 rounded-lg text-sm transition-all border ${
                      user.role === 'superadmin'
                        ? 'bg-red-100 dark:bg-red-900/30 border-red-600 text-red-600'
                        : 'border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-400 hover:border-red-400'
                    }`}
                  >
                    {user.role === 'superadmin' && <Check size={14} className="inline mr-1" />}
                    최고관리자
                  </button>
                  <button
                    onClick={() => handleRoleChange(user.username, 'admin')}
                    className={`flex-1 py-2 px-3 rounded-lg text-sm transition-all border ${
                      user.role === 'admin'
                        ? 'bg-blue-100 dark:bg-blue-900/30 border-blue-600 text-blue-600'
                        : 'border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-400 hover:border-blue-400'
                    }`}
                  >
                    {user.role === 'admin' && <Check size={14} className="inline mr-1" />}
                    관리자
                  </button>
                  <button
                    onClick={() => handleRoleChange(user.username, 'user')}
                    className={`flex-1 py-2 px-3 rounded-lg text-sm transition-all border ${
                      user.role === 'user'
                        ? 'bg-gray-100 dark:bg-gray-700 border-gray-600 text-gray-600 dark:text-gray-400'
                        : 'border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-400 hover:border-gray-400'
                    }`}
                  >
                    {user.role === 'user' && <Check size={14} className="inline mr-1" />}
                    일반
                  </button>
                </div>
              ) : (
                <div className={`py-2 px-3 rounded-lg text-sm text-center border ${getRoleColor(user.role)}`}>
                  {getRoleName(user.role)}
                  {user.username === currentUser && ' (본인)'}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {!canManageRoles && (
        <div className="mt-6 p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-xl">
          <p className="text-sm text-yellow-800 dark:text-yellow-400">
            ℹ️ 권한 변경은 최고관리자만 가능합니다.
          </p>
        </div>
      )}
    </div>
  );
}

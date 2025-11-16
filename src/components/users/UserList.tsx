"use client";

import React, { use, useEffect, useRef, useState } from "react";
import { toast } from 'sonner';
import Sidebar from "../utility/Sidebar";
import { useRouter } from "next/navigation";
import { useUsers } from "@/hooks/useUsers";
import { useUserAuth } from "@/hooks/useUserAuth";
import { useBankAccounts } from "@/hooks/useBankAccount";
import { User } from "@/types";
import { formatRole, paginateItems } from "@/lib/utils";
import Navbar from "../nav/Navbar";

interface NewAdmin {
  fullName: string;
  email: string;
  phone: string;
  role: string;
  password: string;
  username: string;
  avatarUrl: string;
  isActive: boolean;
  permissions: string[];
}

interface AssignedAccount {
  id: string; // Assignment ID
  accountId?: string; // Bank account ID (may not be in response)
  accountName: string;
  accountNumber: string;
  accountType: string;
  clientId: string;
}

const UserList = () => {
  const router = useRouter();
  const { getUsers, getUserById, updateUser, deleteUser, createUser, deactivateUser, activateUser, checkEmailAvailability, checkUsernameAvailability } = useUsers()
  const { getStaffAssignmentsByStaff, unassignStaffFromAccount } = useBankAccounts();
  const { user } = useUserAuth()
  const [role, setRole] = useState('all');
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false)
  const [page, setPage] = useState(0);
  const [assignedAccounts, setAssignedAccounts] = useState<AssignedAccount[]>([]);
  const [loadingAccounts, setLoadingAccounts] = useState(false);
  const [showAssignedAccounts, setShowAssignedAccounts] = useState(true);

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string>("");
  const [emailAvailable, setEmailAvailable] = useState<null | boolean>(null);
  const [usernameAvailable, setUsernameAvailable] = useState<null | boolean>(null);
  const [checkingEmail, setCheckingEmail] = useState(false);
  const [checkingUsername, setCheckingUsername] = useState(false);
  const [newAdmin, setNewAdmin] = useState<NewAdmin>({
    fullName: "",
    email: "",
    phone: "",
    password: "",
    role: "admin",
    username: "",
    avatarUrl: 'https://gravatar.com/avatar/48c3863a0f03a81d67916d28fdaa0ea6?s=400&d=mp&r=pg',
    isActive: true,
    permissions: ["VIEW_CLIENTS", "EDIT_TRANSACTIONS"],
  });

  // Deactivation flow states
  const [showDeactivateConfirm, setShowDeactivateConfirm] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showActivateConfirm, setShowActivateConfirm] = useState(false);
  const [showDeactivateForm, setShowDeactivateForm] = useState(false);
  const [deactivationReason, setDeactivationReason] = useState({
    reason: "",
  });
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const actionButtonRefs = useRef<{ [key: string]: HTMLButtonElement | null }>(
    {}
  );
  // Action menu state
  const [isActionMenuOpen, setIsActionMenuOpen] = useState(false);
  const [selectedUserForAction, setSelectedUserForAction] = useState<User | null>(null);
  const actionMenuRef = useRef<HTMLDivElement>(null);
  const actionButtonRef = useRef<HTMLButtonElement>(null);

  // View User Modal State
  const [showViewModal, setShowViewModal] = useState(false);
  const [viewedUser, setViewedUser] = useState<User | null>(null);

  // Edit User Modal State
  const [showEditModal, setShowEditModal] = useState(false);
  const [editedUser, setEditedUser] = useState<User | null>(null);
  const [editFormData, setEditFormData] = useState<{
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    role: string;
  }>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    role: "",
  });

  const fetchUsers = async () => {
    setLoading(true)
    try {
      if (role === 'all') {
        const allUsers = await getUsers();
        setUsers(allUsers || [])
        return;
      }

      if (role === 'staff') {
        // Backend may have multiple staff roles; fetch all and filter client-side
        const allUsers = await getUsers();
        const staffRoleAliases = [
          'staff', 'staff1', 'staff_1', 'staff2', 'staff_2',
          'finance', 'finance_user', 'finance_staff',
          'auditor', 'auditor_staff'
        ];
        const filtered = (allUsers || []).filter((u: any) => {
          const r = (u?.role || '').toString().toLowerCase();
          return staffRoleAliases.some(alias => r === alias || r.includes(alias));
        });
        setUsers(filtered)
        return;
      }

      const filteredByRole = await getUsers(role.toUpperCase())
      setUsers(filteredByRole || [])
    } finally {
    setLoading(false)
    }
  }
  useEffect(() => {
    fetchUsers()
  }, [role])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (actionMenuRef.current && !actionMenuRef.current.contains(event.target as Node) &&
        actionButtonRef.current && !actionButtonRef.current.contains(event.target as Node)) {
        setIsActionMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  const getPopupPosition = () => {
    if (!selectedUserForAction?.id || !actionButtonRefs.current[selectedUserForAction.id]) {
      return { top: 0, left: 0 };
    }

    const button = actionButtonRefs.current[selectedUserForAction.id];
    if (!button) return { top: 0, left: 0 };

    const rect = button.getBoundingClientRect();
    const viewportWidth = window.innerWidth;
    
    // Calculate left position to prevent going off-screen
    let left = rect.left + window.scrollX;
    
    // If the menu would go off the right side of the screen
    if (left + 192 > viewportWidth) { // 192px is the width of the menu (48rem)
      left = viewportWidth - 200; // Give some padding
    }
    // If the menu would go off the left side of the screen
    else if (left < 0) {
      left = 8; // Give some padding
    }

    return {
      top: rect.bottom + window.scrollY,
      left: left,
    };
  };
  const handleRoleChange = (userId: string, newRole: string) => {
    setLoading(true)
    updateUser(userId, { role: newRole.toUpperCase() }).then(() => {
      setUsers(users.map(user =>
        user.id === userId ? { ...user, role: newRole } : user
      ));
      setLoading(false)
    }).catch(() => {
      setLoading(false)
    })
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type, checked } = e.target as HTMLInputElement;
    setNewAdmin({ ...newAdmin, [name]: type === 'checkbox' ? checked : value });
  };
  useEffect(() => {
    if (!showCreateModal) return;
    const value = newAdmin.email.trim();
    if (!value) { setEmailAvailable(null); return; }
    setCheckingEmail(true);
    const t = setTimeout(async () => {
      const ok = await checkEmailAvailability(value);
      setEmailAvailable(ok);
      setCheckingEmail(false);
    }, 400);
    return () => clearTimeout(t);
  }, [newAdmin.email, showCreateModal]);

  useEffect(() => {
    if (!showCreateModal) return;
    const value = newAdmin.username.trim();
    if (!value) { setUsernameAvailable(null); return; }
    setCheckingUsername(true);
    const t = setTimeout(async () => {
      const ok = await checkUsernameAvailability(value);
      setUsernameAvailable(ok);
      setCheckingUsername(false);
    }, 400);
    return () => clearTimeout(t);
  }, [newAdmin.username, showCreateModal]);

  const togglePermission = (perm: string) => {
    setNewAdmin((prev) => {
      const exists = prev.permissions.includes(perm);
      return {
        ...prev,
        permissions: exists ? prev.permissions.filter(p => p !== perm) : [...prev.permissions, perm]
      }
    })
  }

  const handleDeactivationInputChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setDeactivationReason({ ...deactivationReason, [name]: value });
  };
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        actionMenuRef.current &&
        !actionMenuRef.current.contains(event.target as Node)
      ) {
        closeActionMenu();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const openActionMenu = (user: User, event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    setSelectedUserForAction(user);
    setIsActionMenuOpen(true);
  };

  const closeActionMenu = () => {
    setIsActionMenuOpen(false);
    setSelectedUserForAction(null);
  };

  const handleDeactivateUser = (userId: string) => {
    setSelectedUserId(userId);
    setShowDeactivateConfirm(true);
    closeActionMenu();
  };

  const handleActivateUser = (userId: string) => {
    setSelectedUserId(userId);
    setShowActivateConfirm(true);
    closeActionMenu();
  };

  const handleDeleteUser = (userId: string) => {
    setShowDeleteConfirm(false); // Close confirmation modal first
    setLoading(true)
    deleteUser(userId).then((resp: any) => {
      setUsers(users.filter(user => user.id !== userId));
      setSuccessMessage(resp?.message || 'User has been successfully deleted');
      setShowSuccessModal(true);
      closeActionMenu();
    }).finally(() => {
      setLoading(false)
    })
  };

  const openViewModal = async (user: User) => {
    setLoading(true)
    setLoadingAccounts(true)
    try {
      const fresh = await getUserById(user.id)
      setViewedUser(fresh || user)
      setShowViewModal(true)
      
      // Fetch assigned accounts for this staff member
      try {
        const accounts = await getStaffAssignmentsByStaff(user.id);
        if (accounts && Array.isArray(accounts)) {
          setAssignedAccounts(accounts);
        } else {
          setAssignedAccounts([]);
        }
      } catch (error) {
        console.error('Failed to load assigned accounts:', error);
        setAssignedAccounts([]);
      }
    } finally {
      setLoading(false)
      setLoadingAccounts(false)
    closeActionMenu();
    }
  };

  const closeViewModal = () => {
    setShowViewModal(false);
    setViewedUser(null);
    setAssignedAccounts([]);
  };

  const handleUnassignAccount = async (assignmentId: string, accountId?: string) => {
    // If accountId is not provided, use assignmentId as fallback
    // The backend might accept the assignment ID in the body
    const accountIdToUse = accountId || assignmentId;
    
    setLoadingAccounts(true);
    try {
      const result = await unassignStaffFromAccount(assignmentId, accountIdToUse);
      if (result) {
        // Remove from assigned accounts list
        setAssignedAccounts(assignedAccounts.filter(acc => acc.id !== assignmentId));
        // Refresh the list to get updated data
        if (viewedUser) {
          const accounts = await getStaffAssignmentsByStaff(viewedUser.id);
          if (accounts && Array.isArray(accounts)) {
            setAssignedAccounts(accounts);
          }
        }
      }
    } catch (error) {
      console.error('Failed to unassign account:', error);
    } finally {
      setLoadingAccounts(false);
    }
  };

  const openEditModal = (user: User) => {
    setEditedUser(user);
    setEditFormData({
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      phone: user.phone || "",
      role: user.role,
    });
    setShowEditModal(true);
    closeActionMenu();
  };

  const closeEditModal = () => {
    setShowEditModal(false);
    setEditedUser(null);
  };

  const handleEditFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setEditFormData({ ...editFormData, [name]: value });
  };

  const handleSaveEdit = async () => {
    if (!editedUser) return;
    setLoading(true);
    try {
      const payload: any = {
        firstName: editFormData.firstName,
        lastName: editFormData.lastName,
        email: editFormData.email,
      };
      if (editFormData.role && editFormData.role.trim()) {
        payload.role = editFormData.role.toUpperCase();
      }
      if (typeof editFormData.phone === 'string') {
        payload.phone = editFormData.phone;
      }
      const res = await updateUser(editedUser.id, payload);
      if (res) {
        setUsers(users.map(u => u.id === editedUser.id ? { ...u, ...editFormData, role: payload.role || u.role } : u));
        setSuccessMessage(res?.message || 'User has been successfully updated');
        setShowSuccessModal(true);
        closeEditModal();
      }
    } catch (error: any) {
      // Error message already toasted in hook; no success modal on failure
    } finally {
      setLoading(false);
    }
  };

  const handleCreateUser = () => {
    // Basic validation
    const trimmedFullName = newAdmin.fullName.trim();
    if (!trimmedFullName) {
      toast.error('Full name is required');
      return;
    }
    const [firstName = '', lastName = ''] = trimmedFullName.split(/\s+/, 2);
    if (!firstName || !lastName) {
      toast.error('Please provide both first and last names');
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(newAdmin.email)) {
      toast.error('Please enter a valid email address');
      return;
    }
    if (emailAvailable === false) {
      toast.error('Email is already in use');
      return;
    }
    if (!newAdmin.password || newAdmin.password.length < 8) {
      toast.error('Password must be at least 8 characters');
      return;
    }
    if (!newAdmin.username.trim()) {
      toast.error('Username is required');
      return;
    }
    if (usernameAvailable === false) {
      toast.error('Username is already taken');
      return;
    }

    setShowCreateModal(false);
    setLoading(true);

    createUser({
      firstName,
      lastName,
      email: newAdmin.email,
      role: newAdmin.role.toUpperCase(),
      phone: newAdmin.phone || undefined,
      password: newAdmin.password,
      username: newAdmin.username,
      // Username will be generated in the hook if not provided
      isActive: newAdmin.isActive,
      permissions: newAdmin.permissions,
      avatarUrl: newAdmin.avatarUrl,
    })
      .then((res) => {
      if (res) {
          // Append newly created user to list
        setUsers([...users, res]);
          setSuccessMessage('User has been successfully created');
        setShowSuccessModal(true);
        setNewAdmin({
          fullName: "",
          email: "",
          phone: "",
          password: "",
          role: "admin",
            username: "",
            avatarUrl: 'https://gravatar.com/avatar/48c3863a0f03a81d67916d28fdaa0ea6?s=400&d=mp&r=pg',
            isActive: true,
            permissions: ["VIEW_CLIENTS", "EDIT_TRANSACTIONS"],
        });
      } else {
        setShowSuccessModal(false);
      }
    })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleConfirmDeactivate = () => {
    setShowDeactivateConfirm(false);
    setShowDeactivateForm(true);
  };

  const handleConfirmActivate = () => {
    if (selectedUserId) {
      activateUser(selectedUserId).then((resp: any) => {
        setUsers(users.map(user =>
          user.id === selectedUserId ? { ...user, isActive: true } : user
        ));
        if (selectedUserForAction?.id === selectedUserId) {
          setSelectedUserForAction({ ...(selectedUserForAction as User), isActive: true });
        }
        setShowActivateConfirm(false);
        setSuccessMessage(resp?.message || 'User has been successfully activated');
        setShowSuccessModal(true);
      }).catch(() => {
        // setShowDeactivateForm(false);
      })
    }
  }

  const handleSubmitDeactivation = () => {
    if (selectedUserId) {
      deactivateUser(selectedUserId, deactivationReason.reason).then((resp: any) => {
        setUsers(users.map(user =>
          user.id === selectedUserId ? { ...user, isActive: false } : user
        ));
        if (selectedUserForAction?.id === selectedUserId) {
          setSelectedUserForAction({ ...(selectedUserForAction as User), isActive: false });
        }
        setShowDeactivateForm(false);
        setSuccessMessage(resp?.message || 'User has been successfully deactivated');
        setShowSuccessModal(true);
        setDeactivationReason({

          reason: "",
        });
      }).catch(() => {
        // setShowDeactivateForm(false);
      })
    }

  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
        <div className="flex-1 md:ml-64 md:mt-0">
                    <div className = "mb-4"><Navbar /></div>
                    
      {loading && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-[#2E2D2D] to-[#2E2D2D]/90">
          <img src="/loader.gif" alt="Loading..." className="h-20 w-20" />
        </div>
      )}
     <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-auto pt-32 md:pt-32">
    
        <div className="mb-6">
          <h2 className="text-[#363636] text-lg md:text-xl font-semibold">
            {formatRole(user?.role)}
          </h2>
        </div>

        <div className="bg-white rounded-lg w-full shadow overflow-hidden">
          <div className="p-4 border-b border-gray-200 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div className="flex flex-col sm:flex-row w-full md:w-auto gap-2 sm:gap-4">
              <div className="relative w-full sm:w-auto">
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="block appearance-none bg-white border border-gray-300 text-gray-700 py-2 px-4 pr-8 rounded leading-tight focus:outline-none focus:border-blue-500 text-sm w-full">
                  <option value={'all'}>All</option>
                  <option value={'admin'}>Admin</option>
                  <option value={'super_admin'}>Super Admin</option>
                  <option value={'staff'}>Staff</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                  <svg
                    className="fill-current h-4 w-4"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                  </svg>
                </div>
              </div>
              <div className="relative w-full sm:w-auto">
                <input
                  type="text"
                  placeholder="Search"
                  className="bg-white border border-gray-300 text-gray-700 py-2 px-4 pr-8 rounded leading-tight focus:outline-none focus:border-[#F36F2E] text-sm w-full"
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <svg
                    className="h-4 w-4 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    ></path>
                  </svg>
                </div>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row w-full md:w-auto gap-2 sm:gap-4">
              <button
                onClick={() => setShowCreateModal(true)}
                className="bg-[#F36F2E] hover:bg-[#F36F2E] text-white py-2 px-4 rounded text-sm w-full sm:w-auto"
              >
                Create User
              </button>
              <button
                onClick={() => router.push("/RoleList")}
                className="bg-[#fff] hover:bg-gray-300 text-[#F36F2E] border-[#F36F2E] border-2 py-2 px-4 rounded text-sm w-full sm:w-auto"
              >
                View Roles
              </button>
            </div>
          </div>

          <div className="overflow-x-auto min-h-[100px]">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-3 py-2 md:px-6 md:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    S/N
                  </th>
                  <th className="px-3 py-2 md:px-6 md:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Photo
                  </th>
                  <th className="px-3 py-2 md:px-6 md:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Full name
                  </th>
                  <th className="px-3 py-2 md:px-6 md:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden sm:table-cell">
                    Email
                  </th>
                  <th className="px-3 py-2 md:px-6 md:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">
                    Phone
                  </th>
                  <th className="px-3 py-2 md:px-6 md:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Role
                  </th>
                  <th className="px-3 py-2 md:px-6 md:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-3 py-2 md:px-6 md:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden lg:table-cell">
                    Date Added
                  </th>
                  <th className="px-3 py-2 md:px-6 md:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200 z-1000">
                {paginateItems(users, page, 10).map((user, index) => (
                  <tr key={user.id}>
                    <td className="px-3 py-2 md:px-6 md:py-4 whitespace-nowrap text-xs md:text-sm text-gray-500">
                      {index + 1}
                    </td>
                    <td className="px-3 py-2 md:px-6 md:py-4 whitespace-nowrap text-xs md:text-sm text-gray-500">
                      <img
                        src={user.avatarUrl}
                        width={30}
                        height={30}
                        alt={`${user.firstName} ${user.lastName}`}
                      />
                    </td>
                    <td className="px-3 py-2 md:px-6 md:py-4 whitespace-nowrap text-xs md:text-sm text-gray-500">
                      {user.firstName} {user.lastName}
                    </td>
                    <td className="px-3 py-2 md:px-6 md:py-4 whitespace-nowrap text-xs md:text-sm text-gray-500 truncate max-w-[120px] hidden sm:table-cell">
                      {user.email}
                    </td>
                    <td className="px-3 py-2 md:px-6 md:py-4 whitespace-nowrap text-xs md:text-sm text-gray-500 hidden md:table-cell">
                      {user.phone || 'N/A'}
                    </td>
                    <td className="px-3 py-2 md:px-6 md:py-4 whitespace-nowrap text-xs md:text-sm text-gray-700">
                      <span className="px-2 py-1 bg-gray-100 rounded text-gray-800">
                        {formatRole(user.role)}
                      </span>
                    </td>
                    <td className="px-3 py-2 md:px-6 md:py-4 whitespace-nowrap text-xs md:text-sm text-gray-500">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full
                                      ${user.isActive
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                          }`}
                      >
                        {user.isActive ? 'Active' : 'In Active'}
                      </span>
                    </td>
                    <td className="px-3 py-2 md:px-6 md:py-4 whitespace-nowrap text-xs md:text-sm text-gray-500 hidden lg:table-cell">
                      {new Date(user.createdAt).toLocaleString()}
                    </td>
                    <td className="px-3 py-2 md:px-6 md:py-4 whitespace-nowrap text-xs md:text-sm text-gray-500 relative">
                     <button
                           ref={(el: HTMLButtonElement | null) => {
    if (el) {
      actionButtonRefs.current[user.id] = el;
    } else {
      delete actionButtonRefs.current[user.id];
    }
  }}
                          className="focus:outline-none"
                          onClick={(e) => openActionMenu(user, e)}
                        >
                          <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z" />
                          </svg>
                        </button>

                      {/* Action Popup */}
                       {isActionMenuOpen && selectedUserForAction && (
        <div
          ref={actionMenuRef}
          className="fixed z-50 mt-1 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5"
          style={{
            top: `${getPopupPosition().top}px`,
            left: `${getPopupPosition().left}px`,
          }}
        >
          <div className="py-1">
            <button
              onClick={(e) => { e.stopPropagation(); openViewModal(selectedUserForAction) }}
              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
            >
                              View
                            </button>
                            <button
                              onClick={(e) => { e.stopPropagation(); if (selectedUserForAction) openEditModal(selectedUserForAction) }}
                              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left focus:outline-none"
                            >
                              Edit
                            </button>
                            <button
              onClick={(e) => {
                e.stopPropagation();
                if (!selectedUserForAction) return;
                const current = users.find(u => u.id === selectedUserForAction.id);
                const isActiveNow = current ? current.isActive : selectedUserForAction.isActive;
                isActiveNow ? handleDeactivateUser(selectedUserForAction.id) : handleActivateUser(selectedUserForAction.id)
              }}
                              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left focus:outline-none"
                            >
                              {(users.find(u => u.id === selectedUserForAction?.id)?.isActive ?? selectedUserForAction?.isActive) ? 'Deactivate' : 'Activate'}
                            </button>
                            <button
              onClick={(e) => { 
                e.stopPropagation();
                if (!selectedUserForAction) return;
                setSelectedUserId(selectedUserForAction.id);
                                setShowDeleteConfirm(true);
                                closeActionMenu();
                              }}
                              className="block px-4 py-2 text-sm text-red-600 hover:bg-gray-100 w-full text-left focus:outline-none"
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination Section */}
          <div className="px-4 py-3 bg-white border-t border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-sm text-gray-700">
              Showing <span className="font-medium">1</span> to{" "}
              <span className="font-medium">{users.length >= 10 ? 10 : users.length}</span> of{" "}
              <span className="font-medium">{users.length}</span> entries
            </div>
            <div className="flex space-x-2">
              <button
                className="px-3 py-1 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={page === 0}
                onClick={() => setPage((prev) => Math.max(prev - 1, 0))}
              >
                Previous
              </button>
              <button
                className="px-3 py-1 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={page === Math.ceil(users.length / 10) - 1}
                onClick={() => setPage((prev) => Math.min(prev + 1, Math.ceil(users.length / 10) - 1))}
              //  className="px-3 py-1 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
              >
                Next
              </button>
            </div>
          </div>

          {/* Create User Modal */}
          {showCreateModal && (
            <div className="fixed inset-0 bg-[rgba(0,0,0,0.5)] flex items-center justify-center z-50 p-4 overflow-y-auto">
              <div className="bg-white rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-center mb-4 sticky top-0 bg-white py-2">
                  <h3 className="text-lg text-black font-semibold">Create New User</h3>
                  <button
                    onClick={() => setShowCreateModal(false)}
                    className="text-black hover:text-gray-700"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                <div className="space-y-4 pb-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                    <input
                      type="text"
                      name="fullName"
                      value={newAdmin.fullName}
                      onChange={handleInputChange}
                      placeholder="Enter Admin Full name"
                      className="w-full px-3 py-2 border text-black border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#F36F2E]"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
                    <input
                      type="text"
                      name="username"
                      value={newAdmin.username}
                      onChange={handleInputChange}
                      placeholder="e.g. STAFF0001"
                      className="w-full text-black px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#F36F2E]"
                    />
                    {checkingUsername && <p className="text-xs text-gray-500 mt-1">Checking username...</p>}
                    {usernameAvailable === false && <p className="text-xs text-red-600 mt-1">Username is already taken</p>}
                    {usernameAvailable === true && <p className="text-xs text-green-600 mt-1">Username is available</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <input
                      type="email"
                      name="email"
                      value={newAdmin.email}
                      onChange={handleInputChange}
                      placeholder="Enter Admin Email"
                      className="w-full text-black px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#F36F2E]"
                    />
                    {checkingEmail && <p className="text-xs text-gray-500 mt-1">Checking email...</p>}
                    {emailAvailable === false && <p className="text-xs text-red-600 mt-1">Email is already in use</p>}
                    {emailAvailable === true && <p className="text-xs text-green-600 mt-1">Email is available</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                    <input
                      type="tel"
                      name="phone"
                      value={newAdmin.phone}
                      onChange={handleInputChange}
                      placeholder="Enter Admin Phone Number"
                      className="w-full px-3 text-black py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#F36F2E]"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Avatar URL</label>
                    <input
                      type="text"
                      name="avatarUrl"
                      value={newAdmin.avatarUrl}
                      onChange={handleInputChange}
                      placeholder="https://..."
                      className="w-full px-3 text-black py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#F36F2E]"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                    <input
                      type="password"
                      name="password"
                      value={newAdmin.password}
                      onChange={handleInputChange}
                      placeholder="Enter Password"
                      className="w-full px-3 text-black py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#F36F2E]"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                    <select
                      name="role"
                      value={newAdmin.role}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 text-black border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#F36F2E]"
                    >
                      <option value="staff">Staff</option>
                      <option value="admin">Admin</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Active</label>
                    <label className="inline-flex items-center gap-2 text-gray-700">
                      <input
                        type="checkbox"
                        name="isActive"
                        checked={newAdmin.isActive}
                        onChange={handleInputChange}
                        className="h-4 w-4"
                      />
                      <span>Is Active</span>
                    </label>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Permissions</label>
                    <div className="flex flex-wrap gap-2">
                      {[
                        "VIEW_CLIENTS",
                        "EDIT_TRANSACTIONS",
                      ].map((perm) => (
                        <button
                          key={perm}
                          type="button"
                          onClick={() => togglePermission(perm)}
                          className={`px-3 py-1 rounded-full border text-sm ${
                            newAdmin.permissions.includes(perm)
                              ? "bg-[#F36F2E] text-white border-[#F36F2E]"
                              : "bg-white text-gray-700 border-gray-300"
                          }`}
                        >
                          {perm}
                        </button>
                      ))}
                    </div>
                  </div>

                  <button
                    onClick={handleCreateUser}
                    disabled={checkingEmail || checkingUsername || emailAvailable === false || usernameAvailable === false}
                    className="w-full bg-[#F36F2E] text-white py-2 px-4 rounded-md hover:bg-[#E05C2B] transition-colors sticky bottom-0 disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    Create User
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Activate Confirmation Modal */}
          {showActivateConfirm && (
            <div className="fixed inset-0 bg-[rgba(0,0,0,0.5)] flex items-center justify-center z-50 p-4 overflow-y-auto">
              <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
                <div className="mb-4">
                  <h3 className="text-lg font-semibold text-gray-700">Confirm Activation</h3>
                  <p className="text-gray-600 mt-2">
                    Are you sure you want to activate this user?
                  </p>
                </div>

                <div className="flex justify-end space-x-4 mt-6">
                  <button
                    onClick={() => setShowActivateConfirm(false)}
                    className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleConfirmActivate}
                    className="px-4 py-2 bg-[#F36F2E] text-white rounded-md text-sm font-medium hover:bg-[#E05C2B]"
                  >
                    Activate
                  </button>
                </div>
              </div>
            </div>
          )}


          {/* Deactivate Confirmation Modal */}
          {showDeactivateConfirm && (
            <div className="fixed inset-0 bg-[rgba(0,0,0,0.5)] flex items-center justify-center z-50 p-4 overflow-y-auto">
              <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
                <div className="mb-4">
                  <h3 className="text-lg font-semibold text-gray-700">Confirm Deactivation</h3>
                  <p className="text-gray-600 mt-2">
                    Are you sure you want to deactivate this user?
                  </p>
                </div>

                <div className="flex justify-end space-x-4 mt-6">
                  <button
                    onClick={() => setShowDeactivateConfirm(false)}
                    className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleConfirmDeactivate}
                    className="px-4 py-2 bg-[#F36F2E] text-white rounded-md text-sm font-medium hover:bg-[#E05C2B]"
                  >
                    Deactivate
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Delete User confirmation Modal */}
          {showDeleteConfirm && (
            <div className="fixed inset-0 bg-[rgba(0,0,0,0.5)] flex items-center justify-center z-50 p-4 overflow-y-auto">
              <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
                <div className="mb-4">
                  <h3 className="text-lg font-semibold text-gray-700">Confirm Deletion</h3>
                  <p className="text-gray-600 mt-2">
                    Are you sure you want to delete this user? This action cannot be undone.
                  </p>
                </div>

                <div className="flex justify-end space-x-4 mt-6">
                  <button
                    onClick={() => setShowDeleteConfirm(false)}
                    className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => handleDeleteUser(selectedUserId!)}
                    className="px-4 py-2 bg-red-600 text-white rounded-md text-sm font-medium hover:bg-red-500"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Deactivation Reason Form */}
          {showDeactivateForm && (
            <div className="fixed inset-0 bg-[rgba(0,0,0,0.5)] flex items-center justify-center z-50 p-4 overflow-y-auto">
              <div className="bg-white rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
                <div className="mb-6 sticky top-0 bg-white py-2">
                  <h3 className="text-lg font-semibold text-gray-700">Deactivation Reason</h3>
                </div>

                <div className="space-y-4 text-gray-700 pb-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Reason for Deactivation</label>
                    <select
                      name="reason"
                      value={deactivationReason.reason}
                      onChange={handleDeactivationInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#F36F2E]"
                    >
                      <option value="">Select a reason</option>
                      <option value="reason1">Reason One</option>
                      <option value="reason2">Another Reason</option>
                      <option value="reason3">A Different Reason</option>
                      {/* Add more reason options here */}
                    </select>
                  </div>

                  <div className="border-t border-gray-200 pt-4 flex justify-end space-x-4 sticky bottom-0 bg-white py-2">
                    <button
                      onClick={() => setShowDeactivateForm(false)}
                      className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSubmitDeactivation}
                      className="px-4 py-2 bg-[#F36F2E] text-white rounded-md text-sm font-medium hover:bg-[#E05C2B]"
                    >
                      Send
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Success Modal */}
          {showSuccessModal && (
            <div className="fixed inset-0 bg-[rgba(0,0,0,0.5)] flex items-center justify-center z-50 p-4 overflow-y-auto">
              <div className="bg-white rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
                <div className="flex justify-end sticky top-0 bg-white py-2">
                  <button
                    onClick={() => setShowSuccessModal(false)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                <div className="mb-4">
                  <h3 className="text-lg font-semibold text-green-600">Successful</h3>
                  <p className="text-gray-600 mt-2">{successMessage || 'Action completed successfully'}</p>
                </div>

                <button
                  onClick={() => setShowSuccessModal(false)}
                  className="bg-[#F36F2E] text-white py-2 px-6 rounded-md hover:bg-[#E05C2B] transition-colors sticky bottom-0"
                >
                  Ok
                </button>
              </div>
            </div>
          )}

          {showViewModal && viewedUser && (
            <div className="fixed inset-0 bg-[rgba(0,0,0,0.5)] flex items-center justify-center z-50 p-4 overflow-y-auto">
              <div className="bg-gray-50 p-6 rounded-md shadow-md w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                <div className="flex items-center justify-between mb-6 sticky top-0 bg-gray-50 py-2">
                  <div className="flex items-center">
                    <div className="relative">
                      <div className="w-16 h-16 rounded-full bg-orange-200 flex items-center justify-center overflow-hidden">
                        <img src={viewedUser.avatarUrl} alt="User Avatar" className="absolute inset-0 w-full h-full object-cover rounded-full" />
                      </div>
                      <button className="absolute bottom-0 right-0 bg-white rounded-full shadow-sm p-1 text-gray-500 hover:text-gray-700">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l-6.585 6.585a2.121 2.121 0 00-1.414.615l-1.93-1.93a2.121 2.121 0 00-.615-1.414l6.585-6.585a2.121 2.121 0 003 0 2.121 2.121 0 000 3zM12 17.768h.008v.008H12v-.008z" />
                        </svg>
                      </button>
                    </div>
                    <div className="ml-4">
                      <h3 className="text-lg font-semibold text-gray-800">{viewedUser.firstName} {viewedUser.lastName}</h3>
                      <p className="text-sm text-gray-500">{viewedUser.email}</p>
                    </div>
                  </div>
                  <button onClick={() => setShowViewModal(false)} className="text-gray-500 hover:text-gray-700 focus:outline-none">
                    <svg className="h-6 w-6 fill-current" viewBox="0 0 20 20"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"></path></svg>
                  </button>
                </div>

                <div className="mb-6 p-4 bg-white rounded-md border border-gray-200">
                  <div className="md:grid md:grid-cols-2 md:items-start md:gap-6 mb-4">
                    <div>
                      <h4 className="text-sm font-semibold text-gray-700">Update Personal Details</h4>
                    </div>
                    <p className="text-xs text-gray-500 md:mt-1">Lorem ipsum dolor sit amet consectetur. Purus odio porttitor dignissim orci non odio porttitor dignissim orci non purus purus. Nunc nisl ut</p>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="firstname" className="block text-xs font-medium text-gray-600 mb-1">Firstname</label>
                      <input type="text" id="firstname" className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm text-gray-700 focus:outline-none focus:border-orange-500" value={viewedUser.firstName} readOnly />
                    </div>
                    <div>
                      <label htmlFor="lastname" className="block text-xs font-medium text-gray-600 mb-1">Lastname</label>
                      <input type="text" id="lastname" className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm text-gray-700 focus:outline-none focus:border-orange-500" value={viewedUser.lastName} readOnly />
                    </div>
                    <div className="col-span-2">
                      <label htmlFor="email" className="block text-xs font-medium text-gray-600 mb-1">Email Address</label>
                      <input type="email" id="email" className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm text-gray-700 focus:outline-none focus:border-orange-500" value={viewedUser.email} readOnly />
                    </div>
                    <div>
                      <label htmlFor="phone" className="block text-xs font-medium text-gray-600 mb-1">Phone Number</label>
                      <div className="flex items-center border border-gray-300 rounded-md">
                        <div className="px-3 py-2 bg-gray-100 text-sm text-gray-700 rounded-l-md">
                          <select className="focus:outline-none">
                            <option>🇳🇬</option>
                            {/* Add more country codes */}
                          </select>
                        </div>
                        <input type="tel" id="phone" className="w-full px-3 py-2 text-sm text-gray-700 focus:outline-none" value={viewedUser.phone} readOnly />
                      </div>
                    </div>

                  </div>
                </div>

                {/* Assigned Accounts Section */}
                <div className="mb-6 p-4 bg-white rounded-md border border-gray-200">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-sm font-semibold text-gray-700">Assigned Accounts</h4>
                    <button
                      onClick={() => setShowAssignedAccounts(!showAssignedAccounts)}
                      className="text-gray-500 hover:text-gray-700"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className={`h-5 w-5 transition-transform ${showAssignedAccounts ? 'rotate-180' : ''}`}
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </button>
                  </div>
                  
                  {showAssignedAccounts && (
                    <div>
                      {loadingAccounts ? (
                        <p className="text-gray-500 text-sm">Loading accounts...</p>
                      ) : assignedAccounts.length > 0 ? (
                        <div className="space-y-3">
                          {assignedAccounts.map((account) => (
                            <div key={account.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-md border border-gray-200">
                              <div className="flex-1">
                                <p className="text-sm font-medium text-gray-800">{account.accountName}</p>
                                <div className="flex items-center gap-4 mt-1">
                                  <p className="text-xs text-gray-600">Account: {account.accountNumber}</p>
                                  <p className="text-xs text-gray-600">Type: {account.accountType}</p>
                                </div>
                              </div>
                              <button
                                onClick={() => handleUnassignAccount(account.id, account.accountId)}
                                disabled={loadingAccounts}
                                className="ml-4 px-3 py-1.5 text-xs font-medium text-red-600 hover:text-red-700 hover:bg-red-50 border border-red-200 rounded-md disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-red-500"
                              >
                                Unassign
                              </button>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-gray-500 text-sm">No accounts assigned to this staff member.</p>
                      )}
                    </div>
                  )}
                </div>

              </div>
            </div>
          )}


          {/* Edit User Modal */}
          {showEditModal && editedUser && (
            <div className="fixed inset-0 bg-[rgba(0,0,0,0.5)] flex items-center justify-center z-50 p-4 overflow-y-auto">
              <div className="bg-gray-50 p-6 rounded-md shadow-md w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                <div className="flex items-center justify-between mb-6 sticky top-0 bg-gray-50 py-2">
                  <div className="flex items-center">
                    <div className="relative">
                      <div className="w-16 h-16 rounded-full bg-orange-200 flex items-center justify-center overflow-hidden">
                        {/* Replace with actual user image */}
                        {/* <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-10 h-10 text-orange-700">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.125h15.002M9.75 21.75l-3 1.5-3-1.5m9.75 0l3 1.5 3-1.5M9.375 6a9.375 9.375 0 0116.875-3.75m-16.875 3.75l1.5-7.5m15-7.5l-1.5 7.5m-15 6.75a2.25 2.25 0 002.25 2.25m13.5 0a2.25 2.25 0 002.25-2.25m-16.5 0a2.25 2.25 0 012.25-2.25m13.5 0a2.25 2.25 0 012.25 2.25" />
                        </svg> */}
                        <img src={editedUser.avatarUrl} alt="User Avatar" className="absolute inset-0 w-full h-full object-cover rounded-full" />
                      </div>
                      <button className="absolute bottom-0 right-0 bg-white rounded-full shadow-sm p-1 text-gray-500 hover:text-gray-700">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l-6.585 6.585a2.121 2.121 0 00-1.414.615l-1.93-1.93a2.121 2.121 0 00-.615-1.414l6.585-6.585a2.121 2.121 0 003 0 2.121 2.121 0 000 3zM12 17.768h.008v.008H12v-.008z" />
                        </svg>
                      </button>
                    </div>
                    <div className="ml-4">
                      <h3 className="text-lg font-semibold text-gray-800">{editedUser.firstName} {editedUser.lastName}</h3>
                      <p className="text-sm text-gray-500">{editedUser.email}</p>
                    </div>
                  </div>
                  <button onClick={() => setShowEditModal(false)} className="text-gray-500 hover:text-gray-700 focus:outline-none">
                    <svg className="h-6 w-6 fill-current" viewBox="0 0 20 20"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"></path></svg>
                  </button>
                </div>

                <div className="mb-6 p-4 bg-white rounded-md border border-gray-200">
                  <div className="md:grid md:grid-cols-2 md:items-start md:gap-6 mb-4"> {/* Flex layout for label and text */}
                    <div>
                      <h4 className="text-sm font-semibold text-gray-700">Update Personal Details</h4>
                    </div>
                    <p className="text-xs text-gray-500 md:mt-1">Lorem ipsum dolor sit amet consectetur. Purus odio porttitor dignissim orci non odio porttitor dignissim orci non purus purus. Nunc nisl ut</p>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="firstName" className="block text-xs font-medium text-gray-600 mb-1">Firstname</label>
                      <input type="text" id="firstName" name="firstName" className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm text-gray-700 focus:outline-none focus:border-orange-500" value={editFormData.firstName} onChange={handleEditFormChange} />
                    </div>
                    <div>
                      <label htmlFor="lastName" className="block text-xs font-medium text-gray-600 mb-1">Lastname</label>
                      <input type="text" id="lastName" name="lastName" className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm text-gray-700 focus:outline-none focus:border-orange-500" value={editFormData.lastName} onChange={handleEditFormChange} />
                    </div>
                    <div className="col-span-2">
                      <label htmlFor="email" className="block text-xs font-medium text-gray-600 mb-1">Email Address</label>
                      <input type="email" id="email" name="email" className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm text-gray-700 focus:outline-none focus:border-orange-500" value={editFormData.email} onChange={handleEditFormChange} />
                    </div>
                    <div>
                      <label htmlFor="phone" className="block text-xs font-medium text-gray-600 mb-1">Phone Number</label>
                      <div className="flex items-center border border-gray-300 rounded-md">
                        <div className="px-3 py-2 bg-gray-100 text-sm text-gray-700 rounded-l-md">
                          <select className="focus:outline-none">
                            <option>🇳🇬</option>
                            {/* Add more country codes */}
                          </select>
                        </div>
                        <input type="tel" id="phone" name="phone" className="w-full px-3 py-2 text-sm text-gray-700 focus:outline-none" value={editFormData.phone} onChange={handleEditFormChange} />
                      </div>
                    </div>
                    <div className="col-span-2 flex justify-end">
                      <button onClick={handleSaveEdit} className="bg-orange-500 hover:bg-orange-600 text-white rounded-md py-2 px-4 text-sm font-medium focus:outline-none focus:shadow-outline-orange active:bg-orange-700">
                        Save Changes
                      </button>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-white rounded-md border border-gray-200">
                  <div className="md:grid md:grid-cols-2 md:items-start md:gap-6 mb-4"> {/* Flex layout for label and text */}
                    <div>
                      <h4 className="text-sm font-semibold text-gray-700 mb-4">Password</h4>
                    </div>
                    <div className="text-xs text-gray-500 md:mt-1">Lorem ipsum dolor sit amet consectetur. Purus odio porttitor dignissim orci non odio porttitor dignissim orci non purus purus. Nunc nisl ut</div>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <label htmlFor="old-password" className="block text-xs font-medium text-gray-600 mb-1">Old Password</label>
                      <div className="relative">
                        <input type="password" id="old-password" className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm text-gray-700 focus:outline-none focus:border-orange-500" value="********" readOnly />
                        <button className="absolute top-1/2 right-3 -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7 1.274 4.057 1.274 8.057 0 12-1.274 4.057-5.064 7-9.542 7-4.476 0-8.268-2.943-9.542-7 0-4.057 0-8.057 0-12z" />
                          </svg>
                        </button>
                      </div>
                    </div>
                    <div>
                      <label htmlFor="new-password" className="block text-xs font-medium text-gray-600 mb-1">New Password</label>
                      <div className="relative">
                        <input type="password" id="new-password" className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm text-gray-700 focus:outline-none focus:border-orange-500" value="********" readOnly />
                        <button className="absolute top-1/2 right-3 -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7 1.274 4.057 1.274 8.057 0 12-1.274 4.057-5.064 7-9.542 7-4.476 0-8.268-2.943-9.542-7 0-4.057 0-8.057 0-12z" />
                          </svg>
                        </button>
                      </div>
                    </div>
                    <div className="flex justify-end">
                      <button className="bg-orange-500 hover:bg-orange-600 text-white rounded-md py-2 px-4 text-sm font-medium focus:outline-none focus:shadow-outline-orange active:bg-orange-700">
                        Change Password
                      </button>
                    </div>
                  </div>
                  <div className="mt-4 flex justify-end">
                    <button onClick={() => setShowEditModal(false)} className="bg-gray-300 hover:bg-gray-400 text-gray-700 rounded-md py-2 px-4 text-sm font-medium focus:outline-none focus:shadow-outline-gray active:bg-gray-500">
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>
      </main>
      </div>
    </div>
  );
};

export default UserList;
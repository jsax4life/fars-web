"use client";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useState, useEffect } from "react";
import { useUserAuth } from "@/hooks/useUserAuth";
import {
  FiFile,
  FiEdit2,
  FiTool,
  FiUsers,
  FiShield,
  FiUser,
  FiFileText,
  FiTag,
  FiCreditCard,
  FiHelpCircle,
  FiMenu,
  FiX,
  FiChevronDown,
  FiChevronRight,
} from "react-icons/fi";
import { MenuItem, SubMenuItem } from '../../types/menu';

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>({});
  const pathname = usePathname();
  const { logout } = useUserAuth();

  const menuItems: MenuItem[] = [
    
   
    { name: "Client Management", icon: '/sidebar/4.svg', path: '/Clients' },
    { name: "Role Management", icon: '/sidebar/5.svg', path: '/RoleList' },
    { name: "Staff Management", icon: '/sidebar/6.svg', path: '/UserList' },
    { name: "Bank Management", icon: '/sidebar/7.svg', path: '/BankList' },
    { name: "Bank Account", icon: '/sidebar/7.svg', path: '/BankAccounts' },
     { name: "Rate Management", icon: '/sidebar/9.svg', path: '/Rates' },
      { name: "Analysis", icon: '/sidebar/1.svg', path: '/Analysis' },
    { 
      name: "Classification Configs", 
      icon: '/sidebar/8.svg', 
      subItems: [
        { name: "Classification", path: '/Classification' },
        { name: "Classification Pattern", path: '/ClassificationPattern' },
        { name: "Reversal Keyword", path: '/ReversalKeyword' },
      ]
    },
    { name: "Help", icon: '/sidebar/10.svg', path: '/help' },
  ];

  const toggleItem = (name: string) => {
    setExpandedItems((prev) => ({
      ...prev,
      [name]: !prev[name],
    }));
  };

  // Function to check if a route is active
  const isActive = (path: string) => {
    return pathname === path || pathname.startsWith(`${path}/`);
  };

  // Check if any sub-item is active
  const isParentActive = (subItems?: SubMenuItem[]) => {
    if (!subItems) return false;
    return subItems.some(subItem => isActive(subItem.path));
  };

  // Auto-expand parent menu if any sub-item is active
  useEffect(() => {
    const checkAndExpand = () => {
      menuItems.forEach((item) => {
        if (item.subItems) {
          const hasActiveChild = item.subItems.some(subItem => 
            pathname === subItem.path || pathname.startsWith(`${subItem.path}/`)
          );
          if (hasActiveChild) {
            setExpandedItems((prev) => ({
              ...prev,
              [item.name]: true,
            }));
          }
        }
      });
    };
    checkAndExpand();
  }, [pathname]);

  return (
    <>
      {/* Mobile menu button */}
      <button
        className="md:hidden fixed top-4 left-4 z-50 p-2 bg-gray-800 text-white rounded-md shadow-sm"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <FiX size={24} /> : <FiMenu size={24} />}
      </button>

      {/* Sidebar */}
      <div
        className={`fixed md:fixed inset-y-0 left-0 transform ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0 transition-transform duration-200 ease-in-out z-40 w-64 bg-[#2E2D2D] text-white h-screen overflow-y-auto`}
      >
        <div className="p-4 h-full flex flex-col">
          <div className="flex items-center justify-between py-4 px-2 border-b border-gray-700 mb-4">
            <div className="flex items-center space-x-2">
              <div className="">
                <img
                  src="/logo.svg"
                  alt="Company Logo"
                  className="h-20 w-auto"
                />
              </div>
            </div>
          </div>

          {/* Menu Items */}
          <nav className="flex-1">
            <ul className="space-y-1">
              {menuItems.map((item) => (
                <li key={item.name}>
                  {item.subItems ? (
                    // Parent item with sub-items
                    <>
                      <button
                        onClick={() => toggleItem(item.name)}
                        className={`w-full flex items-center justify-between px-4 py-3 rounded-md hover:bg-gray-700 transition-colors ${
                          isParentActive(item.subItems) ? 'bg-gray-700 font-medium' : ''
                        }`}
                      >
                        <div className="flex items-center min-w-0 flex-1">
                          <Image 
                            src={item.icon} 
                            width={20} 
                            height={20} 
                            alt={item.name}
                            className="mr-3 flex-shrink-0"
                          />
                          <span className="whitespace-nowrap truncate">{item.name}</span>
                        </div>
                        <div className="flex-shrink-0 ml-2">
                          {expandedItems[item.name] ? (
                            <FiChevronDown />
                          ) : (
                            <FiChevronRight />
                          )}
                        </div>
                      </button>
                      {expandedItems[item.name] && (
                        <ul className="ml-4 mt-1 space-y-1">
                          {item.subItems.map((subItem) => (
                            <li key={subItem.name}>
                              <Link
                                href={subItem.path}
                                className={`w-full flex items-center px-4 py-2 rounded-md hover:bg-gray-700 transition-colors ${
                                  isActive(subItem.path) ? 'bg-gray-700 font-medium' : ''
                                }`}
                              >
                                <span className="ml-7">{subItem.name}</span>
                              </Link>
                            </li>
                          ))}
                        </ul>
                      )}
                    </>
                  ) : (
                    // Regular menu item
                    <Link
                      href={item.path || '#'}
                      onClick={() => toggleItem(item.name)}
                      className={`w-full flex items-center px-4 py-3 rounded-md hover:bg-gray-700 transition-colors ${
                        item.path && isActive(item.path) ? 'bg-gray-700 font-medium' : ''
                      }`}
                    >
                      <div className="flex items-center">
                        <Image 
                          src={item.icon} 
                          width={20} 
                          height={20} 
                          alt={item.name}
                          className="mr-3"
                        />
                        <span>{item.name}</span>
                      </div>
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </nav>
          <div className="mt-4 border-t border-gray-700 pt-4">
            <button
              onClick={() => logout()}
              className="w-full text-left px-4 py-3 rounded-md hover:bg-gray-700 transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
};

export default Sidebar;
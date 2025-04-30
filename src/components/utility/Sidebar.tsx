"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  FaFile as FileIcon,
  FaPencilAlt as EditIcon,
  FaSlidersH as MaintenanceIcon,
  FaQuestionCircle as HelpIcon,
  FaPlus as PlusIcon,
  FaCopy as CopyIcon,
  FaObjectGroup as MergeIcon,
  FaExternalLinkAlt as ExternalDataIcon,
  FaFileImport as ImportIcon,
  FaListAlt as ClassifyIcon,
  FaArrowDown as PostIcon,
  FaExchangeAlt as InsertIcon,
  FaCheckSquare as ReconcileIcon,
  FaTimes as UnmatchIcon,
  FaEye as ViewIcon,
  FaHistory as LogIcon,
} from "react-icons/fa";

const Sidebar = () => {
  const [isFileOpen, setIsFileOpen] = useState(false);
  const [isExternalDataOpen, setIsExternalDataOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const router = useRouter();

  const handleNavigation = (path) => {
    router.push(path);
  };

  const toggleFile = () => {
    setIsFileOpen(!isFileOpen);
    setIsExternalDataOpen(false);
    setIsEditOpen(false);
  };

  const toggleExternalData = (e) => {
    e.stopPropagation(); // Prevent File dropdown from closing
    setIsExternalDataOpen(!isExternalDataOpen);
  };

  const toggleEdit = () => {
    setIsEditOpen(!isEditOpen);
    setIsFileOpen(false);
    setIsExternalDataOpen(false);
  };

  return (
    <aside className="bg-[#2E2D2D] text-white w-64 min-h-screen py-4 px-3 flex flex-col">
      <div className="mb-4">
        <button
          className={`flex items-center justify-between w-full py-2 px-3 rounded-md hover:bg-[#3A3939] focus:outline-none ${
            isFileOpen ? "bg-[#3A3939]" : ""
          }`}
          onClick={toggleFile}
        >
          <div className="flex items-center gap-2">
            <FileIcon />
            File
          </div>
          <span>&gt;</span>
        </button>
        {isFileOpen && (
          <div className="mt-1 ml-2">
            <div className="py-2 px-4 hover:bg-[#474646] rounded-md cursor-pointer">
              Transaction
            </div>
            <div className="py-2 px-4 hover:bg-[#474646] rounded-md cursor-pointer">
              Utilities
            </div>
            <div className="py-2 px-4 hover:bg-[#474646] rounded-md cursor-pointer">
              New Account
            </div>
            <div className="py-2 px-4 hover:bg-[#474646] rounded-md cursor-pointer">
              Replica Account
            </div>
            <div className="py-2 px-4 hover:bg-[#474646] rounded-md cursor-pointer">
              Merge Account
            </div>
            <div
              className={`flex items-center justify-between py-2 px-4 hover:bg-[#474646] rounded-md cursor-pointer ${
                isExternalDataOpen ? "bg-[#474646]" : ""
              }`}
              onClick={toggleExternalData}
            >
              <div className="flex items-center gap-2">
                External Data
              </div>
              <span>&gt;</span>
            </div>
            {isExternalDataOpen && (
              <div className="mt-1 ml-2">
                <div className="py-2 px-4 hover:bg-[#545353] rounded-md cursor-pointer">
                  Import Bank Statement
                </div>
                <div className="py-2 px-4 hover:bg-[#545353] rounded-md cursor-pointer">
                  Classify Bank Statement
                </div>
                <div className="py-2 px-4 hover:bg-[#545353] rounded-md cursor-pointer">
                  Post Bank Statement
                </div>
                <div className="py-2 px-4 hover:bg-[#545353] rounded-md cursor-pointer">
                  Insert C/B Transaction
                </div>
                <div className="py-2 px-4 hover:bg-[#545353] rounded-md cursor-pointer">
                  Reconcile
                </div>
                <div className="py-2 px-4 hover:bg-[#545353] rounded-md cursor-pointer">
                  Unmatch Transaction
                </div>
              </div>
            )}
          </div>
        )}

        <button
          className={`flex items-center justify-between w-full py-2 px-3 rounded-md hover:bg-[#3A3939] focus:outline-none ${
            isEditOpen ? "bg-[#3A3939]" : ""
          }`}
          onClick={toggleEdit}
        >
          <div className="flex items-center gap-2">
            <EditIcon />
            Edit
          </div>
          <span>&gt;</span>
        </button>
        {isEditOpen && (
          <div className="mt-1 ml-2">
            <div className="py-2 px-4 hover:bg-[#474646] rounded-md cursor-pointer">
              View
            </div>
            <div className="py-2 px-4 hover:bg-[#474646] rounded-md cursor-pointer">
              Activities Log
            </div>
            <div className="py-2 px-4 hover:bg-[#474646] rounded-md cursor-pointer">
              Delete
            </div>
          </div>
        )}

        <button className="flex items-center gap-2 w-full py-2 px-3 rounded-md hover:bg-[#3A3939] focus:outline-none">
          <MaintenanceIcon />
          Maintenance
        </button>
        <button className="flex items-center gap-2 w-full py-2 px-3 rounded-md hover:bg-[#3A3939] focus:outline-none">
          <HelpIcon />
          Help
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
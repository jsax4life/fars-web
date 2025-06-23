import React, { useState } from "react";

const Navbar = () => {
  const [isNotificationModalOpen, setIsNotificationModalOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);

  const togglePasswordVisibility = (field: any) => {
    if (field === "oldPassword") {
      setShowOldPassword(!showOldPassword);
    } else if (field === "newPassword") {
      setShowNewPassword(!showNewPassword);
    }
  };

  const NotificationModal = ({ isOpen, onClose }: any) => {
    if (!isOpen) return null;

    return (
      <div
        className=" z-1000  items-center justify-center fixed inset-0 bg-[rgba(0,0,0,0.5)] flex"
        onClick={onClose}
      >
        <div
          className="bg-white p-5 rounded-xl shadow-lg relative w-11/12 max-w-md"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex justify-between items-center pb-4 border-b border-gray-200 mb-5">
            <h2 className="text-xl font-semibold text-gray-800">
              Notification
            </h2>
            <span
              className="text-gray-400 text-2xl font-bold cursor-pointer hover:text-black"
              onClick={onClose}
            >
              &times;
            </span>
          </div>
          <div className="flex space-x-3 mb-4">
            <button className="px-4 py-2 rounded-full bg-orange-500 text-white text-sm font-medium">
              All
            </button>
            <button className="px-4 py-2 rounded-full bg-gray-200 text-gray-700 text-sm font-medium">
              Unread
            </button>
          </div>
          <div className="max-h-96 overflow-y-auto pr-2">
            {/* Notification Item 1 */}
            <div className="flex items-start mb-4 p-3 bg-white rounded-lg shadow-sm relative">
              <img
                src="https://placehold.co/40x40/FF6347/FFFFFF?text=JD"
                alt="User 1"
                className="w-10 h-10 rounded-full mr-4 object-cover"
              />
              <div className="flex-grow">
                <p className="font-medium text-gray-800">
                  Eget euismod enim urna in eget tincide.
                </p>
                <p className="text-sm text-gray-600">
                  Lorem ipsum dolor sit amet consectetur. Eget euismod enim urna
                  in eget tincid Aliquet vel tincidunt. Lorem ipsum dolor sit
                  amet consectetur.
                </p>
              </div>
              <div className="w-2 h-2 bg-red-500 rounded-full absolute top-4 right-4"></div>
            </div>
            {/* Notification Item 2 */}
            <div className="flex items-start mb-4 p-3 bg-white rounded-lg shadow-sm relative">
              <img
                src="https://placehold.co/40x40/3CB371/FFFFFF?text=CD"
                alt="User 2"
                className="w-10 h-10 rounded-full mr-4 object-cover"
              />
              <div className="flex-grow">
                <p className="font-medium text-gray-800">
                  Charles drop a message
                </p>
                <p className="text-sm text-gray-600">
                  Lorem ipsum dolor sit amet consectetur. Eget euismod enim urna
                  in eget tincid Aliquet vel tincidunt. Lorem ipsum dolor sit
                  amet consectetur.
                </p>
              </div>
              <div className="w-2 h-2 bg-red-500 rounded-full absolute top-4 right-4"></div>
            </div>
            {/* Notification Item 3 */}
            <div className="flex items-start mb-4 p-3 bg-white rounded-lg shadow-sm relative">
              <img
                src="https://placehold.co/40x40/6A5ACD/FFFFFF?text=AS"
                alt="User 3"
                className="w-10 h-10 rounded-full mr-4 object-cover"
              />
              <div className="flex-grow">
                <p className="font-medium text-gray-800">
                  Lorem ipsum dolor sit amet consectetur.
                </p>
                <p className="text-sm text-gray-600">
                  Lorem ipsum dolor sit amet consectetur. Eget euismod enim urna
                  in eget tincid Aliquet vel tincidunt. Lorem ipsum dolor sit
                  amet consectetur.
                </p>
              </div>
              <div className="w-2 h-2 bg-red-500 rounded-full absolute top-4 right-4"></div>
            </div>
            {/* Notification Item 4 */}
            <div className="flex items-start mb-4 p-3 bg-white rounded-lg shadow-sm relative">
              <img
                src="https://placehold.co/40x40/F4A460/FFFFFF?text=SK"
                alt="User 4"
                className="w-10 h-10 rounded-full mr-4 object-cover"
              />
              <div className="flex-grow">
                <p className="font-medium text-gray-800">
                  New update available for your account.
                </p>
                <p className="text-sm text-gray-600">
                  Lorem ipsum dolor sit amet consectetur. Eget euismod enim urna
                  in eget tincid Aliquet vel tincidunt. Lorem ipsum dolor sit
                  amet consectetur.
                </p>
              </div>
              <div className="w-2 h-2 bg-red-500 rounded-full absolute top-4 right-4"></div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const ProfileModal = ({ isOpen, onClose }: any) => {
    if (!isOpen) return null;

    return (
      <div
        className="z-1000 items-center justify-center fixed inset-0 bg-[rgba(0,0,0,0.5)] flex"
        onClick={onClose}
      >
        <div
          className="bg-white p-5 rounded-xl shadow-lg relative w-11/12 max-w-2xl mx-auto md:m-10 max-h-[90vh] flex flex-col"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex justify-between items-center pb-4 border-b border-gray-200 mb-5 flex-shrink-0">
            <h2 className="text-xl font-semibold text-gray-800">Profile</h2>
            <span
              className="text-gray-400 text-2xl font-bold cursor-pointer hover:text-black"
              onClick={onClose}
            >
              &times;
            </span>
          </div>

          <div className="overflow-y-auto flex-grow pr-2 -mr-2">
            {" "}
            {/* Added overflow-y-auto, flex-grow, pr-2, -mr-2 */}
            <div className="bg-white p-6 rounded-xl shadow-sm mb-5">
              <div className="flex items-center mb-6">
                <div className="relative">
                  <img
                    src="https://placehold.co/80x80/FF7F50/FFFFFF?text=O"
                    alt="Profile Large"
                    className="w-20 h-20 rounded-full mr-5 object-cover"
                  />
                  <span className="absolute bottom-0 right-0 bg-orange-500 text-white rounded-full p-2 text-sm cursor-pointer flex items-center justify-center w-7 h-7 transform translate-x-3 translate-y-3 border-2 border-white">
                    <i className="fas fa-pencil-alt"></i>
                  </span>
                </div>
                <div className="">
                  <p className="text-xl font-semibold text-gray-800">
                    Olayimika Oluwasegun
                  </p>
                  <p className="text-gray-600">olayimikaoluwasegun@gmail.com</p>
                </div>
              </div>

              <h3 className="text-lg font-medium text-gray-800 mb-4">
                Update Personal Details
              </h3>
              <p className="text-sm text-gray-600 mb-6">
                Lilac Parus dipertitor dig mici non odio porther dignissim arci
                non puruspurus. Nure nisu
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
                <div>
                  <label
                    htmlFor="firstName"
                    className="block mb-2 font-medium text-gray-700"
                  >
                    Firstname
                  </label>
                  <input
                    type="text"
                    id="firstName"
                    defaultValue="Olayimmika"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400"
                  />
                </div>
                <div>
                  <label
                    htmlFor="lastName"
                    className="block mb-2 font-medium text-gray-700"
                  >
                    Lastname
                  </label>
                  <input
                    type="text"
                    id="lastName"
                    defaultValue="Segun"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400"
                  />
                </div>
              </div>

              <div className="mb-5">
                <label
                  htmlFor="email"
                  className="block mb-2 font-medium text-gray-700"
                >
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  defaultValue="olayimikaoluwasegun@gmail.com"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400"
                />
              </div>

              <div className="mb-5">
                <label
                  htmlFor="phoneNumber"
                  className="block mb-2 font-medium text-gray-700"
                >
                  Phone Number
                </label>
                <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-orange-400">
                  <select className="p-3 border-r border-gray-300 bg-gray-50 rounded-l-lg outline-none">
                    <option value="+234">🇳🇬 +234</option>
                    {/* Add more country codes as needed */}
                  </select>
                  <input
                    type="text"
                    id="phoneNumber"
                    defaultValue="08101831001"
                    className="flex-grow p-3 border-none outline-none rounded-r-lg"
                  />
                </div>
              </div>

              <button className="bg-orange-500 text-white py-3 px-6 rounded-lg font-semibold cursor-pointer transition-colors hover:bg-orange-600 block ml-auto">
                Save Changes
              </button>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <h3 className="text-lg font-medium text-gray-800 mb-4">
                Password
              </h3>
              <p className="text-sm text-gray-600 mb-6">
                Lanem am dd sit amet nach Piran parte d
              </p>

              <div className="mb-5">
                <label
                  htmlFor="oldPassword"
                  className="block mb-2 font-medium text-gray-700"
                >
                  Old Password
                </label>
                <div className="relative">
                  <input
                    type={showOldPassword ? "text" : "password"}
                    id="oldPassword"
                    defaultValue="••••••••"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 pr-10"
                  />
                  <span
                    className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-gray-500"
                    onClick={() => togglePasswordVisibility("oldPassword")}
                  >
                    <i
                      className={`fas ${
                        showOldPassword ? "fa-eye-slash" : "fa-eye"
                      }`}
                    ></i>
                  </span>
                </div>
              </div>

              <div className="mb-5">
                <label
                  htmlFor="newPassword"
                  className="block mb-2 font-medium text-gray-700"
                >
                  New Password
                </label>
                <div className="relative">
                  <input
                    type={showNewPassword ? "text" : "password"}
                    id="newPassword"
                    defaultValue="••••••••"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 pr-10"
                  />
                  <span
                    className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-gray-500"
                    onClick={() => togglePasswordVisibility("newPassword")}
                  >
                    <i
                      className={`fas ${
                        showNewPassword ? "fa-eye-slash" : "fa-eye"
                      }`}
                    ></i>
                  </span>
                </div>
              </div>

              <button className="bg-orange-500 text-white py-3 px-6 rounded-lg font-semibold cursor-pointer transition-colors hover:bg-orange-600 block ml-auto">
                Change Password
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="bg-gray-100 font-inter">
      <nav className="bg-white p-4 shadow-md flex justify-between items-center px-6 md:px-10 rounded-b-lg">
        {/* Left Section */}
        <div className="flex items-center space-x-4">
          <div className="text-xl md:text-2xl font-bold text-gray-800">👋</div>
          <div className="flex flex-col">
            <div className="text-xl md:text-2xl font-bold text-gray-800">
              {" "}
              Hi, Olayimmika
            </div>
            <div className="text-sm text-gray-500 hidden md:block">
              June 18th 2023 - 08:34 am
            </div>
          </div>
        </div>

        {/* Right Section */}
        <div className="flex items-center space-x-4 md:space-x-6">
          {/* Bell Icon */}
          <div
            className="relative cursor-pointer bg-gray-200 p-2  rounded-full hover:bg-gray-300 transition-colors"
            onClick={() => setIsNotificationModalOpen(true)}
          >
            {/* <i className="fas fa-bell text-gray-600 text-lg md:text-xl"></i> */}
            <svg width="29" height="29" viewBox="0 0 59 59" fill="none" xmlns="http://www.w3.org/2000/svg">
<rect x="0.196777" y="0.375" width="58.1374" height="58.1374" rx="29.0687" fill="#E8E8E8"/>
<path d="M32.0909 44.7646C32.0553 44.9287 32.0068 45.0898 31.9435 45.2461C31.7542 45.6777 31.4673 46.0596 31.1027 46.3584C30.7523 46.6455 30.3406 46.8473 29.9005 46.9521H29.8273L29.7618 46.9658C29.5964 47.0003 29.4278 47.0186 29.2589 47.0225C28.4879 47.0162 27.75 46.7091 27.2032 46.165C26.8134 45.7772 26.5458 45.2909 26.4191 44.7646H32.0909ZM19.2169 27.1406C19.1273 24.7414 19.6676 22.3602 20.7853 20.2354C21.3169 19.2982 22.0409 18.4837 22.9093 17.8457C23.7805 17.2056 24.778 16.7578 25.8351 16.5312L26.3527 16.4209V13.8965C26.3527 13.2124 26.9068 12.6572 27.5909 12.6572H30.9396C31.6237 12.6572 32.1788 13.2124 32.1788 13.8965V16.4082L32.6818 16.5283C34.8197 17.0374 36.4573 18.212 37.5724 19.9736C38.696 21.7489 39.3136 24.1611 39.3136 27.165V37.3799L42.1964 38.8213C42.616 39.0311 42.881 39.4605 42.881 39.9297V40.4336C42.881 41.1176 42.3266 41.6726 41.6427 41.6729H16.8888C16.2047 41.6729 15.6495 41.1177 15.6495 40.4336V39.9297C15.6495 39.4606 15.9146 39.0311 16.3341 38.8213L19.2169 37.3799V27.1406Z" stroke="#5D5D5D" stroke-width="1.30883"/>
<rect x="34.2815" y="16.0537" width="8.52113" height="8.52113" rx="4.26057" fill="#E63B1F"/>
</svg>

            {/* <span className="absolute top-0 right-0 block h-3 w-3 rounded-full ring-2 ring-white bg-red-500"></span> */}
          </div>

          {/* Profile Image */}
          <div
            className="relative cursor-pointer"
            onClick={() => setIsProfileModalOpen(true)}
          >
            <img
              src="https://placehold.co/40x40/FF7F50/FFFFFF?text=O"
              alt="Profile"
              className="w-10 h-10 rounded-full border-2 border-orange-400 object-cover"
            />
          </div>
        </div>
      </nav>

      {/* Notification Modal Component */}
      <NotificationModal
        isOpen={isNotificationModalOpen}
        onClose={() => setIsNotificationModalOpen(false)}
      />

      {/* Profile Modal Component */}
      <ProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
      />
    </div>
  );
};

export default Navbar;

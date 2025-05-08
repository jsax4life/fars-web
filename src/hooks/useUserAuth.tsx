import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useApi } from './useApi';
import Endpoints from '@/lib/endpoints';
import { User } from '@/types';


interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<string>;
  register: (
    name: string,
    username: string,
    email: string,
    password: string,
    referralCode?: string,
  ) => Promise<boolean>;
  logout: () => void;
  isAdmin: () => boolean;
  updateUserRole: (role: 'user' | 'baker' | 'admin') => void;
  changePassword: (currentPassword: string, newPassword: string) => Promise<boolean>;
  verifyOTP: (otp: string, email: string) => Promise<boolean>;
  resetPassword: (password: string, confirmPassword: string) => Promise<boolean>;
  requestOTP: (email: string) => Promise<boolean>;
  forgetPassword: (email: string) => Promise<boolean>;
  checkUsernameAvailability: (username: string) => Promise<boolean>;
  resetPin: (otp: string, pin: string, confirmPin: string) => Promise<boolean>;
  getRefferals: () => Promise<User[] | undefined>;
  updateAccount: (name: string, phoneNumber: string, bio: string) => Promise<boolean>;
  deleteAccount: (reason: string) => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);



export const UserAuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const api = useApi()

  useEffect(() => {
    // Check for existing session in localStorage
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    } else {
      setUser(null);
    }
    setIsLoading(false);
  }, []);

  const getProfile = async () => {
    setIsLoading(true);

    try {
      // call get profile api
      const request = await api.get(Endpoints.profile)

      if (request) {
        setUser(request);
        localStorage.setItem('user', JSON.stringify(request));
      }
    } catch (error) {
      // toast.error('Failed to get profile: ' + error?.message);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    if (api.token) {
      getProfile()
    }
  }, [api.token])

  const login = async (email: string, password: string): Promise<string> => {
    setIsLoading(true);

    try {
      // call login api
      const request = await api.post(Endpoints.login, {
        email,
        password,
      })

      if (request?.token) {
        const { password, ...userWithoutPassword } = request?.user;
        api.updateToken(request?.token);
        setUser(userWithoutPassword);
        localStorage.setItem('user', JSON.stringify(userWithoutPassword));
        // toast.success('Logged in successfully!');
        return 'success';
      } else if (request?.isNewDevice) {
        // toast.error(request?.message);
        return 'new';
      } else {
        // toast.error('Invalid email or password');
        return 'error';
      }
    } catch (error) {
      // toast.error('Login failed: ' + error?.message);
      return 'error';
    } finally {
      setIsLoading(false);
    }
  };

  const verifyOTP = async (otp: string, email: string): Promise<boolean> => {
    setIsLoading(true);

    try {
      // call verify otp api
      const request = await api.post(Endpoints.verify, {
        email,
        otp,
      })

      if (request?.user) {
        api.updateToken(request?.token);
        setUser(request?.user);
        localStorage.setItem('user', JSON.stringify(request?.user));
        // toast.success('OTP verified successfully!');
        return true;
      }
      return false;
    } catch (error) {
      // toast.error('OTP verification failed: ' + error?.message);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const requestOTP = async (email: string): Promise<boolean> => {
    setIsLoading(true);

    try {
      // call request otp api
      const request = await api.post(Endpoints.requestOtp + `/${email}`, {})

      if (request?.message) {
        // toast.success(request?.message);
        return true;
      }
      return false;
    } catch (error) {
      // toast.error('OTP request failed: ' + error?.message);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const checkUsernameAvailability = async (username: string): Promise<boolean> => {
    try {
      // call api
      const request = await api.get(Endpoints.checkUsername + `/${username}`)

      if (request) {
        return true
      }
      return false;
    } catch (error) {
      // toast.error('Failed to check username availability');
      return false;
    }
  };

  const forgetPassword = async (email: string): Promise<boolean> => {
    setIsLoading(true);

    try {
      // call request forget password api
      const request = await api.post(Endpoints.forgotPassword, {
        email: email
      })

      if (request?.message) {
        // toast.success(request?.message);
        return true;
      }
      return false;
    } catch (error) {
      // toast.error('Request failed: ' + error?.message);
      return false;
    } finally {
      setIsLoading(false);
    }
  };


  const resetPassword = async (password: string, confirmPassword: string): Promise<boolean> => {
    setIsLoading(true);

    try {
      // call reset otp api
      const request = await api.post(Endpoints.resetPassword, {
        password,
        passwordConfirmation: confirmPassword,
      })

      if (request?.message) {
        // toast.success(request.message);
        return true;
      }
      return false;
    } catch (error) {
      // toast.error('Password reset failed: ' + error?.message);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const resetPin = async (otp: string, pin: string, confirmPin: string): Promise<boolean> => {
    setIsLoading(true);
    const request = await api.post(Endpoints.resetPin, {
      otp,
      pin,
      pinConfirmation: confirmPin
    })
    if (request?.message) {
      // toast.success(request.message);
      return true;
    } else {
      // toast.error('Failed to reset pin: ' + request?.message);
      return false;
    }
  };

  const register = async (
    name: string,
    username: string,
    email: string,
    password: string,
    referralCode?: string
  ): Promise<boolean> => {
    setIsLoading(true);

    try {
      // call sign up api
      const request = await api.post(Endpoints.register, {
        "email": email,
        "password": password,
        "firstName": name.split(' ')[0] || '',
        "lastName": name.split(' ')[1] || '',
        "userName": username,
        "phoneNumber": "",
        "referralCode": referralCode
      })

      if (request.message) {
        // toast.success(request.message)
        return true;
      }
      return false;
    } catch (error) {
      // toast.error('Registration failed: ' + error?.message);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const getRefferals = async () => {
    setIsLoading(true);

    try {
      // call get refferals api
      const request = await api.get(Endpoints.refferals)

      if (request) {
        return request;
      }
    } catch (error) {
      // toast.error('Failed to get refferals: ' + error?.message);
    } finally {
      setIsLoading(false);
    }
  }

  const logout = () => {
    api.get(Endpoints.logout)
      .then(() => {
        setUser(null);
        localStorage.removeItem('user');
        api.updateToken(null);
        // toast.success('Logged out');
      }).catch((error) => {
        setUser(null);
        localStorage.removeItem('user');
        api.updateToken(null);
        // toast.success('Logged out');
      });
  };

  const isBaker = () => {
    return user?.hasShop;
  };

  const isAdmin = () => {
    return user?.userType === 'Admin';
  };

  const updateUserRole = (role: 'user' | 'baker' | 'admin') => {
    if (!user) return;

    // const updatedUser = { ...user, role };
    // setUser(updatedUser);
    // localStorage.setItem('user', JSON.stringify(updatedUser));

    // In a real app, this would make an API call to update the database
    // toast.success(`User role updated to ${role}`);
  };

  const changePassword = async (currentPassword: string, newPassword: string): Promise<boolean> => {
    if (!user) return false;

    setIsLoading(true);

    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      // In a real app, this would verify the current password against the database
      // and then update with the new password

      // For our mock implementation, we'll just simulate success
      // toast.success('Password updated successfully');
      return true;
    } catch (error) {
      // toast.error('Failed to update password');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const updateAccount = async (name: string, phoneNumber: string, bio: string) => {
    setIsLoading(true);

    try {
      // call update account api
      const request = await api.put(Endpoints.updateAccount, {
        name,
        phoneNumber,
        bio
      })

      if (request) {
        // toast.success('Account updated successfully!');
        setUser(request);
        localStorage.setItem('user', JSON.stringify(request));
        return true;
      }
      return false;
    } catch (error) {
      // toast.error('Failed to update account: ' + error?.message);
      return false;
    } finally {
      setIsLoading(false);
    }
  }

  const deleteAccount = async (reason: string) => {
    setIsLoading(true);

    try {
      // call delete account api
      const request = await api.delete(Endpoints.account + `/${reason}`)

      if (request?.message) {
        // toast.success(request?.message);
        return true;
      }
      return false;
    } catch (error) {
      // toast.error('Failed to delete account: ' + error?.message);
      return false;
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated: api.token !== null,
      isLoading,
      login,
      register,
      logout,
      isAdmin,
      updateUserRole,
      changePassword,
      verifyOTP,
      requestOTP,
      checkUsernameAvailability,
      forgetPassword,
      resetPassword,
      resetPin,
      getRefferals,
      updateAccount,
      deleteAccount,
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useUserAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useUserAuth must be used within a UserAuthProvider');
  }
  return context;
};

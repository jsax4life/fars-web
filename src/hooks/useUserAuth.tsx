'use client'
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useApi } from './useApi';
import Endpoints from '@/lib/endpoints';
import { User } from '@/types';
import { toast } from 'sonner';


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
  changePassword: (currentPassword: string, newPassword: string) => Promise<boolean>;
  resetPassword: (password: string, token: string) => Promise<boolean>;
  forgetPassword: (email: string) => Promise<boolean>;
  resetPin: (otp: string, pin: string, confirmPin: string) => Promise<boolean>;
  updateAccount: (id: string, data: {}) => Promise<boolean>;
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
    } catch (error: any) {
      toast.error('Failed to get profile: ' + error?.message);
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

      if (request) {
        const { id, accessToken, refreshToken } = request;
        api.updateToken({ accessToken, refreshToken });
        toast.success('Logged in successfully!');
        return 'success';
      }
      return 'error';
    } catch (error: any) {
      toast.error('Login failed: ' + error?.message);
      return 'error';
    } finally {
      setIsLoading(false);
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
        toast.success(request?.message);
        return true;
      }
      return false;
    } catch (error: any) {
      toast.error('Request failed: ' + error?.message);
      return false;
    } finally {
      setIsLoading(false);
    }
  };


  const resetPassword = async (password: string, token: string): Promise<boolean> => {
    setIsLoading(true);

    try {
      // call reset otp api
      const request = await api.patch(Endpoints.resetPassword, {
        password,
        resetToken: token,
      })

      if (request?.message) {
        toast.success(request.message);
        return true;
      }
      return false;
    } catch (error: any) {
      toast.error('Password reset failed: ' + error?.message);
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
      toast.success(request.message);
      return true;
    } else {
      toast.error('Failed to reset pin: ' + request?.message);
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

  const logout = () => {
    api.get(Endpoints.logout)
      .finally(() => {
        setUser(null);
        localStorage.removeItem('user');
        api.updateToken(null);
        // navigate to login/root
        if (typeof window !== 'undefined') {
          window.location.href = '/';
        }
      });
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

  const updateAccount = async (id: string, data: {
    firstName?: string,
    lastName?: string,
    username?: string,
    email?: string,
    avatarUrl?: string,
    role?: string,
    permissions?: string[],
    isActive?: true
  }) => {
    setIsLoading(true);

    try {
      // call update account api
      const request = await api.put(Endpoints.updateAccount + id, data)

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
      changePassword,
      forgetPassword,
      resetPassword,
      resetPin,
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

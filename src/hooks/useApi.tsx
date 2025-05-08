import React, { createContext, useContext, useState, useEffect } from "react";

interface ApiContextType {
    token: string | null;
    updateToken: (newToken: string | null) => void;
}

// Define API Context
const ApiContext = createContext<ApiContextType | null>(null);

// API Base URL
const API_BASE_URL = "https://dev.api.cakkie.com";

export const ApiProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [token, setToken] = useState<string | null>(null);
    const [loading, setLoading] = useState(true); // Track loading state

    // Load token from storage
    useEffect(() => {
        const storedToken = localStorage.getItem("authToken");
        if (storedToken) {
            setToken(storedToken);
        }
        setLoading(false); // Mark as loaded
    }, []);

    const updateToken = (newToken: string | null) => {
        setToken(newToken);
        if (newToken) {
            localStorage.setItem("authToken", newToken);
        } else {
            localStorage.removeItem("authToken");
        }
    };

    // Wait for token to load before rendering children
    if (loading) {
        return null; // Or a loading spinner
    }

    return (
        <ApiContext.Provider value={{ token, updateToken }}>
            {children}
        </ApiContext.Provider>
    );
};


// Hook to use the API provider
export const useApi = () => {
    const context = useContext(ApiContext);
    if (!context) {
        throw new Error("useApi must be used within an ApiProvider");
    }

    const { token, updateToken } = context;

    const request = async (method: string, endpoint: string, data?: any) => {
        if (token === null) {
            console.warn("Token not available yet. Proceeding without.");
            // return null; // Skip request if token is still being loaded
            //delay for 1 second before making the request
            await new Promise((resolve) => setTimeout(resolve, 500));
        }

        const url = `${API_BASE_URL}${endpoint}`;
        const headers: Record<string, string> = {
            "Content-Type": "application/json",
        };

        if (token) {
            headers["Authorization"] = `Bearer ${token}`;
        }

        try {
            const response = await fetch(url, {
                method,
                headers,
                body: data ? JSON.stringify(data) : undefined,
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.message || "Something went wrong");
            }

            return result;
        } catch (error) {
            console.error("API Error:", error);
            throw error;
        }
    };

    return {
        token,
        updateToken,
        get: (endpoint: string) => request("GET", endpoint),
        post: (endpoint: string, data: any) => request("POST", endpoint, data),
        put: (endpoint: string, data: any) => request("PUT", endpoint, data),
        delete: (endpoint: string) => request("DELETE", endpoint),
    };
};


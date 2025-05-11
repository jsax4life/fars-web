'use client'
import React, { createContext, useContext, useState, useEffect } from "react";

interface Tokens {
    accessToken: string;
    refreshToken: string;
}

interface ApiContextType {
    token: Tokens | null;
    updateToken: (newToken: Tokens | null) => void;
}

// Define API Context
const ApiContext = createContext<ApiContextType | null>(null);

// API Base URL
const API_BASE_URL = "http://fars-api-env.eba-rfmzrjse.eu-west-2.elasticbeanstalk.com";


export const ApiProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [token, setToken] = useState<Tokens | null>(null);
    const [loading, setLoading] = useState(true); // Track loading state

    // Load token from storage
    useEffect(() => {
        const storedToken = localStorage.getItem("authTokenFaRs");
        if (storedToken) {
            // Parse the token if it's in JSON format
            try {
                const parsedToken = JSON.parse(storedToken) as Tokens;
                setToken(parsedToken);
            }
            catch (error) {
                console.error("Failed to parse token from localStorage:", error);
                setToken(null); // Reset token if parsing fails
            }
        }
        setLoading(false); // Mark as loaded
    }, []);

    const updateToken = (newToken: Tokens | null) => {
        setToken(newToken);
        if (newToken) {
            // Store the token in localStorage as a string
            localStorage.setItem("authTokenFaRs", JSON.stringify(newToken));
        } else {
            localStorage.removeItem("authTokenFaRs");
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
            headers["Authorization"] = `Bearer ${token.accessToken}`;
        }

        try {
            const response = await fetch(url, {
                method,
                headers,
                body: data ? JSON.stringify(data) : undefined,
            });

            const result = await response.json();

            if (!response.ok) {
                // Handle token expiration or invalidation here
                if (response.status === 401 || response.statusText === "Unauthorized") {
                    // Optionally, you can refresh the token here or redirect to login
                    console.warn("Token expired. Please log in again.");
                    updateToken(null); // Clear token on error
                }
                throw new Error(result.message || response.statusText);
            }

            return result;
        } catch (error: any) {
            throw error;
        }
    };

    return {
        token,
        updateToken,
        get: (endpoint: string) => request("GET", endpoint),
        post: (endpoint: string, data: any) => request("POST", endpoint, data),
        patch: (endpoint: string, data: any) => request("PATCH", endpoint, data),
        put: (endpoint: string, data: any) => request("PUT", endpoint, data),
        delete: (endpoint: string) => request("DELETE", endpoint),
    };
};


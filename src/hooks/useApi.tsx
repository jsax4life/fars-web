'use client'
import React, { createContext, useContext, useState, useEffect } from "react";

interface Tokens {
    accessToken: string;
    refreshToken: string;
}

interface ApiContextType {
    token: Tokens | null;
    updateToken: (newToken: Tokens | null) => void;
    isFetching: boolean;
    incrementPending: () => void;
    decrementPending: () => void;
}

// Define API Context
const ApiContext = createContext<ApiContextType | null>(null);

// API Base URL - use environment variable or fallback to default
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "https://adegoroyefadareandco.org";


export const ApiProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [token, setToken] = useState<Tokens | null>(null);
    const [loading, setLoading] = useState(true); // Track loading state
    const [pendingRequests, setPendingRequests] = useState(0);

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

    const incrementPending = () => setPendingRequests((prev) => prev + 1);
    const decrementPending = () => setPendingRequests((prev) => Math.max(0, prev - 1));

    return (
        <ApiContext.Provider value={{ token, updateToken, isFetching: pendingRequests > 0, incrementPending, decrementPending }}>
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

    const { token, updateToken, isFetching, incrementPending, decrementPending } = context;

    const request = async (method: string, endpoint: string, data?: any) => {
        if (token === null) {
            console.warn("Token not available yet. Proceeding without.");
            // return null; // Skip request if token is still being loaded
            //delay for 1 second before making the request
            await new Promise((resolve) => setTimeout(resolve, 500));
        }

        const url = `${API_BASE_URL}${endpoint}`;
        const headers: Record<string, string> = {};

        // Only set Content-Type for non-FormData requests
        if (!(data instanceof FormData)) {
            headers["Content-Type"] = "application/json";
        }

        if (token) {
            headers["Authorization"] = `Bearer ${token.accessToken}`;
        }

        try {
            incrementPending();
            const response = await fetch(url, {
                method,
                headers,
                body: data ? (data instanceof FormData ? data : JSON.stringify(data)) : undefined,
            });

            // Check if response has content before trying to parse JSON
            const contentType = response.headers.get("content-type");
            const hasJsonContent = contentType && contentType.includes("application/json");
            const hasContent = response.status !== 204 && response.status !== 205; // 204 No Content, 205 Reset Content

            let result: any = null;
            if (hasContent) {
                try {
                    const text = await response.text();
                    if (text && text.trim().length > 0) {
                        // Try to parse as JSON if Content-Type suggests JSON, or try parsing anyway
                        if (hasJsonContent || text.trim().startsWith('{') || text.trim().startsWith('[')) {
                            result = JSON.parse(text);
                        } else {
                            // If it's not JSON, return the text as a simple object
                            result = { message: text };
                        }
                    }
                } catch (parseError) {
                    // If JSON parsing fails, result stays null
                    // This is okay - we'll handle errors based on response.ok below
                    result = null;
                }
            }

            if (!response.ok) {
                // Handle token expiration or invalidation here
                if (response.status === 401 || response.statusText === "Unauthorized") {
                    // Optionally, you can refresh the token here or redirect to login
                    console.warn("Token expired. Please log in again.");
                    updateToken(null); // Clear token on error
                    //navigate to /
                    if (token) window.location.href = "/"; // Redirect to login page
                }

                // Normalize backend error shapes into a readable message
                let errorMessage: string = response.statusText;
                try {
                    const messages: string[] = [];
                    if (result) {
                        if (typeof result.message === 'string') messages.push(result.message);
                        if (Array.isArray(result.message)) messages.push(result.message.join('\n'));
                        if (result.response) {
                            if (typeof result.response.message === 'string') messages.push(result.response.message);
                            if (Array.isArray(result.response.message)) messages.push(result.response.message.join('\n'));
                            if (typeof result.response.error === 'string') messages.push(result.response.error);
                        }
                        if (typeof result.error === 'string') messages.push(result.error);
                    }
                    const chosen = messages.find(m => m && m.trim().length > 0);
                    if (chosen) errorMessage = chosen;
                } catch (_) {
                    // fallback to statusText
                }

                const err = new Error(errorMessage) as Error & { status?: number };
                (err as any).status = response.status;
                throw err;
            }

            // For successful responses without content (like 204), return a success indicator
            if (!hasContent || !result) {
                return { success: true, message: 'Operation completed successfully' };
            }

            return result;
        } catch (error: any) {
            throw error;
        } finally {
            decrementPending();
        }
    };

    return {
        token,
        updateToken,
        isFetching,
        get: (endpoint: string) => request("GET", endpoint),
        post: (endpoint: string, data: any) => request("POST", endpoint, data),
        patch: (endpoint: string, data: any) => request("PATCH", endpoint, data),
        put: (endpoint: string, data: any) => request("PUT", endpoint, data),
        delete: (endpoint: string, data?: any) => request("DELETE", endpoint, data),
    };
};


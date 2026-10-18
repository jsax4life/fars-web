'use client'
import React, { createContext, useContext, useState, useEffect, useRef } from "react";
import { toast } from "sonner";
import { extractAuthTokens, isAccessTokenExpired } from "@/lib/authTokens";

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

const ApiContext = createContext<ApiContextType | null>(null);

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "https://fars-api-server-production.up.railway.app";

const PUBLIC_API_ENDPOINTS = [
    '/api/auth/login',
    '/api/auth/refresh',
    '/auth/sign-up',
    '/api/auth/forgot-password',
    '/api/auth/reset-password',
    '/auth/resend-otp',
    '/auth/verify-account',
];

const isPublicApiEndpoint = (endpoint: string) =>
    PUBLIC_API_ENDPOINTS.some((publicEndpoint) => endpoint.startsWith(publicEndpoint));

let refreshInFlight: Promise<Tokens | null> | null = null;

async function refreshSessionTokens(current: Tokens): Promise<Tokens | null> {
    if (refreshInFlight) return refreshInFlight;

    refreshInFlight = (async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/api/auth/refresh`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ refreshToken: current.refreshToken }),
            });
            const text = await response.text();
            if (!response.ok || !text) return null;
            const parsed = JSON.parse(text);
            return extractAuthTokens(parsed);
        } catch {
            return null;
        } finally {
            refreshInFlight = null;
        }
    })();

    return refreshInFlight;
}

function endSession(updateToken: (t: Tokens | null) => void) {
    updateToken(null);
    localStorage.removeItem('user');
    toast.error('Your session expired. Please sign in again.');
}

if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
    console.log('API Base URL:', API_BASE_URL);
}

export const ApiProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [token, setToken] = useState<Tokens | null>(null);
    const [loading, setLoading] = useState(true);
    const [pendingRequests, setPendingRequests] = useState(0);

    useEffect(() => {
        const storedToken = localStorage.getItem("authTokenFaRs");
        if (storedToken) {
            try {
                const parsedToken = JSON.parse(storedToken) as Tokens;
                setToken(parsedToken);
            } catch (error) {
                console.error("Failed to parse token from localStorage:", error);
                setToken(null);
            }
        }
        setLoading(false);
    }, []);

    const updateToken = (newToken: Tokens | null) => {
        setToken(newToken);
        if (newToken) {
            localStorage.setItem("authTokenFaRs", JSON.stringify(newToken));
        } else {
            localStorage.removeItem("authTokenFaRs");
        }
    };

    if (loading) {
        return null;
    }

    const incrementPending = () => setPendingRequests((prev) => prev + 1);
    const decrementPending = () => setPendingRequests((prev) => Math.max(0, prev - 1));

    return (
        <ApiContext.Provider value={{ token, updateToken, isFetching: pendingRequests > 0, incrementPending, decrementPending }}>
            {children}
        </ApiContext.Provider>
    );
};

export const useApi = () => {
    const context = useContext(ApiContext);
    if (!context) {
        throw new Error("useApi must be used within an ApiProvider");
    }

    const { token, updateToken, isFetching, incrementPending, decrementPending } = context;
    const tokenRef = useRef(token);
    tokenRef.current = token;

    const performRequest = async (
        method: string,
        endpoint: string,
        data: any,
        isRetry: boolean,
    ): Promise<any> => {
        const isPublicEndpoint = isPublicApiEndpoint(endpoint);

        if (!isPublicEndpoint && !tokenRef.current) {
            throw new Error('Not authenticated. Please sign in.');
        }

        const url = `${API_BASE_URL}${endpoint}`;
        const headers: Record<string, string> = {};

        if (!(data instanceof FormData)) {
            headers["Content-Type"] = "application/json";
        }

        const bearerToken = tokenRef.current;
        if (bearerToken) {
            headers["Authorization"] = `Bearer ${bearerToken.accessToken}`;
        }

        incrementPending();
        try {
            let response: Response;
            try {
                response = await fetch(url, {
                    method,
                    headers,
                    body: data ? (data instanceof FormData ? data : JSON.stringify(data)) : undefined,
                });
            } catch (networkError: unknown) {
                const networkErrorMessage =
                    networkError instanceof Error ? networkError.message : 'Network error';
                if (
                    networkErrorMessage.includes('ERR_NAME_NOT_RESOLVED') ||
                    networkErrorMessage.includes('Failed to fetch') ||
                    networkErrorMessage.includes('NetworkError')
                ) {
                    throw new Error(
                        `Cannot connect to server. Please check your internet connection and verify the API URL is correct. (${API_BASE_URL})`,
                    );
                }
                throw new Error(`Network error: ${networkErrorMessage}`);
            }

            const contentType = response.headers.get("content-type");
            const hasJsonContent = contentType && contentType.includes("application/json");
            const hasContent = response.status !== 204 && response.status !== 205;

            let result: unknown = null;
            if (hasContent) {
                try {
                    const text = await response.text();
                    if (text && text.trim().length > 0) {
                        if (hasJsonContent || text.trim().startsWith('{') || text.trim().startsWith('[')) {
                            result = JSON.parse(text);
                        } else {
                            result = { message: text };
                        }
                    }
                } catch {
                    result = null;
                }
            }

            if (!response.ok) {
                if (response.status === 401 || response.statusText === "Unauthorized") {
                    const session = tokenRef.current;
                    if (!isPublicEndpoint && session) {
                        const accessExpired = isAccessTokenExpired(session.accessToken);

                        if (!isRetry && endpoint !== '/api/auth/refresh') {
                            const refreshed = await refreshSessionTokens(session);
                            if (refreshed) {
                                updateToken(refreshed);
                                tokenRef.current = refreshed;
                                return performRequest(method, endpoint, data, true);
                            }
                        }

                        if (accessExpired || isRetry) {
                            endSession(updateToken);
                        }
                    }
                }

                let errorMessage: string = response.statusText;
                try {
                    const messages: string[] = [];
                    const resultObj = result as Record<string, unknown> | null;
                    if (resultObj) {
                        if (typeof resultObj.message === 'string') messages.push(resultObj.message);
                        if (Array.isArray(resultObj.message)) messages.push(resultObj.message.join('\n'));
                        const nested = resultObj.response as Record<string, unknown> | undefined;
                        if (nested) {
                            if (typeof nested.message === 'string') messages.push(nested.message);
                            if (Array.isArray(nested.message)) messages.push(nested.message.join('\n'));
                            if (typeof nested.error === 'string') messages.push(nested.error);
                        }
                        if (typeof resultObj.error === 'string') messages.push(resultObj.error);
                    }
                    const chosen = messages.find((m) => m && m.trim().length > 0);
                    if (chosen) errorMessage = chosen;
                } catch {
                    // fallback to statusText
                }

                const err = new Error(errorMessage) as Error & { status?: number };
                err.status = response.status;
                throw err;
            }

            if (!hasContent || !result) {
                return { success: true, message: 'Operation completed successfully' };
            }

            return result;
        } finally {
            decrementPending();
        }
    };

    const request = async (method: string, endpoint: string, data?: any) => {
        try {
            return await performRequest(method, endpoint, data, false);
        } catch (error) {
            throw error;
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

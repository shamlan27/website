"use client";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { authAPI } from "@/lib/api";

export default function AuthCallback() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handleCallback = async () => {
      try {
        // Get token and user data from URL parameters
        const token = searchParams.get('token');
        const userParam = searchParams.get('user');
        
        if (!token) {
          setError('Authentication failed: No token received');
          setTimeout(() => router.push('/login'), 3000);
          return;
        }

        let user = null;
        if (userParam) {
          try {
            user = JSON.parse(decodeURIComponent(userParam));
          } catch (e) {
            console.error('Error parsing user data:', e);
          }
        }

        // Store auth data
        const success = await authAPI.handleOAuthCallback(token, user);
        
        if (success) {
          // Redirect to dashboard after successful authentication
          setTimeout(() => router.push('/dashboard'), 1000);
        } else {
          setError('Authentication failed: Invalid token');
          setTimeout(() => router.push('/login'), 3000);
        }
      } catch (err) {
        console.error('OAuth callback error:', err);
        setError('An error occurred during authentication');
        setTimeout(() => router.push('/login'), 3000);
      }
    };

    handleCallback();
  }, [searchParams, router]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full">
        <div className="bg-white py-8 px-6 shadow-xl rounded-lg border border-gray-100 text-center">
          {error ? (
            <>
              <div className="mb-4">
                <svg className="w-16 h-16 text-red-500 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Authentication Failed</h2>
              <p className="text-red-600 mb-4">{error}</p>
              <p className="text-sm text-gray-600">Redirecting to login page...</p>
            </>
          ) : (
            <>
              <div className="mb-4">
                <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto"></div>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Completing Sign In</h2>
              <p className="text-gray-600">Please wait while we authenticate your account...</p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

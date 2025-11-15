import { LogIn } from 'lucide-react';

interface AuthRequiredModalProps {
  show: boolean;
}

export default function AuthRequiredModal({ show }: AuthRequiredModalProps) {
  if (!show) return null;

  const handleGoogleSignIn = () => {
    window.location.href = `${process.env.NEXT_PUBLIC_API_URL}/auth/google`;
  };

  const handleFacebookSignIn = () => {
    // window.location.href = `${process.env.NEXT_PUBLIC_API_URL}/auth/facebook`;
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
      <div className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl transform transition-all">
        <div className="text-center mb-6">
          <div className="w-16 h-16 rounded-full bg-[#06BBCC]/10 flex items-center justify-center mx-auto mb-4">
            <LogIn size={32} className="text-[#06BBCC]" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Authentication Required
          </h2>
          <p className="text-gray-600">
            Please sign in to access the IELTS writing test
          </p>
        </div>

        <div className="space-y-3">
          {/* Google Sign In */}
          <button
            onClick={handleGoogleSignIn}
            className="w-full flex items-center justify-center gap-3 bg-white border-2 border-gray-300 hover:border-[#06BBCC] text-gray-700 px-6 py-3 rounded-xl font-medium transition-all shadow-sm hover:shadow-md"
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path
                d="M18.7511 10.1944C18.7511 9.47495 18.6915 8.94995 18.5626 8.40552H10.1797V11.6527H15.1003C15.0011 12.4597 14.4654 13.675 13.2749 14.4916L13.2582 14.6003L15.9087 16.6126L16.0924 16.6305C17.7788 15.1041 18.7511 12.8583 18.7511 10.1944Z"
                fill="#4285F4"
              />
              <path
                d="M10.1788 18.75C12.5895 18.75 14.6133 17.9722 16.0915 16.6305L13.274 14.4916C12.5201 15.0068 11.5081 15.3666 10.1788 15.3666C7.81773 15.3666 5.81379 13.8402 5.09944 11.7305L4.99473 11.7392L2.23868 13.8295L2.20264 13.9277C3.67087 16.786 6.68674 18.75 10.1788 18.75Z"
                fill="#34A853"
              />
              <path
                d="M5.10014 11.7305C4.91087 11.1847 4.80175 10.6013 4.80175 9.99995C4.80175 9.39856 4.91087 8.81523 5.09014 8.26941L5.08514 8.15356L2.29642 6.03027L2.20264 6.07217C1.61379 7.24995 1.27881 8.58328 1.27881 9.99995C1.27881 11.4166 1.61379 12.75 2.20264 13.9277L5.10014 11.7305Z"
                fill="#FBBC05"
              />
              <path
                d="M10.1788 4.63328C11.8354 4.63328 12.9764 5.33328 13.6347 5.94439L16.1519 3.51661C14.6033 2.09995 12.5895 1.25 10.1788 1.25C6.68674 1.25 3.67087 3.21384 2.20264 6.07217L5.08981 8.26941C5.81379 6.15967 7.81773 4.63328 10.1788 4.63328Z"
                fill="#EB4335"
              />
            </svg>
            Sign in with Google
          </button>

          {/* Facebook Sign In - Disabled for now */}
          <button
            onClick={handleFacebookSignIn}
            disabled
            className="w-full flex items-center justify-center gap-3 bg-gray-100 border-2 border-gray-200 text-gray-400 px-6 py-3 rounded-xl font-medium cursor-not-allowed"
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
              <path d="M20 10c0-5.523-4.477-10-10-10S0 4.477 0 10c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V10h2.54V7.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V10h2.773l-.443 2.89h-2.33v6.988C16.343 19.128 20 14.991 20 10z" />
            </svg>
            Sign in with Facebook (Coming Soon)
          </button>
        </div>

        <p className="text-xs text-gray-500 text-center mt-6">
          By signing in, you agree to our Terms of Service and Privacy Policy
        </p>
      </div>
    </div>
  );
}

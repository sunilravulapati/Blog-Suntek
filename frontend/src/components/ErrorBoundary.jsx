import { useRouteError } from 'react-router'
import { errorClass, primaryBtn } from '../styles/common'

function ErrorBoundary() {
    const { data, status, statusText } = useRouteError()
    return (
        <div className={`${errorClass} flex flex-col items-center text-center max-w-lg mx-auto`}>
            {/* Error Icon */}
            <div className="text-6xl mb-4">☠️</div>
            {/* Status */}
            <p className="text-2xl font-bold text-[#cc2f26]">
                {status} – {statusText}
            </p>
            {/* Error Data */}
            {data && (
                <p className="mt-3 text-base font-medium text-[#6e6e73]">
                    {data}
                </p>
            )}
            {/* Friendly Message */}
            <p className="mt-5 text-sm text-[#6e6e73] leading-relaxed">
                Oops! Something went wrong. The page you’re looking for doesn’t exist or has been moved.
            </p>
            {/* Action Button */}
            <a href="/" className={`${primaryBtn} mt-6`}>
                ⬅️ Back to Homepage
            </a>
        </div>
    )
}

export default ErrorBoundary
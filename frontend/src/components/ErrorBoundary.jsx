import { useRouteError } from 'react-router'
import { errorClass } from '../styles/common'

function ErrorBoundary() {
    const { data, status, statusText } = useRouteError()
    return (
        <div className={`${errorClass} text-center`}>
            <p>☠️{status}-{statusText}</p>
            <p>{data}</p>
        </div>
    )
}

export default ErrorBoundary
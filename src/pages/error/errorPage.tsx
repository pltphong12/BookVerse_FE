import { useNavigate } from "react-router-dom";

const ErrorPage: React.FC = () => {
    const navigate = useNavigate()
    const handleOnClick = () => {
        navigate(-1)
    }
    return (
        <>
            <div className="flex items-center justify-center h-screen">
                <div className="text-center">
                    <h1 className="text-4xl font-bold">404</h1>
                    <p className="text-gray-500">Page not found</p>
                    <button onClick={handleOnClick} className="bg-blue-500 text-white px-4 py-2 rounded-md">Previous Page</button>
                </div>
            </div>

        </>
    )
}

export default ErrorPage
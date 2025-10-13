import { ArrowLeft, Home } from "lucide-react";
import { useNavigate } from "react-router-dom";

const NotFound: React.FC = () => {
    const navigate = useNavigate();

    const handleGoBack = () => {
        navigate(-1);
    };

    const handleGoHome = () => {
        navigate('/');
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-primary-50 to-primary-100 flex items-center justify-center px-4">
            <div className="max-w-2xl w-full text-center">
                {/* 404 Animation */}
                <div className="mb-8">
                    <div className="relative">
                        <div className="text-9xl font-bold text-primary-600">404</div>
                        
                    </div>
                </div>

                {/* Error Message */}
                <div className="mb-8">
                    <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
                        Trang không tồn tại
                    </h1>
                    <p className="text-xl text-gray-600 mb-2">
                        Xin lỗi, trang bạn đang tìm kiếm không tồn tại hoặc đã bị di chuyển.
                    </p>
                    <p className="text-gray-500">
                        Có thể trang này chưa được xuất bản hoặc bạn đã nhập sai địa chỉ.
                    </p>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
                    <button
                        onClick={handleGoHome}
                        className="btn btn-primary btn-lg flex items-center gap-2"
                    >
                        <Home className="w-5 h-5" />
                        Về trang chủ
                    </button>

                    <button
                        onClick={handleGoBack}
                        className="btn btn-outline btn-lg flex items-center gap-2"
                    >
                        <ArrowLeft className="w-5 h-5" />
                        Quay lại
                    </button>
                </div>


                {/* Contact Info */}
                <div className="mt-8 text-sm text-gray-500">
                    <p>
                        Nếu bạn tin rằng đây là lỗi, vui lòng{' '}
                        <a href="mailto:support@bookverse.vn" className="text-primary-600 hover:underline">
                            liên hệ với chúng tôi
                        </a>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default NotFound;
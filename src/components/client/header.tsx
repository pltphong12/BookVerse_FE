import { Menu, Search, ShoppingCart, User } from "lucide-react";
import { Link } from "react-router-dom";
import Logo from "../../assets/main_logo.png";

export const Header: React.FC = () => {
    return (
        <header className="bg-white shadow-md sticky top-0 z-50">
            <div className="bg-primary-400 text-white py-2">
                <div className="container mx-auto px-4 flex justify-between items-center text-sm">
                    <div className="flex gap-4">
                        <span>Hotline: 0767557431</span>
                        <span>Miễn phí vận chuyển đơn từ 300k</span>
                    </div>
                    <div className="flex gap-4">
                        <a href="#" className="hover:underline">Theo dõi đơn hàng</a>
                        <a href="#" className="hover:underline">Hỗ trợ</a>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 py-4">
                <div className="flex items-center justify-between gap-6">
                    <div className="flex items-center gap-4">
                        <Link to={'/'} className="flex items-center gap-4">
                            <img
                                className="w-32 h-auto object-contain"
                                src={Logo}
                                alt="BookVerse Logo"
                                style={{
                                    filter: 'brightness(0) saturate(100%) invert(39%) sepia(57%) saturate(2000%) hue-rotate(200deg) brightness(96%) contrast(94%)',
                                }}
                            />
                            <div className="flex flex-col">
                                <h1 className="text-xl font-bold text-primary-500">Vũ Trụ Sách</h1>
                                <p className="text-sm text-gray-600 italic">Tri thức mở ra thế giới</p>
                            </div>
                        </Link>
                    </div>

                    <div className="flex-1 max-w-2xl">
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="Tìm kiếm sách, tác giả, nhà xuất bản..."
                                className="w-full px-4 py-3 pr-12 border-2 border-primary-300 rounded-lg focus:outline-none focus:border-primary-500"
                            />
                            <button className="absolute right-2 top-1/2 -translate-y-1/2 bg-primary-500 text-white p-2 rounded-md hover:bg-primary-600">
                                <Search className="w-5 h-5" />
                            </button>
                        </div>
                    </div>

                    <div className="flex items-center gap-6">
                        <button className="flex flex-col items-center gap-1 hover:text-primary-500">
                            <User className="w-6 h-6" />
                            <span className="text-xs">Tài khoản</span>
                        </button>
                        <button className="flex flex-col items-center gap-1 hover:text-primary-500 relative">
                            <ShoppingCart className="w-6 h-6" />
                            <span className="text-xs">Giỏ hàng</span>
                            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                                0
                            </span>
                        </button>
                    </div>
                </div>

                <nav className="mt-4 flex items-center gap-6 text-sm border-t pt-3">
                    <button className="flex items-center gap-2 text-primary-600 font-semibold">
                        <Menu className="w-5 h-5" />
                        Danh mục
                    </button>
                    <a href="#" className="hover:text-primary-500">Sách mới</a>
                    <a href="#" className="hover:text-primary-500">Best Seller</a>
                    <a href="#" className="hover:text-primary-500">Giảm giá</a>
                    <a href="#" className="hover:text-primary-500">Văn học</a>
                    <a href="#" className="hover:text-primary-500">Kinh tế</a>
                    <a href="#" className="hover:text-primary-500">Thiếu nhi</a>
                    <a href="#" className="hover:text-primary-500">Kỹ năng</a>
                </nav>
            </div>
        </header>
    );
}
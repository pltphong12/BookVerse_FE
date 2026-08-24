import { Mail, MapPin, Phone, ArrowUpRight } from "lucide-react";
import { Link } from "react-router-dom";
import Logo from "../../assets/main_logo.png";

export const Footer: React.FC = () => {
    return (
        <footer className="bg-white border-t border-[#dff1fb] text-slate-600 mt-16 shadow-[0_-4px_20px_rgba(26,35,126,0.03)]">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 xl:px-16 py-12 lg:py-16">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-10">
                    {/* Brand column */}
                    <div className="lg:col-span-4 flex flex-col gap-4">
                        <Link to={'/'} className="flex items-center gap-3">
                            <img
                                className="w-32 h-auto object-contain"
                                src={Logo}
                                alt="BookVerse Logo"
                                style={{
                                    filter: 'brightness(0) saturate(100%) invert(13%) sepia(85%) saturate(3025%) hue-rotate(229deg) brightness(90%) contrast(105%)',
                                }}
                            />
                            <div className="flex flex-col">
                                <h2 className="text-xl font-headline font-extrabold text-[#0d1e25] leading-tight">Vũ Trụ Sách</h2>
                                <p className="text-xs text-slate-500 font-body">Tri thức mở ra thế giới</p>
                            </div>
                        </Link>
                        <p className="font-body text-sm text-slate-600 leading-relaxed max-w-sm">
                            BookVerse là không gian khám phá và kết nối sách trực tuyến hàng đầu, mang đến hàng triệu đầu sách tinh tuyển cùng trải nghiệm đọc sách tuyệt vời.
                        </p>
                        <div className="flex gap-2.5 pt-1">
                            <a
                                href="https://www.facebook.com/plthanhphong/"
                                target="_blank"
                                rel="noreferrer"
                                aria-label="Facebook"
                                className="w-10 h-10 rounded-full bg-[#e3f2fd] text-[#1a237e] hover:bg-[#1a237e] hover:text-white flex items-center justify-center transition-all duration-300 shadow-sm"
                            >
                                <svg className="w-4 h-4 fill-currentColor" viewBox="0 0 24 24">
                                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                                </svg>
                            </a>
                            <a
                                href="https://www.instagram.com/plth_phong/"
                                target="_blank"
                                rel="noreferrer"
                                aria-label="Instagram"
                                className="w-10 h-10 rounded-full bg-[#e3f2fd] text-[#1a237e] hover:bg-[#1a237e] hover:text-white flex items-center justify-center transition-all duration-300 shadow-sm"
                            >
                                <svg className="w-4 h-4 fill-currentColor" viewBox="0 0 24 24">
                                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                                </svg>
                            </a>
                            <a
                                href="https://github.com/pltphong12"
                                target="_blank"
                                rel="noreferrer"
                                aria-label="GitHub"
                                className="w-10 h-10 rounded-full bg-[#e3f2fd] text-[#1a237e] hover:bg-[#1a237e] hover:text-white flex items-center justify-center transition-all duration-300 shadow-sm"
                            >
                                <svg className="w-4 h-4 fill-currentColor" viewBox="0 0 24 24">
                                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                                </svg>
                            </a>
                        </div>
                    </div>

                    {/* Links: Dịch vụ */}
                    <div className="lg:col-span-2 sm:col-span-1">
                        <h3 className="font-headline font-bold text-[#0d1e25] text-sm uppercase tracking-wider mb-4">
                            Dịch Vụ
                        </h3>
                        <ul className="space-y-2.5 text-sm font-body">
                            <li><Link to="/products" className="hover:text-[#1a237e] transition-colors">Tất cả sản phẩm</Link></li>
                            <li><Link to="/products" className="hover:text-[#1a237e] transition-colors">Sách bán chạy</Link></li>
                            <li><Link to="/products" className="hover:text-[#1a237e] transition-colors">Khuyến mãi hot</Link></li>
                            <li><a href="#" className="hover:text-[#1a237e] transition-colors">Chính sách bảo mật</a></li>
                            <li><a href="#" className="hover:text-[#1a237e] transition-colors">Điều khoản dịch vụ</a></li>
                        </ul>
                    </div>

                    {/* Links: Hỗ trợ */}
                    <div className="lg:col-span-2 sm:col-span-1">
                        <h3 className="font-headline font-bold text-[#0d1e25] text-sm uppercase tracking-wider mb-4">
                            Hỗ Trợ
                        </h3>
                        <ul className="space-y-2.5 text-sm font-body">
                            <li><a href="#" className="hover:text-[#1a237e] transition-colors">Câu hỏi thường gặp</a></li>
                            <li><a href="#" className="hover:text-[#1a237e] transition-colors">Hướng dẫn mua hàng</a></li>
                            <li><Link to="/order-history" className="hover:text-[#1a237e] transition-colors">Theo dõi đơn hàng</Link></li>
                            <li><a href="#" className="hover:text-[#1a237e] transition-colors">Chính sách giao hàng</a></li>
                            <li><a href="#" className="hover:text-[#1a237e] transition-colors">Chính sách đổi trả</a></li>
                        </ul>
                    </div>

                    {/* Contact details */}
                    <div className="lg:col-span-4">
                        <h3 className="font-headline font-bold text-[#0d1e25] text-sm uppercase tracking-wider mb-4">
                            Thông Tin Liên Hệ
                        </h3>
                        <ul className="space-y-3 text-sm font-body">
                            <li className="flex items-start gap-3">
                                <div className="w-8 h-8 rounded-lg bg-[#e3f2fd] text-[#1a237e] flex items-center justify-center shrink-0 mt-0.5">
                                    <MapPin className="w-4 h-4" />
                                </div>
                                <span className="text-slate-600">Số 27, Đường 14C, Khu dân cư Phong Phú, Bình Chánh, TP.HCM</span>
                            </li>
                            <li className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-lg bg-[#e3f2fd] text-[#1a237e] flex items-center justify-center shrink-0">
                                    <Phone className="w-4 h-4" />
                                </div>
                                <span className="text-[#1a237e] font-semibold">0767557431</span>
                            </li>
                            <li className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-lg bg-[#e3f2fd] text-[#1a237e] flex items-center justify-center shrink-0">
                                    <Mail className="w-4 h-4" />
                                </div>
                                <span className="text-slate-600">phanlathanhphong19@gmail.com</span>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="border-t border-[#dff1fb] mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-body text-slate-500">
                    <p>© 2026 BookVerse. Bản quyền thuộc về Vũ Trụ Sách.</p>
                    <div className="flex gap-6">
                        <a href="#" className="hover:text-[#1a237e] transition-colors">Chính sách bảo mật</a>
                        <a href="#" className="hover:text-[#1a237e] transition-colors">Điều khoản sử dụng</a>
                        <a href="#" className="hover:text-[#1a237e] transition-colors flex items-center gap-0.5">
                            Trợ giúp <ArrowUpRight className="w-3 h-3" />
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    );
};
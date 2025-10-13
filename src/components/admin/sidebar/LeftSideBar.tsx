import { Book, KeyRound, LayoutDashboard, Library, TagsIcon, User, UserCog, UserPen } from 'lucide-react';
import { Link, NavLink } from 'react-router-dom';
import Logo from '../../../assets/main_logo.png';
export const LeftSidebar = () => {

    return (
        <div className="z-30 overflow-y-auto h-full [scrollbar-width:none]">
            <ul className="menu pt-2 w-60 bg-base-100 min-h-full text-base-content border-r border-gray-200 dark:border-gray-700">
                <li className="font-semibold text-xl">
                    <Link to={'/'}>
                        <img
                            className="w-auto h-auto object-contain"
                            src={Logo}
                            alt="BookVerse Logo"
                            style={{
                                filter: 'brightness(0) saturate(100%) invert(39%) sepia(57%) saturate(2000%) hue-rotate(200deg) brightness(96%) contrast(94%)',
                            }}
                        />
                    </Link>
                </li>

                <div className='divider m-0'></div>
                {/* Phần 1: Dashboard */}
                <li className="menu-title">
                    <span>Dashboard</span>
                </li>
                <li className="">
                    <NavLink
                        to={"/admin"}
                        className="mb-2 flex items-center gap-2" >
                        <LayoutDashboard />
                        Trang quản lý
                    </NavLink>
                </li>

                <div className='divider m-0'></div>

                {/* Phần 2: Account */}
                <li className="menu-title">
                    <span>Account</span>
                </li>
                <li className="">
                    <NavLink
                        to={"/admin/users"}
                        className="mb-2 flex items-center gap-2" >
                        <User />
                        Người dùng
                    </NavLink>
                    <NavLink
                        to={"/admin/roles"}
                        className="mb-2 flex items-center gap-2" >
                        <UserCog />
                        Vai trò
                    </NavLink>
                    <NavLink
                        to={"/admin/permissions"}
                        className="mb-2 flex items-center gap-2" >
                        <KeyRound />
                        Quyền hạn
                    </NavLink>
                </li>

                <div className='divider m-0'></div>

                {/* Phần 3: Nội dung */}
                <li className="menu-title">
                    <span>Content</span>
                </li>
                <li className="">
                    <NavLink
                        to={"/admin/authors"}
                        className="mb-2 flex items-center gap-2" >
                        <UserPen />
                        Tác giả
                    </NavLink>
                    <NavLink
                        to={"/admin/books"}
                        className="mb-2 flex items-center gap-2" >
                        <Book />
                        Sách
                    </NavLink>
                    <NavLink
                        to={"/admin/categories"}
                        className="mb-2 flex items-center gap-2" >
                        <TagsIcon />
                        Thể loại
                    </NavLink>
                    <NavLink
                        to={"/admin/publishers"}
                        className="mb-2 flex items-center gap-2" >
                        <Library />
                        Nhà xuất bản
                    </NavLink>
                </li>
            </ul>
        </div>
    )
}
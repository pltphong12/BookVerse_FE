// Vietnam 2-level administrative division dataset: Tỉnh/Thành phố -> Phường/Xã/Thị trấn (Không có Quận/Huyện)

export interface IProvinceData {
    name: string;
    wards: string[];
}

export const VIETNAM_PROVINCES: IProvinceData[] = [
    {
        name: 'Hồ Chí Minh',
        wards: [
            'Phường Bến Nghé', 'Phường Bến Thành', 'Phường Cầu Kho', 'Phường Cầu Ông Lãnh', 'Phường Cô Giang',
            'Phường Đa Kao', 'Phường Nguyễn Cư Trinh', 'Phường Nguyễn Thái Bình', 'Phường Phạm Ngũ Lão', 'Phường Tân Định',
            'Phường Thảo Điền', 'Phường An Phú', 'Phường An Khánh', 'Phường Bình An', 'Phường Thủ Thiêm',
            'Phường Linh Chiểu', 'Phường Linh Trung', 'Phường Linh Tây', 'Phường Hiệp Bình Chánh', 'Phường Hiệp Bình Phước',
            'Phường Tân Sơn Nhì', 'Phường Tây Thạnh', 'Phường Sơn Kỳ', 'Phường Tân Quý', 'Phường Tân Thành', 'Phường Phú Thọ Hòa',
            'Phường 1', 'Phường 2', 'Phường 3', 'Phường 4', 'Phường 5', 'Phường 6', 'Phường 7', 'Phường 8', 'Phường 9', 'Phường 10',
            'Phường 11', 'Phường 12', 'Phường 13', 'Phường 14', 'Phường 15',
            'Xã Bình Hưng', 'Xã Phong Phú', 'Xã Đa Phước', 'Xã Quy Đức', 'Xã Tân Kiên', 'Xã Tân Nhựt',
            'Xã Vĩnh Lộc A', 'Xã Vĩnh Lộc B', 'Xã Bà Điểm', 'Xã Đông Thạnh', 'Xã Xuân Thới Thượng', 'Thị trấn Hóc Môn',
            'Xã Phước Kiển', 'Xã Nhà Bè', 'Xã Hiệp Phước', 'Xã Phú Xuân', 'Thị trấn Cần Thạnh'
        ]
    },
    {
        name: 'Hà Nội',
        wards: [
            'Phường Tràng Tiền', 'Phường Hàng Bạc', 'Phường Hàng Buồm', 'Phường Hàng Đào', 'Phường Hàng Gai',
            'Phường Cửa Đông', 'Phường Cửa Nam', 'Phường Đồng Xuân', 'Phường Phan Chu Trinh', 'Phường Lý Thái Tổ',
            'Phường Dịch Vọng', 'Phường Dịch Vọng Hậu', 'Phường Mai Dịch', 'Phường Nghĩa Đô', 'Phường Nghĩa Tân',
            'Phường Quan Hoa', 'Phường Trung Hòa', 'Phường Yên Hòa',
            'Phường Bách Khoa', 'Phường Đồng Tâm', 'Phường Lê Đại Hành', 'Phường Minh Khai', 'Phường Trương Định',
            'Phường Kim Mã', 'Phường Liễu Giai', 'Phường Đội Cấn', 'Phường Cống Vị', 'Phường Ngọc Hà',
            'Phường Láng Hạ', 'Phường Láng Thượng', 'Phường Ô Chợ Dừa', 'Phường Quang Trung', 'Phường Văn Miếu',
            'Phường Mễ Trì', 'Phường Mỹ Đình 1', 'Phường Mỹ Đình 2', 'Phường Cầu Diễn', 'Phường Phú Đô',
            'Xã Tân Triều', 'Xã Thanh Liệt', 'Xã Tam Hiệp', 'Thị trấn Văn Điển', 'Xã An Khánh', 'Xã Kim Chung'
        ]
    },
    {
        name: 'Đà Nẵng',
        wards: [
            'Phường Hải Châu I', 'Phường Hải Châu II', 'Phường Thạch Thang', 'Phường Thanh Bình', 'Phường Thuận Phước',
            'Phường Hòa Cường Bắc', 'Phường Hòa Cường Nam', 'Phường Bình Thuận', 'Phường Bình Hiên', 'Phường Nam Dương',
            'Phường An Hải Bắc', 'Phường An Hải Đông', 'Phường An Hải Tây', 'Phường Phước Mỹ', 'Phường Mân Thái',
            'Phường Khuê Mỹ', 'Phường Mỹ An', 'Phường Hòa Minh', 'Phường Hòa Khánh Bắc', 'Phường Hòa Khánh Nam',
            'Xã Hòa Châu', 'Xã Hòa Tiến', 'Xã Hòa Phong', 'Xã Hòa Nhơn'
        ]
    },
    {
        name: 'Hải Phòng',
        wards: [
            'Phường Hoàng Văn Thụ', 'Phường Minh Khai', 'Phường Phan Bội Châu', 'Phường Quang Trung',
            'Phường Cầu Đất', 'Phường Đằng Giang', 'Phường Lạch Tray', 'Phường Đông Khê',
            'Phường Đằng Hải', 'Phường Nam Hải', 'Phường Tràng Cát', 'Phường Quán Toan',
            'Thị trấn An Dương', 'Thị trấn Núi Đèo', 'Thị trấn Cát Bà', 'Xã Tân Dương'
        ]
    },
    {
        name: 'Cần Thơ',
        wards: [
            'Phường Tân An', 'Phường An Cư', 'Phường An Nghiệp', 'Phường An Phú', 'Phường Xuân Khánh',
            'Phường Hưng Lợi', 'Phường An Khánh', 'Phường An Bình', 'Phường Cái Khế', 'Phường Thới Bình',
            'Phường Hưng Phú', 'Phường Hưng Thạnh', 'Phường Phú Thứ', 'Phường Tân Phú', 'Phường Trà Nóc',
            'Phường Bình Thủy', 'Phường Long Hòa', 'Phường Long Tuyền', 'Phường Châu Văn Liêm'
        ]
    },
    {
        name: 'An Giang',
        wards: ['Phường Mỹ Bình', 'Phường Mỹ Long', 'Phường Mỹ Xuyên', 'Phường Bình Đức', 'Phường Châu Phú A', 'Phường Châu Phú B', 'Thị trấn Núi Sập', 'Thị trấn Chợ Mới']
    },
    {
        name: 'Bà Rịa - Vũng Tàu',
        wards: ['Phường 1', 'Phường 2', 'Phường 3', 'Phường 4', 'Phường 5', 'Phường 7', 'Phường 8', 'Phường 9', 'Phường Thắng Nhất', 'Phường Thắng Nhì', 'Phường Phước Trung', 'Phường Kim Dinh', 'Thị trấn Long Hải']
    },
    {
        name: 'Bắc Giang',
        wards: ['Phường Trần Phú', 'Phường Ngô Quyền', 'Phường Lê Lợi', 'Phường Hoàng Văn Thụ', 'Phường Dĩnh Kế', 'Phường Đa Mai', 'Thị trấn Bích Động', 'Thị trấn Vôi']
    },
    {
        name: 'Bắc Kạn',
        wards: ['Phường Đức Xuân', 'Phường Sông Cầu', 'Phường Phùng Chí Kiên', 'Phường Huyền Tụng', 'Thị trấn Chợ Rã', 'Thị trấn Đồng Tâm']
    },
    {
        name: 'Bạc Liêu',
        wards: ['Phường 1', 'Phường 2', 'Phường 3', 'Phường 5', 'Phường 7', 'Phường 8', 'Phường Nhà Mát', 'Thị trấn Hòa Bình', 'Thị trấn Gành Hào']
    },
    {
        name: 'Bắc Ninh',
        wards: ['Phường Suối Hoa', 'Phường Tiền An', 'Phường Ninh Xá', 'Phường Vệ An', 'Phường Đại Phúc', 'Phường Võ Cường', 'Phường Đông Ngàn', 'Thị trấn Chờ']
    },
    {
        name: 'Bến Tre',
        wards: ['Phường An Hội', 'Phường Phú Khương', 'Phường Phú Tân', 'Phường 6', 'Phường 7', 'Phường 8', 'Thị trấn Ba Tri', 'Thị trấn Bình Đại', 'Thị trấn Mỏ Cày']
    },
    {
        name: 'Bình Định',
        wards: ['Phường Lê Lợi', 'Phường Trần Hưng Đạo', 'Phường Ngô Mây', 'Phường Nguyễn Văn Cừ', 'Phường Ghềnh Ráng', 'Phường Đống Đa', 'Thị trấn Phú Phong', 'Phường Tam Quan']
    },
    {
        name: 'Bình Dương',
        wards: ['Phường Phú Cường', 'Phường Phú Hòa', 'Phường Phú Lợi', 'Phường Hiệp Thành', 'Phường Chánh Nghĩa', 'Phường Dĩ An', 'Phường An Bình', 'Phường Lái Thiêu', 'Phường Thuận Giao', 'Phường Mỹ Phước', 'Thị trấn Dầu Tiếng']
    },
    {
        name: 'Bình Phước',
        wards: ['Phường Tân Phú', 'Phường Tân Đồng', 'Phường Tân Bình', 'Phường Tân Xuân', 'Phường Long Thủy', 'Phường Phước Bình', 'Thị trấn Chơn Thành', 'Thị trấn Lộc Ninh']
    },
    {
        name: 'Bình Thuận',
        wards: ['Phường Phú Thủy', 'Phường Đức Nghĩa', 'Phường Đức Thắng', 'Phường Hàm Tiến', 'Phường Mũi Né', 'Phường Xuân An', 'Thị trấn Phan Rí Cửa', 'Thị trấn Liên Hương']
    },
    {
        name: 'Cà Mau',
        wards: ['Phường 1', 'Phường 2', 'Phường 4', 'Phường 5', 'Phường 6', 'Phường 7', 'Phường 8', 'Phường 9', 'Phường Tân Xuyên', 'Thị trấn Năm Căn', 'Thị trấn Sông Đốc']
    },
    {
        name: 'Cao Bằng',
        wards: ['Phường Hợp Giang', 'Phường Sông Bằng', 'Phường Tân Giang', 'Phường Sông Hiến', 'Phường Đề Thám', 'Thị trấn Nước Hai', 'Thị trấn Trùng Khánh']
    },
    {
        name: 'Đắk Lắk',
        wards: ['Phường Thắng Lợi', 'Phường Tân Lợi', 'Phường Tự An', 'Phường Tân An', 'Phường Ea Tam', 'Phường Khánh Xuân', 'Thị trấn Quảng Phú', 'Thị trấn Buôn Trấp']
    },
    {
        name: 'Đắk Nông',
        wards: ['Phường Nghĩa Đức', 'Phường Nghĩa Thành', 'Phường Nghĩa Phú', 'Phường Nghĩa Tân', 'Phường Nghĩa Trung', 'Thị trấn Gia Nghĩa', 'Thị trấn Đắk Mil']
    },
    {
        name: 'Điện Biên',
        wards: ['Phường Mường Thanh', 'Phường Tân Thanh', 'Phường Thanh Bình', 'Phường Nam Thanh', 'Phường Noong Bua', 'Thị trấn Mường Ảng', 'Thị trấn Tuần Giáo']
    },
    {
        name: 'Đồng Nai',
        wards: ['Phường Quyết Thắng', 'Phường Trung Dũng', 'Phường Thống Nhất', 'Phường Tân Phong', 'Phường Trảng Dài', 'Phường Long Bình', 'Phường Hóa An', 'Phường Bảo Vinh', 'Phường Xuân An', 'Thị trấn Long Thành', 'Thị trấn Trảng Bom']
    },
    {
        name: 'Đồng Tháp',
        wards: ['Phường 1', 'Phường 2', 'Phường 3', 'Phường 4', 'Phường Hòa Thuận', 'Phường Mỹ Phú', 'Phường An Hòa', 'Phường Sa Đéc', 'Thị trấn Mỹ An']
    },
    {
        name: 'Gia Lai',
        wards: ['Phường Tây Sơn', 'Phường Hoa Lư', 'Phường Hội Thương', 'Phường Diên Hồng', 'Phường Phù Đổng', 'Phường Yên Đỗ', 'Thị trấn Chư Sê', 'Thị trấn Đắk Đoa']
    },
    {
        name: 'Hà Giang',
        wards: ['Phường Trần Phú', 'Phường Minh Khai', 'Phường Nguyễn Trãi', 'Phường Quang Trung', 'Phường Ngọc Hà', 'Thị trấn Đồng Văn', 'Thị trấn Mèo Vạc']
    },
    {
        name: 'Hà Nam',
        wards: ['Phường Quang Trung', 'Phường Minh Khai', 'Phường Hai Bà Trưng', 'Phường Trần Hưng Đạo', 'Phường Lê Hồng Phong', 'Thị trấn Đồng Văn', 'Thị trấn Hòa Mạc']
    },
    {
        name: 'Hà Tĩnh',
        wards: ['Phường Bắc Hà', 'Phường Nam Hà', 'Phường Tân Giang', 'Phường Trần Phú', 'Phường Hà Huy Tập', 'Phường Sông Trí', 'Thị trấn Hương Khê', 'Thị trấn Cẩm Xuyên']
    },
    {
        name: 'Hải Dương',
        wards: ['Phường Lê Thanh Nghị', 'Phường Trần Phú', 'Phường Quang Trung', 'Phường Nguyễn Trãi', 'Phường Hải Tân', 'Phường Tứ Minh', 'Phường Sao Đỏ', 'Thị trấn Kẻ Sặt']
    },
    {
        name: 'Hậu Giang',
        wards: ['Phường 1', 'Phường 3', 'Phường 4', 'Phường 5', 'Phường 7', 'Phường Thuận An', 'Phường Lái Hiếu', 'Thị trấn Một Ngàn', 'Thị trấn Nàng Mau']
    },
    {
        name: 'Hòa Bình',
        wards: ['Phường Phương Lâm', 'Phường Đồng Tiến', 'Phường Chăm Mát', 'Phường Tân Thịnh', 'Phường Hữu Nghị', 'Thị trấn Lương Sơn', 'Thị trấn Mai Châu']
    },
    {
        name: 'Hưng Yên',
        wards: ['Phường Lê Lợi', 'Phường Quang Trung', 'Phường Minh Khai', 'Phường Hiến Nam', 'Phường Lam Sơn', 'Phường Bần Yên Nhân', 'Thị trấn Khoái Châu', 'Thị trấn Như Quỳnh']
    },
    {
        name: 'Khánh Hòa',
        wards: ['Phường Lộc Thọ', 'Phường Phước Hải', 'Phường Vĩnh Hải', 'Phường Vĩnh Phước', 'Phường Tân Lập', 'Phường Phương Sài', 'Phường Cam Ranh', 'Phường Ninh Hòa', 'Thị trấn Diên Khánh']
    },
    {
        name: 'Kiên Giang',
        wards: ['Phường Vĩnh Thanh', 'Phường Vĩnh Lạc', 'Phường Rạch Sỏi', 'Phường Vĩnh Quang', 'Phường Dương Đông', 'Phường An Thới', 'Phường Pháo Đài', 'Thị trấn Kiên Lương']
    },
    {
        name: 'Kon Tum',
        wards: ['Phường Quyết Thắng', 'Phường Thắng Lợi', 'Phường Quang Trung', 'Phường Duy Tân', 'Phường Trần Hưng Đạo', 'Thị trấn Đắk Hà', 'Thị trấn Măng Đen']
    },
    {
        name: 'Lai Châu',
        wards: ['Phường Quyết Thắng', 'Phường Đoàn Kết', 'Phường Tân Phong', 'Phường Đông Phong', 'Thị trấn Tam Đường', 'Thị trấn Phong Thổ']
    },
    {
        name: 'Lâm Đồng',
        wards: ['Phường 1', 'Phường 2', 'Phường 3', 'Phường 4', 'Phường 5', 'Phường 6', 'Phường 8', 'Phường 9', 'Phường 10', 'Phường B’Lao', 'Phường Lộc Sơn', 'Thị trấn Liên Nghĩa', 'Thị trấn Đơn Dương']
    },
    {
        name: 'Lạng Sơn',
        wards: ['Phường Hoàng Văn Thụ', 'Phường Tam Thanh', 'Phường Vĩnh Trại', 'Phường Đông Kinh', 'Phường Chi Lăng', 'Thị trấn Đồng Đăng', 'Thị trấn Hữu Lũng']
    },
    {
        name: 'Lào Cai',
        wards: ['Phường Kim Tân', 'Phường Bắc Cường', 'Phường Cốc Lếu', 'Phường Duyên Hải', 'Phường Sa Pa', 'Phường Cầu Mây', 'Thị trấn Bát Xát', 'Thị trấn Phố Lu']
    },
    {
        name: 'Long An',
        wards: ['Phường 1', 'Phường 2', 'Phường 3', 'Phường 4', 'Phường 5', 'Phường 6', 'Phường 7', 'Phường Tân Khánh', 'Thị trấn Bến Lức', 'Thị trấn Cần Giuộc', 'Thị trấn Hậu Nghĩa']
    },
    {
        name: 'Nam Định',
        wards: ['Phường Vị Hoàng', 'Phường Phan Đình Phùng', 'Phường Trần Hưng Đạo', 'Phường Lộc Vượng', 'Phường Cửa Bắc', 'Thị trấn Cổ Lễ', 'Thị trấn Ngô Đồng']
    },
    {
        name: 'Nghệ An',
        wards: ['Phường Quang Trung', 'Phường Lê Mao', 'Phường Trường Thi', 'Phường Hưng Dũng', 'Phường Bến Thủy', 'Phường Cửa Lò', 'Phường Thái Hòa', 'Thị trấn Diễn Châu', 'Thị trấn Đô Lương']
    },
    {
        name: 'Ninh Bình',
        wards: ['Phường Vân Giang', 'Phường Phúc Thành', 'Phường Nam Thành', 'Phường Tân Thành', 'Phường Bích Đào', 'Phường Bắc Sơn', 'Phường Nam Sơn', 'Thị trấn Phát Diệm']
    },
    {
        name: 'Ninh Thuận',
        wards: ['Phường Kinh Dinh', 'Phường Thanh Sơn', 'Phường Phủ Hà', 'Phường Mỹ Hương', 'Phường Đô Vinh', 'Thị trấn Phước Dân', 'Thị trấn Khánh Hải']
    },
    {
        name: 'Phú Thọ',
        wards: ['Phường Gia Cẩm', 'Phường Tiên Cát', 'Phường Nông Trang', 'Phường Tân Dân', 'Phường Âu Cơ', 'Phường Hùng Vương', 'Thị trấn Phong Châu', 'Thị trấn Đoan Hùng']
    },
    {
        name: 'Phú Yên',
        wards: ['Phường 1', 'Phường 2', 'Phường 3', 'Phường 4', 'Phường 5', 'Phường 7', 'Phường 9', 'Phường Xuân Phú', 'Thị trấn Chí Thạnh', 'Thị trấn Hai Riêng']
    },
    {
        name: 'Quảng Bình',
        wards: ['Phường Đồng Mỹ', 'Phường Hải Đình', 'Phường Bắc Lý', 'Phường Nam Lý', 'Phường Đồng Phú', 'Phường Ba Đồn', 'Thị trấn Hoàn Lão', 'Thị trấn Quán Hàu']
    },
    {
        name: 'Quảng Nam',
        wards: ['Phường An Mỹ', 'Phường Tân Thạnh', 'Phường Phước Hòa', 'Phường An Sơn', 'Phường Minh An', 'Phường Cẩm Phô', 'Phường Cẩm Châu', 'Thị trấn Hà Lam', 'Thị trấn Núi Thành']
    },
    {
        name: 'Quảng Ngãi',
        wards: ['Phường Trần Hưng Đạo', 'Phường Lê Hồng Phong', 'Phường Nguyễn Nghiêm', 'Phường Quảng Phú', 'Phường Trương Quang Trọng', 'Thị trấn Chợ Chùa', 'Thị trấn La Hà']
    },
    {
        name: 'Quảng Ninh',
        wards: ['Phường Bạch Đằng', 'Phường Hồng Gai', 'Phường Bãi Cháy', 'Phường Hòn Gai', 'Phường Cẩm Phả', 'Phường Uông Bí', 'Phường Móng Cái', 'Thị trấn Tiên Yên', 'Thị trấn Cái Rồng']
    },
    {
        name: 'Quảng Trị',
        wards: ['Phường 1', 'Phường 2', 'Phường 3', 'Phường 5', 'Phường Đông Lễ', 'Phường Đông Lương', 'Phường An Đôn', 'Thị trấn Gio Linh', 'Thị trấn Cam Lộ']
    },
    {
        name: 'Sóc Trăng',
        wards: ['Phường 1', 'Phường 2', 'Phường 3', 'Phường 4', 'Phường 6', 'Phường 8', 'Phường 10', 'Thị trấn Mỹ Xuyên', 'Thị trấn Kế Sách']
    },
    {
        name: 'Sơn La',
        wards: ['Phường Quyết Thắng', 'Phường Tô Hiệu', 'Phường Chiềng Lề', 'Phường Chiềng Cơi', 'Phường Chiềng Sinh', 'Thị trấn Mộc Châu', 'Thị trấn Hát Lót']
    },
    {
        name: 'Tây Ninh',
        wards: ['Phường 1', 'Phường 2', 'Phường 3', 'Phường Ninh Sơn', 'Phường Ninh Thạnh', 'Phường Trảng Bàng', 'Phường Hòa Thành', 'Thị trấn Gò Dầu', 'Thị trấn Tân Biên']
    },
    {
        name: 'Thái Bình',
        wards: ['Phường Lê Hồng Phong', 'Phường Bồ Xuyên', 'Phường Đề Thám', 'Phường Kỳ Bá', 'Phường Trần Hưng Đạo', 'Thị trấn Diêm Điền', 'Thị trấn Quỳnh Côi']
    },
    {
        name: 'Thái Nguyên',
        wards: ['Phường Phan Đình Phùng', 'Phường Hoàng Văn Thụ', 'Phường Trưng Vương', 'Phường Quang Trung', 'Phường Tích Lương', 'Phường Sông Công', 'Thị trấn Chùa Hang', 'Thị trấn Hương Sơn']
    },
    {
        name: 'Thanh Hóa',
        wards: ['Phường Điện Biên', 'Phường Ba Đình', 'Phường Lam Sơn', 'Phường Ngọc Trạo', 'Phường Đông Thọ', 'Phường Sầm Sơn', 'Phường Bỉm Sơn', 'Thị trấn Hậu Lộc', 'Thị trấn Quảng Xương']
    },
    {
        name: 'Thừa Thiên Huế',
        wards: ['Phường Phú Nhuận', 'Phường Vĩnh Ninh', 'Phường Thuận Thành', 'Phường Tây Lộc', 'Phường Hương Sơ', 'Phường An Đông', 'Phường Thủy Dương', 'Thị trấn Thuận An']
    },
    {
        name: 'Tiền Giang',
        wards: ['Phường 1', 'Phường 2', 'Phường 4', 'Phường 5', 'Phường 7', 'Phường 10', 'Phường Gò Công', 'Thị trấn Cái Bè', 'Thị trấn Chợ Gạo']
    },
    {
        name: 'Trà Vinh',
        wards: ['Phường 1', 'Phường 2', 'Phường 3', 'Phường 5', 'Phường 7', 'Phường 9', 'Thị trấn Càng Long', 'Thị trấn Tiểu Cần', 'Thị trấn Duyên Hải']
    },
    {
        name: 'Tuyên Quang',
        wards: ['Phường Tân Quang', 'Phường Phan Thiết', 'Phường Minh Xuân', 'Phường Nông Tiến', 'Phường Ỷ La', 'Thị trấn Sơn Dương', 'Thị trấn Na Hang']
    },
    {
        name: 'Vĩnh Long',
        wards: ['Phường 1', 'Phường 2', 'Phường 3', 'Phường 4', 'Phường 8', 'Phường 9', 'Phường Bình Minh', 'Xã Song Phú', 'Thị trấn Tam Bình', 'Thị trấn Vũng Liêm']
    },
    {
        name: 'Vĩnh Phúc',
        wards: ['Phường Ngô Quyền', 'Phường Liên Bảo', 'Phường Tích Sơn', 'Phường Đống Đa', 'Phường Phúc Yên', 'Thị trấn Hương Canh', 'Thị trấn Yên Lạc']
    },
    {
        name: 'Yên Bái',
        wards: ['Phường Yên Thịnh', 'Phường Đồng Tâm', 'Phường Nguyễn Thái Học', 'Phường Hồng Hà', 'Phường Nghĩa Lộ', 'Thị trấn Yên Bình', 'Thị trấn Mậu A']
    }
];

export const getWardsByProvince = (provinceName: string): string[] => {
    const province = VIETNAM_PROVINCES.find(
        (p) => p.name.toLowerCase().trim() === provinceName.toLowerCase().trim()
    );
    return province ? province.wards : [];
};

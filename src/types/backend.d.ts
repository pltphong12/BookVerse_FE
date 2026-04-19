// types/api.ts
export interface IBackendRes<T> {
    error?: string | string[];
    message?: string;
    status: number | string;
    data?: T;
}

export interface IMeta {
    page: number;
    pageSize: number;
    pages: number;
    total: number;
}

export interface IPagination<T> {
    result: T[];
    meta: IMeta;
}

export interface ILoginRes {
    user?: IUser
    accessToken: string;
}

export interface ICustomer{
    id: number;
    identityCard: string;
    totalOrder: number;
    totalSpending: number;
    customerLevel: string;
    user: IUser;
    createdAt?: string;
    updatedAt?: string;
    createdBy?: string;
    updatedBy?: string;
}

export interface IUser{
    id: number;
    fullName: string;
    email: string;
    address: string;
    phone: string;
    avatar: string;
    role: IRole
    createdAt?: string;
    updatedAt?: string;
    createdBy?: string;
    updatedBy?: string;
}

export interface IRole{
    id: number;
    name: string;
    description: string;
    permissions: IPermission[];
    createdAt?: string;
    updatedAt?: string;
    createdBy?: string;
    updatedBy?: string;
}

export interface IPermission {
    id: number;
    name: string;
    domain: string;
    apiPath: string;
    method: string;
    roles?: IRole[];
    createdAt?: string;
    updatedAt?: string;
    createdBy?: string;
    updatedBy?: string;
}

// interface in book
export interface IAuthorInBook {
    id: number;
    name: string;
    birthday: string;
    nationality: string;
    createdAt?: string;
    updatedAt?: string;
    createdBy?: string;
    updatedBy?: string;
}
// interface in book
export interface ICategoryInBook {
    id: number;
    name: string;
    description: string;
    createdAt?: string;
    updatedAt?: string;
    createdBy?: string;
    updatedBy?: string;
}

export interface IBookImage {
    id: number;
    relativePath: string;
    sortOrder: number;
    primary: boolean;
}

export interface IBook {
    id: number;
    title: string;
    publisher: IPublisher;
    supplier: ISupplier | null;
    price: number;
    quantity: number;
    sold: number;
    discount: number;
    publishYear: number;
    weight: number;
    dimensions: string | null;
    numberOfPages: number;
    coverFormat: string;
    description: string;
    image: string;
    images: IBookImage[];
    authors: IAuthorInBook[];
    category: ICategoryInBook;
    createdAt?: string;
    updatedAt?: string;
    createdBy?: string;
    updatedBy?: string;
}

// interface in Author
export interface IBookInAuthor {
    id: number;
    title: string;
    publisher: string;
    price: number;
    quantity: number;
    description: string;
    image: string | null;
    category?: string;
}

export interface IAuthor {
    id: number;
    name: string;
    birthday: string;
    nationality: string;
    avatar: string;
    books: IBook[];
    createdAt?: string;
    updatedAt?: string;
    createdBy?: string;
    updatedBy?: string;
}

export interface IPublisher {
    id: number;
    name: string;
    address: string
    phone: string
    email: string
    description: string
    image: string
    createdAt?: string;
    updatedAt?: string;
    createdBy?: string;
    updatedBy?: string;
}

export interface ISupplier {
    id: number;
    name: string;
    address: string
    phone: string
    email: string
    description: string
    image: string
    createdAt?: string;
    updatedAt?: string;
    createdBy?: string;
    updatedBy?: string;
}

export interface IBookFilterCriteria {
    title?: string;
    categoryId?: number[];
    publisherId?: number[];
    publishYear?: number[];
    coverFormat?: string[];
    minPrice?: number;
    maxPrice?: number;
    sortType?: string;
}

export interface IFile {
    fileName: string;
    uploadTime: string;
}

export interface ICartBookInfo {
    id: number;
    title: string;
    authors: IAuthorInBook[];
    publisher: string;
    price: number;
    discount: number;
    quantity: number;
    description: string;
    image: string;
}

export interface ICartDetail {
    id: number;
    price: number;
    quantity: number;
    book: ICartBookInfo;
}

export interface ICart {
    id: number;
    sum: number;
    cartDetails: ICartDetail[];
    createdAt?: string;
    updatedAt?: string;
    createdBy?: string;
    updatedBy?: string;
}

export interface ICategory {
    id: number;
    name: string;
    description: string;
    infoBookInCategory: IBookInAuthor[];
    createdAt?: string;
    updatedAt?: string;
    createdBy?: string;
    updatedBy?: string;

}

export interface IOrderBookInfo {
    id: number;
    title: string;
    authors: IAuthorInBook[];
    publisher: string;
    price: number;
    quantity: number;
    description: string;
    image: string;
}

export interface IOrderDetail {
    id: number;
    price: number;
    quantity: number;
    book: IOrderBookInfo;
}

export interface IOrder {
    id: number;
    orderCode: string;
    totalPrice: number;
    subtotal: number;
    shippingFee?: number;
    discountTotal?: number;
    receiverName: string;
    receiverAddress?: string;
    receiverPhone: string;
    receiverEmail?: string;
    status: string;
    paymentMethod: string;
    paymentStatus: string;
    paidAt?: string | null;
    customerId: number;
    paymentUrl?: string | null;
    orderDetails?: IOrderDetail[];
    createdAt?: string;
    updatedAt?: string;
    createdBy?: string;
    updatedBy?: string;
}

export interface IReqOrderLine {
    bookId: number;
    quantity: number;
}

export interface ICreateOrderReq {
    receiverName: string;
    receiverAddress: string;
    receiverPhone: string;
    receiverEmail?: string;
    paymentMethod: 'COD' | 'VNPAY';
    items: IReqOrderLine[];
    note?: string;
}

export interface ICreateOrderRes extends IOrder {
    paymentUrl?: string;
}
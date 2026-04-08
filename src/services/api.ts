import { ILoginRes, IAuthor, IAuthorInBook, IBackendRes, IBook, IBookFilterCriteria, ICart, ICategory, ICategoryInBook, ICreateOrderReq, ICreateOrderRes, IFile, IPagination, IPermission, IPublisher, IRole, IUser, ISupplier, ICustomer, IOrder } from "../types/backend";
import axiosInstance from "./axios-customize";


/**
 * 
Module Auth
 */

export const callLoginApi = (email: string, password: string) => {
    const url: string = 'api/v1/auth/login'
    const data = { email: email, password: password }
    return axiosInstance.post<IBackendRes<ILoginRes>>(url, data)
}

export const callRegisterApi = (email: string, password: string, fullName: string, address: string, phone: string) => {
    const url: string = 'api/v1/auth/register'
    const data = {
        email: email,
        password: password,
        fullName: fullName,
        address: address,
        phone: phone
    }
    return axiosInstance.post<IBackendRes<IUser>>(url, data)
}

export const callRefreshTokenApi = () => {
    const url: string = 'api/v1/auth/refresh'
    return axiosInstance.get<IBackendRes<ILoginRes>>(url)
}

export const callGetAccountApi = () => {
    const url: string = 'api/v1/auth/account'
    return axiosInstance.get<IBackendRes<IUser>>(url)
}

export const callLogoutApi = () => {
    const url: string = 'api/v1/auth/logout'
    return axiosInstance.post<IBackendRes<null>>(url)
}

/**
 * 
Module Customers
 */

export const callFetchAllCustomersWithPaginationAndFilterApi = (identityCard: string, customerLevel: string, dateFrom: string, page: number, size: number) => {
    const url = `api/v1/customers/search?identityCard=${identityCard}&customerLevel=${customerLevel}&dateFrom=${dateFrom}&page=${page}&size=${size}`
    return axiosInstance.get<IBackendRes<IPagination<ICustomer>>>(url)
}

export const callCreateCustomerApi = (identityCard: string, password: string, fullName: string, email: string, address: string, phone: string, avatar: string, customerLevel: string) => {
    const url = "/api/v1/customers";
    const data = {
        identityCard: identityCard,
        password: password,
        fullName: fullName,
        email: email,
        address: address,
        phone: phone,
        avatar: avatar,
        customerLevel: customerLevel
    }
    return axiosInstance.post<IBackendRes<ICustomer>>(url, data)
}

export const callUpdateCustomerApi = (id: number, identityCard: string, fullName: string, email: string, address: string, phone: string, avatar: string, customerLevel: string) => {
    const url = "/api/v1/customers";
    const data = {
        id: id,
        identityCard: identityCard,
        password: null,
        fullName: fullName,
        email: email,
        address: address,
        phone: phone,
        avatar: avatar,
        customerLevel: customerLevel
    }
    return axiosInstance.put<IBackendRes<ICustomer>>(url, data)
}

export const callFetchCustomerByIdApi = (id: number) => {
    const url = `api/v1/customers/${id}`;
    return axiosInstance.get<IBackendRes<ICustomer>>(url)
}

export const callDeleteCustomerApi = (id: number) => {
    const url = `api/v1/customers/${id}`;
    return axiosInstance.delete<IBackendRes<ICustomer>>(url)
}

/**
 * 
Module Users
 */

export const callFetchAllUserWithPaginationApi = (email: string, roleId: number, dateFrom: string, page: number, size: number) => {
    const url: string = `api/v1/users/search?page=${page}&size=${size}&email=${email}&roleId=${roleId}&dateFrom=${dateFrom}`
    return axiosInstance.get<IBackendRes<IPagination<IUser>>>(url)
}

export const callCreateUserApi = (password: string, fullName: string, email: string, address: string, phone: string, role: number, avatar: string) => {
    const url = "/api/v1/users";

    const data = {
        password: password,
        fullName: fullName,
        email: email,
        address: address,
        phone: phone,
        role: {
            id: role,
        },
        avatar: avatar
    };

    return axiosInstance.post<IBackendRes<IUser>>(url, data);
};

export const callUpdateUserApi = (
    id: number,
    fullName: string,
    email: string,
    address: string,
    phone: string,
    role: number,
    avatar: string
) => {
    const url = "api/v1/users";

    const data = {
        id: id,
        password: null,
        fullName: fullName,
        email: email,
        address: address,
        phone: phone,
        role: {
            id: role,
        },
        avatar: avatar
    };

    const res = axiosInstance.put(url, data);
    return res;
};

export const callDeleteUserApi = (id: number) => {
    const url = `api/v1/users/${id}`;
    const res = axiosInstance.delete(url);
    return res;
};


/**
 * 
Module Roles
 */

export const callFetchAllRole = () => {
    const url: string = 'api/v1/roles'
    return axiosInstance.get<IBackendRes<IRole[]>>(url)
}

export const callFetchAllRolesWithPaginationAndFilterApi = (name: string, dateFrom: string, page: number, size: number) => {
    const url = `api/v1/roles/search?name=${name}&dateFrom=${dateFrom}&page=${page}&size=${size}`
    return axiosInstance.get<IBackendRes<IPagination<IRole>>>(url)
}

export const callCreateRolesApi = (name: string, description: string, permissions: IPermission[]) => {
    const url = '/api/v1/roles'
    const data = {
        name: name,
        description: description,
        permissions: permissions
    }
    return axiosInstance.post<IBackendRes<IRole>>(url, data)
}

export const callUpdateRolesApi = (id: number, name: string, description: string, permissions: IPermission[]) => {
    const url = '/api/v1/roles'
    const data = {
        id: id,
        name: name,
        description: description,
        permissions: permissions
    }
    return axiosInstance.put<IBackendRes<IRole>>(url, data)
}

export const callDeleteRolesApi = (id: number) => {
    const url = `api/v1/roles/${id}`
    return axiosInstance.delete<IBackendRes<IRole>>(url)
}

/**
 * 
Module Permissions
 */

export const callFetchAllPermissionsApi = () => {
    const url = 'api/v1/permissions'
    return axiosInstance.get<IBackendRes<IPermission[]>>(url)
}

export const callFetchAllPermissionsWithPaginationAndFilterApi = (name: string, method: string, domain: string, dateFrom: string, page: number, size: number) => {
    const url = `api/v1/permissions/search?name=${name}&method=${method}&domain=${domain}&dateFrom=${dateFrom}&page=${page}&size=${size}`
    return axiosInstance.get<IBackendRes<IPagination<IPermission>>>(url)
}

export const callCreatePermissionApi = (name: string, apiPath: string, domain: string, method: string) => {
    const url = '/api/v1/permissions'
    const data = {
        name: name,
        apiPath: apiPath,
        domain: domain,
        method: method
    }
    return axiosInstance.post<IBackendRes<IPermission>>(url, data)
}

export const callUpdatePermissionApi = (id: number, name: string, apiPath: string, domain: string, method: string) => {
    const url = '/api/v1/permissions'
    const data = {
        id: id,
        name: name,
        apiPath: apiPath,
        domain: domain,
        method: method
    }
    return axiosInstance.put<IBackendRes<IPermission>>(url, data)
}

export const callDeletePermissionApi = (id: number) => {
    const url = `api/v1/permissions/${id}`
    return axiosInstance.delete<IBackendRes<IPermission>>(url)
}
/**
 * 
Module Books
 */

export const callFetchAllBooksWithPaginationApi = (title: string, publisherId: number, authorId: number, categoryId: number, dateFrom: string, page: number, size: number) => {
    const url: string = `api/v1/books/search?title=${title}&publisherId=${publisherId}&authorId=${authorId}&categoryId=${categoryId}&dateFrom=${dateFrom}&page=${page}&size=${size}`
    return axiosInstance.get<IBackendRes<IPagination<IBook>>>(url)
}

export const callFetchAllProductsWithPaginationAndFilterApi = (
    criteria: IBookFilterCriteria,
    page: number,
    size: number
) => {
    const params = new URLSearchParams();
    params.append('page', page.toString());
    params.append('size', size.toString());

    if (criteria.title) params.append('title', criteria.title);
    if (criteria.minPrice !== undefined) params.append('minPrice', criteria.minPrice.toString());
    if (criteria.maxPrice !== undefined) params.append('maxPrice', criteria.maxPrice.toString());
    if (criteria.sortType) params.append('sortType', criteria.sortType);

    criteria.categoryId?.forEach(id => params.append('categoryId', id.toString()));
    criteria.publisherId?.forEach(id => params.append('publisherId', id.toString()));
    criteria.publishYear?.forEach(year => params.append('publishYear', year.toString()));
    criteria.coverFormat?.forEach(format => params.append('coverFormat', format));

    const url = `api/v1/books/search-product?${params.toString()}`;
    return axiosInstance.get<IBackendRes<IPagination<IBook>>>(url);
}

export const callFetchTop5LatestBooksApi = () => {
    const url = 'api/v1/books/top-5-latest'
    return axiosInstance.get<IBackendRes<IBook[]>>(url)
}

export const callCreateBookApi = (
    title: string,
    publisher: IPublisher,
    supplier: ISupplier,
    authors: IAuthorInBook[],
    category: ICategoryInBook,
    price: number,
    discount: number,
    quantity: number,
    publishYear: number,
    weight: number,
    dimensions: string,
    numberOfPages: number,
    coverFormat: string,
    images: { relativePath: string; sortOrder: number; primary: boolean }[],
    description: string) => {
    const url = "/api/v1/books";

    const data = {
        title,
        publisher,
        supplier,
        authors,
        category,
        price,
        discount,
        quantity,
        publishYear,
        weight,
        dimensions,
        numberOfPages,
        coverFormat,
        images,
        description
    };

    return axiosInstance.post<IBackendRes<IBook>>(url, data)
}

export const callUpdateBookApi = (
    id: number,
    title: string,
    publisher: IPublisher,
    supplier: ISupplier,
    authors: IAuthorInBook[],
    category: ICategoryInBook,
    price: number,
    discount: number,
    quantity: number,
    publishYear: number,
    weight: number,
    dimensions: string,
    numberOfPages: number,
    coverFormat: string,
    images: { relativePath: string; sortOrder: number; primary: boolean }[],
    description: string
) => {
    const url = "/api/v1/books";

    const data = {
        id,
        title,
        publisher,
        supplier,
        authors,
        category,
        price,
        discount,
        quantity,
        publishYear,
        weight,
        dimensions,
        numberOfPages,
        coverFormat,
        images,
        description
    };

    return axiosInstance.put<IBackendRes<IBook>>(url, data)
}

export const callDeleteBookApi = (id: number) => {
    const url = `api/v1/books/${id}`;
    const res = axiosInstance.delete(url);
    return res;
};

export const callFetchBookByIdApi = (id: number) => {
    const url = `api/v1/books/${id}`;
    return axiosInstance.get<IBackendRes<IBook>>(url);
}


/**
 * 
Module Authors
 */

export const callFetchAllAuthorsApi = () => {
    const url = 'api/v1/authors'
    return axiosInstance.get<IBackendRes<IAuthorInBook[]>>(url)
}

export const callFetchAllAuthorsWithPaginationAndFilterApi = (name: string, nationality: string, dateFrom: string, page: number, size: number) => {
    const url = `api/v1/authors/search?name=${name}&nationality=${nationality}&dateFrom=${dateFrom}&page=${page}&size=${size}`
    return axiosInstance.get<IBackendRes<IPagination<IAuthor>>>(url)
}

export const callCreateAuthorApi = (name: string, nationality: string, birthday: string, avatar: string) => {
    const url = 'api/v1/authors'
    const data = {
        name: name,
        nationality: nationality,
        birthday: birthday,
        avatar: avatar
    }
    return axiosInstance.post<IBackendRes<IAuthor>>(url, data)
}

export const callUpdateAuthorApi = (id: number, name: string, nationality: string, birthday: string, avatar: string) => {
    const url = 'api/v1/authors'
    const data = {
        id: id,
        name: name,
        nationality: nationality,
        birthday: birthday,
        avatar: avatar
    }
    return axiosInstance.put<IBackendRes<IAuthor>>(url, data)
}

export const callDeleteAuthorApi = (id: number) => {
    const url = `api/v1/authors/${id}`
    return axiosInstance.delete<IBackendRes<IAuthor>>(url)
}

/**
 * 
Module Categories
 */

export const callFetchAllCategoriesApi = () => {
    const url = 'api/v1/categories'
    return axiosInstance.get<IBackendRes<ICategoryInBook[]>>(url)
}

export const callFetchAllCategoriesWithPaginationAndFilterApi = (name: string, dateFrom: string, page: number, size: number) => {
    const url = `api/v1/categories/search?name=${name}&dateFrom=${dateFrom}&page=${page}&size=${size}`
    return axiosInstance.get<IBackendRes<IPagination<ICategory>>>(url)
}

export const callCreateCategoryApi = (name: string, description: string) => {
    const url = 'api/v1/categories'
    const data = {
        name: name,
        description: description,
    }
    return axiosInstance.post<IBackendRes<ICategory>>(url, data)
}

export const callUpdateCategoryApi = (id: number, name: string, description: string) => {
    const url = 'api/v1/categories'
    const data = {
        id: id,
        name: name,
        description: description,
    }
    return axiosInstance.put<IBackendRes<ICategory>>(url, data)
}

export const callDeleteCategoryApi = (id: number) => {
    const url = `api/v1/categories/${id}`
    return axiosInstance.delete<IBackendRes<ICategory>>(url)
}

/**
 *
 Module Publishers 
 */

export const callFetchAllPublishersApi = () => {
    const url = 'api/v1/publishers'
    return axiosInstance.get<IBackendRes<IPublisher[]>>(url)
}

export const callFetchAllPublishersWithPaginationAndFilterApi = (name: string, dateFrom: string, page: number, size: number) => {
    const url = `api/v1/publishers/search?name=${name}&dateFrom=${dateFrom}&page=${page}&size=${size}`
    return axiosInstance.get<IBackendRes<IPagination<IPublisher>>>(url)
}

export const callCreatePublisherApi = (name: string, address: string, phone: string, email: string, description: string, image: string) => {
    const url = 'api/v1/publishers'
    const data = {
        name: name,
        address: address,
        phone: phone,
        email: email,
        description: description,
        image: image
    }
    return axiosInstance.post<IBackendRes<IPublisher>>(url, data)
}

export const callUpdatePublisherApi = (id: number, name: string, address: string, phone: string, email: string, description: string, image: string) => {
    const url = 'api/v1/publishers'
    const data = {
        id: id,
        name: name,
        address: address,
        phone: phone,
        email: email,
        description: description,
        image: image
    }
    return axiosInstance.put<IBackendRes<IPublisher>>(url, data)
}

export const callDeletePublisherApi = (id: number) => {
    const url = `api/v1/publishers/${id}`
    return axiosInstance.delete<IBackendRes<IPublisher>>(url)
}

/**
 *
 Module Suppliers 
 */

export const callFetchAllSuppliersWithPaginationAndFilterApi = (name: string, dateFrom: string, page: number, size: number) => {
    const url = `api/v1/suppliers/search?name=${name}&dateFrom=${dateFrom}&page=${page}&size=${size}`
    return axiosInstance.get<IBackendRes<IPagination<ISupplier>>>(url)
}

export const callCreateSupplierApi = (name: string, address: string, phone: string, email: string, description: string, image: string) => {
    const url = 'api/v1/suppliers'
    const data = {
        name: name,
        address: address,
        phone: phone,
        email: email,
        description: description,
        image: image
    }
    return axiosInstance.post<IBackendRes<ISupplier>>(url, data)
}

export const callUpdateSupplierApi = (id: number, name: string, address: string, phone: string, email: string, description: string, image: string) => {
    const url = 'api/v1/suppliers'
    const data = {
        id: id,
        name: name,
        address: address,
        phone: phone,
        email: email,
        description: description,
        image: image
    }
    return axiosInstance.put<IBackendRes<ISupplier>>(url, data)
}

export const callDeleteSupplierApi = (id: number) => {
    const url = `api/v1/suppliers/${id}`
    return axiosInstance.delete<IBackendRes<ISupplier>>(url)
}

export const callFetchAllSuppliersApi = () => {
    const url = 'api/v1/suppliers'
    return axiosInstance.get<IBackendRes<ISupplier[]>>(url)
}

export const callFetchSupplierByIdApi = (id: number) => {
    const url = `api/v1/suppliers/${id}`
    return axiosInstance.get<IBackendRes<ISupplier>>(url)
}

/**
 *
 Module Files 
 */
export const callUploadSingleFile = (file: File, folderType: string) => {
    const url = 'api/v1/files'
    const bodyFormData = new FormData();
    bodyFormData.append('file', file);
    bodyFormData.append('folder', folderType);

    return axiosInstance.post<IBackendRes<IFile>>(url, bodyFormData, {
        headers: {
            "Content-Type": "multipart/form-data"
        }
    })
}

export const callUploadBatchFiles = (files: File[], folderType: string) => {
    const url = 'api/v1/files/batch'
    const bodyFormData = new FormData();
    files.forEach(file => {
        bodyFormData.append('files', file);
    });
    bodyFormData.append('folder', folderType);

    return axiosInstance.post<IBackendRes<IFile[]>>(url, bodyFormData, {
        headers: {
            "Content-Type": "multipart/form-data"
        }
    })
}

/**
 * 
Module Carts
 */

export const callAddToCartApi = (bookId: number, quantity: number) => {
    const url = 'api/v1/carts/items'
    const data = {
        bookId: bookId,
        quantity: quantity
    }
    return axiosInstance.post<IBackendRes<ICart>>(url, data)
}

export const callFetchCartApi = () => {
    const url = 'api/v1/carts'
    return axiosInstance.get<IBackendRes<ICart>>(url)
}

export const callIncreaseQuantityApi = (bookId: number) => {
    const url = `api/v1/carts/items/${bookId}/increase`
    return axiosInstance.put<IBackendRes<ICart>>(url)
}

export const callDecreaseQuantityApi = (bookId: number) => {
    const url = `api/v1/carts/items/${bookId}/decrease`
    return axiosInstance.put<IBackendRes<ICart>>(url)
}

export const callRemoveFromCartApi = (bookId: number) => {
    const url = `api/v1/carts/items/${bookId}`
    return axiosInstance.delete<IBackendRes<ICart>>(url)
}

/**
 * 
Module Orders
 */

export const callFetchAllOrdersWithPaginationAndFilterApi = (
    orderCode: string,
    status: string,
    paymentMethod: string,
    paymentStatus: string,
    dateFrom: string,
    page: number,
    size: number
) => {
    const url = `api/v1/orders/search?orderCode=${orderCode}&status=${status}&paymentMethod=${paymentMethod}&paymentStatus=${paymentStatus}&dateFrom=${dateFrom}&page=${page}&size=${size}`
    return axiosInstance.get<IBackendRes<IPagination<IOrder>>>(url)
}

export const callFetchOrderByIdApi = (id: number) => {
    const url = `api/v1/orders/${id}`
    return axiosInstance.get<IBackendRes<IOrder>>(url)
}

export const callUpdateOrderApi = (
    id: number,
    receiverName: string,
    receiverAddress: string,
    receiverPhone: string,
    receiverEmail: string,
    status: string,
    paymentStatus: string
) => {
    const url = '/api/v1/orders'
    const data = {
        id,
        receiverName,
        receiverAddress,
        receiverPhone,
        receiverEmail,
        status,
        paymentStatus
    }
    return axiosInstance.put<IBackendRes<IOrder>>(url, data)
}

export const callCreateOrderApi = (data: ICreateOrderReq) => {
    const url = '/api/v1/orders'
    return axiosInstance.post<IBackendRes<ICreateOrderRes>>(url, data)
}
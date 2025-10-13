import { ILoginRes, IAuthor, IAuthorInBook, IBackendRes, IBook, ICategory, ICategoryInBook, IFile, IPagination, IPermission, IPublisher, IRole, IUser } from "../types/backend";
import axiosInstance from "./axios-customize";


/**
 * 
Module Auth
 */

export const callLoginApi = (username: string, password: string) => {
    const url: string = 'api/v1/auth/login'
    const data = { username: username, password: password }
    return axiosInstance.post<IBackendRes<ILoginRes>>(url, data)
}

export const callRegisterApi = (username: string, password: string, fullName: string, address: string, phone: string) => {
    const url: string = 'api/v1/auth/register'
    const data = {
        username: username,
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
Module Users
 */

export const callFetchAllUserWithPaginationApi = (username: string, roleId: number, dateFrom: string, page: number, size: number) => {
    const url: string = `api/v1/users/search?page=${page}&size=${size}&username=${username}&roleId=${roleId}&dateFrom=${dateFrom}`
    return axiosInstance.get<IBackendRes<IPagination<IUser>>>(url)
}

export const callCreateUserApi = (username: string, password: string, fullName: string, email: string, address: string, phone: string, role: number, avatar: string) => {
  const url = "/api/v1/users";

  const data = {
    username: username,
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
  username: string,
  password: string,
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
    username: null,
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
  return axiosInstance.post<IBackendRes<IRole>>(url,data)
}

export const callUpdateRolesApi = (id: number, name: string, description: string, permissions: IPermission[]) => {
  const url = '/api/v1/roles'
  const data = {
    id: id,
    name: name,
    description: description,
    permissions: permissions
  }
  return axiosInstance.put<IBackendRes<IRole>>(url,data)
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
  return axiosInstance.post<IBackendRes<IPermission>>(url,data)
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
  return axiosInstance.put<IBackendRes<IPermission>>(url,data)
}

export const callDeletePermissionApi = (id: number) => {
  const url = `api/v1/permissions/${id}`
  return axiosInstance.delete<IBackendRes<IPermission>>(url)
}
/**
 * 
Module Books
 */

export const callFetchAllBooksWithPaginationApi = (title: string, publisherId: number, authorId: number, categoryId: number,dateFrom: string, page: number, size: number) => {
  const url: string = `api/v1/books/search?title=${title}&publisherId=${publisherId}&authorId=${authorId}&categoryId=${categoryId}&dateFrom=${dateFrom}&page=${page}&size=${size}`
  return axiosInstance.get<IBackendRes<IPagination<IBook>>>(url)
}

export const callCreateBookApi = (
  title: string, 
  publisher: IPublisher, 
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
  isbn: string,
  image: string, 
  description: string) => {
    const url = "/api/v1/books";

    const data = {
      title: title,
      publisher: publisher,
      authors: authors,
      category: category,
      price: price,
      discount: discount,
      quantity: quantity,
      publishYear: publishYear,
      weight: weight,
      dimensions: dimensions,
      numberOfPages: numberOfPages,
      coverFormat: coverFormat,
      isbn: isbn,
      image: image,
      description: description
    };

    return axiosInstance.post<IBackendRes<IBook>>(url, data)
}

export const callUpdateBookApi = (
  id: number,
  title: string, 
  publisher: IPublisher, 
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
  isbn: string,
  image: string, 
  description: string
) => {
  const url = "/api/v1/books";

  const data = {
    id: id,
    title: title,
    publisher: publisher,
    authors: authors,
    category: category,
    price: price,
    discount: discount,
    quantity: quantity,
    publishYear: publishYear,
    weight: weight,
    dimensions: dimensions,
    numberOfPages: numberOfPages,
    coverFormat: coverFormat,
    isbn: isbn,
    image: image,
    description: description
  };

  return axiosInstance.put<IBackendRes<IBook>>(url, data)
}

export const callDeleteBookApi = (id: number) => {
  const url = `api/v1/books/${id}`;
  const res = axiosInstance.delete(url);
  return res;
};


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
 Module Files 
 */
export const callUploadSingleFile = (file: File, folderType: string) => {
  const url = 'api/v1/files'
  const bodyFormData = new FormData();
  bodyFormData.append('file', file);
  bodyFormData.append('folder', folderType);
  
  return axiosInstance.post<IBackendRes<IFile>>(url,bodyFormData, {
    headers: {
      "Content-Type": "multipart/form-data"
    }
  })
}
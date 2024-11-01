// Geo Coordinates
export interface Geo {
  lat: string;
  lng: string;
}

// Company Details
export interface Company {
  name: string;
  catchPhrase: string;
  bs: string;
}

// Address Information
export interface Address {
  street: string;
  suite: string;
  city: string;
  zipcode: string;
  geo: Geo;
}

// Pagination Links
export interface PaginationLinks {
  prev?: string | null;
  next?: string | null;
  self: string;
}

// Page Metadata
export interface PageMetadata {
  totalCount: number;
  pageCount: number;
  page: number;
  limit: number;
}

// Photo Model
export interface Photo {
  id: string;
  title: string;
  url: string;
  thumbnailUrl: string;
  album: Album;
}

// Page of Photos
export interface PhotosPage {
  data: Photo[];
  links: PaginationLinks;
  meta: PageMetadata;
}

// Album Model
export interface Album {
  id: string;
  title: string;
  user: User;
  photos: PhotosPage;
}

// User Model
export interface User {
  id: string;
  name: string;
  username: string;
  email: string;
  address: Address;
  phone: string;
  website: string;
  company: Company;
  posts?: PostsPage;
  albums?: AlbumsPage;
  todos?: TodosPage;
}

// Generic Page Type for Posts
export interface PostsPage {
  data: Post[];
  links: PaginationLinks;
  meta: PageMetadata;
}

// Post Model
export interface Post {
  id: string;
  title: string;
  body: string;
  user: User;
}

// Generic Page Type for Albums
export interface AlbumsPage {
  data: Album[];
  links: PaginationLinks;
  meta: PageMetadata;
}

// Generic Page Type for Todos
export interface TodosPage {
  data: Todo[];
  links: PaginationLinks;
  meta: PageMetadata;
}

// Todo Model
export interface Todo {
  id: string;
  title: string;
  completed: boolean;
  user: User;
}

// Optional: Utility type for pagination
export type PaginatedResponse<T> = {
  data: T[];
  links: PaginationLinks;
  meta: PageMetadata;
};

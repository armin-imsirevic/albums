export interface Album {
    id: number;
    title: string;
    price: string;
    imageUrl: string;
    releaseDate: string;
    artistId: number;
    favorite: boolean;
}

export interface Artist {
    id: number;
    title: string;
}
import { IPagination, IQueryOptions } from './interfaces';

export const unique = (value: any, index: number, self: any) => {
    return self.indexOf(value) === index
}

export const artistURLRegex = /^\/artist\/\d+$/g;

/*
    Returns pagination. Pagination values are coming from URL or Selects.
    Values from selects are going to be ignored if limit or page value is defined in URL.
*/
export const getPagination = (): IPagination => {
    const urlParams = new URLSearchParams(window.location.search);
    const limitEl: HTMLSelectElement = document.querySelector('#limit');
    const pageEL: HTMLSelectElement = document.querySelector('#page');

    if (urlParams.has('limit') || urlParams.has('page')) {
        const limit = urlParams.get('limit') || '10';
        const page = urlParams.get('page') || '1';

        limitEl.value = limit;
        pageEL.value = page;

        return {limit, page};
    } else {
        return {limit: limitEl.value || '10', page: pageEL.value || '1'};
    }
}

export const setPaginationToDefault = () => {
    const limitEl: HTMLSelectElement = document.querySelector('#limit');
    const pageEL: HTMLSelectElement = document.querySelector('#page');
    limitEl.value = '10';
    pageEL.value = '1';
}

export const constructQueryParamsString = (options: IQueryOptions): string => {
    const {
        limit,
        page,
        query,
        artistId
    } = options;

    const limitParameter = limit ? '_limit=' + limit : null;
    const pageParameter = page && !artistId && !query ? '_page=' + page : null;
    const queryParameter = query && !artistId ? 'q=' + query : null;
    const artistIdParameter = artistId ? 'artistId=' + artistId : null;
    const queryParameters = [limitParameter, pageParameter, queryParameter, artistIdParameter].filter((p) => p != null).join('&');

    return queryParameters;
}
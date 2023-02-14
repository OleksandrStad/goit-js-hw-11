import axios from 'axios';

const baseUrl = 'https://pixabay.com/api/?';

export async function fetchImg(content, page) {
    const searchParams = new URLSearchParams({
        key: '33646026-f313f2ff5deeed9e46eba7e22',
        q: content,
        image_type: 'photo',
        orientation: 'horizontal',
        safesearch: true,
        per_page: 40,
        page: page,
    });
    return axios.get(`${baseUrl}${searchParams}`);
}


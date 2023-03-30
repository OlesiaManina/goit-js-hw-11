import axios from "axios";

export default async function fetchData(searchQuery, pageNumber) {
    const BASE_URL = 'https://pixabay.com/api/'
    const API_KEY = '34772880-f6f31822e5151a683868d32ba'
    const searchParams = new URLSearchParams({
        q: searchQuery,
        image_type: 'photo',
        orientation: 'horizontal',
        safesearch: true,
        page: pageNumber,
        per_page: 40,
    })
        const response = await axios.get(`${BASE_URL}?key=${API_KEY}&${searchParams}`);
        return response;
};


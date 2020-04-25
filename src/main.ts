import { Album } from './interfaces';

const request = new XMLHttpRequest();


request.open('GET', 'http://localhost:3004/albums');
request.send();
request.onload = () => {
    console.log(request);
    if (request.status === 200) {
        const albums: Album[] = request.response; 
        console.log(albums);
    } else {
        console.log('Something went wrong!');
    }
}

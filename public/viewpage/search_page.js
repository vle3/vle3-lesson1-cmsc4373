import { routePath } from '../controller/route.js';
import * as Elements from './elements.js';
import * as Util from './util.js';
import * as ProtectedMessage from './protected_message.js';
import { currentUser } from '../controller/firebase_auth.js';

export function addEventListeners(){

        Elements.formSearch.addEventListener('submit', e => {
            e.preventDefault();
            const searchKeys = e.target.searchKeys.value.trim();
            if(searchKeys.length == 0){
                Util.info('Error', 'No search keys');
                return;
            }

            const searchKeysArray = searchKeys.toLowerCase().match(/\S+/g);
            const joinedSearchKeys = searchKeysArray.join(',');

            history.pushState(null, null, routePath.SEARCH + '#' + joinedSearchKeys);
            search_page(joinedSearchKeys);
        });
}

export function search_page(joinedSearchKeys){

    if(!joinedSearchKeys){
        Util.info('Error', 'No search keys');
        return;
    }

    const searchKeysArray = joinedSearchKeys.split(',');
    if(searchKeysArray.length == 0){
        Util.info('Error', 'No search keys');
        return;
    }

    // console.log('search keys: ' + joinedSearchKeys);
    if(!currentUser){
        Elements.root.innerHTML = ProtectedMessage.html;
        return;
    }

    Elements.root.innerHTML = `<h1>Search for: ${joinedSearchKeys}</h1>`;

}
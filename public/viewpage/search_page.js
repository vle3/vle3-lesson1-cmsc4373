import { routePath } from '../controller/route.js';
import * as Elements from './elements.js';
import * as Util from './util.js';
import * as ProtectedMessage from './protected_message.js';
import * as FirestoreController from '../controller/firestore_controller.js'
import * as Constants from '../model/constants.js'
import { buildHomeScreen } from './home_page.js';
import { currentUser } from '../controller/firebase_auth.js';

export function addEventListeners(){

        Elements.formSearch.addEventListener('submit', async e => {
            e.preventDefault();
            const searchKeys = e.target.searchKeys.value.trim();
            if(searchKeys.length == 0){
                Util.info('Error', 'No search keys');
                return;
            }

            const button = e.target.getElementsByTagName('button')[0];
            const label = Util.disabledButton(button);

            const searchKeysArray = searchKeys.toLowerCase().match(/\S+/g);
            const joinedSearchKeys = searchKeysArray.join(',');

            history.pushState(null, null, routePath.SEARCH + '#' + joinedSearchKeys);
            await search_page(joinedSearchKeys);

            Util.enabledButton(button, label);
        });
}

export async function search_page(joinedSearchKeys){

    if(!joinedSearchKeys){
        Util.info('Error', 'No search keys');
        return;
    }

    const searchKeysArray = joinedSearchKeys.split(',');
    if(searchKeysArray.length == 0){
        Util.info('Error', 'No search keys');
        return;
    }

    if(searchKeysArray.length > 10){
        Util.info('Error', 'The number of search key cannot exceed 10');
        return;
    }

    // console.log('search keys: ' + joinedSearchKeys);
    if(!currentUser){
        Elements.root.innerHTML = ProtectedMessage.html;
        return;
    }

    let threadList;
    try{
        threadList = await FirestoreController.searchThread(searchKeysArray);
    }catch(e){
        if(Constants.DEV) console.log(e);
        Util.info('Search Error', JSON.stringify(e));
        return;
    }
    
    buildHomeScreen(threadList);
    //Elements.root.innerHTML = `<h1>Search for: ${joinedSearchKeys}</h1>`;

}
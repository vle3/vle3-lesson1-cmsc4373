import { currenUser } from "../controller/firebase_auth.js";
import * as ProtectedMessage from './protected_message.js';
import * as Elements from './elements.js';
import * as Util from './util.js';
import * as FirestoreController from '../controller/firestore_controller.js';
import * as Constants from '../model/constants.js';

export function addViewFormEvents() {
    const viewForms = document.getElementsByClassName('thread-view-form');
    for (let i = 0; i < viewForms.length; i++) {
        attachViewFormEventListener(viewForms[i]);
    }
}

export function attachViewFormEventListener(form) {
    form.addEventListener('submit', e => {
        e.preventDefault();
        const threadId = e.target.threadId.value;
        thread_page(threadId);
    });
}

async function thread_page(threadId) {
    if (!currenUser) {
        Elements.root.innerHTML = ProtectedMessage.html;
        return;
    }
    if (!threadId) {
        Util.info('Error', 'Thread is null; invalid access');
    }

    //TO-DO list
    // 1. get thread from Firestore by threadId
    // 2. get all replies to this thread
    // 3. display the thread 
    // 4. display all replies
    // 5. add a form to post a new reply

    let thread;
    try {
        thread = await FirestoreController.getOneThread(threadId);
        if(!thread) throw `Thread does not exist by id: ${threadId}`;
    } catch (e) {
        if (Constants.DEV) console.log(e);
        Util.info('Error', JSON.stringify(e));
        return;
    }

    Elements.root.innerHTML = `${thread.title} | ${thread.content}`;

}
import * as Elements from './elements.js'
import { routePath } from '../controller/route.js';
import { currenUser } from '../controller/firebase_auth.js';
import * as ProtectedMessage from './protected_message.js'
import { Thread } from '../model/thread.js';
import * as Constants from '../model/constants.js'
import * as FirestoreController from '../controller/firestore_controller.js'
import * as Util from './util.js'
import * as ThreadPage from './thread_page.js'

export function addEventListener() {
    Elements.menuHome.addEventListener('click', async () => {
        history.pushState(null, null, routePath.HOME);
        const label = Util.disabledButton(Elements.menuHome)
        await home_page();
        //await Util.sleep(1000);
        Util.enabledButton(Elements.menuHome, label);
    });

    Elements.formCreateThread.addEventListener('submit', addNewThread);
}

async function addNewThread(e) {
    e.preventDefault();

    const createButton = e.target.getElementsByTagName('button')[0];
    const label = Util.disabledButton(createButton);

    const title = e.target.title.value;
    const content = e.target.content.value;
    const keywords = e.target.keywords.value;
    const uid = currenUser.uid;
    const email = currenUser.email;
    const timestamp = Date.now();
    const keywordsArray = keywords.toLowerCase().match(/\S+/g);

    const thread = new Thread({
        title, uid, content, email, timestamp, keywordsArray

    });

    try {
        const docId = await FirestoreController.addThread(thread);
        thread.set_docId(docId);
        //home_page();
        const trTag = document.createElement('tr'); // <tr></tr>
        trTag.innerHTML = buildThreadView(thread);
        const tableBodyTag = document.getElementById('thread-view-table-body');
        tableBodyTag.prepend(trTag);
        //attach event listener to the new thread form
        const viewForms = document.getElementsByClassName('thread-view-form');
        ThreadPage.attachViewFormEventListener(viewForms[0]);

        e.target.reset(); // clear entries in the form
        const noThreadFound = document.getElementById('no-thread-found') ;
        if(noThreadFound){
            noThreadFound.remove();
        }

        Util.info('Success', 'A new thread were added', Elements.modalCreateThread);
    } catch (e) {
        if (Constants.DEV) console.log(e);
        Util.info('Failed', JSON.stringify(e), Elements.modalCreateThread);
    }

    Util.enabledButton(createButton.label);
}

export async function home_page() {
    if (!currenUser) {
        Elements.root.innerHTML = ProtectedMessage.html;
        return;
    }
    //read all threads from DB and render 
    let threadList;
    try{
        threadList = await FirestoreController.getThreadList();
    }catch(e){
        if(Constants.DEV) console.log(e);
        Util.info('Error to get thread list', JSON.stringify(e));
        return;
    }

    buildHomeScreen(threadList);

}

function buildHomeScreen(threadList) {
    let html = ' ';

    html += `
        <button class="btn btn-outline-danger" data-bs-toggle="modal" data-bs-target="#modal-create-thread">
        + New Thread</button>
    `;

    html += `
    <table class="table table-striped">
    <thead>
    <tr>
      <th scope="col">Action</th>
      <th scope="col">Title</th>
      <th scope="col">Keywords</th>
      <th scope="col">Posted By</th>
      <th scope="col">Content</th>
      <th scope="col">Posted At</th>
    </tr>
    </thead>
    <tbody id="thread-view-table-body">
    `;

    threadList.forEach(thread => {
        html += `
            <tr>
                ${buildThreadView(thread)}
            </tr>
        `;
    });

    html += '</tbody></table>';

    if(threadList.length == 0){
        html += `<h4 id="no-thread-found">No Threads found</h4>`;
    }

    Elements.root.innerHTML = html;

    //attach event listeners to view buttons 
    ThreadPage.addViewFormEvents();
}

function buildThreadView(thread){
    return `
        <td>
            <form method="post" class="thread-view-form">
                <input type="hidden" name="threadId" value="${thread.docId}">
                <button type="submit" class="btn btn-outline-primary">View</button>
            </form>
        </td>
        <td>${thread.title}</td>
        <td>${!thread.keywordsArray || !Array.isArray(thread.keywordsArray) ? '' : thread.keywordsArray.join(' ')}</td>
        <td>${thread.email}</td>
        <td>${thread.content}</td>
        <td>${new Date(thread.timestamp).toString()}</td>
    `;
}
import { getAuth, signInWithEmailAndPassword, signOut, onAuthStateChanged  } from 'https://www.gstatic.com/firebasejs/9.16.0/firebase-auth.js'

import * as Elements from '../viewpage/elements.js'
import * as Util from '../viewpage/util.js'
import * as Constants from '../model/constant.js'

const auth = getAuth();

export function addEventListener() {
    Elements.formSignIn.addEventListener('submit', async e => {
        e.preventDefault(); //keeps from refreshing the current page
        const email = e.target.email.value;
        const password = e.target.password.value;

        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;
            Elements.modalSignin.hide();
        } catch (error) {
            const errorCode = error.code;
            const errorMessage = error.message;
            Util.info('Sign In Error', JSON.stringify(error), Elements.modalSignin);
            if(Constants.DEV)
                console.log(`sign in failed: ${errorCode} | ${errorMessage} `);
        }
    });

    Elements.menuSignout.addEventListener('click', async ()=>{
        //sign out from Firebase Auth 
        try{
            await signOut(auth);
        }catch (e){
            console.log('sign out error' + e);
        }
    });

    onAuthStateChanged(auth, authStateChangeObserver);
}

function authStateChangeObserver(user){
    if(user){
        //signed in
        console.log(`auth state change: ${user.email}`);
    }
    else{
        //signed out
        console.log(`auth state change: Signed out`);
    }
}


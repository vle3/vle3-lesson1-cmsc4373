//main root element
export const root = document.getElementById('root');

//form
export const formSearch = document.getElementById('form-search');
export const formSignIn = document.getElementById('form-signin');
export const formCreateThread = document.getElementById('form-create-thread');

//menu buttons
export const menuSignout = document.getElementById('menu-signout');
export const menuHome = document.getElementById('menu-home');
export const menuAbout = document.getElementById('menu-about');

//modal
export const modalSignin = new bootstrap.Modal(document.getElementById('modal-signin-form'), { backdrop: 'static' });

export const modalInfobox = {
    modal: new bootstrap.Modal(document.getElementById('modal-infobox'), { backdrop: 'static' }),
    title: document.getElementById('modal-infobox-title'),
    body: document.getElementById('modal-infobox-body'),
}

export const modalCreateThread = new bootstrap.Modal(document.getElementById('modal-create-thread'), {backdrop: 'static'});
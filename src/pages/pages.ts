// The page the user lands on after opening the app and without a session
//.export const FirstRunPage = 'TutorialPage';
export const WelcomePage = 'WelcomePage';

let a = 'success';
let page = '';

console.log("Pages export: " + localStorage.getItem("loggedIn") );




if (localStorage.getItem("loggedIn") == 'Y') {
    this.page = 'TabsPage';
    console.log("page: " + this.page)
} else {
    this.page = 'TutorialPage';
    console.log("page: " + this.page)
}

export const FirstRunPage = this.page;
// The main page the user will see as they use the app over a long period of time.
// Change this if not using tabs
export const MainPage = 'TabsPage';

// The initial root pages for our tabs (remove if not using tabs)
export const Tab1Root = 'ListMasterPage';
export const Tab2Root = 'SearchPage';
export const Tab3Root = 'SettingsPage';
export const TabHomeRoot = 'HomePage';
export const TutorialPage = 'TutorialPage';

import { Component } from '@angular/core';
import { IonicPage, NavController, ToastController, MenuController } from 'ionic-angular';
import { TranslateService } from '@ngx-translate/core';


import { User, Weather } from '../../providers/providers';
import { MainPage } from '../pages';

/**
 * The Welcome Page is a splash page that quickly describes the app,
 * and then directs the user to create an account or log in.
 * If you'd like to immediately put the user onto a login/signup page,
 * we recommend not using the Welcome page.
*/
@IonicPage()
@Component({
  selector: 'page-welcome',
  templateUrl: 'welcome.html'
})
export class WelcomePage {

  activeMenu: string;

  account: { email: string, password: string } = {
    email: '',
    password: ''
  };

  // Our translated text strings
  private loginErrorString: string;

  constructor(public navCtrl: NavController,
    public user: User,
    public toastCtrl: ToastController,
    public translateService: TranslateService,
    public menu: MenuController,
    public weather: Weather) {
    //this.disableMenue();


    this.translateService.get('LOGIN_ERROR').subscribe((value) => {
      this.loginErrorString = value;
    })
  }

  ionViewDidLoad() {
    //this.activeMenu = 'menu1';
    //this.menu.enable(true, 'menu1');
    this.menu.swipeEnable(false, 'left');
    this.menu.enable(false, 'left');
  }

  disableMenue() {
    this.activeMenu = 'menu1';
    //this.menu.enable(true, 'menu1');
    this.menu.enable(false, 'menu1');
  }

  menu1Active() {
    this.activeMenu = 'menu1';
    this.menu.enable(true, 'menu1');
    this.menu.enable(false, 'menu2');
  }
  menu2Active() {
    this.activeMenu = 'menu2';
    this.menu.enable(false, 'menu1');
    this.menu.enable(true, 'menu2');
  }



  doLogin() {
    if (typeof (Storage) != "undefined") {
      localStorage.setItem("loggedIn", "Y");
      //localStorage.setItem("lastname", "Raboy");
      alert(localStorage.getItem("loggedIn"));
    } else {
      alert("Sorry, your browser does not support Web Storage...");
    }

    console.log(this.account.email);


    this.user.login(this.account).subscribe((resp) => {
      this.navCtrl.push(MainPage);
    }, (err) => {
      this.navCtrl.push(MainPage);
      // Unable to log in
      let toast = this.toastCtrl.create({
        message: this.loginErrorString,
        duration: 3000,
        position: 'top'
      });
      toast.present();
    });

    
  }



  /*
 login() {
   this.navCtrl.push('LoginPage');
 }

 signup() {
   this.navCtrl.push('SignupPage');
 }
 */



}

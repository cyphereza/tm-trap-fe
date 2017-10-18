import { Injectable } from '@angular/core';

import 'rxjs/add/operator/map';
import { Platform } from 'ionic-angular';
import { ConnectivityServiceProvider } from '../connectivity-service/connectivity-service';
import { Geolocation } from '@ionic-native/geolocation';

/*
  Generated class for the GoogleMapsProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class GoogleMapsProvider {

  mapElement: any;
  pleaseConnect: any;
  map: any;
  mapInitialised: boolean = false;
  mapLoaded: any;
  mapLoadedObserver: any;
  currentMarker: any;
  apiKey: string = "AIzaSyDed8O52MfiWPs_WcUMqQZG1e74si0sGXg";
 

  constructor(public connectivityService: ConnectivityServiceProvider, public geolocation: Geolocation) {
    console.log('Hello GoogleMapsProvider Provider');
  }

  init(mapElement: any, pleaseConnect: any): Promise<any> {
    
       this.mapElement = mapElement;
       this.pleaseConnect = pleaseConnect;
    
       return this.loadGoogleMaps();
    
     }

     loadGoogleMaps(): Promise<any> {
      
         return new Promise((resolve) => {
      
           if(typeof google == "undefined" || typeof google.maps == "undefined"){
      
             console.log("Google maps JavaScript needs to be loaded.");
             this.disableMap();
      
             if(this.connectivityService.isOnline()){
      
               window['mapInit'] = () => {
      
                 this.initMap().then(() => {
                   resolve(true);
                 });
      
                 this.enableMap();
               }
      
               let script = document.createElement("script");
               script.id = "googleMaps";
      
               if(this.apiKey){
                 script.src = 'http://maps.google.com/maps/api/js?key=' + this.apiKey + '&callback=mapInit&libraries=places';
               } else {
                 script.src = 'http://maps.google.com/maps/api/js?callback=mapInit';      
               }
      
               document.body.appendChild(script); 
      
             }
           } else {
      
             if(this.connectivityService.isOnline()){
               this.initMap();
               this.enableMap();
             }
             else {
               this.disableMap();
             }
      
             resolve(true);
      
           }
      
           this.addConnectivityListeners();
      
         });
      
       }
      
       initMap(): Promise<any> {
      
         this.mapInitialised = true;
      
         return new Promise((resolve) => {
      
           this.geolocation.getCurrentPosition().then((position) => {
      
             let latLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
      
             let mapOptions = {
               center: latLng,
               zoom: 15,
               mapTypeId: google.maps.MapTypeId.ROADMAP
             }
      
             this.map = new google.maps.Map(this.mapElement, mapOptions);
             resolve(true);
      
           });
      
         });
      
       }
      
       disableMap(): void {
      
         if(this.pleaseConnect){
           this.pleaseConnect.style.display = "block";
         }
      
       }
      
       enableMap(): void {
      
         if(this.pleaseConnect){
           this.pleaseConnect.style.display = "none";
         }
      
       }
      
       addConnectivityListeners(): void {
      
         this.connectivityService.watchOnline().subscribe(() => {
      
           setTimeout(() => {
      
             if(typeof google == "undefined" || typeof google.maps == "undefined"){
               this.loadGoogleMaps();
             }
             else {
               if(!this.mapInitialised){
                 this.initMap();
               }
      
               this.enableMap();
             }
      
           }, 2000);
      
         });
      
         this.connectivityService.watchOffline().subscribe(() => {
      
           this.disableMap();
      
         });
      
       }

}

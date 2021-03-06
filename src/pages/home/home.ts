
import { Component, ViewChild, ElementRef } from '@angular/core';
import { IonicPage, ModalController, NavController, AlertController, ToastController, MenuController, reorderArray, Refresher, Platform } from 'ionic-angular';
import { Chart } from 'chart.js';
import { Subscription } from 'rxjs';
import { Item } from '../../models/item';
import { Items, Weather } from '../../providers/providers';
import { Geolocation } from '@ionic-native/geolocation';
import { Diagnostic } from '@ionic-native/diagnostic';
import { PhonegapLocalNotification } from '@ionic-native/phonegap-local-notification';
import { LaunchNavigator, LaunchNavigatorOptions } from '@ionic-native/launch-navigator';


declare var google;
declare var GeolocationMarker;

@IonicPage()
@Component({
    selector: 'page-home',
    templateUrl: 'home.html'
})
export class HomePage {
    private onResumeSubscription: Subscription;

    activeMenu: string;
    currentItems: Item[];
    updateChart: any;
    cardList: any[];
    weatherInfo: any[];
    currentInfo: any[];
    editButton: string = 'Edit';
    editing: boolean = false;
    directionInfo: any[];
    date: any;
    hours: any;
    minutes: any;
    seconds: any;
    etaTime: any;



    @ViewChild('carBarCanvas') carBarCanvas;
    @ViewChild('bikeBarCanvas') bikeBarCanvas;
    @ViewChild('doughnutCanvas') doughnutCanvas;
    @ViewChild('lineCanvas') lineCanvas;

    @ViewChild('map') mapElement: ElementRef;
    @ViewChild('directionsPanel') directionsPanel: ElementRef;
    map: any;




    carBarChart: any;
    bikeBarChart: any;
    doughnutChart: any;
    lineChart: any;

    private loginErrorString: string;

    constructor(public navCtrl: NavController,
        public items: Items,
        public modalCtrl: ModalController,
        private geolocation: Geolocation,
        public alertCtrl: AlertController,
        public toastCtrl: ToastController,
        public menu: MenuController,
        private diagnostic: Diagnostic,
        private localNotification: PhonegapLocalNotification,
        private launchNavigator: LaunchNavigator,
        platform: Platform,
        public weather: Weather) {

        //background to foreground process    
        this.onResumeSubscription = platform.resume.subscribe(() => {
            // do something meaningful when the app is put in the foreground
            this.loadMap();
            alert("Resume");
        });

        
        this.currentItems = this.items.query();

        this.weatherInfo = [
            {
                currentCondition: '',
                destinationLatitude: '',
                destinationLongitude: '',


            }
        ];

        this.directionInfo = [
            {
                distance: '',
                time: '',


            }
        ];





    }

    ionViewDidEnter() {
        this.loadMap();

    }





    /**
     * The view loaded, let's query our items for the list
     */
    ionViewDidLoad() {


        //this.startNavigating();

        this.updateChart = setInterval(() => {
            //this.refreshData();
            this.updateChartData();
        }, 10000);

        /* this.geolocation.getCurrentPosition().then((resp) => {
           // resp.coords.latitude
           // resp.coords.longitude
           console.log('Lat: ' + resp.coords.latitude);
           console.log('Lon: ' + resp.coords.longitude);

           let toast = this.toastCtrl.create({
               message: 'Lat: ' + resp.coords.latitude + ',Lon: ' + resp.coords.longitude,
               duration: 3000,
               position: 'middle'
           });
           toast.present();
       }).catch((error) => {
           console.log('Error getting location', error);
       });

       let watch = this.geolocation.watchPosition();
       watch.subscribe((data) => {
           // data can be a set of coordinates, or an error (if an error occurred).
           // data.coords.latitude
           // data.coords.longitude
       });*/




        this.weather.getWeather('3.115033', '101.66577559999996').subscribe((resp) => {
            console.log(resp['weather'][0].main);


            localStorage.setItem("currentCondition", resp['weather'][0].main);



            this.currentInfo = [
                {
                    currentCondition: resp['weather'][0].main,

                }
            ];

            this.weatherInfo.map(currentCondition => 'aaa')

        }, (err) => {

            // Unable to log in
            let toast = this.toastCtrl.create({
                message: this.loginErrorString,
                duration: 3000,
                position: 'top'
            });
            toast.present();
        });








        this.cardList = [
            {
                title: 'Title1',
                body: "<p>aaa</p>",
            },
            {
                title: 'Title1',
                body: "<p>bbb</p>",
            },
            {
                title: 'Title1',
                body: "<p>xxx</p>",
            }
        ];

        this.menu.swipeEnable(true, 'left');
        this.menu.enable(true, 'left');

        if (this.diagnostic.isLocationEnabled()) {
            console.log("location enable");
        } else {
            console.log("location disable");
        }

        //console.log(this.diagnostic.getLocationAuthorizationStatus());



        //this.diagnostic.isCameraAvailable().then(successCallback).catch(errorCallback);

        //this.diagnostic.isBluetoothAvailable().then(successCallback, errorCallback);










        this.carBarChart = new Chart(this.carBarCanvas.nativeElement, {

            type: 'horizontalBar',
            data: {
                labels: [" TM Annexe", " Menara LG2", " Menara LG4"],
                datasets: [{
                    label: '# of Votes',
                    data: [100, 200, 300],
                    backgroundColor: [
                        'rgba(255, 99, 132, 1)',
                        'rgba(54, 162, 235, 1)',
                        'rgba(255, 206, 86, 1)',
                        'rgba(75, 192, 192, 1)',
                        'rgba(153, 102, 255, 1)',
                        'rgba(255, 159, 64, 1)'
                    ],
                    borderColor: [
                        'rgba(255,99,132,1)',
                        'rgba(54, 162, 235, 1)',
                        'rgba(255, 206, 86, 1)',
                        'rgba(75, 192, 192, 1)',
                        'rgba(153, 102, 255, 1)',
                        'rgba(255, 159, 64, 1)'
                    ],
                    borderWidth: 1
                }]
            },
            options: {
                // Elements options apply to all of the options unless overridden in a dataset
                // In this case, we are setting the border of each horizontal bar to be 2px wide
                elements: {
                    rectangle: {
                        borderWidth: 2,
                    }
                },
                responsive: true,
                use_plugin: true,
                legend: {
                    position: 'top',
                    display: false

                },
                title: {
                    display: false,
                    text: 'Realtime Count'
                },
                scales: {
                    xAxes: [{
                        ticks: {
                            stepSize: 1,
                            beginAtZero: true,
                            max: 700,
                            autoSkip: false
                        },
                        type: "linear",
                        display: false,
                        position: "bottom"

                    }],
                    yAxes: [{
                        ticks: {
                            mirror: false
                        },
                        position: "left",
                        gridLines: {
                            display: false
                        }
                    }]
                }
            }

        });




        this.bikeBarChart = new Chart(this.bikeBarCanvas.nativeElement, {

            type: 'horizontalBar',
            data: {
                labels: [" TM Annexe", " Menara LG2", " Menara LG4"],
                datasets: [{
                    label: '# of Votes',
                    data: [50, 120, 230],
                    backgroundColor: [
                        'rgba(255, 99, 132, 1)',
                        'rgba(54, 162, 235, 1)',
                        'rgba(255, 206, 86, 1)',
                        'rgba(75, 192, 192, 1)',
                        'rgba(153, 102, 255, 1)',
                        'rgba(255, 159, 64, 1)'
                    ],
                    borderColor: [
                        'rgba(255,99,132,1)',
                        'rgba(54, 162, 235, 1)',
                        'rgba(255, 206, 86, 1)',
                        'rgba(75, 192, 192, 1)',
                        'rgba(153, 102, 255, 1)',
                        'rgba(255, 159, 64, 1)'
                    ],
                    borderWidth: 1
                }]
            },
            options: {
                // Elements options apply to all of the options unless overridden in a dataset
                // In this case, we are setting the border of each horizontal bar to be 2px wide
                elements: {
                    rectangle: {
                        borderWidth: 2,
                    }
                },
                responsive: true,
                use_plugin: true,
                legend: {
                    position: 'top',
                    display: false

                },
                title: {
                    display: false,
                    text: 'Realtime Count'
                },
                scales: {
                    xAxes: [{
                        ticks: {
                            stepSize: 1,
                            beginAtZero: true,
                            max: 700,
                            autoSkip: false
                        },
                        type: "linear",
                        display: false,
                        position: "bottom"

                    }],
                    yAxes: [{
                        ticks: {
                            mirror: false
                        },
                        position: "left",
                        gridLines: {
                            display: false
                        }
                    }]
                }
            }

        });





        this.doughnutChart = new Chart(this.doughnutCanvas.nativeElement, {

            type: 'doughnut',
            data: {
                labels: ["Red", "Blue", "Yellow", "Green", "Purple", "Orange"],
                datasets: [{
                    label: '# of Votes',
                    data: [12, 19, 3, 5, 2, 3],
                    backgroundColor: [
                        'rgba(255, 99, 132, 0.2)',
                        'rgba(54, 162, 235, 0.2)',
                        'rgba(255, 206, 86, 0.2)',
                        'rgba(75, 192, 192, 0.2)',
                        'rgba(153, 102, 255, 0.2)',
                        'rgba(255, 159, 64, 0.2)'
                    ],
                    hoverBackgroundColor: [
                        "#FF6384",
                        "#36A2EB",
                        "#FFCE56",
                        "#FF6384",
                        "#36A2EB",
                        "#FFCE56"
                    ]
                }]
            }

        });

        this.lineChart = new Chart(this.lineCanvas.nativeElement, {

            type: 'line',
            data: {
                labels: ["January", "February", "March", "April", "May", "June", "July"],
                datasets: [
                    {
                        label: "My First dataset",
                        fill: false,
                        lineTension: 0.1,
                        backgroundColor: "rgba(75,192,192,0.4)",
                        borderColor: "rgba(75,192,192,1)",
                        borderCapStyle: 'butt',
                        borderDash: [],
                        borderDashOffset: 0.0,
                        borderJoinStyle: 'miter',
                        pointBorderColor: "rgba(75,192,192,1)",
                        pointBackgroundColor: "#fff",
                        pointBorderWidth: 1,
                        pointHoverRadius: 5,
                        pointHoverBackgroundColor: "rgba(75,192,192,1)",
                        pointHoverBorderColor: "rgba(220,220,220,1)",
                        pointHoverBorderWidth: 2,
                        pointRadius: 1,
                        pointHitRadius: 10,
                        data: [65, 59, 80, 81, 56, 55, 40],
                        spanGaps: false,
                    }
                ]
            }

        });

        // Define a plugin to provide data labels
        Chart.plugins.register({
            afterDatasetsDraw: function (chart, easing) {
                // To only draw at the end of animation, check for easing === 1
                if (chart.config.options.use_plugin) {

                    var ctx = chart.ctx;

                    chart.data.datasets.forEach(function (dataset, i) {
                        var meta = chart.getDatasetMeta(i);
                        if (!meta.hidden) {
                            meta.data.forEach(function (element, index) {
                                // Draw the text in black, with the specified font
                                ctx.fillStyle = 'rgb(0, 0, 0)';

                                var fontSize = 14;
                                var fontStyle = 'normal';
                                var fontFamily = 'Helvetica Neue';
                                ctx.font = Chart.helpers.fontString(fontSize, fontStyle, fontFamily);

                                // Just naively convert to string for now
                                var dataString = dataset.data[index].toString();

                                // Make sure alignment settings are correct
                                ctx.textAlign = 'left';
                                ctx.textBaseline = 'top';

                                var padding = 0;
                                var position = element.tooltipPosition();
                                ctx.fillText(dataString, position.x + 5, position.y - (fontSize / 2) - padding);
                            });
                        }
                    });
                }
            }
        });


        setTimeout(() => {
            this.localNotification.requestPermission().then(
                (permission) => {
                    if (permission === 'granted') {

                        // Create the notification
                        this.localNotification.create('Parking Count', {
                            tag: 'message1',
                            body: 'No parking available for Menara LG4',
                            icon: 'assets/icon/favicon.ico'
                        });

                    }
                }
            );
        }, 2000);




    }

    /**
     * Prompt the user to add a new item. This shows our ItemCreatePage in a
     * modal and then adds the new item to our data source if the user created one.
     */
    addItem() {
        let addModal = this.modalCtrl.create('ItemCreatePage');
        addModal.onDidDismiss(item => {
            if (item) {
                this.items.add(item);
            }
        })
        addModal.present();
    }

    /**
     * Delete an item from the list of items.
     */
    deleteItem(item) {
        this.items.delete(item);
    }

    /**
     * Navigate to the detail page for this item.
     */
    openItem(item: Item) {
        this.navCtrl.push('ItemDetailPage', {
            item: item
        });
    }

    enableMenue() {
        this.activeMenu = 'menu1';
        //this.menu.enable(true, 'menu1');
        this.menu.enable(true, 'menu1');
    }



    toggleEdit() {
        this.editing = !this.editing;
        if (this.editing) {
            this.editButton = 'Done';
        } else {
            this.editButton = 'Edit';
        }
    }

    reorderData(indexes: any) {
        this.cardList = reorderArray(this.cardList, indexes);
    }



    /*launchLocationPage() {

        console.log('LocationPage');

        let modal = this.modalCtrl.create(LocationSelectPage);

        modal.onDidDismiss((location) => {
            console.log(location);
            if (location) {
                localStorage.setItem("destinationLatitude", location.lat);
                localStorage.setItem("destinationLongitude", location.lng);
                localStorage.setItem("destinationName", location.name);
            }




        });

        modal.present();

    }*/

    etaRefresher() {
        this.loadMap();
    }

    doRefresh(refresher: Refresher) {

        this.loadMap();

        console.log('DOREFRESH', refresher);
        let lat = '';
        let lon = '';

        if (localStorage.getItem("destinationLatitude") && localStorage.getItem("destinationLongitude")) {
            lat = localStorage.getItem("destinationLatitude");
            lon = localStorage.getItem("destinationLongitude")

        } else {

            lat = '3.115033';
            lon = '101.66577559999996';

        }


        console.log("ressss " + lat);



        this.weather.getWeather(lat, lon).subscribe((resp) => {
            console.log(resp);
            console.log("Refresher: " + resp['weather'][0].main);
            console.log("current condition" + this.weatherInfo[0].currentCondition);
            console.log("temp" + resp['main'].temp);

            localStorage.setItem("currentCondition", 'Rain');

            console.log(localStorage.getItem("currentCondition"));
            console.log(localStorage.getItem("destinationLatitude"));

            refresher.complete();
        }
        );
    }

    doPulling(refresher: Refresher) {
        console.log('DOPULLING', refresher.progress);
    }

    refreshData(): void {
        console.log('update...');
    }

    updateChartData() {
        this.carBarChart.data.datasets[0].data = [Math.round(Math.random() * 100), Math.round(Math.random() * 100), Math.round(Math.random() * 100)];
        this.bikeBarChart.data.datasets[0].data = [Math.round(Math.random() * 100), Math.round(Math.random() * 100), Math.round(Math.random() * 100)];
        //this.carBarChart.data.labels[3] = "New Label";
        this.carBarChart.update();
        this.bikeBarChart.update();
    }

    loadMap() {
        this.geolocation.getCurrentPosition().then((position) => {

            let latLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);


            let styles = {
                default: null,

                night: [
                    { elementType: 'geometry', stylers: [{ color: '#242f3e' }] },
                    { elementType: 'labels.text.stroke', stylers: [{ color: '#242f3e' }] },
                    { elementType: 'labels.text.fill', stylers: [{ color: '#746855' }] },
                    {
                        featureType: 'administrative.locality',
                        elementType: 'labels.text.fill',
                        stylers: [{ color: '#d59563' }]
                    },
                    {
                        featureType: 'poi',
                        elementType: 'labels.text.fill',
                        stylers: [{ color: '#d59563' }]
                    },
                    {
                        featureType: 'poi.park',
                        elementType: 'geometry',
                        stylers: [{ color: '#263c3f' }]
                    },
                    {
                        featureType: 'poi.park',
                        elementType: 'labels.text.fill',
                        stylers: [{ color: '#6b9a76' }]
                    },
                    {
                        featureType: 'road',
                        elementType: 'geometry',
                        stylers: [{ color: '#38414e' }]
                    },
                    {
                        featureType: 'road',
                        elementType: 'geometry.stroke',
                        stylers: [{ color: '#212a37' }]
                    },
                    {
                        featureType: 'road',
                        elementType: 'labels.text.fill',
                        stylers: [{ color: '#9ca5b3' }]
                    },
                    {
                        featureType: 'road.highway',
                        elementType: 'geometry',
                        stylers: [{ color: '#746855' }]
                    },
                    {
                        featureType: 'road.highway',
                        elementType: 'geometry.stroke',
                        stylers: [{ color: '#1f2835' }]
                    },
                    {
                        featureType: 'road.highway',
                        elementType: 'labels.text.fill',
                        stylers: [{ color: '#f3d19c' }]
                    },
                    {
                        featureType: 'transit',
                        elementType: 'geometry',
                        stylers: [{ color: '#2f3948' }]
                    },
                    {
                        featureType: 'transit.station',
                        elementType: 'labels.text.fill',
                        stylers: [{ color: '#d59563' }]
                    },
                    {
                        featureType: 'water',
                        elementType: 'geometry',
                        stylers: [{ color: '#17263c' }]
                    },
                    {
                        featureType: 'water',
                        elementType: 'labels.text.fill',
                        stylers: [{ color: '#515c6d' }]
                    },
                    {
                        featureType: 'water',
                        elementType: 'labels.text.stroke',
                        stylers: [{ color: '#17263c' }]
                    }
                ],

                retro: [
                    { elementType: 'geometry', stylers: [{ color: '#ebe3cd' }] },
                    { elementType: 'labels.text.fill', stylers: [{ color: '#523735' }] },
                    { elementType: 'labels.text.stroke', stylers: [{ color: '#f5f1e6' }] },
                    {
                        featureType: 'administrative',
                        elementType: 'geometry.stroke',
                        stylers: [{ color: '#c9b2a6' }]
                    },
                    {
                        featureType: 'administrative.land_parcel',
                        elementType: 'geometry.stroke',
                        stylers: [{ color: '#dcd2be' }]
                    },
                    {
                        featureType: 'administrative.land_parcel',
                        elementType: 'labels.text.fill',
                        stylers: [{ color: '#ae9e90' }]
                    },
                    {
                        featureType: 'landscape.natural',
                        elementType: 'geometry',
                        stylers: [{ color: '#dfd2ae' }]
                    },
                    {
                        featureType: 'poi',
                        elementType: 'geometry',
                        stylers: [{ color: '#dfd2ae' }]
                    },
                    {
                        featureType: 'poi',
                        elementType: 'labels.text.fill',
                        stylers: [{ color: '#93817c' }]
                    },
                    {
                        featureType: 'poi.park',
                        elementType: 'geometry.fill',
                        stylers: [{ color: '#a5b076' }]
                    },
                    {
                        featureType: 'poi.park',
                        elementType: 'labels.text.fill',
                        stylers: [{ color: '#447530' }]
                    },
                    {
                        featureType: 'road',
                        elementType: 'geometry',
                        stylers: [{ color: '#f5f1e6' }]
                    },
                    {
                        featureType: 'road.arterial',
                        elementType: 'geometry',
                        stylers: [{ color: '#fdfcf8' }]
                    },
                    {
                        featureType: 'road.highway',
                        elementType: 'geometry',
                        stylers: [{ color: '#f8c967' }]
                    },
                    {
                        featureType: 'road.highway',
                        elementType: 'geometry.stroke',
                        stylers: [{ color: '#e9bc62' }]
                    },
                    {
                        featureType: 'road.highway.controlled_access',
                        elementType: 'geometry',
                        stylers: [{ color: '#e98d58' }]
                    },
                    {
                        featureType: 'road.highway.controlled_access',
                        elementType: 'geometry.stroke',
                        stylers: [{ color: '#db8555' }]
                    },
                    {
                        featureType: 'road.local',
                        elementType: 'labels.text.fill',
                        stylers: [{ color: '#806b63' }]
                    },
                    {
                        featureType: 'transit.line',
                        elementType: 'geometry',
                        stylers: [{ color: '#dfd2ae' }]
                    },
                    {
                        featureType: 'transit.line',
                        elementType: 'labels.text.fill',
                        stylers: [{ color: '#8f7d77' }]
                    },
                    {
                        featureType: 'transit.line',
                        elementType: 'labels.text.stroke',
                        stylers: [{ color: '#ebe3cd' }]
                    },
                    {
                        featureType: 'transit.station',
                        elementType: 'geometry',
                        stylers: [{ color: '#dfd2ae' }]
                    },
                    {
                        featureType: 'water',
                        elementType: 'geometry.fill',
                        stylers: [{ color: '#b9d3c2' }]
                    },
                    {
                        featureType: 'water',
                        elementType: 'labels.text.fill',
                        stylers: [{ color: '#92998d' }]
                    }
                ],

                hiding: [
                    {
                        featureType: 'poi.business',
                        stylers: [{ visibility: 'off' }]
                    },
                    {
                        featureType: 'transit',
                        elementType: 'labels.icon',
                        stylers: [{ visibility: 'off' }]
                    }
                ]
            };


            let mapOptions = {
                center: latLng,
                scrollwheel: false,
                draggable: false,
                zoom: 15,
                zoomControl: true,
                streetViewControl: false,
                fullscreenControl: false,
                styles: styles['retro'],
                mapTypeId: google.maps.MapTypeId.ROADMAP
            }



            this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);

            let GeoMarker = new GeolocationMarker(this.map);

            let directionsService = new google.maps.DirectionsService;
            let directionsDisplay = new google.maps.DirectionsRenderer;

            console.log(directionsService);
            console.log(directionsDisplay);


            directionsDisplay.setMap(this.map);
            directionsDisplay.setPanel(this.directionsPanel.nativeElement);

            directionsService.route({
                origin: { lat: position.coords.latitude, lng: position.coords.longitude },
                destination: { lat: 3.116006, lng: 101.665624 },
                travelMode: google.maps.TravelMode['DRIVING']
            }, (res, status) => {

                console.log(res.routes[0].legs[0].distance.text);



                if (status == google.maps.DirectionsStatus.OK) {
                    directionsDisplay.setDirections(res);

                    let currentTimeSeconds = new Date().getTime() / 1000;
                    var eta = +currentTimeSeconds.toFixed(0) + +res.routes[0].legs[0].duration.value;
                    console.log("Text: " + eta);
                    this.date = new Date(eta * 1000);
                    // Hours part from the timestamp
                    this.hours = this.date.getHours();
                    var ampm = this.hours >= 12 ? 'PM' : 'AM';
                    if (this.hours > 12) {

                        this.hours = this.date.getHours() - 12;
                    } else {

                        if (this.hours == 0) {
                            this.hours = 12;
                        } else {
                            this.hours = this.date.getHours();
                        }


                    }

                    // Minutes part from the timestamp
                    this.minutes = "0" + this.date.getMinutes();
                    // Seconds part from the timestamp
                    this.seconds = "0" + this.date.getSeconds();


                    // Will display time in 10:30:23 format
                    //var etaTime = hours + ':' + minutes.substr(-2) + ':' + seconds.substr(-2) + ' ' + ampm;
                    this.etaTime = this.hours + ':' + this.minutes.substr(-2) + ' ' + ampm;
                    console.log("TIme ETA: " + this.etaTime)

                    this.directionInfo = [
                        {
                            distance: res.routes[0].legs[0].distance.text,
                            duration: res.routes[0].legs[0].duration.text,
                            eta: this.etaTime,
                            text: res.routes[0].legs[0].duration.text + "  • ≈  " + res.routes[0].legs[0].distance.text + ' to office',


                        }
                    ];
                } else {
                    console.warn(status);
                }

            });





        }, (err) => {
            console.log(err);
        });


    }


    addMarker() {

        let marker = new google.maps.Marker({
            map: this.map,
            animation: google.maps.Animation.DROP,
            position: this.map.getCenter()
        });

        let content = "<h4>Information!</h4>";

        this.addInfoWindow(marker, content);

    }

    addInfoWindow(marker, content) {

        let infoWindow = new google.maps.InfoWindow({
            content: content
        });

        google.maps.event.addListener(marker, 'click', () => {
            infoWindow.open(this.map, marker);
        });

    }

    startNavigating() {

        this.geolocation.getCurrentPosition().then((position) => {

            let directionsService = new google.maps.DirectionsService;
            let directionsDisplay = new google.maps.DirectionsRenderer;

            //console.log(directionsService);
            //console.log(directionsDisplay);


            directionsDisplay.setMap(this.map);
            //directionsDisplay.setPanel(this.directionsPanel.nativeElement);
            let newLat = position.coords.latitude;
            console.log(position.coords.latitude);
            directionsService.route({
                origin: { lat: newLat, lng: 101.665624 },
                destination: { lat: 3.116006, lng: 101.665624 },
                travelMode: google.maps.TravelMode['DRIVING']
            }, (res, status) => {

                console.log(res.routes[0].legs[0].distance.text);



                if (status == google.maps.DirectionsStatus.OK) {
                    directionsDisplay.setDirections(res);

                    let currentTimeSeconds = new Date().getTime() / 1000;
                    var eta = +currentTimeSeconds.toFixed(0) + +res.routes[0].legs[0].duration.value;
                    console.log("Text: " + eta);
                    this.date = new Date(eta * 1000);
                    // Hours part from the timestamp
                    this.hours = this.date.getHours();
                    var ampm = this.hours >= 12 ? 'PM' : 'AM';
                    if (this.hours > 12) {

                        this.hours = this.date.getHours() - 12;
                    } else {

                        if (this.hours == 0) {
                            this.hours = 12;
                        } else {
                            this.hours = this.date.getHours();
                        }


                    }

                    // Minutes part from the timestamp
                    this.minutes = "0" + this.date.getMinutes();
                    // Seconds part from the timestamp
                    this.seconds = "0" + this.date.getSeconds();


                    // Will display time in 10:30:23 format
                    //var etaTime = hours + ':' + minutes.substr(-2) + ':' + seconds.substr(-2) + ' ' + ampm;
                    this.etaTime = this.hours + ':' + this.minutes.substr(-2) + ' ' + ampm;
                    console.log("TIme ETA: " + this.etaTime)

                    this.directionInfo = [
                        {
                            distance: res.routes[0].legs[0].distance.text,
                            duration: res.routes[0].legs[0].duration.text,
                            eta: this.etaTime,
                            text: res.routes[0].legs[0].duration.text + "  • ≈  " + res.routes[0].legs[0].distance.text + ' to office',


                        }
                    ];
                } else {
                    console.warn(status);
                }

            });
            return 'OK';
        }, (err) => {
            console.log(err);
        });

    }

    launchNavigation() {

        this.launchNavigator.navigate([3.116006, 101.665624])
            .then(
            success => console.log('Launched navigator'),
            error => console.log('Error launching navigator', error)
            );



    }

    ngOnDestroy() {
        // always unsubscribe your subscriptions to prevent leaks
        this.onResumeSubscription.unsubscribe();
    }




}

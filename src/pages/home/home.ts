
import { Component, ViewChild, ElementRef } from '@angular/core';
import { IonicPage, ModalController, NavController, AlertController, ToastController, MenuController, reorderArray, Refresher } from 'ionic-angular';
import { Chart } from 'chart.js';

import { Item } from '../../models/item';
import { Items, Weather } from '../../providers/providers';

import { Geolocation } from '@ionic-native/geolocation';
import { Diagnostic } from '@ionic-native/diagnostic';
import { PhonegapLocalNotification } from '@ionic-native/phonegap-local-notification';


@IonicPage()
@Component({
    selector: 'page-home',
    templateUrl: 'home.html'
})
export class HomePage {
    activeMenu: string;
    currentItems: Item[];
    updateChart: any;
    //songs: any[];
    cardList: any[];
    weatherInfo: any[];
    currentInfo: any[];
    editButton: string = 'Edit';
    editing: boolean = false;


    @ViewChild('carBarCanvas') carBarCanvas;
    @ViewChild('bikeBarCanvas') bikeBarCanvas;
    @ViewChild('doughnutCanvas') doughnutCanvas;
    @ViewChild('lineCanvas') lineCanvas;




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
        public weather: Weather) {
        this.currentItems = this.items.query();

        this.weatherInfo = [
            {
                currentCondition: '',
                destinationLatitude: '',
                destinationLongitude: '',


            }
        ];





    }





    /**
     * The view loaded, let's query our items for the list
     */
    ionViewDidLoad() {

        this.updateChart = setInterval(() => {
            //this.refreshData();
            this.updateChartData();
          }, 1000);

          this.geolocation.getCurrentPosition().then((resp) => {
            // resp.coords.latitude
            // resp.coords.longitude
            console.log('Lat: ' + resp.coords.latitude);
            console.log('Lon: ' + resp.coords.longitude);
            /*let alert = this.alertCtrl.create({
              title: 'Your current location',
              subTitle: 'Lat: ' + resp.coords.latitude + ',Lon: ' + resp.coords.longitude,
              buttons: ['Ok']
             
            });
            alert.present();*/

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
        });


    

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


    doRefresh(refresher: Refresher) {
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

    refreshData() : void{
        console.log('update...');
    }

    updateChartData(){
        this.carBarChart.data.datasets[0].data = [Math.round(Math.random()*100), Math.round(Math.random()*100), Math.round(Math.random()*100)];
        this.bikeBarChart.data.datasets[0].data = [Math.round(Math.random()*100), Math.round(Math.random()*100), Math.round(Math.random()*100)];
        //this.carBarChart.data.labels[3] = "New Label";
        this.carBarChart.update();
        this.bikeBarChart.update();
    }



}

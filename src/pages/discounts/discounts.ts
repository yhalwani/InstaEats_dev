import { Component } from '@angular/core';
import { NavController, NavParams, Events, ActionSheetController } from 'ionic-angular';
import { Storage } from '@ionic/storage';

import firebase from 'firebase';

@Component({
  selector: 'page-discounts',
  templateUrl: 'discounts.html',
})
export class DiscountsPage {

  bundles: Array<{
    bundleName:            string,
    bundleDescription:     string,
    live:                  boolean,
    bundleElem:            Array<{
      menuGroupName:       string,
      menu:                Array<{
        name: string, description: string, price: number, checked: boolean, discount: number
      }>
    }>
  }>;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public events: Events,
    public storage: Storage,
    public actionSheetCtrl: ActionSheetController
  ) {

    var bundlesArr = [];
    var restaurantId = firebase.auth().currentUser.uid;
    var bundleNode = firebase.database().ref("/Bundles/" + restaurantId);

    bundleNode.once('value', (snapshot) => {
      console.log("In bundleNode");

      snapshot.forEach( (childSnapshot) => {
        console.log("  In forEach loop of " + childSnapshot.key);
        var bundle = {
          bundleName: childSnapshot.key,
          bundleDescription:"",
          live: false,
          bundleElem: []
        }
        childSnapshot.forEach((childSnapshot) => {
                  console.log("    In forEach loop of " + childSnapshot.key);
          if (childSnapshot.key == "description"){
            bundle.bundleDescription = childSnapshot.val();
          } else if (childSnapshot.key == "live") {
            bundle.live = childSnapshot.val();
          } else {
            childSnapshot.forEach((childSnapshot) => {
                      console.log("      In forEach loop of " + childSnapshot.key);
              var bundleE = {menuGroupName:"", menu: []};
              childSnapshot.forEach((childSnapshot) => {
                        console.log("        In forEach loop of " + childSnapshot.key);
                if(childSnapshot.key == "menuGroupName"){
                  bundleE.menuGroupName = childSnapshot.val();
                } else {
                  childSnapshot.forEach((childSnapshot) => {
                            console.log("          In forEach loop of " + childSnapshot.key);
                    var tmp = childSnapshot.val();
                    var menu = {
                      name:         tmp.name,
                      description:  tmp.description,
                      price:        tmp.price,
                      checked:      tmp.checked,
                      discount:     tmp.discount
                    };
                    bundleE.menu.push(menu);
                    return false;
                  })
                };
                return false;
              });
              bundle.bundleElem.push(bundleE);
              return false;
            });
          };
          return false;
        });
        bundlesArr.push(bundle);
        return false;
      });
      this.bundles = bundlesArr;
    });

    this.events.subscribe('bundle:created', (bundle) => {
      this.bundles = bundle;
    });

  };


  presentActionSheet(index) {
    let actionSheet = this.actionSheetCtrl.create({
      title: this.bundles[index].bundleName,
      buttons: [
        {
          text: 'Go Live!',
          handler: () => {
            var restRef = firebase.database().ref("Bundles/");
            var rest = firebase.auth().currentUser;
            restRef.child(rest.uid).child(this.bundles[index].bundleName).update({
              live: true
            });

          }
        },
        {
          text: 'Terminate!',
          handler: () => {
            var restRef = firebase.database().ref("Bundles/");
            var rest = firebase.auth().currentUser;
            restRef.child(rest.uid).child(this.bundles[index].bundleName).update({
              live: false
            });
          }
        },
        {
          text: 'Delete',
          handler: () => {
            var name = this.bundles[index].bundleName;

            // delete the bundle from firebase database
            var user = firebase.auth().currentUser;
            var ref = firebase.database().ref("/Bundles/" + user.uid);
            ref.child(name).remove();

            // delete from local as well
            this.bundles.splice(index,1);
            this.storage.get('bundles').then((list) => {
              list.splice(index,1);
              this.storage.set('bundles', list);
            });
          }
        }
      ]
    });

    actionSheet.present();
  }

}

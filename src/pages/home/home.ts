import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { AngularFireDatabase } from 'angularfire2/database';
import { SpeechRecognition } from '@ionic-native/speech-recognition';
import { Camera, CameraOptions } from '@ionic-native/camera';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  tasksRef;
  tasks = [];
  newTask = '';

  constructor(
    public navCtrl: NavController,
    private speechRecognition: SpeechRecognition,
    private db: AngularFireDatabase,
    private camera: Camera
  ) {
    this.tasksRef = this.db.list('tasks');
    this.tasksRef.subscribe((tasks)=>{
      this.tasks = tasks;
    });
  }

  addTask(image='') {
    this.tasksRef.push({
      name: this.newTask,
      image: image,
      createdAt: Date.now()
    });
    this.newTask = '';
  }

  removeTask(key) {
    this.tasksRef.remove(key);
  }

  startRecording() {

    let start = ()=> {
      this.speechRecognition.startListening()
        .subscribe(
          (matches: Array<string>) => {
            if (matches && matches.length) {
              this.newTask = matches[0];
              this.addTask();
            }
            console.log(matches)
          },
          (onerror) => console.log('error:', onerror)
        )
    }

    this.speechRecognition.hasPermission()
      .then((hasPermission: boolean) => {
        if (hasPermission) {
          start();
        } else {
        this.speechRecognition.requestPermission()
          .then(
            () => {
              console.log('Granted')
              start();
            },
            () => console.log('Denied')
          )
        }
      });
  }

  captureImage() {
    const options: CameraOptions = {
      quality: 100,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE
    }

    this.camera.getPicture(options).then((imageData) => {
    // imageData is either a base64 encoded string or a file URI
    // If it's base64:
      let base64Image = 'data:image/jpeg;base64,' + imageData;
      console.log(base64Image)
      this.addTask(base64Image);
    }, (err) => {
    // Handle error
    });
  }

}

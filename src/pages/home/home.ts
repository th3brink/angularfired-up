import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';

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
    private db: AngularFireDatabase
  ) {
    this.tasksRef = this.db.list('tasks');
    this.tasksRef.subscribe((tasks)=>{
      this.tasks = tasks;
    });

  }

  addTask() {
    this.tasksRef.push({
      name: this.newTask,
      createdAt: Date.now()
    });
    this.newTask = '';
  }

  removeTask(key) {
    this.tasksRef.remove(key);
  }

}

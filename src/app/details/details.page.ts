import { isPlatformServer } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { makeStateKey, TransferState } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { database } from 'firebase';

@Component({
  selector: 'app-details',
  templateUrl: './details.page.html',
  styleUrls: ['./details.page.scss'],
})
export class DetailsPage implements OnInit {
  id = null;
  data = null;
  constructor(  private http: HttpClient,
    private route: ActivatedRoute,
    @Inject(PLATFORM_ID) private platformId,
    private transferState: TransferState) {
      this.id = this.route.snapshot.paramMap.get('id');
      this.loadata();
     }

  ngOnInit() {

    database().ref('chongsinran').once('value',data=>{
      console.log(data.val())
    })
  }

  loadata() {
    const DATA_KEY = makeStateKey('pokemon-' + this.id);
    if (this.transferState.hasKey(DATA_KEY)) {
      console.log('Fetch data from State!');
      this.data = this.transferState.get(DATA_KEY, null);
      this.transferState.remove(DATA_KEY);
    } else {


      database().ref(this.id).once('value',data=>{
        if(data.val()){
          if (isPlatformServer(this.platformId)) {
            this.transferState.set(DATA_KEY, data.val());
          } else {
            this.data = data.val();
          }
        }
        console.log(data.val())
      })
      console.log('Get Data from API...');
    
    }
  }

}

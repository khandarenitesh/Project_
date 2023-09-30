import { Component, OnInit } from '@angular/core';
import { Observable, from, of } from 'rxjs';

@Component({
  selector: 'app-observable-practice',
  templateUrl: './observable-practice.component.html',
  styleUrls: ['./observable-practice.component.scss']
})
export class ObservablePracticeComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
    this.CreateObservable();
  }

  CreateObservable(){
  // const obs = Observable.create((observer:any)=>{
  //   observer.next('1');
  //   observer.next('2');
  //   observer.next('3');
  //   observer.complete();
  // });

  // obs.subscribe((value:any)=>{
  //   console.log('observable value',value);
  // })

  // const observable = new Observable((observer:any)=>{
  //   observer.next('1');
  //   observer.next('2');
  //   observer.next('3');
  //   observer.complete('complete');
  // });

  // observable.subscribe((value:any)=>{
  // console.log('values - ',value);
  // error:(error:any)=>{
  //   console.log(error);
  // }
  // complete:(complete:any)=>{
  //   console.log('completed',complete);
  // }
  // })

// const array =[1,2,3,4,5,6,7,8,9,10];
// const array1 = [10,11,12,13,14,15,16,17,18,19];
// const obsof1 = of(array,array1,1,2,3); //of operator return the value as of data
// const obsfrom2 = from('Hello World');
// const obsfrom1 = from(array); //from operator return signle value at times
// obsfrom2.subscribe((value:any)=>{
//   console.log('from operator! ',value);
// })


//   obsof1.subscribe((value:any)=>{
//     console.log('value received - ',value);
//     error:((error:any)=>{
//       console.log('error',error);
//     })
//     complete:((complete:any)=>{
//     console.log('complete',complete);
//     })
//   })

// let myMap = new Map();
// myMap.set(0,'Hello');
// myMap.set(1,'World');
// const obsfrom = from(myMap);
// obsfrom.subscribe((value:any)=>{
//   console.log('value',value);
//   error:(error:any)=>{
//     console.log('error',error);
//   }
//   complete:(cmp:any)=>{
//     console.log('error',cmp);
//   }

// })

// const promiseSource = from(new Promise(resolve => resolve('Hello World!')));
// const obsFrom5 = from(promiseSource);
// obsFrom5.subscribe(val => console.log(val),
//   error => console.log("error"),
//   () => console.log("complete"))

  const obs = new Observable((observer:any)=>{
    console.log('Observable start');

    setTimeout(()=>{
      {observer.next('1'),1000}
    });

    setTimeout(()=>{
      {observer.next('2'),2000}
    });
    setTimeout(()=>{
      {observer.next('3'),3000}
    })
  })

  }
}

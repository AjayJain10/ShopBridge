import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CommonServiceService {

  // https://crudcrud.com/api/2abae1151a1b487cb1e3b73b9a51a94e // Another API for PUT and POST
  baseURL: string = 'http://dummy.restapiexample.com/api/v1/';
  headers = new HttpHeaders({
    'Content-Type': 'application/json'
  });

  private itemsBSubject = new BehaviorSubject<number>(0);
  itemCountObservable = this.itemsBSubject.asObservable();

  private loaderBSubject = new BehaviorSubject<boolean>(false);
  loaderObservable = this.loaderBSubject.asObservable();

  constructor(private http: HttpClient) { }

  updateItemsCount(itemsCount: number) { // TO receive the items count from any non-related component
    this.itemsBSubject.next(itemsCount);
  }

  updateLoaderStatus(loaderFlag: boolean) { // To receive the loader actions to show and hide it whenever needed from any component
    this.loaderBSubject.next(loaderFlag);
  }

  getAllItems(): Observable<any> { // GET all items
    return this.http.get(this.baseURL + 'employees');
  }

  getItemById(itemId: number): Observable<any> { // GET item by ID
    return this.http.get(this.baseURL + 'employee/' + itemId);
  }

  deleteItem(id): Observable<any> { // DELETE item by ID
    return this.http.delete(this.baseURL + 'delete/' + id);
  }

  createItem(data: any): Observable<any> { // CREATE item by JSON data in req payload
    return this.http.post(this.baseURL + 'create', JSON.stringify(data), {headers: this.headers});
  }

  updateItem(itemId: number, data: any): Observable<any> { // UPDATE item by ID and JSON data in req payload
    return this.http.put(this.baseURL + 'update/' + itemId, JSON.stringify(data), {headers: this.headers});
  }

}

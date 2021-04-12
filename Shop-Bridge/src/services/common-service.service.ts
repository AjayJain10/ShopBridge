import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CommonServiceService {

  baseURL: string = 'http://dummy.restapiexample.com/api/v1/';
  headers = new HttpHeaders({
    'Content-Type': 'application/json'
  });
  private itemsBSubject = new BehaviorSubject<number>(0);
  itemCountObservable = this.itemsBSubject.asObservable();

  private loaderBSubject = new BehaviorSubject<boolean>(false);
  loaderObservable = this.loaderBSubject.asObservable();

  constructor(private http: HttpClient) { }

  updateItemsCount(itemsCount: number) {
    this.itemsBSubject.next(itemsCount);
  }

  updateLoaderStatus(loaderFlag: boolean) {
    this.loaderBSubject.next(loaderFlag);
  }

  getAllItems(): Observable<any> {
    return this.http.get(this.baseURL + 'employees');
  }

  getItemById(itemId: number): Observable<any> {
    return this.http.get(this.baseURL + 'employee/' + itemId);
  }

  deleteItem(id): Observable<any> {
    return this.http.delete(this.baseURL + 'delete/' + id);
  }

  createItem(data: any): Observable<any> {
    return this.http.post(this.baseURL + 'create', JSON.stringify(data), {headers: this.headers});
  }

  updateItem(itemId: number, data: any): Observable<any> {
    return this.http.put(this.baseURL + 'update/' + itemId, JSON.stringify(data), {headers: this.headers});
  }

}

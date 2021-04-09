import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CommonServiceService {

  baseURL: string = 'http://dummy.restapiexample.com/api/v1/';

  constructor(private http: HttpClient) { }

  getAllItems(): Observable<any> {
    return this.http.get(this.baseURL + 'employees');
  }

  deleteItem(id): Observable<any> {
    return this.http.delete(this.baseURL + 'delete/' + id);
  }

}

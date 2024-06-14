import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

const apiUrl = 'https://my-movies-flix-db-60666e043a4b.herokuapp.com/';

/**
 * @description Service for user registration operations.
 * @injectable
 */
@Injectable({
  providedIn: 'root'
})
export class FetchApiDataService {
  /**
    * @constructor
    * @param {HttpClient} http - Angular's HttpClient module for making HTTP requests.
    * @param {DataService} dataService - Service for handling shared data between components.
    */
  constructor(private http: HttpClient) {
  }

  /**
   * @description Making the api call for the user registration endpoint.
   * @param {any} userDetails - User details for registration.
   * @returns {Observable<any>} - Observable for the API response.
   */
  public userRegistration(userDetails: any): Observable<any> {
    console.log(userDetails);
    return this.http.post(apiUrl + 'users', userDetails).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * @description Making the api call for the user login endpoint.
   * @param {any} userDetails - User details for login.
   * @returns {Observable<any>} - Observable for the API response.
   */
  public userLogin(userDetails: any): Observable<any> {
    console.log(userDetails);
    return this.http.post(apiUrl + 'login', userDetails).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * @description Making the api call for the Get All Movies endpoint.
   * @returns {Observable<any>} - Observable for the API response.
   */
  public getAllMovies(): Observable<any> {
    const token = localStorage.getItem('token');
    return this.http.get(apiUrl + 'movies', {headers: new HttpHeaders(
      {
        Authorization: 'Bearer ' + token,
      })}).pipe(
        map(this.extractResponseData),
        catchError(this.handleError)
    );
  }

  /**
   * @description Making the api call for the Get One Movie endpoint.
   * @param {string} title - One movie title.
   * @returns {Observable<any>} - Observable for the API response.
   */
  public getOneMovies(title: string): Observable<any> {
    const token = localStorage.getItem('token');
    return this.http.get(apiUrl + 'movies/' + title, {
      headers: new HttpHeaders(
        {
          Authorization: 'Bearer ' + token,
        })}).pipe(
          map(this.extractResponseData),
          catchError(this.handleError)
    );
  }

  /**
   * @description Making the api call for the Get Director endpoint.
   * @returns {Observable<any>} - Observable for the API response.
   */
  public getDirector(directorName: string): Observable<any> {
    const token = localStorage.getItem('token');
    return this.http.get(apiUrl + 'movies/director/' + directorName, {
      headers: new HttpHeaders(
        {
          Authorization: 'Bearer ' + token,
        })}).pipe(
          map(this.extractResponseData),
          catchError(this.handleError)
    );
  }

  /**
   * @description Making the api call for the Get Genre endpoint.
   * @returns {Observable<any>} - Observable for the API response.
   */
  public getGenre(genreName: string): Observable<any> {
    const token = localStorage.getItem('token');
    return this.http.get(apiUrl + 'movies/genre/' + genreName, {
      headers: new HttpHeaders(
        {
          Authorization: 'Bearer ' + token,
        })}).pipe(
          map(this.extractResponseData),
          catchError(this.handleError)
    );
  }

  /**
   * @description Making the api call for the Get User endpoint.
   * @returns {Observable<any>} - Observable for the API response.
   */
  public getUser(): Observable<any> {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    return user;
  }

  /**
   * @description Making the api call for the Get Favorite Movies for a user endpoint.
   * @param {string} username - Users username for getting favorite Movies.
   * @returns {Observable<any>} - Observable for the API response.
   */
  public getFavoriteMovies(username: string): Observable<any> {
    const token = localStorage.getItem('token');
    return this.http.get(apiUrl + 'users/' + username, {
      headers: new HttpHeaders(
        {
          Authorization: 'Bearer ' + token,
        })}).pipe(
          map(this.extractResponseData),
          catchError(this.handleError)
    );
  }

  /**
   * @description Making the api call for the Add a Movie to Favorite Movies endpoint.
   * @param {any} movie - Movie for adding to favorite Movies.
   * @returns {Observable<any>} - Observable for the API response.
   */
  public addFavoriteMovies( movie: any ): Observable<any> {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const token = localStorage.getItem('token');
    console.log('in fetch api service: ', movie);
    console.log('in fetch api service_id: ', movie._id);
    return this.http.post(apiUrl + 'users/' + user.Username + '/movies/' + movie._id, null, {
      headers: new HttpHeaders(
        {
          Authorization: 'Bearer ' + token,
        })}).pipe(
          map(this.extractResponseData),
          catchError(this.handleError)
    );
  }

  /**
   * @description Making the api call for the Update User endpoint.
   * @param {any} userDetails - User details for updating user information.
   * @returns {Observable<any>} - Observable for the API response.
   */
  public updateUser(userDetails: any): Observable<any> {
    const token = localStorage.getItem('token');
    return this.http.put(apiUrl + 'users/' + userDetails.Username, userDetails, {
      headers: new HttpHeaders(
        {
          Authorization: 'Bearer ' + token,
        })}).pipe(
          map(this.extractResponseData),
          catchError(this.handleError)
    );
  }

  /**
   * @description Making the api call for the Delete User endpoint.
   * @returns {Observable<any>} - Observable for the API response.
   */
  public deleteUser(): Observable<any> {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const token = localStorage.getItem('token');
    return this.http.delete(apiUrl + 'users/' + user.Username, {
      headers: new HttpHeaders(
        {
          Authorization: 'Bearer ' + token,
        })}).pipe(
          map(this.extractResponseData),
          catchError(this.handleError)
    );
  }

  /**
   * @description Making the api call for the Delete a Movie to Favorite Movies endpoint.
   * @param {any} movie - Movie for deleting from favorite Movies.
   * @returns {Observable<any>} - Observable for the API response.
   */
  public deleteFavoriteMovies(movie: any): Observable<any> {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const token = localStorage.getItem('token');
    console.log('in fetch api service: ', movie._id);
    return this.http.delete(apiUrl + 'users/' + user.Username + '/movies/' + movie._id, {
      headers: new HttpHeaders(
        {
          Authorization: 'Bearer ' + token,
        })}).pipe(
          map(this.extractResponseData),
          catchError(this.handleError)
    );
  }

  /**
   * @description Non-typed response extraction.
   * @param {Object} res - API response.
   * @returns {any} - Extracted response data.
   */
  private extractResponseData(res: Object): any {
    const body = res;
    return body || {};
  }

  /**
   * @description Handling of HTTP errors.
   * @param {HttpErrorResponse} error - HTTP error response.
   * @returns {any} - Error details.
   */
  private handleError(error: HttpErrorResponse): any {
    if (error.error instanceof ErrorEvent) {
      console.error('Some error occurred:', error.error.message);
    } else {
      console.error(
        `Error Status code ${error.status}, ` +
        `Error body is: ${error.error}`);
    }
    return throwError(
      'Something bad happened; please try again later.');
  }
}

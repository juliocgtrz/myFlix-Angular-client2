import { Component, OnInit } from '@angular/core';
import { FetchApiDataService } from '../fetch-api-data.service';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { GenreInfoComponent } from '../genre-info/genre-info.component';
import { DirectorInfoComponent } from '../director-info/director-info.component';
import { MovieSynopsisComponent } from '../movie-synopsis/movie-synopsis.component';

/**
 * @description Component representing the movie card.
 * @selector 'app-movie-card'
 * @templateUrl './movie-card.component.html'
 * @styleUrls ['./movie-card.component.scss']
 */
@Component({
  selector: 'app-movie-card',
  templateUrl: './movie-card.component.html',
  styleUrl: './movie-card.component.scss'
})
export class MovieCardComponent implements OnInit {
  movies: any[] = [];
  user: any = {};
  userData = { Username: "", FavoriteMovies: [] };
  FavoriteMovies: any[] = [];
  isFavoriteMovie: boolean = false;

  

  /**
   * @constructor - Constructor for MovieCardComponent.
   * @param {FetchApiDataService} fetchApiData - Service for fetching data from the API.
   * @param {MatDialog} dialog - Material dialog service for opening dialogs.
   * @param {MatSnackBar} snackBar - Material snack bar service for displaying notifications.
   */
  constructor(
    public fetchApiData: FetchApiDataService,
    public dialog: MatDialog,
    public snackBar: MatSnackBar,
  ) {}

  /** @description lifecycle hook that is called after data-bound properties of directive are initialized */
  ngOnInit(): void {
    this.getMovies();
    this.getFavoriteMovies();
  }

  /**
   * @description Function for getting all movies.
   * @returns All movies.
   */
  getMovies(): void {
    this.fetchApiData.getAllMovies().subscribe((resp: any) => {
      this.movies = resp;
      console.log(this.movies);
      return this.movies;
    });
  }

  /**
   * @description Function that will open the dialog when genre button is clicked.
   * @param {string} name - Name of the genre.
   * @param {string} description - Description of the genre.
   * @returns Genre name and discription.
   */
  openGenreDialog(name: string, description: string): void {
    this.dialog.open(GenreInfoComponent, {
      data: {
        Name: name,
        Description: description,
      },
      width: '450px'
    });
  }

  /**
   * @description Function that will open the dialog when director button is clicked.
   * @param {string} name - Name of the director.
   * @param {string} bio - Biography of the director.
   * @param {string} birth - Birth date of the director.
   * @returns Directors name, bio, birth date and death date.
   */
  openDirectorDialog(name: string, bio: string, birth: string): void {
    this.dialog.open(DirectorInfoComponent, {
      data: {
        Name: name,
        Bio: bio,
        Birth: birth,
      },
      width: '450px',
    });
  }

  /**
   * @description Function that will open the dialog when synopsis button is clicked
   * @param {string} description - Description of the movie.
   * @returns Description of the movie.
   */
  openSynopsisDialog(description: string): void {
    this.dialog.open(MovieSynopsisComponent, {
      data: {
        Description: description,
      },
      width: '450px',
    });
  }

  /**
   * @description Function to get favMovie list.
   * @returns Favorite movies of user.
   */
  getFavoriteMovies(): void {
    this.user = this.fetchApiData.getUser();
    this.userData.FavoriteMovies = this.user.FavoriteMovies;
    this.FavoriteMovies = this.user.FavoriteMovies;
    console.log('Favorite Movies in getFavoriteMovie', this.FavoriteMovies);
  }

  /**
   * @description Function to check if movie is a favorite movie.
   * @param movie  - Movie object to check.
   * @returns {boolean} - Boolean indicating whether the movie is a favorite.
   */
  isFavorite(movie: any): any {
    const MovieID = movie._id;
    if (this.FavoriteMovies.some((movie) => movie === MovieID)) {
      return true;
    } else {
      return false;
    }
  }

  /**
   * @description Function add / delete favorite movie by icon button
   * @param {any} movie - Movie to toggle favorite icon for. 
   */
  toggleFavorite(movie: any): void {
    const isFavorite = this.isFavorite(movie);
    isFavorite
      ? this.deleteFavoriteMovies(movie)
      : this.addFavoriteMovies(movie);
  }

  /**
   * @description Function to add movie to FavoriteMovies list
   * @param {any} movie - Movie to add to favorite movies.
   * @returns Message "Movie added to your favorites successfully!"
   */
  addFavoriteMovies(movie: any): void {
    this.user = this.fetchApiData.getUser();
    this.userData.Username = this.user.Username;
    this.fetchApiData.addFavoriteMovies(movie).subscribe((result) => {
      localStorage.setItem('user', JSON.stringify(result));
      this.getFavoriteMovies(); 
      this.snackBar.open('Movie added to your favorites successfully!', 'OK', {
        duration: 3000,
      });
    });
  }

  /**
   * @description Function to delete movie from FavoriteMovies list.
   * @param {any} movie - Movie to delete from favorite movies.
   * @returns Message "Movie removed from your favorites successfully!"
   */
  deleteFavoriteMovies(movie: any): void {
    this.user = this.fetchApiData.getUser();
    this.userData.Username = this.user.Username;
    this.fetchApiData.deleteFavoriteMovies(movie).subscribe((result) => {
      localStorage.setItem('user', JSON.stringify(result));
      this.getFavoriteMovies();
      this.snackBar.open('Movie removed from your favorites successfully!', 'OK', {
        duration: 3000,
      });
    });
  }

}
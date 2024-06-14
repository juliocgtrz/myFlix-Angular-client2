import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

/**
 * @description Component representing the navbar.
 * @selector 'app-navbar'
 * @templateUrl './navbar.component.html'
 * @styleUrls ['./navbar.component.scss']
 */
@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent implements OnInit {
  /** username of the user when logged-in */
  public Username: string = "";

  /**
   * @constructor - Constructor for NavbarComponent. 
   * @param {Router} router - Router service for navigation.
   * @param {MatSnackBar} snackBar - Material snack bar service for displaying notifications.
   */
  constructor(
    public snackBar: MatSnackBar,
    public router: Router,
  ) { }

  /** @description lifecycle hook that is called after data-bound properties of a directive are initialized */
  ngOnInit(): void {
    this.Username = JSON.parse(localStorage.getItem("user")!).Username;
  }

  /** @description function to navigate to the movies page */
  public openMovies(): void {
    this.router.navigate(['movies']);
  }

  /** @description function to navigate to the profile page */
  public openProfile(): void {
    this.router.navigate(['profile']);
  }

  /**
   * @description Function to logout user.
   * @returns Message "You have been logged out successfully".
   */
  public logoutUser(): void {
    localStorage.setItem('token', '');
    localStorage.setItem('user', '');
    this.router.navigate(['welcome']);
    this.snackBar.open('You have been logged out successfully', 'OK', {
      duration: 2000,
    });
  }

}

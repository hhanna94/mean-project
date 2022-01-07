import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  // styleUrls: ['./registration.component.css']
})
export class RegistrationComponent implements OnInit {
  isLoading = false;

  constructor(public authService: AuthService) { }

  ngOnInit(): void {
  }

  onRegister(form: NgForm) {
    if (form.invalid) return;

    this.authService.createUser(form.value)
  }
}

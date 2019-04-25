import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormControl, Validators, ValidationErrors } from '@angular/forms';


import {AuthService} from '../auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['../auth.component.scss']
})
export class RegisterComponent implements OnInit {

  constructor(private authService: AuthService, private router: Router) { }

  ngOnInit() {
  }

  passwordsMatchValidator(control: FormControl): ValidationErrors {
    let password = control.root.get('password');
    return password && control.value !== password.value ? {
      passwordMatch: true
    }: null;
  }

  userForm = new FormGroup({
    firstName: new FormControl('', [Validators.required]),
    lastName: new FormControl('', [Validators.required]),
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required]),
    repeatPassword: new FormControl('', [Validators.required, this.passwordsMatchValidator])
  })

  get firstName(): any { return this.userForm.get('firstName'); }
  get lastName(): any { return this.userForm.get('lastName'); }
  get email(): any { return this.userForm.get('email'); }
  get password(): any { return this.userForm.get('password'); }
  get repeatPassword(): any { return this.userForm.get('repeatPassword'); }

  register() {

    if(!this.userForm.valid) return;

    let {
      firstName,
      lastName,
      email,
      password,
      repeatPassword
    } = this.userForm.getRawValue();

    this.authService.register(firstName, lastName, email, password, repeatPassword)
    .subscribe(data => {
      this.router.navigate(['']);
    })
  }

}

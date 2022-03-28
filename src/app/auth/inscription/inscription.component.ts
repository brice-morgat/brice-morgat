import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import firebase from 'firebase';

@Component({
  selector: 'app-inscription',
  templateUrl: './inscription.component.html',
  styleUrls: ['./inscription.component.scss']
})
export class InscriptionComponent implements OnInit {

  signUpForm: FormGroup = this.formBuilder.group({});
  errorMessage: string = "";

  constructor(private formBuilder: FormBuilder,
              private authService: AuthService,
              private router: Router) { }

  ngOnInit(): void {
    this.initForm();
  }

  checkPasswords(password: string, confirmPassword: string) { // here we have the 'passwords' group
    return password === confirmPassword ? false : { notSame: true }     
  }

  initForm(){
    this.signUpForm = this.formBuilder.group({
      displayName: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.pattern('[0-9a-zA-Z]{6,}')]],
    });
  }

  onSubmit() {
    const email = this.signUpForm!!.get('email')!!.value;
    const password = this.signUpForm!!.get('password')!!.value;
    const name = this.signUpForm!!.get('displayName')!!.value;
    this.authService.createNewUser(email, password).then(
      () => {
        this.router.navigate(['/article']);
        firebase.auth().currentUser!!.updateProfile({
          displayName: name
        })
      },
      (error) => {
        this.errorMessage = error;
      }
    )
  }

}

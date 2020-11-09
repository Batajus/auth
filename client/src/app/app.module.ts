import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { MaterialModule } from './material/material.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { LogoutComponent } from './logout/logout.component';
import { InterceptorService } from './auth/interceptor.service';

@NgModule({
    declarations: [AppComponent, LoginComponent, LogoutComponent],
    imports: [
        BrowserModule,
        ReactiveFormsModule,
        AppRoutingModule,
        MaterialModule,
        HttpClientModule,
        BrowserAnimationsModule
    ],
    providers: [{ provide: HTTP_INTERCEPTORS, useClass: InterceptorService, multi: true }],
    bootstrap: [AppComponent]
})
export class AppModule {}

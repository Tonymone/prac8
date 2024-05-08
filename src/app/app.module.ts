import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { FormsModule } from '@angular/forms'; // Import FormsModule
//import { CalendarModule } from 'ion2-calendar';
import { CalendarModule, DateAdapter } from 'angular-calendar'; // Import DateAdapter
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns'; // Import adapterFactory

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    CalendarModule.forRoot({
      provide: DateAdapter,
      useFactory: adapterFactory,
    }),
    FormsModule // Add FormsModule here
    
  ],
  providers: [{ provide: RouteReuseStrategy, useClass: IonicRouteStrategy , }],
  bootstrap: [AppComponent],
})
export class AppModule {}
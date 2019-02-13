
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { ChickenModule } from './modules/chicken.module';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    ChickenModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

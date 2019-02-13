import { NgModule } from "@angular/core";
import {
  MatSelectModule,
  MatFormFieldModule,
  MatDatepickerModule,
  MatInputModule,
  MatNativeDateModule,
  MatIconModule,
  MatButtonModule,
  MatTableModule,
  MatPaginatorModule,
  MatSortModule,
  DateAdapter,
  MAT_DATE_FORMATS,
  MatChipsModule,
  MatCheckboxModule,
  MatSidenavModule,
  MatOptionModule,
  MatCardModule,
  MatRippleModule,
  MatMenuModule,
  MatGridListModule,
  MatToolbarModule,
  MatListModule,
  MatDialogModule,
  MatSnackBarModule
} from "@angular/material";
import { AppDateAdapter, APP_DATE_FORMATS } from "../helper/date.adapter";

const IMPORT_EXPORT_ARRAY = [
  MatFormFieldModule,
  MatSelectModule,
  MatDatepickerModule,
  MatInputModule,
  MatNativeDateModule,
  MatIconModule,
  MatButtonModule,
  MatTableModule,
  MatPaginatorModule,
  MatSortModule,
  MatChipsModule,
  MatCheckboxModule,
  MatSidenavModule,
  MatOptionModule,
  MatCardModule,
  MatRippleModule,
  MatMenuModule,
  MatGridListModule,
  MatToolbarModule,
  MatListModule,
  MatDialogModule,
  MatSnackBarModule
];
@NgModule({
  imports: [IMPORT_EXPORT_ARRAY],
  exports: [IMPORT_EXPORT_ARRAY],
  providers: [
    {
      provide: DateAdapter,
      useClass: AppDateAdapter
    },
    {
      provide: MAT_DATE_FORMATS,
      useValue: APP_DATE_FORMATS
    }
  ]
})
export class MaterialModule {}

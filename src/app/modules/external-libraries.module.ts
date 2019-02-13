import { NgModule } from "@angular/core";
import { NgxElectronModule } from "ngx-electron";
import { NgpaRepositoryModule } from "ngpa-repository";
import { MaterialModule } from "./material.module";
import { FlexLayoutModule } from '@angular/flex-layout';

const IMPORT_EXPORT_ARRAY = [
    NgxElectronModule,
    NgpaRepositoryModule,
    MaterialModule,
    FlexLayoutModule
];

@NgModule({
    imports: [IMPORT_EXPORT_ARRAY],
    exports: [IMPORT_EXPORT_ARRAY]
})
export class ExternalLibraryModule {}
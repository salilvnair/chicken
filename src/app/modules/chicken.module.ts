import { NgModule } from "@angular/core";
import { ExternalLibraryModule } from "./external-libraries.module";
import { DashboardComponent } from "../dashboard/dashboard.component";
import { SanitizeHtmlPipe } from "../helper/safe-html.pipe";
import { CopyToClipboard } from "../helper/copy-to-clipboard.directive";
import { DashboardService } from "../dashboard/service/dashboard.service";
import { ThreadUtil } from "../helper/thread.util";
import { MatSvgIconComponent } from "../mat-svg-icon/mat-svg-icon.component";
import { FileHistoryComponent } from "../file-history/file-history.component";
import { GitDiffComponent } from "../git-diff/git-diff.component";
import { GitHistoryComponent } from "../git-history/git-history.component";
import { HttpClientModule } from "@angular/common/http";
import { ReactiveFormsModule, FormsModule } from "@angular/forms";
import { BrowserModule } from "@angular/platform-browser";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { SharedData } from "../shared/shared-data.service";
import { ChickenRoutingModule } from "../routes/chicken.routes";
import { SidenavComponent } from "../navigation/sidenav/sidenav.component";
import { HeaderComponent } from "../navigation/header/header.component";

const IMPORT_EXPORT_ARRAY = [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    ChickenRoutingModule,    
    ExternalLibraryModule,
    HttpClientModule
];

const COMPONENT_DECLARATION_EXPORT_ARRAY = [
    DashboardComponent,
    MatSvgIconComponent,
    FileHistoryComponent,
    GitHistoryComponent,
    GitDiffComponent,
    SidenavComponent,
    HeaderComponent
];
  
const DIRECTIVE_DECLARATION_EXPORT_ARRAY = [
      CopyToClipboard
];

const PIPE_DECLARATION_EXPORT_ARRAY = [
    SanitizeHtmlPipe
];

const PROVIDER_ARRAY = [
    DashboardService,
    ThreadUtil,
    SharedData
];

@NgModule({
    declarations:[
        COMPONENT_DECLARATION_EXPORT_ARRAY,
        DIRECTIVE_DECLARATION_EXPORT_ARRAY,
        PIPE_DECLARATION_EXPORT_ARRAY
    ],
    imports: [IMPORT_EXPORT_ARRAY],
    exports: [
        IMPORT_EXPORT_ARRAY,
        COMPONENT_DECLARATION_EXPORT_ARRAY,
        DIRECTIVE_DECLARATION_EXPORT_ARRAY,
        PIPE_DECLARATION_EXPORT_ARRAY
    ],
    providers:[PROVIDER_ARRAY]
})
export class ChickenModule {}
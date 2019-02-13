import { Component, OnInit, Input, Output, EventEmitter } from "@angular/core";
import { DomSanitizer } from "@angular/platform-browser";
import { MatIconRegistry } from "@angular/material";

@Component({
  selector: "mat-svg-icon",
  templateUrl: "./mat-svg-icon.component.html",
  styleUrls: ["./mat-svg-icon.component.css"]
})
export class MatSvgIconComponent implements OnInit {
  constructor(
    private matIconRegistry: MatIconRegistry,
    private domSanitizer: DomSanitizer
  ) {
    this.matIconRegistry.addSvgIcon(
      "added",
      this.domSanitizer.bypassSecurityTrustResourceUrl("assets/icons/added.svg")
    );
    this.matIconRegistry.addSvgIcon(
      "deleted",
      this.domSanitizer.bypassSecurityTrustResourceUrl(
        "assets/icons/deleted.svg"
      )
    );
    this.matIconRegistry.addSvgIcon(
      "modified",
      this.domSanitizer.bypassSecurityTrustResourceUrl(
        "assets/icons/modified.svg"
      )
    );
    this.matIconRegistry.addSvgIcon(
      "renamed",
      this.domSanitizer.bypassSecurityTrustResourceUrl(
        "assets/icons/modified.svg"
      )
    );
    this.matIconRegistry.addSvgIcon(
      "clipboard",
      this.domSanitizer.bypassSecurityTrustResourceUrl(
        "assets/icons/clipboard.svg"
      )
    );
    this.matIconRegistry.addSvgIcon(
      "history",
      this.domSanitizer.bypassSecurityTrustResourceUrl(
        "assets/icons/history.svg"
      )
    );
  }
  @Input("icon") icon: string;
  @Input("color") color: string = "primary";
  @Input("button") button: false;
  @Output() onClickEvent = new EventEmitter<any>();
  ngOnInit() {}
  onClick(event) {
    this.onClickEvent.emit(event);
  }
}

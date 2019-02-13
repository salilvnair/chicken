import { Component, OnInit, Output, EventEmitter } from "@angular/core";

@Component({
  selector: "icard-sidenav",
  templateUrl: "./sidenav.component.html",
  styleUrls: ["./sidenav.component.css"]
})
export class SidenavComponent implements OnInit {
  @Output() closeSideNav = new EventEmitter<void>();
  constructor() {}

  ngOnInit() {}

  onCloseSideNav() {
    this.closeSideNav.emit();
  }
}

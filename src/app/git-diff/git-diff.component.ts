import { Component, OnInit, Input } from "@angular/core";
// import { Diff2Html } from "diff2html";
import { Diff2Html } from "diff2html";
@Component({
  selector: "git-diff",
  templateUrl: "./git-diff.component.html",
  styleUrls: ["./git-diff.component.css"]
})
export class GitDiffComponent implements OnInit {
  outputHtml: string;
  constructor() {}
  @Input("diffInput") diffInput: string;
  @Input("compareSideBySide") compareSideBySide: boolean = false;
  ngOnInit() {
    console.info(Diff2Html);
    this.init();
  }

  init() {
    console.info(Diff2Html);
    // let strInput =
    //   "--- a/src/app/deploy/host-list/host-app/host-app.component.ts\n+++ b/src/app/deploy/host-list/host-app/host-app.component.ts\n@@ -57,7 +57,7 @@ export class HostAppComponent implements OnInit {\n deployDetail(row) {\n const rawdata = JSON.parse(JSON.stringify(row));\n let appid = rawdata.id;\n- this.router.navigate(['/deploy/detail'], {queryParams: {env: this.env, appId: appid}})\n+ this.router.navigate(['/deploy/detail'], {queryParams: {env: this.env, appId: appid, appCode:rawdata.code}})\n }\n }\n \n--- a/src/app/deploy/deploy-history/deploy-history.component.ts\n+++ b/src/app/deploy/deploy-history/deploy-history.component.ts\n@@ -71,7 +71,7 @@ export class DeployHistoryComponent implements OnInit {\n deployDetail(row) {\n const rawdata = JSON.parse(JSON.stringify(row));\n let appid = rawdata.app_id;\n- this.router.navigate(['/deploy/detail'], {queryParams: {env: this.env, appId: appid}})\n+ this.router.navigate(['/deploy/detail'], {queryParams: {env: this.env, appId: appid, appCode:rawdata.app_name}})\n }\n \n searchEnter(e) {\n}";
    let strInput = this.diffInput;
    let htmlString = "";
    if (this.compareSideBySide) {
      htmlString = Diff2Html.getPrettySideBySideHtmlFromDiff(strInput, {
        inputFormat: "diff",
        showFiles: true,
        matching: "words"
      });
    } else {
      htmlString = Diff2Html.getPrettyHtml(strInput, {
        inputFormat: "diff",
        showFiles: true,
        matching: "words"
      });
    }
    this.outputHtml = htmlString;
  }
}

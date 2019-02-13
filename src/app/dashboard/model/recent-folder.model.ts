import { Database, NeDBModel } from "ngpa-repository";

@Database("recent-folder")
export class RecentFolder {
  _id: string;
  folderName: string;
  folderPath: string;
  dateAdded: Date;
  pinned: boolean = false;
}

import { NeDBRepository } from "ngpa-repository";
import { RecentFolder } from "../model/recent-folder.model";

export class RecentFolderRepo extends NeDBRepository<RecentFolder> {
  returnEntityInstance(): RecentFolder {
    return new RecentFolder();
  }
}

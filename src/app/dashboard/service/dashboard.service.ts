import { Injectable } from "@angular/core";
import { RecentFolderRepo } from "../repo/recent-folder.repo";
import { RecentFolder } from "../model/recent-folder.model";

@Injectable()
export class DashboardService {
  constructor(private recentFolderRepo: RecentFolderRepo) {}

  saveRecentUsedRepository(recentFolder: RecentFolder) {
    this.recentFolderRepo.save(recentFolder);
  }

  loadRecentlyUsedRepositories(): Promise<RecentFolder[]> {
    return this.recentFolderRepo.selectAll();
  }

  updateRepoPinStatus(oldFolderEntity: RecentFolder, newFolderEntity: RecentFolder) {
    this.updateRecentFolderRepo(oldFolderEntity, newFolderEntity);
  }

  updateRecentFolderRepo(oldFolderEntity: RecentFolder, newFolderEntity: RecentFolder) {
    this.recentFolderRepo.update(oldFolderEntity, newFolderEntity);
    this.recentFolderRepo.compactDatabase();
  }
}

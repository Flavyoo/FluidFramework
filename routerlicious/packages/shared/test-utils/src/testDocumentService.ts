import {
    IDeltaStorageService,
    IDocumentDeltaConnection,
    IDocumentDeltaStorageService,
    IDocumentService,
    IDocumentStorageService,
    ISnapshotTree,
    ITokenProvider,
    ITree,
} from "@prague/container-definitions";
import * as resources from "@prague/gitresources";
import * as socketStorage from "@prague/routerlicious-socket-storage";
import { TestDocumentDeltaConnection } from "./";

class TestDocumentStorageService implements IDocumentStorageService {
    public get repositoryUrl(): string {
        return "";
    }

    public async getSnapshotTree(version?: resources.ICommit): Promise<ISnapshotTree> {
        return null;
    }

    public async getVersions(sha: string, count: number): Promise<resources.ICommit[]> {
        return [];
    }

    public async read(path: string): Promise<string> {
        return "";
    }

    public async getContent(version: resources.ICommit, path: string): Promise<string> {
        return "";
    }

    public async write(root: ITree, parents: string[], message: string): Promise<resources.ICommit> {
        const commit: resources.ICommit = {
            author: { date: "", email: "", name: ""},
            committer: { date: "", email: "", name: ""},
            message: "",
            parents: [],
            sha: "test",
            tree: {
                sha: "test",
                url: "test",
            },
            url: "test",
        };
        return commit;
    }

    public async createBlob(file: Buffer): Promise<resources.ICreateBlobResponse> {
        return null;
    }

    public async getBlob(sha: string): Promise<resources.IBlob> {
        return null;
    }

    public getRawUrl(sha: string): string {
        return null;
    }
}

export class TestDocumentService implements IDocumentService {
    private errorTracking = new socketStorage.DefaultErrorTracking();

    constructor(private deltaStorage: IDeltaStorageService, private tokenProvider: ITokenProvider) {
    }

    public async connectToStorage(
        tenantId: string,
        id: string): Promise<IDocumentStorageService> {
        return new TestDocumentStorageService();
    }

    public async connectToDeltaStorage(
        tenantId: string,
        id: string): Promise<IDocumentDeltaStorageService> {
        return new socketStorage.DocumentDeltaStorageService(tenantId, id, this.tokenProvider, this.deltaStorage);
    }

    public async connectToDeltaStream(
        tenantId: string,
        id: string): Promise<IDocumentDeltaConnection> {

        return new TestDocumentDeltaConnection(id, "test-client", false, "", undefined, undefined);
    }

    public branch(tenantId: string, id: string): Promise<string> {
        return Promise.reject("Not implemented");
    }

    public getErrorTrackingService() {
        return this.errorTracking;
    }
}

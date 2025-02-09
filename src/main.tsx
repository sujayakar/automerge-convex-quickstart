import { isValidAutomergeUrl, Repo } from "@automerge/automerge-repo";
// import { BroadcastChannelNetworkAdapter } from "@automerge/automerge-repo-network-broadcastchannel";
import { RepoContext } from "@automerge/automerge-repo-react-hooks";
import { IndexedDBStorageAdapter } from "@automerge/automerge-repo-storage-indexeddb";
import React from "react";
import ReactDOM from "react-dom/client";
import App, { type TaskList } from "./App.tsx";
import "./index.css";
import {
  // ConvexProvider,
  ConvexReactClient,
} from "convex/react";
import { sync } from "./sync.ts";

// We fall back to a demo backend so you can try it out before setting up your
// own Convex project.
const convexUrl =
  (import.meta.env.VITE_CONVEX_URL as string) ??
  "https://dazzling-cobra-717.convex.cloud";

const repo = new Repo({
  network: [
    // If you want tabs to immediately reflect each other's changes:
    // new BroadcastChannelNetworkAdapter(),
  ],
  storage: new IndexedDBStorageAdapter(),
});

const convex = new ConvexReactClient(convexUrl);

sync(repo, convex);

const rootDocUrl = `${document.location.hash.substring(1)}`;
let handle;
if (isValidAutomergeUrl(rootDocUrl)) {
  handle = repo.find(rootDocUrl);
} else {
  handle = repo.create<TaskList>({
    tasks: [{ id: crypto.randomUUID(), title: "", done: false }],
  });
}
const docUrl = (document.location.hash = handle.url);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <RepoContext.Provider value={repo}>
      {/* To use Convex for more than automerge sync, set up a ConvexProvider
       <ConvexProvider client={convex}> */}
      <App docUrl={docUrl} />
      {/* </ConvexProvider> */}
    </RepoContext.Provider>
  </React.StrictMode>
);

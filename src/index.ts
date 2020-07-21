const { name: packageName, version: packageVersion } = require("../package.json");
const G: any = global || window || {};
const PACKAGE_GUARD: symbol = Symbol.for(packageName);
if (PACKAGE_GUARD in G) {
	const conflictVersion = G[PACKAGE_GUARD];
	// tslint:disable-next-line: max-line-length
	const msg = `Conflict module version. Looks like two different version of package ${packageName} was loaded inside the process: ${conflictVersion} and ${packageVersion}.`;
	if (process !== undefined && process.env !== undefined && process.env.NODE_ALLOW_CONFLICT_MODULES === "1") {
		console.warn(msg + " This treats as warning because NODE_ALLOW_CONFLICT_MODULES is set.");
	} else {
		throw new Error(msg + " Use NODE_ALLOW_CONFLICT_MODULES=\"1\" to treats this error as warning.");
	}
} else {
	G[PACKAGE_GUARD] = packageVersion;
}

import { CancellationToken } from "@zxteam/contract";

export { AggregatedCancellationToken } from "./AggregatedCancellationToken";
export { CancellationTokenSource } from "./CancellationTokenSource";
export { ManualCancellationTokenSource } from "./ManualCancellationTokenSource";
export { TimeoutCancellationTokenSource } from "./TimeoutCancellationTokenSource";

export { sleep } from "./sleep";

export const DUMMY_CANCELLATION_TOKEN: CancellationToken = Object.freeze({
	get isCancellationRequested(): boolean { return false; },
	addCancelListener(cb: Function): void {/* Dummy */ },
	removeCancelListener(cb: Function): void {/* Dummy */ },
	throwIfCancellationRequested(): void {/* Dummy */ }
});


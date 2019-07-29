import * as zxteam from "@zxteam/contract";

export interface CancellationTokenSource {
	readonly isCancellationRequested: boolean;
	readonly token: zxteam.CancellationToken;
	cancel(): void;
}

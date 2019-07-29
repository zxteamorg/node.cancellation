import * as zxteam from "@zxteam/contract";
import { AggregateError, CancelledError, wrapErrorIfNeeded } from "@zxteam/errors";

import { CancellationTokenSource } from "./CancellationTokenSource";

export class SimpleCancellationTokenSource implements CancellationTokenSource {
	private readonly _token: zxteam.CancellationToken;
	private readonly _cancelListeners: Array<Function> = [];
	private _isCancellationRequested: boolean;

	public constructor() {
		this._isCancellationRequested = false;
		const self = this;
		this._token = {
			get isCancellationRequested() { return self.isCancellationRequested; },
			addCancelListener(cb) { self.addCancelListener(cb); },
			removeCancelListener(cb) { self.removeCancelListener(cb); },
			throwIfCancellationRequested() { self.throwIfCancellationRequested(); }
		};
	}

	public get token(): zxteam.CancellationToken { return this._token; }
	public get isCancellationRequested(): boolean { return this._isCancellationRequested; }

	public cancel(): void {
		if (this._isCancellationRequested) {
			// Prevent to call listeners twice
			return;
		}
		this._isCancellationRequested = true;
		const errors: Array<Error> = [];
		if (this._cancelListeners.length > 0) {
			// Release callback. We do not need its anymore
			const cancelListeners = this._cancelListeners.splice(0);
			cancelListeners.forEach(cancelListener => {
				try {
					cancelListener();
				} catch (e) {
					errors.push(wrapErrorIfNeeded(e));
				}
			});
		}
		if (errors.length > 0) {
			throw new AggregateError(errors);
		}
	}

	private addCancelListener(cb: Function): void {
		this._cancelListeners.push(cb);
	}

	private removeCancelListener(cb: Function): void {
		const cbIndex = this._cancelListeners.indexOf(cb);
		if (cbIndex !== -1) {
			this._cancelListeners.splice(cbIndex, 1);
		}
	}

	private throwIfCancellationRequested(): void {
		if (this.isCancellationRequested) {
			throw new CancelledError();
		}
	}
}

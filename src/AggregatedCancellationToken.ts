import { CancellationToken } from "@zxteam/contract";
import { AggregateError, wrapErrorIfNeeded } from "@zxteam/errors";

/**
 * Wrap several tokens as CancellationToken
 */
export class AggregatedCancellationToken implements CancellationToken {
	private readonly _innerTokens: Array<CancellationToken>;
	private readonly _cancelListeners: Array<Function> = [];

	private _isCancellationRequested: boolean;

	public constructor(...tokens: Array<CancellationToken>) {
		this._innerTokens = tokens;
		this._isCancellationRequested = false;

		const listener = () => {
			for (const innerToken of tokens) {
				innerToken.removeCancelListener(listener);
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
		};
		for (const innerToken of tokens) {
			innerToken.addCancelListener(listener);
		}
	}

	/**
	 * Returns `true` if any of inner tokens requested cancellation
	 */
	public get isCancellationRequested(): boolean {
		return this._isCancellationRequested;
	}

	public addCancelListener(cb: Function): void {
		this._cancelListeners.push(cb);
	}

	public removeCancelListener(cb: Function): void {
		const cbIndex = this._cancelListeners.indexOf(cb);
		if (cbIndex !== -1) {
			this._cancelListeners.splice(cbIndex, 1);
		}
	}

	public throwIfCancellationRequested(): void {
		for (const innerToken of this._innerTokens) {
			innerToken.throwIfCancellationRequested();
		}
	}
}

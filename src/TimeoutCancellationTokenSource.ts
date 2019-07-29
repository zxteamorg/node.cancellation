import { SimpleCancellationTokenSource } from "./SimpleCancellationTokenSource";

export class TimeoutCancellationTokenSource extends SimpleCancellationTokenSource {
	private _timeoutHandler: any;

	public constructor(timeout: number) {
		super();

		this._timeoutHandler = setTimeout(() => {
			if (this._timeoutHandler !== undefined) { delete this._timeoutHandler; }
			super.cancel();
		}, timeout);
	}
	public cancel(): void {
		if (this._timeoutHandler !== undefined) {
			clearTimeout(this._timeoutHandler);
			delete this._timeoutHandler;
		}
		super.cancel();
	}

	/**
	 * After call this method, the instance behaves is as `SimpleCancellationTokenSource`
	 */
	public stopTimer(): void {
		if (this._timeoutHandler !== undefined) {
			clearTimeout(this._timeoutHandler);
			delete this._timeoutHandler;
		}
	}
}

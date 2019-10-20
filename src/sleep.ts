import { CancellationToken } from "@zxteam/contract";
import { CancelledError } from "@zxteam/errors";

/**
 * Provide a "sleeping" `Promise` that completes via timeout or cancellationToken
 * @param cancellationToken The cancellation token to cancel "sleeping"
 * @param ms Timeout delay in milliseconds. If ommited,the "sleeping" `Promise` will sleep infinitely and wait for cancellation token activation
 * @example
 * await sleep(DUMMY_CANCELLATION_TOKEN, 25); // Suspend execution for 25 milliseconds
 * @example
 * const cancellationTokenSource = new ManualCancellationTokenSource();
 * ...
 * await sleep(cancellationTokenSource.token, 25); // Suspend execution for 25 milliseconds or cancel if cancellationTokenSource activates
 * @example
 * const cancellationTokenSource = new ManualCancellationTokenSource();
 * ...
 * await sleep(cancellationTokenSource.token); // Suspend infinitely while cancellationTokenSource activates
 */
export function sleep(cancellationToken: CancellationToken, ms?: number): Promise<void> {
	return new Promise<void>((resolve, reject) => {
		if (cancellationToken.isCancellationRequested) {
			return reject(new CancelledError());
		}

		let timeout: NodeJS.Timeout | null = null;

		if (ms !== undefined) {
			function timeoutCallback() {
				cancellationToken.removeCancelListener(cancelCallback);
				return resolve();
			}
			timeout = setTimeout(timeoutCallback, ms);
		}

		function cancelCallback() {
			cancellationToken.removeCancelListener(cancelCallback);
			if (timeout !== null) {
				clearTimeout(timeout);
			}
			return reject(new CancelledError());
		}

		cancellationToken.addCancelListener(cancelCallback);
	});
}

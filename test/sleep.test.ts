import { AggregateError, CancelledError } from "@zxteam/errors";

import { assert } from "chai";

import { sleep, ManualCancellationTokenSource, TimeoutCancellationTokenSource, DUMMY_CANCELLATION_TOKEN } from "../src/index";

describe("ManualCancellationTokenSource tests", function () {
	it("Should cancel sleep() before started", async () => {
		let expectedError;

		const cancellationTokenSource = new ManualCancellationTokenSource();
		cancellationTokenSource.cancel();
		sleep(cancellationTokenSource.token, 1000).catch(err => { expectedError = err; });
		await new Promise(wakeup => setTimeout(wakeup, 25));

		assert.isDefined(expectedError);
		assert.instanceOf(expectedError, CancelledError);
	});
	it("Should cancel sleep() after start", async () => {
		let expectedError;

		const cancellationTokenSource = new ManualCancellationTokenSource();
		const sleepTask = sleep(cancellationTokenSource.token, 1000).catch(err => { expectedError = err; });
		await new Promise(wakeup => setTimeout(wakeup, 25));

		cancellationTokenSource.cancel();

		await sleepTask;

		assert.isDefined(expectedError);
		assert.instanceOf(expectedError, CancelledError);
	});
	it("Should cancel sleep() via cancellationToken", async () => {
		let expectedError;

		const cancellationTokenSource = new ManualCancellationTokenSource();
		sleep(cancellationTokenSource.token).catch(err => { expectedError = err; });

		await new Promise(wakeup => setTimeout(wakeup, 10));

		assert.isUndefined(expectedError);

		cancellationTokenSource.cancel();

		assert.isUndefined(expectedError);

		await new Promise(wakeup => setTimeout(wakeup, 10));

		assert.isDefined(expectedError);
		assert.instanceOf(expectedError, CancelledError);
	});
	it("Should cancel sleep() via Timeout", async () => {
		let expectedError;

		const cancellationTokenSource = new TimeoutCancellationTokenSource(25);

		const sleepTask = sleep(cancellationTokenSource.token, 1000).catch(err => { expectedError = err; });

		await new Promise(wakeup => setTimeout(wakeup, 50));

		await sleepTask;


		assert.isDefined(expectedError);
		assert.instanceOf(expectedError, CancelledError);
	});
	it("Should cancel sleep() via Timeout before start", async () => {
		let expectedError;

		const cancellationTokenSource = new TimeoutCancellationTokenSource(24 * 60 * 60 * 1000/* long timeout */);

		cancellationTokenSource.cancel();

		sleep(cancellationTokenSource.token, 1000).catch(err => { expectedError = err; });

		await new Promise(wakeup => setTimeout(wakeup, 50));


		assert.isDefined(expectedError);
		assert.instanceOf(expectedError, CancelledError);
	});
	it("Should cancel sleep() via Timeout + call cancel()", async () => {
		let expectedError;

		const cancellationTokenSource = new TimeoutCancellationTokenSource(24 * 60 * 60 * 1000/* long timeout */);

		const sleepTask = sleep(cancellationTokenSource.token, 1000).catch(err => { expectedError = err; });

		await new Promise(wakeup => setTimeout(wakeup, 50));

		cancellationTokenSource.cancel();

		assert.isUndefined(expectedError);

		await sleepTask;

		assert.isDefined(expectedError);
		assert.instanceOf(expectedError, CancelledError);
	});
});

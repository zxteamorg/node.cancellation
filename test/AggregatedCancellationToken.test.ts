import * as zxteam from "@zxteam/contract";
import { AggregateError, CancelledError } from "@zxteam/errors";

import { assert } from "chai";

import {
	AggregatedCancellationToken,
	CancellationTokenSource,
	ManualCancellationTokenSource
} from "../src/index";

describe("ManualCancellationTokenSource tests", function () {
	it("Should not cancel", async function () {
		const cts1: CancellationTokenSource = new ManualCancellationTokenSource();
		const cts2: CancellationTokenSource = new ManualCancellationTokenSource();

		const token: zxteam.CancellationToken =
			new AggregatedCancellationToken(cts1.token, cts2.token);

		assert.isFalse(token.isCancellationRequested);
	});

	it("Should cancel by first token", async function () {
		let cancel = false;

		const cts1: CancellationTokenSource = new ManualCancellationTokenSource();
		const cts2: CancellationTokenSource = new ManualCancellationTokenSource();

		const token: zxteam.CancellationToken =
			new AggregatedCancellationToken(cts1.token, cts2.token);

		token.addCancelListener(() => { cancel = true; });

		cts1.cancel();

		assert.isTrue(cancel);
	});

	it("Should cancel by first token #2", async function () {
		const cts1: CancellationTokenSource = new ManualCancellationTokenSource();
		const cts2: CancellationTokenSource = new ManualCancellationTokenSource();

		const token: zxteam.CancellationToken =
			new AggregatedCancellationToken(cts1.token, cts2.token);

		cts1.cancel();

		assert.isTrue(token.isCancellationRequested);
	});

	it("Should cancel by second token", async function () {
		let cancel = false;

		const cts1: CancellationTokenSource = new ManualCancellationTokenSource();
		const cts2: CancellationTokenSource = new ManualCancellationTokenSource();

		const token: zxteam.CancellationToken =
			new AggregatedCancellationToken(cts1.token, cts2.token);

		token.addCancelListener(() => { cancel = true; });

		cts2.cancel();

		assert.isTrue(cancel);
	});

	it("Should cancel by second token #2", async function () {
		const cts1: CancellationTokenSource = new ManualCancellationTokenSource();
		const cts2: CancellationTokenSource = new ManualCancellationTokenSource();

		const token: zxteam.CancellationToken =
			new AggregatedCancellationToken(cts1.token, cts2.token);

		cts2.cancel();

		assert.isTrue(token.isCancellationRequested);
	});

	it("Should be able to removeCancelListener", async function () {
		let cancel = false;

		const cts1: CancellationTokenSource = new ManualCancellationTokenSource();
		const cts2: CancellationTokenSource = new ManualCancellationTokenSource();

		const token: zxteam.CancellationToken =
			new AggregatedCancellationToken(cts1.token, cts2.token);

		const listener = () => { cancel = true; };

		token.addCancelListener(listener);
		token.removeCancelListener(listener);

		cts2.cancel();

		assert.isFalse(cancel);
	});

	it("Should call cancel callback once", async function () {
		let cancelCount = 0;

		const cts1: CancellationTokenSource = new ManualCancellationTokenSource();
		const cts2: CancellationTokenSource = new ManualCancellationTokenSource();

		const token: zxteam.CancellationToken =
			new AggregatedCancellationToken(cts1.token, cts2.token);

		token.addCancelListener(() => { ++cancelCount; });

		cts1.cancel();
		cts2.cancel();

		assert.equal(cancelCount, 1, "Cancel callback should call once");
	});

	it("Should throw if cancel", async function () {
		const cts1: CancellationTokenSource = new ManualCancellationTokenSource();
		const cts2: CancellationTokenSource = new ManualCancellationTokenSource();

		const token: zxteam.CancellationToken =
			new AggregatedCancellationToken(cts1.token, cts2.token);

		cts1.cancel();

		let expectedError!: Error;
		try {
			token.throwIfCancellationRequested();
		} catch (e) {
			expectedError = e;
		}

		assert.isDefined(expectedError);
		assert.instanceOf(expectedError, CancelledError);
	});
});

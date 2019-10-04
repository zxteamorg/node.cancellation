import * as zxteam from "@zxteam/contract";
import { AggregateError } from "@zxteam/errors";

import { assert } from "chai";

import { CancellationTokenSource, ManualCancellationTokenSource } from "../src/index";

describe("ManualCancellationTokenSource tests", function () {
	it("Should cancel two listeners", async function () {
		let cancel1 = false;
		let cancel2 = false;

		const cts: CancellationTokenSource = new ManualCancellationTokenSource();

		const token: zxteam.CancellationToken = cts.token;

		token.addCancelListener(() => { cancel1 = true; });
		token.addCancelListener(() => { cancel2 = true; });

		cts.cancel();

		assert.isTrue(cancel1);
		assert.isTrue(cancel2);
	});
});

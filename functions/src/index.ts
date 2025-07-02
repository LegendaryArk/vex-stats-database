/**
 * Import function triggers from their respective submodules:
 *
 * import {onCall} from "firebase-functions/v2/https";
 * import {onDocumentWritten} from "firebase-functions/v2/firestore";
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

import { setGlobalOptions } from "firebase-functions";
import { onRequest } from "firebase-functions/https";
import * as logger from "firebase-functions/logger";

import { initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { onDocumentCreated } from "firebase-functions/firestore";
import * as axios from "axios";

import { TeamJson } from "./teamData";
import { TeamStats } from "./teamStats";
import { getToken } from "./tokens";

// Start writing functions
// https://firebase.google.com/docs/functions/typescript

// For cost control, you can set the maximum number of containers that can be
// running at the same time. This helps mitigate the impact of unexpected
// traffic spikes by instead downgrading performance. This limit is a
// per-function limit. You can override the limit for each function using the
// `maxInstances` option in the function's options, e.g.
// `onRequest({ maxInstances: 5 }, (req, res) => { ... })`.
// NOTE: setGlobalOptions does not apply to functions using the v1 API. V1
// functions should each use functions.runWith({ maxInstances: 10 }) instead.
// In the v1 API, each function can only serve one request per container, so
// this will be the maximum concurrent request count.
setGlobalOptions({ maxInstances: 10, timeoutSeconds: 300 });

export const helloWorld = onRequest((request, response) => {
	logger.info("Hello logs!", { structuredData: true });
	response.send("Hello from Firebase!");
});

export const addMessage = onRequest(async (req, res) => {
	logger.info("messages");
	const original = req.query.text;
	const writeRes = await getFirestore().collection("messages").add({ original: original });
	res.json({ result: `Message with ID: ${writeRes.id} added` });
});

export const makeUppercase = onDocumentCreated("messages/{documentId}", (event) => {
	const original = event.data?.data().original;
	logger.log("Uppercasing", event.params.documentId, original);

	const uppercase = original.toUpperCase();

	return event.data?.ref.set({ uppercase }, { merge: true });
});

export const robotevents = onRequest(async (req, response) => {
	try {
		const res = await axios.get("https://robotevents.com/api/v2/teams?per_page=100", {
			headers: {
				Authorization: `Bearer ${getToken()}`
			}
		});

		const json: TeamJson = res.data as TeamJson;
		// console.log(json);

		while (json.meta.current_page < json.meta.last_page) {
			const res = await axios.get(json.meta.next_page_url, {
				headers: {
					Authorization: `Bearer ${getToken()}`
				}
			});
			const result: TeamJson = res.data as TeamJson;
			json.meta = result.meta;
			json.data.push(...result.data);
		}

		let teams: TeamStats[] = [];
		json.data.forEach((v, i) => {
			teams.push(new TeamStats());
			teams[i].updateTeamInfo(v);
		});

		console.log(teams);
		response.status(200).send(teams);
	} catch (error: any) {
		response.status(500).send("Error fetching data: " + error.message);
	}
});

initializeApp();

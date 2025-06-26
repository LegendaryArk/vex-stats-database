import { DocumentData } from "firebase-admin/firestore";
import { TeamData } from "./teamData"

enum Grade {
	HS = "High School",
	MS = "Middle School",
	CO = "College"
}

export class TeamStats {
	id: number = 0;
	number: String = "";
	name: String = "";
	grade?: Grade = undefined;

	skillsProg: number = 0;
	skillsDriver: number = 0;
	skillsTotal: number = 0;
	skillsRank: number = 0;

	opr: number = 0;
	dpr: number = 0;
	ccwm: number = 0;

	ts: number = 0;
	tsRank: number = 0;

	constructor() {}

	updateTeamInfo(data: TeamData) {
		this.id = data.id;
		this.number = data.number;
		this.name = data.team_name;
		this.grade = (Object.values(Grade) as unknown as String).includes(data.grade) ? data.grade as unknown as Grade : undefined;
	}

	toDocumentData(): DocumentData {
		return {
			id: this.id,
			number: this.number,
			name: this.name,
			grade: this.grade,
			skillsProg: this.skillsProg,
			skillsDriver: this.skillsDriver,
			skillsTotal: this.skillsTotal,
			skillsRank: this.skillsRank,
			ts: this.ts,
			tsRank: this.tsRank
		};
	}
}
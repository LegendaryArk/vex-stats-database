export interface TeamJson {
	meta: Meta
	data: TeamData[]
  }
  
  export interface Meta {
	current_page: number
	first_page_url: string
	from: number
	last_page: number
	last_page_url: string
	next_page_url: string
	path: string
	per_page: number
	prev_page_url: any
	to: number
	total: number
  }
  
  export interface TeamData {
	id: number
	number: string
	team_name: string
	robot_name?: string
	organization?: string
	location: Location
	registered: boolean
	program: Program
	grade: string
  }
  
  export interface Location {
	venue: any
	address_1: string
	address_2: any
	city: string
	region?: string
	postcode: string
	country: string
	coordinates: Coordinates
  }
  
  export interface Coordinates {
	lat: number
	lon: number
  }
  
  export interface Program {
	id: number
	name: string
	code: string
  }
  
export type Activity = {
  time: string
  title: string
  description: string
  place?: string
}

export type DayPlan = {
  day: number
  title: string
  activities: Activity[]
}

export type Hotel = {
  name: string
  priceRange: string
  area: string
  image?: string
  geoQuery?: string
}

export type TripPlan = {
  title: string
  origin: string
  destination: string
  duration: string
  budget: string
  groupSize: string
  hotels: Hotel[]
  days: DayPlan[]
}
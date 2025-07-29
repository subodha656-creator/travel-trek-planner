export interface Trip {
  id: number;
  title: string;
  destination: string;
  start_date: string;
  end_date: string;
  cover_image_url: string;
  notes: string;
  days?: Array<{
    id: number;
    date: string;
    activities: Array<{
      id: number;
      time: string;
      activity: string;
      location: string;
    }>;
  }>;
}
import {
  Select, SelectTrigger, SelectContent, SelectItem, SelectValue,
} from "@/components/ui/select";
import TeamMembersPanel from "@/components/tripItem/team-members";
import TripDaysPanel from "@/components/tripItem/trip-days-panel";
import DaySchedule from "@/components/tripItem/day-schedule";
import AddActivityModal from "@/components/tripItem/add-location-modal";
import TripHeaderCard from "@/components/tripItem/trip-header-card";
import MapWithToggle from "@/components/tripItem/map-with-toggle";
import { useTripContext } from "@/context/trip-context";
import TripMapHeader from "@/components/tripItem/trip-map-header";

const ItineraryPageContent = async() => {


  return (
    <div className="space-y-6 mt-8 mb-8">
      <TripHeaderCard
      />
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2 rounded-4xl">
          <div className="bg-white rounded-4xl border border-[outset]/40 overflow-hidden">
            <TripMapHeader

            />
            <MapWithToggle
            />
          </div>
        </div>

        <div className="space-y-6">
          <TeamMembersPanel

          />
          <TripDaysPanel

          />
            <DaySchedule
            
            />
        </div>
      </div>
    </div>
  );
};

export default ItineraryPageContent;

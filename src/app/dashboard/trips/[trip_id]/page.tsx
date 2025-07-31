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
    <>
    <section className="grid grid-cols-3 my-16 border-[1px] p-2">
      <div className="col-span-2">
        <TripHeaderCard/>
        <MapWithToggle/>
      </div>
      <div className="col-span-1">
          <TeamMembersPanel

          />
          <TripDaysPanel

          />
            <DaySchedule
            
            />
      </div>

    </section>
    
    </>
  );
};

export default ItineraryPageContent;


import React from 'react';
import { Driver } from '@/firebase/drivers';
import DataUsageIndicator from "@/components/DataUsageIndicator";
import MapPlaceholder from "@/components/MapPlaceholder";
import SearchingRide from "@/components/ride/SearchingRide";
import DriverSelectList from "@/components/ride/DriverSelectList";
import DriverCard from "@/components/ride/DriverCard";
import RideInProgress from "@/components/ride/RideInProgress";
import RideSummary from "@/components/ride/RideSummary";

interface RideContentProps {
  status: 'searching' | 'selectingDriver' | 'matched' | 'arriving' | 'inProgress' | 'completed';
  totalData: number;
  usedData: number;
  availableDrivers: Driver[];
  selectedDriver: Driver | null;
  loadingDrivers: boolean;
  dataUsedDuringRide: number;
  elapsedTime: number;
  ride: {
    pickupLocation: string;
    dropoffLocation: string;
    distance: number;
    duration: number;
    baseFare: number;
    dataUsed: number;
    dataCost: number;
    totalCost: number;
    paymentMethod: 'cash' | 'card';
  };
  onSelectDriver: (driver: Driver) => void;
  onConfirmPayment: () => void;
}

const RideContent = ({
  status,
  totalData,
  usedData,
  availableDrivers,
  selectedDriver,
  loadingDrivers,
  dataUsedDuringRide,
  elapsedTime,
  ride,
  onSelectDriver,
  onConfirmPayment
}: RideContentProps) => {
  return (
    <main className="flex-1 overflow-auto p-4 space-y-4">
      <MapPlaceholder />
      
      {status !== 'completed' && (
        <DataUsageIndicator 
          totalData={totalData || 500} 
          usedData={usedData} 
          className="glass-card p-3 rounded-lg animate-fade-in"
        />
      )}
      
      {status === 'searching' && (
        <SearchingRide />
      )}
      
      {status === 'selectingDriver' && (
        <DriverSelectList 
          drivers={availableDrivers}
          onSelectDriver={onSelectDriver}
          isLoading={loadingDrivers}
        />
      )}
      
      {(status === 'matched' || status === 'arriving') && selectedDriver && (
        <DriverCard driver={selectedDriver} />
      )}
      
      {status === 'inProgress' && selectedDriver && (
        <RideInProgress 
          elapsedTime={elapsedTime}
          dataUsedDuringRide={dataUsedDuringRide}
          dropoffLocation={ride.dropoffLocation}
          driver={selectedDriver}
        />
      )}
      
      {status === 'completed' && (
        <RideSummary 
          ride={{
            ...ride,
            dataUsed: dataUsedDuringRide,
            dataCost: dataUsedDuringRide * 0.01,
            totalCost: ride.baseFare + (dataUsedDuringRide * 0.01)
          }} 
          onConfirm={onConfirmPayment} 
        />
      )}
    </main>
  );
};

export default RideContent;

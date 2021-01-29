export interface VendorInterface {
  name: string;
  departureAirport: string;
  map: string;
  features: string[];
}
export interface ParkingInterface {
  id: number;
  indoor: boolean;
  insurance: boolean;
  price: string;
}
export interface DictionaryInterface {
  bookYourParking: string;
  featuresTitle: string;
  indoorSpace: string;
  outdoorSpace: string;
  insuranceIncluded: string;
  insuranceExcluded: string;
}
export interface ModelInterface {
  vendor: VendorInterface;
  parkings: ParkingInterface[];
  dictionary: DictionaryInterface;
}

import { Float } from "react-native/Libraries/Types/CodegenTypes";

export interface LocationProps {
  latitude: Float;
  longitude: Float;
}

export interface MapRendererProps {
  isShowLocationPressed: boolean;
  setIsShowLocationPressed: any;
  propertyLocation: LocationProps;
}

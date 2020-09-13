import actions from '../actions/app';
import {handleActions} from 'redux-actions';

export const appInitialState = {
  initializing: false,
  currentImage: null,
  markers: [],
  selectedMarker: null,
  followUserLocation: true,
  isWalking: false,
};

const reducerMap = {
  [actions.setInitializing]: (state, action) => {
    return {
      ...state,
      initializing: action.payload,
    };
  },
  [actions.setCurrentImage]: (state, action) => {
    return {
      ...state,
      currentImage: action.payload,
    };
  },
  [actions.setSelectedMarker]: (state, action) => {
    return {
      ...state,
      selectedMarker: action.payload,
    };
  },
  [actions.setMarkers]: (state, action) => {
    return {
      ...state,
      markers: [...action.payload],
    };
  },
  [actions.setFollowUserLocation]: (state, action) => {
    return {
      ...state,
      followUserLocation: action.payload,
    };
  },
  [actions.setIsWalking]: (state, action) => {
    return {
      ...state,
      isWalking: action.payload,
    };
  },
};

const reducer = handleActions(reducerMap, appInitialState);
export default reducer;

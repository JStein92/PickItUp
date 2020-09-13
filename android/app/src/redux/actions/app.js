import {createActions} from 'redux-actions';

const prefix = 'APP';

const actionTypes = [
  'SET_INITIALIZING',
  'SET_CURRENT_IMAGE',
  'SET_SELECTED_MARKER',
  'SET_FOLLOW_USER_LOCATION',
  'SET_MARKERS',
  'SET_IS_WALKING',
];

export default createActions(...actionTypes, {prefix});

import {createActions} from 'redux-actions';

const prefix = 'APP';

const actionTypes = [
  'SET_INITIALIZING',
  'SET_CURRENT_IMAGE',
  'SET_SELECTED_MARKER',
  'SET_FOLLOW_USER_LOCATION',
];

export default createActions(...actionTypes, {prefix});

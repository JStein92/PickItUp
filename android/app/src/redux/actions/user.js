import {createActions} from 'redux-actions';

const prefix = 'USER';

const actionTypes = [
  'SET_USER',
  'SET_LOCATION',
  'ADD_COORDINATE',
  'CLEAR_COORDINATES',
];

export default createActions(...actionTypes, {prefix});

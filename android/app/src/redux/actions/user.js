import {createActions} from 'redux-actions';

const prefix = 'USER';

const actionTypes = ['SET_USER', 'SET_LOCATION'];

export default createActions(...actionTypes, {prefix});

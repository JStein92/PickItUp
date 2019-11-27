import {createActions} from 'redux-actions';

const prefix = 'APP';

const actionTypes = ['SET_INITIALIZING', 'SET_CURRENT_IMAGE'];

export default createActions(...actionTypes, {prefix});

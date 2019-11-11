import {createActions} from 'redux-actions';

const prefix = 'APP';

const actionTypes = ['SET_INITIALIZING'];

export default createActions(...actionTypes, {prefix});

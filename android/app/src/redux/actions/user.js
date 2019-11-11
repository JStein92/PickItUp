import {createActions} from 'redux-actions';

const prefix = 'USER';

const actionTypes = ['SET_USER'];

export default createActions(...actionTypes, {prefix});

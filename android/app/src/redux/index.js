import {createStore, combineReducers, applyMiddleware, compose} from 'redux';
import thunk from 'redux-thunk';
import userReducer from './reducers/user';
import appReducer from './reducers/app';

const rootReducer = combineReducers({
  user: userReducer,
  app: appReducer,
});
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const middleWare = [thunk];

export function createNewStore() {
  const store = createStore(
    rootReducer,
    composeEnhancers(applyMiddleware(...middleWare)),
  );
  return store;
}

const store = createStore(
  rootReducer,
  composeEnhancers(applyMiddleware(...middleWare)),
);

export default store;

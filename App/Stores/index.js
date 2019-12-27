import { combineReducers } from 'redux';
import {configureStore} from './createStore';
import rootSaga from '../Sagas';
import { reducer as authReducer } from './Auth/Reducers';
import { reducer as dealsReducer } from './Deals/Reducers';
// import { reducer as videoReducer } from './Video/Reducers';


export default () => {
  const rootReducer = combineReducers({
    
    auth: authReducer,
    deals: dealsReducer,
    
  })

  return configureStore(rootReducer, rootSaga)
}
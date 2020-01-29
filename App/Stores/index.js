import { combineReducers } from 'redux';
import {configureStore} from './createStore';
import rootSaga from '../Sagas';
import { reducer as authReducer } from './Auth/Reducers';




export default () => {
  const rootReducer = combineReducers({
    
    auth: authReducer,
    
    
  })

  return configureStore(rootReducer, rootSaga)
}
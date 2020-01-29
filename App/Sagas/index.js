import { takeLatest, all } from 'redux-saga/effects'

import { AuthTypes } from '../Stores/Auth/Actions'




import { createUser } from './AuthSaga'




export default function* root() {
  yield all([
    /**
     * @see https://redux-saga.js.org/docs/basics/UsingSagaHelpers.html
     */
    // Run the startup saga when the application starts
    takeLatest(AuthTypes.CREATE_USER_REQUEST, createUser),

  

    
  ])
}

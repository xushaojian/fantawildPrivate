import React from 'react'
import { render } from 'react-dom'
import { createStore } from 'redux'
import { Provider } from 'react-redux'
import App from './components/App'
import rootReducer from './reducers'

// reducer 传入 Redux 提供的 createStore 函数中，返回 store 对象
const store = createStore(rootReducer)

render(
  //将 store 挂载在组件树的根部
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
)

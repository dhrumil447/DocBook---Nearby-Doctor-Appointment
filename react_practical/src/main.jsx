import { createRoot } from 'react-dom/client'
// import './index.css'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap/dist/js/bootstrap.js'
import { BrowserRouter} from 'react-router'
import Routing from './components/Routing'
import { Provider } from 'react-redux'
import mystore from './redux/mystore.js'

createRoot(document.getElementById('root')).render(
  <Provider store={mystore}>
  <BrowserRouter>
    <Routing/>
  </BrowserRouter>
  </Provider>
)


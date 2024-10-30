import {createRoot} from 'react-dom/client'
import './css/index.css'
import AppRouter from "./router/AppRouter.tsx";
import {BrowserRouter} from "react-router-dom";

createRoot(document.getElementById('root')!).render(
  <BrowserRouter>
    <AppRouter />
  </BrowserRouter>,
)

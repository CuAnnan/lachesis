import { useState } from 'react'
import {Routes, Route, Outlet, Navigate} from "react-router-dom";
import conf from '../conf.js';


import Layout from "./components/Layout.jsx";


function App()
{
    return (<Routes>
        <Route path="/" element={<Layout />}>

        </Route>
    </Routes>);
}


export default App

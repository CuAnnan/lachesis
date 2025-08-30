import { useState } from 'react'
import conf from '../conf.js';
import {Routes, Route, Outlet, Navigate} from "react-router-dom";

import Layout from "./components/Layout.jsx";
import Character from "./components/character/Character.jsx";


function App()
{
    return (<Routes>
        <Route path="/" element={<Layout />}>
            <Route path="/character" element={<Character />} />
        </Route>

    </Routes>);
}



export default App

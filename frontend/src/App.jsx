import {Routes, Route, Outlet, Navigate} from "react-router-dom";

import Layout from "./components/Layout.jsx";
import CharacterEditor from "@CharacterEditor/CharacterEditor.jsx";
import CharacterSheetUI from "@CharacterSheet/CharacterSheetUI.jsx";

function App()
{
    return (<Routes>
        <Route path="/" element={<Layout />}>
            <Route path="/character" element={<CharacterEditor />} />
            <Route path="/character/:nanoid/edit" element={<CharacterEditor />} />
            <Route path="/character/:nanoid/view" element={<CharacterSheetUI />} />
        </Route>

    </Routes>);
}



export default App

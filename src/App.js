
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Showusers from "./componentes/showusers";

function App() {
  return (
   <BrowserRouter>
   <Routes>
      <Route path="/" element={<Showusers></Showusers>}></Route>
   </Routes>
   </BrowserRouter>
  );
}

export default App;

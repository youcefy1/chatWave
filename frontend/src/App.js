import Register from './components/Register';
import Login from './components/Login';
import Home from './components/Home';
import Layout from './components/Layout';
import Admin from './components/Admin';
import Missing from './components/Missing';
import Unauthorized from './components/Unauthorized';
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import RequireAuth from './components/RequireAuth';
import PersistLogin from './components/PersistLogin';
import { Routes, Route, useNavigate } from 'react-router-dom';
import PublicHome from './components/PublicHome';


const $ = require("jquery");
window.$ = $;
window.jQuery = $;
require("bootstrap/dist/js/bootstrap.min");

const ROLES = {
  'User': 2001,
  'Admin': 5150
}

function App() {
  return (
    <>
    <img src="background.png" alt="" className="bg" />
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route path='/home' element={<PublicHome />} />
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />
        <Route path="unauthorized" element={<Unauthorized />} />

        <Route element={<PersistLogin />}>
          <Route element={<RequireAuth allowedRoles={[ROLES.User]} />}>
            <Route path="/" element={<Home />} />
          </Route>



          <Route element={<RequireAuth allowedRoles={[ROLES.Admin]} />}>
            <Route path="admin" element={<Admin />} />
          </Route>
        </Route>

        {/* catch all */}
        <Route path="*" element={<Missing />} />
      </Route>
    </Routes>
    </>
  );
}

export default App;
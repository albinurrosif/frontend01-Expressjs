import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import Mahasiswa from '../pages/Mahasiswa';
import Jurusan from '../pages/Jurusan';
import Login from '../pages/auth/Login';
import Register from '../pages/auth/Register';
function Routing() {
  const token = localStorage.getItem('token');
  const isLoggedIn = !!token;
  // const navigate = useNavigate();
  const handleLogout = () => {
    localStorage.removeItem('token');
    console.log('Berhasil Logout');
    window.location.reload();
  };
  return (
    <Router>
      <div>
        <nav className="navbar navbar-expand-lg navbar-light bg-light">
          <div className="container-fluid">
            <a className="navbar-brand">Frontend</a>
            <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
              <span className="navbar-toggler-icon"></span>
            </button>
            <div className="collapse navbar-collapse" id="navbarNav">
              <ul className="navbar-nav">
                <li className="nav-item">
                  <Link className="nav-link active" to="/mhs">
                    Mahasiswa
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/jrsn">
                    Jurusan
                  </Link>
                </li>
                {isLoggedIn ? (
                  <li className="nav-item">
                    <Link className="nav-link" onClick={handleLogout}>
                      Logout
                    </Link>
                  </li>
                ) : (
                  <li className="nav-item">
                    <Link className="nav-link" to="/login">
                      Login
                    </Link>
                  </li>
                )}
              </ul>
            </div>
          </div>
        </nav>

        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/mhs" element={<Mahasiswa />} />
          <Route path="/jrsn" element={<Jurusan />} />
        </Routes>
      </div>
    </Router>
  );
}

export default Routing;

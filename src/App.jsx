import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./database/authcontext";
import ProtectedRoute from "./components/ProtectedRoute"; 
import Login from './views/Login'
import Encabezado from "./components/Encabezado";
import Inicio from "./views/Inicio";
import Categorias from "./views/Categorias";
import Productos from "./views/Productos";
import Catalogo from "./views/Catalogo";
import Libros from "./views/Libros";
import Clima from "./views/Clima";
import Empleados from "./views/Empleados";
import Pronunciacion from "./views/Pronunciacion";
import './App.css'
import Estadisticas from "./components/estadisticas/Estadisticas";

function App() {
  return (
    <AuthProvider>
      <Router>
          <Encabezado />
          <main className="margen-superior-main">
            <Routes>
              <Route path="/" element={<Login />} />
              <Route path="/inicio" element={<ProtectedRoute element={<Inicio />} />} />
              <Route path="/categorias" element={<ProtectedRoute element={<Categorias />} />}/>
              <Route path="/productos" element={<ProtectedRoute element={<Productos />} />}/>
              <Route path="/catalogo" element={<ProtectedRoute element={<Catalogo />} />}/>
              <Route path="/libros" element={<ProtectedRoute element={<Libros />} />}/>
              <Route path="/clima" element={<ProtectedRoute element={<Clima />} />}/>
              <Route path="/pronunciacion" element={<ProtectedRoute element={<Pronunciacion />} />}/>
              <Route path="/estadisticas" element={<ProtectedRoute element={<Estadisticas />} />}/>
              <Route path="/empleados" element={<ProtectedRoute element={<Empleados />} />}/>
            </Routes>
          </main>
      </Router>
    </AuthProvider>
  )
}

export default App;
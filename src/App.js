import { Navigate, Route, Routes } from 'react-router-dom';
import './App.scss';
import Dashboard from './pages/dashboard';
import Login from './pages/login';
import Register from './pages/register';
import { app, database } from './firebaseConfig';

function App() {
  return (
    <Routes>
      <Route path='*' element={<Navigate to={'/login'} />} />
      <Route path={'/register'} element={<Register database={database} />} />
      <Route path={'/login'} element={<Login />} />
      <Route path={'/dashboard'} element={<Dashboard database={database}/>} />
    </Routes>

  );
}

export default App;

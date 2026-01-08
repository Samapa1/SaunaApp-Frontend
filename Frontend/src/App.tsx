import { Route, Routes } from 'react-router-dom';
import { useAuth } from "react-oidc-context";
import Calendar from "./components/Calendar"
import Home from './components/Home';

function App() {
  const auth = useAuth();

  const signOutRedirect = () => {
    auth.removeUser()
    const clientId = "3j48smp8k3nq09m6dk2ar2m6fl";
    const logoutUri = import.meta.env.LOGOUT_URL;
    const cognitoDomain = import.meta.env.COGNITO_DOMAIN;
    window.location.href = `${cognitoDomain}/logout?client_id=${clientId}&logout_uri=${encodeURIComponent(logoutUri)}`;
  };

  if (auth.isLoading) {
    return <div>Loading...</div>;
  }

  if (auth.error) {
    return <div>Encountering error... {auth.error.message}</div>;
  }

  if (auth.isAuthenticated) {
    return(
      <div>
        <Routes>
            <Route path='/' element={<Home/>} />
            <Route path='/sauna1' element={<Calendar sauna={"Sauna 1"}/>} />
            <Route path='/sauna2' element={<Calendar sauna={"Sauna 2"}/>} />
            <Route path='/sauna3' element={<Calendar sauna={"Sauna 3"}/>} />
            <Route path='/sauna4' element={<Calendar sauna={"Sauna 4"}/>} />
            <Route path='/sauna5' element={<Calendar sauna={"Sauna 5"}/>} />
            <Route path="*" element={<Home/>} />
        </Routes>
        <button onClick={() => signOutRedirect()}>Sign out</button>
      </div>
    )
  }

  return (
    <div>
      <button onClick={() => auth.signinRedirect()}>Sign in</button>
    </div>
  );
}

export default App;
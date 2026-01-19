import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom';
import React from "react";
import { AuthProvider } from "react-oidc-context";

import App from './App.tsx'

const cognitoAuthConfig = {
  authority: "https://cognito-idp.eu-west-1.amazonaws.com/eu-west-1_qeIDiHinq",
  client_id: "3j48smp8k3nq09m6dk2ar2m6fl",
  redirect_uri: "http://localhost:5173/",
  response_type: "code",
  scope: "email openid phone",
};


createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider {...cognitoAuthConfig}>
        <App />
      </AuthProvider>
    </BrowserRouter>
   </React.StrictMode>
)





import { useCallback, useState } from 'react';

import LoadingButton from '@mui/lab/LoadingButton';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';

import { appsettings } from 'src/settings/appsettings';

import { useNavigate } from 'react-router-dom';
import { useRouter } from 'src/routes/hooks';

import { Iconify } from 'src/components/iconify';

// ----------------------------------------------------------------------

/* Solicitud al backend */
const loginRequest = async (username: string, password: string): Promise<any> => {
  try {
    const response = await fetch(`${appsettings.apiUrl}login`, { 
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });

    if (!response.ok) {
      throw new Error('Login failed');
    }

    const token = await response.text();
    return token;
  } catch (error) {
    console.error("Error during login",error);
    throw error;
  }
}

// ----------------------------------------------------------------------
export function SignInView() {
  const navigate = useNavigate();
  const router = useRouter();

  const [showPassword, setShowPassword] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSignIn = useCallback( async () => {
    setLoading(true);

    // Llamamos a la API para autenticar
    const token = await loginRequest(username, password);

    if (token) {
      // Guardamos el token en localStorage (o sessionStorage)
      localStorage.setItem('token', token);

      // Decodificamos el token JWT para obtener los roles y datos
      const decodedToken = JSON.parse(atob(token.split('.')[1]));

      // Extraemos los valores del token usando las claves completas (URLs) que proporcionaste
      const role = decodedToken['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'];
      const givenName = decodedToken['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/givenname'];
      const surname = decodedToken['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/surname'];
      const emailAddress = decodedToken['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress'];

      // Guardamos el rol y los datos adicionales en localStorage
      localStorage.setItem('userRole', role);
      localStorage.setItem('givenName', givenName);
      localStorage.setItem('surname', surname);
      localStorage.setItem('emailAddress', emailAddress);

      if (role === 'Administrador') {
        navigate('/');
      } else {
        navigate('/bank');
      }
    } else {
      alert('Login fallido. Intenta nuevamente');
    }

    setLoading(false);
  }, [username, password, navigate]);

  const renderForm = (
    <Box display="flex" flexDirection="column" alignItems="flex-end">
      <TextField
        fullWidth
        name="email"
        label="Usuario"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        InputLabelProps={{ shrink: true }}
        sx={{ mb: 3 }}
      />

      <TextField
        fullWidth
        name="password"
        label="Contraseña"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        InputLabelProps={{ shrink: true }}
        type={showPassword ? 'text' : 'password'}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                <Iconify icon={showPassword ? 'solar:eye-bold' : 'solar:eye-closed-bold'} />
              </IconButton>
            </InputAdornment>
          ),
        }}
        sx={{ mb: 3 }}
      />

      <LoadingButton
        fullWidth
        size="large"
        type="submit"
        color="inherit"
        variant="contained"
        onClick={handleSignIn}
        loading={loading}
      >
        Ingresar
      </LoadingButton>
    </Box>
  );

  return (
    <>
      <Box gap={1.5} display="flex" flexDirection="column" alignItems="center" sx={{ mb: 5 }}>
        <Typography variant="h5">Iniciar Sesión</Typography>
      </Box>

      {renderForm}
    </>
  );
}

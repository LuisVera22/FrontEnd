import { lazy, Suspense, useEffect, useState } from 'react';
import { Navigate, Outlet, useRoutes } from 'react-router-dom';


import Box from '@mui/material/Box';
import LinearProgress, { linearProgressClasses } from '@mui/material/LinearProgress';

import ProtectedRoute from 'src/routes/components/ProtectedRoute';

import { AuthLayout } from 'src/layouts/auth';
import { DashboardLayout } from 'src/layouts/dashboard';
import { varAlpha } from 'src/theme/styles';

// ----------------------------------------------------------------------

export const HomePage = lazy(() => import('src/pages/home'));
export const BlogPage = lazy(() => import('src/pages/blog'));
export const UserPage = lazy(() => import('src/pages/user'));
export const BankPage = lazy(() => import('src/pages/bank'));
export const DocentePage = lazy(() => import('src/pages/docente'));
export const MatriculaPage = lazy(() => import('src/pages/matricula'))
export const HorariosPage = lazy(() => import('src/pages/horarios'));
export const GradoSeccionPage = lazy(() => import('src/pages/gradoseccion'));
export const AsignaciónDocente = lazy(() => import('src/pages/asignaciondocente'));
export const StudentPage = lazy(() => import('src/pages/student'));
export const LegalGuardianPage = lazy(() => import('src/pages/legalGuardian'));
export const PaymentTypesPage = lazy(() => import('src/pages/paymentTypes'));
export const PaymentStatusPage = lazy(() => import('src/pages/paymentStatus'));
export const SignInPage = lazy(() => import('src/pages/sign-in'));
export const ProductsPage = lazy(() => import('src/pages/products'));
export const Page404 = lazy(() => import('src/pages/page-not-found'));
export const Page403 = lazy(() => import('src/pages/page-access-denied'));

// ----------------------------------------------------------------------

const renderFallback = (
  <Box display="flex" alignItems="center" justifyContent="center" flex="1 1 auto">
    <LinearProgress
      sx={{
        width: 1,
        maxWidth: 320,
        bgcolor: (theme) => varAlpha(theme.vars.palette.text.primaryChannel, 0.16),
        [`& .${linearProgressClasses.bar}`]: { bgcolor: 'text.primary' },
      }}
    />
  </Box>
);


export function Router() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [role, setRole] = useState('');

  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem('token');
      if(token) {
        // Decodificar el token JWT para extraer el rol
        const decodedToken = JSON.parse(atob(token.split('.')[1]));
        setRole(decodedToken?.role);
      }
      setIsAuthenticated(!!token);
    };

    checkAuth();
  }, []);


  return useRoutes([
    {
      element: (
        <DashboardLayout>
          <Suspense fallback={renderFallback}>
            <Outlet />
          </Suspense>
        </DashboardLayout>
      ),
      children: [
        // Ruta raíz `/` es la del Dashboard y es protegida
        {
          path: '/',
          element: isAuthenticated ? <ProtectedRoute><Navigate to="/" replace /></ProtectedRoute> : <Navigate to="/sign-in" replace />,
        },
        {
          element: 
            <ProtectedRoute>
              <HomePage />
            </ProtectedRoute>,
          index: true 
        },
        /* School project */
        { path: 'bank',
          element: 
            <ProtectedRoute>
              <BankPage/>
            </ProtectedRoute>
        },
        { 
          path: 'payments', 
          element: <h1>Por implementar</h1>
        },
        { 
          path: 'docentes', 
          element: (
            <ProtectedRoute>
              <DocentePage />
            </ProtectedRoute>
          ),
        },
        { path: 'matricula',
          element: 
            <ProtectedRoute>
              <MatriculaPage/>
            </ProtectedRoute>
        },
        { path: 'students',
          element: 
            <ProtectedRoute>
              <StudentPage/>
            </ProtectedRoute>
        },
        { path: 'legalguardians',
          element:
            <ProtectedRoute>
              <LegalGuardianPage/>
            </ProtectedRoute>
        },
        { path: 'horarios', 
          element: 
          <HorariosPage/> 
        },
        { path: 'gradoseccion', 
          element: 
          <GradoSeccionPage/> 
        },
        { path: 'asignaciondocente',
          element:
          <ProtectedRoute allowedRoles={['Administrador']}>
            <AsignaciónDocente/>
          </ProtectedRoute>
        },
        { path: 'paymentTypes',
          element:
          <ProtectedRoute>
            <PaymentTypesPage/>
          </ProtectedRoute>
        },
        {
          path: 'horarios/porGradoSeccion/:id',
          element: <HorariosPage />, // O <HorariosView /> según cómo organices la vista
        },
        { path: 'paymentStatus',
          element:
          <ProtectedRoute>
            <PaymentStatusPage/>
          </ProtectedRoute>
        }
      ],
    },
    {
      path: 'sign-in',
      element: (
        <AuthLayout>
          <SignInPage />
        </AuthLayout>
      ),
    },
    {
      path: '404',
      element: <Page404 />,
    },
    {
      path: '403',
      element: <Page403 />,
    },
    {
      path: '*',
      element: <Navigate to="/404" replace />,
    },
  ]);
}

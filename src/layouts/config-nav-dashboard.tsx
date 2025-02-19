import { Label } from 'src/components/label';
import { SvgColor } from 'src/components/svg-color';

// ----------------------------------------------------------------------

const icon = (name: string) => (
  <SvgColor width="100%" height="100%" src={`/assets/icons/navbar/${name}.svg`} />
);

const role = localStorage.getItem('userRole');

export const navData = [
  {
    title: 'Dashboard',
    path: '/',
    icon: icon('ic-analytics'),
  },
  {
    title: 'Bancos',
    path: '/bank',
    icon: icon('ic-bank'),
  },
  {
    title: 'Cobros',
    path: '/payments',
    icon: icon('ic-payments'),
  },
  {
    title: 'Docentes',
    path: '/docentes',
    icon: icon('ic-teacher'),
  },
  {
    title: 'Matrículas',
    path: '/registrations',
    icon: icon('ic-registrations'),
    info: (
      <Label color="error" variant="inverted">
        +3
      </Label>
    ),
  },
  {
    title: 'Estudiantes',
    path: '/students',
    icon: icon('ic-student'),
  },
  {
    title: 'Apoderados',
    path: '/legalguardians',
    icon: icon('ic-legalGuardian'),
  },
  {
    title: 'Horarios',
    path: '/horarios',
    icon: icon('ic-horario'),
  },
  {
    title: 'Grado y Sección',
    path: '/gradoseccion',
    icon: icon('ic-gradoSeccion'),
  },
  {
    title: 'Asignación de docente',
    path: '/asignaciondocente',
    icon: icon('ic-asignacionDocente'),
  },
  {
    title: 'Tipos de pago',
    path: '/tipospago',
    icon: icon('ic-tipoPago'),
  },
  {
    title: 'Estados de pago',
    path: '/estadospago',
    icon: icon('ic-estadoPago'),
  } /* ,
  {
    title: 'Sign in',
    path: '/sign-in',
    icon: icon('ic-lock'),
  },
  {
    title: 'Not found',
    path: '/404',
    icon: icon('ic-disabled'),
  }, */
];

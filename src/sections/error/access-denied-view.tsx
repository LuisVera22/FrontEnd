import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';

import { RouterLink } from 'src/routes/components';

import { SimpleLayout } from 'src/layouts/simple';

// ----------------------------------------------------------------------

export function AccessDeniedView() {
  return (
    <SimpleLayout content={{ compact: true }}>
      <Container>
        <Typography variant="h3" sx={{ mb: 2 }}>
          Lo siento, no tienes acceso a esta página!
        </Typography>

        <Typography sx={{ color: 'text.secondary' }}>
          Lo sentimos, no puedes acceder a la página que estás buscando. Quizás ocurrió un error,
          comunícate con tu administrador.
        </Typography>

        <Box
          component="img"
          src="/assets/illustrations/illustration-403.png"
          sx={{
            width: 320,
            height: 'auto',
            my: { xs: 5, sm: 10 },
          }}
        />

        <Button component={RouterLink} href="/" size="large" variant="contained" color="inherit">
          Ir al inicio
        </Button>
      </Container>
    </SimpleLayout>
  );
}

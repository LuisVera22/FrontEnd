import { Button, Checkbox, Dialog, DialogActions, DialogContent, DialogTitle, FormControl, FormControlLabel, InputLabel, MenuItem, Select, SelectChangeEvent, TextField } from '@mui/material';
import React, { useState } from 'react';
import { ILegalGuardian } from 'src/interfaces/ILegalGuardian';
import { IStudent } from 'src/interfaces/IStudent';
import { appsettings } from 'src/settings/appsettings';

// ----------------------------------------------------------------------
const token = localStorage.getItem('token');
if (!token) {
  window.location.href = '/sign-in';
}

interface RegisterStudentModalProps {
  open: boolean;
  onClose: () => void;
  onRegister: (student: IStudent) => void;
}

export const RegisterStudentModal: React.FC<RegisterStudentModalProps> = ({ open, onClose, onRegister }) => {
  const [student, setStudent] = useState<IStudent>({
    id: 0,
    code: '',
    name: '',
    lastName: '',
    gender: '',
    direction: '',
    birthdate: '',
    legalGuardianId: 0,
    legalGuardian: null,
  });

  const [registerGuardian, setRegisterGuardian] = useState(false);
  const [legalGuardian, setLegalGuardian] = useState<ILegalGuardian>({
    id: 0,
    identityDocument: '',
    name: '',
    lastName: '',
    gender: '',
    birthdate: '',
    cellphoneNumber: '',
    email: '',
    direction: '',
  });

  const [errorMessage, setErrorMessage] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setStudent((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleGuardianChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setLegalGuardian((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleGenderChange = (e: SelectChangeEvent<string>, isGuardian: boolean) => {
    const value = e.target.value;
    if (isGuardian) {
      setLegalGuardian((prev) => ({
        ...prev,
        gender: value,
      }));
    } else {
      setStudent((prev) => ({
        ...prev,
        gender: value,
      }));
    }
  };

  const handleClose = () => {
    setStudent({
      id: 0,
      code: '',
      name: '',
      lastName: '',
      gender: '',
      direction: '',
      birthdate: '',
      legalGuardianId: 0,
      legalGuardian: null,
    });
    setLegalGuardian({
      id: 0,
      identityDocument: '',
      name: '',
      lastName: '',
      gender: '',
      birthdate: '',
      cellphoneNumber: '',
      email: '',
      direction: '',
    });
    setRegisterGuardian(false);
    setErrorMessage('');
    onClose();
  };

  const handleRegister = async () => {
    const studentData = {
      ...student,
      legalGuardian: registerGuardian ? legalGuardian : null,
    };

    try {
      const response = await fetch(`${appsettings.apiUrl}LegalGuardian/{findDNI}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(studentData),
      });

      if (response.ok) {
        const data = await response.json();
        onRegister(data);
        handleClose();
      } else {
        const errorData = await response.json();
        setErrorMessage(errorData.message || 'Error al registrar el estudiante');
      }
    } catch (error) {
      console.error('Error en la solicitud:', error);
      setErrorMessage('Hubo un problema con la conexión. Intenta nuevamente.');
    }
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Registrar Estudiante</DialogTitle>
      <DialogContent>
        {errorMessage && <div style={{ color: 'red', marginBottom: 10 }}>{errorMessage}</div>}
        
        <TextField
          label="Documento de Identidad"
          name="code"
          value={student.code}
          onChange={handleChange}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Nombre"
          name="name"
          value={student.name}
          onChange={handleChange}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Apellido"
          name="lastName"
          value={student.lastName}
          onChange={handleChange}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Dirección"
          name="direction"
          value={student.direction}
          onChange={handleChange}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Fecha de Nacimiento"
          name="birthdate"
          type="date"
          value={student.birthdate}
          onChange={handleChange}
          fullWidth
          margin="normal"
          InputLabelProps={{
            shrink: true,
          }}
        />

        <FormControl fullWidth margin="normal">
          <InputLabel>Género</InputLabel>
          <Select
            name="gender"
            value={student.gender}
            onChange={(e) => handleGenderChange(e, false)}
            label="Género"
          >
            <MenuItem value="varon">Varón</MenuItem>
            <MenuItem value="mujer">Mujer</MenuItem>
          </Select>
        </FormControl>

        <FormControlLabel
          control={
            <Checkbox
              checked={registerGuardian}
              onChange={(e) => setRegisterGuardian(e.target.checked)}
              color="primary"
            />
          }
          label="Registrar Apoderado"
        />
        {registerGuardian && (
          <>
            <TextField
              label="Documento de Identidad del Apoderado"
              name="identityDocument"
              value={legalGuardian.identityDocument}
              onChange={handleGuardianChange}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Nombre del Apoderado"
              name="name"
              value={legalGuardian.name}
              onChange={handleGuardianChange}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Apellido del Apoderado"
              name="lastName"
              value={legalGuardian.lastName}
              onChange={handleGuardianChange}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Teléfono del Apoderado"
              name="cellphoneNumber"
              value={legalGuardian.cellphoneNumber}
              onChange={handleGuardianChange}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Correo del Apoderado"
              name="email"
              value={legalGuardian.email}
              onChange={handleGuardianChange}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Dirección del Apoderado"
              name="direction"
              value={legalGuardian.direction}
              onChange={handleGuardianChange}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Fecha de Nacimiento del Apoderado"
              type="date"
              name="birthdate"
              value={legalGuardian.birthdate}
              onChange={handleGuardianChange}
              fullWidth
              margin="normal"
              InputLabelProps={{
                shrink: true,
              }}
            />
            <FormControl fullWidth margin="normal">
              <InputLabel>Género del Apoderado</InputLabel>
              <Select
                name="gender"
                value={legalGuardian.gender}
                onChange={(e) => handleGenderChange(e, true)}
                label="Género del Apoderado"
              >
                <MenuItem value="varon">Varón</MenuItem>
                <MenuItem value="mujer">Mujer</MenuItem>
              </Select>
            </FormControl>
          </>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Cancelar
        </Button>
        <Button onClick={handleRegister} color="primary">
          Registrar
        </Button>
      </DialogActions>
    </Dialog>
  );
};
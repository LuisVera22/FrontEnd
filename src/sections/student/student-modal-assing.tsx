import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from '@mui/material';
import React, { useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { appsettings } from 'src/settings/appsettings';

const token = localStorage.getItem('token');
if (!token) {
  window.location.href = '/sign-in';
}

interface AssignGuardianModalProps {
  open: boolean;
  onClose: () => void;
  studentId: number; 
}

export const AssignGuardianModal: React.FC<AssignGuardianModalProps> = ({ open, onClose, studentId }) => {
  const [guardian, setGuardian] = useState({
    identityDocument: '',
    name: '',
    lastName: '',
    gender: '',
    birthdate: '',
    cellphoneNumber: '',
    email: '',
    direction: '',
    id: 0,
  });

  const [guardianNotFound, setGuardianNotFound] = useState(false);

  const resetGuardian = () => {
    setGuardian({
      identityDocument: '',
      name: '',
      lastName: '',
      gender: '',
      birthdate: '',
      cellphoneNumber: '',
      email: '',
      direction: '',
      id: 0, 
    });
    setGuardianNotFound(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setGuardian((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSearchGuardian = async () => {
    try {
      const response = await fetch(`${appsettings.apiUrl}LegalGuardian/${guardian.identityDocument}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setGuardian({
          id: data.id,
          name: data.name,
          lastName: data.lastName,
          gender: data.gender,
          birthdate: data.birthdate,
          cellphoneNumber: data.cellphoneNumber,
          email: data.email,
          direction: data.direction,
          identityDocument: guardian.identityDocument,
        });
        setGuardianNotFound(false);
      } else {
        setGuardianNotFound(true);
        toast.error('No se encontró un apoderado con ese número de documento', {
          autoClose: 3000,
          position: "top-right",
        });
      }
    } catch (error) {
      console.error('Error al buscar apoderado:', error);
      toast.error('Error al buscar el apoderado.', {
        autoClose: 3000,
        position: "top-right",
      });
    }
  };

  const handleAssignGuardian = async () => {
    try {
      const response = await fetch(`${appsettings.apiUrl}Student/AssignLegalGuardianToStudent`, {
        method: 'PUT', 
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          StudentId: studentId,  
          LegalGuardianId: guardian.id,  
        }),
      });

      if (response.ok) {
        toast.success('Apoderado asignado exitosamente.', {
            autoClose: 3000,
            position: "top-right",
          });
        onClose();
      } else {
        console.error("Error al asignar el apoderado.");
        toast.error('Error al asignar el apoderado.', {
            autoClose: 3000,
            position: "top-right",
          });
      }
    } catch (error) {
      console.error("Error en la solicitud:", error);
      toast.error('Error en la solicitud.', {
        autoClose: 3000,
        position: "top-right",
      });
    }
  };

  const handleCloseModal = () => {
    onClose();
    resetGuardian(); 
  };

  return (
    <>
      <ToastContainer />

      <Dialog open={open} onClose={handleCloseModal}>
        <DialogTitle>Asignar Apoderado al Estudiante</DialogTitle>
        <DialogContent>
          <TextField
            label="Documento de Identidad del Apoderado"
            name="identityDocument"
            value={guardian.identityDocument}
            onChange={handleChange}
            fullWidth
            margin="normal"
          />
          <Button 
            onClick={handleSearchGuardian} 
            color="primary" 
            disabled={guardian.identityDocument.trim() === ''} 
          >
            Buscar Apoderado
          </Button>

          {guardianNotFound && <p>No se encontró el apoderado.</p>}

          {guardian.id !== 0 && (
            <>
              <TextField
                label="Nombre del Apoderado"
                name="name"
                value={guardian.name}
                onChange={handleChange}
                fullWidth
                margin="normal"
                disabled 
              />
              <TextField
                label="Apellido del Apoderado"
                name="lastName"
                value={guardian.lastName}
                onChange={handleChange}
                fullWidth
                margin="normal"
                disabled 
              />
              <TextField
                label="Teléfono del Apoderado"
                name="cellphoneNumber"
                value={guardian.cellphoneNumber}
                onChange={handleChange}
                fullWidth
                margin="normal"
                disabled 
              />
              <TextField
                label="Correo del Apoderado"
                name="email"
                value={guardian.email}
                onChange={handleChange}
                fullWidth
                margin="normal"
                disabled 
              />
              <TextField
                label="Dirección del Apoderado"
                name="direction"
                value={guardian.direction}
                onChange={handleChange}
                fullWidth
                margin="normal"
                disabled 
              />
              <TextField
                label="Fecha de Nacimiento del Apoderado"
                name="birthdate"
                type="date"
                value={guardian.birthdate ? guardian.birthdate.split('T')[0] : ''}
                onChange={handleChange}
                fullWidth
                margin="normal"
                disabled 
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseModal} color="primary">
            Cancelar
          </Button>
          <Button 
            onClick={handleAssignGuardian} 
            color="primary" 
            disabled={guardian.id === 0}
          >
            Asignar Apoderado
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};
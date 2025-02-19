import {
    Button,
    Checkbox,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    FormControl,
    FormControlLabel,
    InputLabel,
    MenuItem,
    Select,
    TextField,
} from '@mui/material';
import React from 'react';
  
  interface StudentRegisterModalProps {
    open: boolean;
    onClose: () => void;
    onSubmit: (studentData: any, isEdit: boolean) => void;
    student: any;
    setStudent: React.Dispatch<React.SetStateAction<any>>;
    addLegalGuardian: boolean;
    setAddLegalGuardian: React.Dispatch<React.SetStateAction<boolean>>;
    newLegalGuardian: any;
    setNewLegalGuardian: React.Dispatch<React.SetStateAction<any>>;
  }
  
  export const StudentRegisterModal: React.FC<StudentRegisterModalProps> = ({
    open,
    onClose,
    onSubmit,
    student,
    setStudent,
    addLegalGuardian,
    setAddLegalGuardian,
    newLegalGuardian,
    setNewLegalGuardian,
  }) => {
    const handleClose = () => {
      // Limpiar el estado cuando se cierra el modal
      setStudent({
        code: '',
        name: '',
        lastName: '',
        gender: '',
        direction: '',
        birthdate: '',
        id: '',
      });
      setAddLegalGuardian(false);
      setNewLegalGuardian({
        identityDocument: '',
        name: '',
        lastName: '',
        gender: '',
        birthdate: '',
        cellphoneNumber: '',
        email: '',
        direction: '',
      });
      onClose();
    };
  
    const handleSubmit = async () => {
      // Crear objeto de datos del estudiante
      const studentData = {
        code: student.code,
        name: student.name,
        lastName: student.lastName,
        gender: student.gender,
        direction: student.direction,
        birthdate: student.birthdate,
        legalGuardianId: addLegalGuardian ? undefined : undefined,  // Si no se agrega apoderado, no se envía `legalGuardianId`
        legalGuardian: addLegalGuardian ? newLegalGuardian : undefined,  // Si se agrega apoderado, enviar sus datos
      };
  
      // Llamar la función `onSubmit`, enviando los datos y el flag de `isEdit`
      onSubmit(studentData, student.id !== ''); // Si el `id` del estudiante no es vacío, es edición (isEdit=true)
    };
  
    return (
      <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
        <DialogTitle>{student.id === '' ? 'Registrar Estudiante' : 'Editar Estudiante'}</DialogTitle>
        <DialogContent
          sx={{
            maxHeight: '60vh',
            overflowY: 'auto',
          }}
        >
          <TextField
            label="DNI"
            value={student.code}
            onChange={(e) => setStudent({ ...student, code: e.target.value })}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Nombre"
            value={student.name}
            onChange={(e) => setStudent({ ...student, name: e.target.value })}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Apellido"
            value={student.lastName}
            onChange={(e) => setStudent({ ...student, lastName: e.target.value })}
            fullWidth
            margin="normal"
          />
          <FormControl fullWidth margin="normal">
            <InputLabel>Género</InputLabel>
            <Select
              value={student.gender}
              onChange={(e) => setStudent({ ...student, gender: e.target.value })}
            >
              <MenuItem value="varon">Varón</MenuItem>
              <MenuItem value="mujer">Mujer</MenuItem>
            </Select>
          </FormControl>
          <TextField
            label="Dirección"
            value={student.direction}
            onChange={(e) => setStudent({ ...student, direction: e.target.value })}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Fecha de nacimiento"
            type="date"
            value={student.birthdate ? student.birthdate.split('T')[0] : ''}
            onChange={(e) => setStudent({ ...student, birthdate: e.target.value })}
            fullWidth
            margin="normal"
            InputLabelProps={{
              shrink: true,
            }}
          />
          {student.id === '' ? (
            <FormControlLabel
              control={
                <Checkbox
                  checked={addLegalGuardian}
                  onChange={(e) => setAddLegalGuardian(e.target.checked)}
                  name="addLegalGuardian"
                />
              }
              label="Agregar apoderado"
            />
          ) : null}
          {addLegalGuardian && (
            <>
              <TextField
                label="DNI del apoderado"
                value={newLegalGuardian.identityDocument}
                onChange={(e) =>
                  setNewLegalGuardian({
                    ...newLegalGuardian,
                    identityDocument: e.target.value,
                  })
                }
                fullWidth
                margin="normal"
              />
              <TextField
                label="Nombre del apoderado"
                value={newLegalGuardian.name}
                onChange={(e) =>
                  setNewLegalGuardian({
                    ...newLegalGuardian,
                    name: e.target.value,
                  })
                }
                fullWidth
                margin="normal"
              />
              <TextField
                label="Apellido del apoderado"
                value={newLegalGuardian.lastName}
                onChange={(e) =>
                  setNewLegalGuardian({
                    ...newLegalGuardian,
                    lastName: e.target.value,
                  })
                }
                fullWidth
                margin="normal"
              />
              <FormControl fullWidth margin="normal">
                <InputLabel>Género del apoderado</InputLabel>
                <Select
                  value={newLegalGuardian.gender}
                  onChange={(e) =>
                    setNewLegalGuardian({
                      ...newLegalGuardian,
                      gender: e.target.value,
                    })
                  }
                >
                  <MenuItem value="varon">Varón</MenuItem>
                  <MenuItem value="mujer">Mujer</MenuItem>
                </Select>
              </FormControl>
              <TextField
                label="Fecha de nacimiento del apoderado"
                type="date"
                value={newLegalGuardian.birthdate}
                onChange={(e) =>
                  setNewLegalGuardian({
                    ...newLegalGuardian,
                    birthdate: e.target.value,
                  })
                }
                fullWidth
                margin="normal"
                InputLabelProps={{
                  shrink: true,
                }}
              />
              <TextField
                label="Número de celular del apoderado"
                value={newLegalGuardian.cellphoneNumber}
                onChange={(e) =>
                  setNewLegalGuardian({
                    ...newLegalGuardian,
                    cellphoneNumber: e.target.value,
                  })
                }
                fullWidth
                margin="normal"
              />
              <TextField
                label="Correo electrónico del apoderado"
                value={newLegalGuardian.email}
                onChange={(e) =>
                  setNewLegalGuardian({
                    ...newLegalGuardian,
                    email: e.target.value,
                  })
                }
                fullWidth
                margin="normal"
              />
              <TextField
                label="Dirección del apoderado"
                value={newLegalGuardian.direction}
                onChange={(e) =>
                  setNewLegalGuardian({
                    ...newLegalGuardian,
                    direction: e.target.value,
                  })
                }
                fullWidth
                margin="normal"
              />
            </>
          )}
        </DialogContent>
  
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancelar
          </Button>
          <Button
            onClick={handleSubmit}
            color="primary"
            variant="contained"
          >
            {student.id === '' ? 'Registrar' : 'Editar'}
          </Button>
        </DialogActions>
      </Dialog>
    );
  };  
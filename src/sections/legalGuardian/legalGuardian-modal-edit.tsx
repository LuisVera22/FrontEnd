import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from '@mui/material';
import { useEffect, useState } from 'react';
import { ILegalGuardian } from 'src/interfaces/ILegalGuardian';

export function EditLegalGuardianModal({
  open,
  onClose,
  onSave,
  initialData
}: {
  open: boolean;
  onClose: () => void;
  onSave: (updatedGuardian: ILegalGuardian) => void;
  initialData: ILegalGuardian;
}) {
  const [editedGuardian, setEditedGuardian] = useState<ILegalGuardian>(initialData);

  useEffect(() => {
    setEditedGuardian(initialData);
  }, [initialData]);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setEditedGuardian((prevState) => ({ ...prevState, [name]: value }));
  };

  const handleSave = async () => {
    if (Object.values(editedGuardian).some((val) => val === '')) {
      alert('Por favor complete todos los campos');
      return;
    }
    onSave(editedGuardian);
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Editar Apoderado</DialogTitle>
      <DialogContent>
        <TextField
          margin="dense"
          label="DNI"
          name="identityDocument"
          value={editedGuardian.identityDocument}
          onChange={handleInputChange}
          fullWidth
        />
        <TextField
          margin="dense"
          label="Nombre"
          name="name"
          value={editedGuardian.name}
          onChange={handleInputChange}
          fullWidth
        />
        <TextField
          margin="dense"
          label="Apellido"
          name="lastName"
          value={editedGuardian.lastName}
          onChange={handleInputChange}
          fullWidth
        />
        <TextField
          margin="dense"
          label="Género"
          name="gender"
          value={editedGuardian.gender}
          onChange={handleInputChange}
          fullWidth
        />
        <TextField
          margin="dense"
          label="Fecha de Nacimiento"
          name="birthdate"
          type="date"
          value={editedGuardian.birthdate ? editedGuardian.birthdate.split('T')[0] : ''}
          onChange={handleInputChange}
          fullWidth
          InputLabelProps={{
            shrink: true,
          }}
        />
        <TextField
          margin="dense"
          label="Celular"
          name="cellphoneNumber"
          value={editedGuardian.cellphoneNumber}
          onChange={handleInputChange}
          fullWidth
        />
        <TextField
          margin="dense"
          label="Email"
          name="email"
          value={editedGuardian.email}
          onChange={handleInputChange}
          fullWidth
        />
        <TextField
          margin="dense"
          label="Dirección"
          name="direction"
          value={editedGuardian.direction}
          onChange={handleInputChange}
          fullWidth
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">Cancelar</Button>
        <Button onClick={handleSave} color="primary">Guardar</Button>
      </DialogActions>
    </Dialog>
  );
}
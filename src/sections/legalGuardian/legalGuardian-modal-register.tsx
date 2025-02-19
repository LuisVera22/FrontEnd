import { Button, Dialog, DialogActions, DialogContent, DialogTitle, FormControl, InputLabel, MenuItem, Select, TextField } from '@mui/material';
import { useEffect, useState } from 'react';
import { ILegalGuardian } from 'src/interfaces/ILegalGuardian';

export function AddLegalGuardianModal({ open, onClose, onSave }: { open: boolean, onClose: () => void, onSave: (newGuardian: ILegalGuardian) => void }) {
  const [newGuardian, setNewGuardian] = useState<ILegalGuardian>({
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

  useEffect(() => {
    if (!open) {
      setNewGuardian({
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
    }
  }, [open]);
  

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setNewGuardian((prevState) => ({ ...prevState, [name]: value }));
  };

  const handleSave = async () => {
    if (Object.values(newGuardian).some((val) => val === '')) {
      alert('Por favor complete todos los campos');
      return;
    }
    onSave(newGuardian);
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Registrar Apoderado</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          label="DNI"
          name="identityDocument"
          value={newGuardian.identityDocument}
          onChange={handleInputChange}
          fullWidth
        />
        <TextField
          margin="dense"
          label="Nombre"
          name="name"
          value={newGuardian.name}
          onChange={handleInputChange}
          fullWidth
        />
        <TextField
          margin="dense"
          label="Apellido"
          name="lastName"
          value={newGuardian.lastName}
          onChange={handleInputChange}
          fullWidth
        />
        <FormControl fullWidth margin="normal">
            <InputLabel>Género</InputLabel>
            <Select
                value={newGuardian.gender}
                onChange={(e) => handleInputChange({
                    target: { name: 'gender', value: e.target.value }
                } as React.ChangeEvent<HTMLInputElement>)}
                fullWidth
            >
                <MenuItem value="varon">Varón</MenuItem>
                <MenuItem value="mujer">Mujer</MenuItem>
            </Select>
        </FormControl>
        <TextField
          margin="dense"
          label="Fecha de Nacimiento"
          name="birthdate"
          type="date"
          value={newGuardian.birthdate}
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
          value={newGuardian.cellphoneNumber}
          onChange={handleInputChange}
          fullWidth
        />
        <TextField
          margin="dense"
          label="Email"
          name="email"
          value={newGuardian.email}
          onChange={handleInputChange}
          fullWidth
        />
        <TextField
          margin="dense"
          label="Dirección"
          name="direction"
          value={newGuardian.direction}
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
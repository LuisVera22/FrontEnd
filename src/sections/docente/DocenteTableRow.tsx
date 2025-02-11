import { useCallback, useState } from 'react';

import Box from '@mui/material/Box';
import Checkbox from '@mui/material/Checkbox';
import IconButton from '@mui/material/IconButton';
import MenuItem, { menuItemClasses } from '@mui/material/MenuItem';
import MenuList from '@mui/material/MenuList';
import Popover from '@mui/material/Popover';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';

import { Iconify } from 'src/components/iconify';
import { Label } from 'src/components/label';

import { IDocente } from 'src/interfaces/IDocente';

// ----------------------------------------------------------------------

export type DocenteProps = {
  id: number;
  nombre: string;
  apellido: string;
  dni:string;
  especialidad:string;
  estado: boolean;
};

type DocenteTableRowProps = {
  row: DocenteProps;
  selected: boolean;
  onSelectRow: () => void;
  onDelete: (id: number) => void;
  onDesactivate: (id: number) => void;
  onReinstate: (id: number) => void;
  onEdit: (Docente : IDocente) => void;
};

export function DocenteTableRow({
  row,
  selected,
  onSelectRow,
  onDelete,
  onDesactivate,
  onReinstate,
  onEdit,
}: DocenteTableRowProps) {
  const [openPopover, setOpenPopover] = useState<HTMLButtonElement | null>(null);

  const handleOpenPopover = useCallback((event: React.MouseEvent<HTMLButtonElement>) => {
    setOpenPopover(event.currentTarget);
  }, []);

  const handleClosePopover = useCallback(() => {
    setOpenPopover(null);
  }, []);

  return (
    <>
      <TableRow hover tabIndex={-1} role="checkbox" selected={selected}>
        <TableCell padding="checkbox">
          <Checkbox disableRipple checked={selected} onChange={onSelectRow} />
        </TableCell>

        <TableCell component="th" scope="row">
          <Box gap={2} display="flex" alignItems="center">
            {row.nombre}
          </Box>
        </TableCell>

        <TableCell component="th" scope="row">
          <Box gap={2} display="flex" alignItems="center">
            {row.apellido}
          </Box>
        </TableCell>

       <TableCell component="th" scope="row">
          <Box gap={2} display="flex" alignItems="center">
            {row.dni}
          </Box>
        </TableCell>
        <TableCell component="th" scope="row">
          <Box gap={2} display="flex" alignItems="center">
            {row.especialidad}
          </Box>
        </TableCell>
        <TableCell>
          <Label color={row.estado ? 'success' : 'error'}>
            {row.estado ? 'Activo' : 'Inactivo'}
          </Label>
        </TableCell>

        <TableCell align="right">
          <IconButton onClick={handleOpenPopover}>
            <Iconify icon="eva:more-vertical-fill" />
          </IconButton>
        </TableCell>
      </TableRow>

      <Popover
        open={!!openPopover}
        anchorEl={openPopover}
        onClose={handleClosePopover}
        anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <MenuList
          disablePadding
          sx={{
            p: 0.5,
            gap: 0.5,
            width: 140,
            display: 'flex',
            flexDirection: 'column',
            [`& .${menuItemClasses.root}`]: {
              px: 1,
              gap: 2,
              borderRadius: 0.75,
              [`&.${menuItemClasses.selected}`]: { bgcolor: 'action.selected' },
            },
          }}
        >
          {row.estado ? (
          <>
          <MenuItem onClick={() => onEdit(row)}>
            <Iconify icon="solar:pen-bold" />
            Editar
          </MenuItem>

          <MenuItem onClick={() => onDelete(row.id)} sx={{ color: 'error.main' }}>
            <Iconify icon="solar:trash-bin-trash-bold" />
            Eliminar
          </MenuItem>

          <MenuItem onClick={() => onDesactivate(row.id)} sx={{ color: 'warning.main' }}>
            <Iconify icon="eva:eye-off-fill"/>
            Desactivar
          </MenuItem>
          </>
          ) : (
            <MenuItem onClick={() => onReinstate(row.id)}sx={{color: 'success.main'}}>
              <Iconify icon="mdi:Docente-transfer-in" />
              Reingresar
            </MenuItem>
          )
          }
        </MenuList>
      </Popover>
    </>
  );
}

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

import { IGradoSeccion } from 'src/interfaces/IGradoSeccion';
import { IHorarios } from 'src/interfaces/IHorarios';

// ----------------------------------------------------------------------

export type HorariosProps = {
 id: number;
 horaInicio: string;
 horaFin: string;
 diaSemana: string;
 gradoSeccion: IGradoSeccion; 
};

type HorariosTableRowProps = {
  row: HorariosProps;
  selected: boolean;
  onSelectRow: () => void;
  onDelete: (id: number) => void;
  onEdit: (Horarios : IHorarios) => void;
};

export function HorariosTableRow({
  row,
  selected,
  onSelectRow,
  onDelete,
  onEdit,
}: HorariosTableRowProps) {
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
            {row.horaInicio}
          </Box>
        </TableCell>

        <TableCell component="th" scope="row">
          <Box gap={2} display="flex" alignItems="center">
            {row.horaFin}
          </Box>
        </TableCell>

       <TableCell component="th" scope="row">
          <Box gap={2} display="flex" alignItems="center">
            {row.diaSemana}
          </Box>
        </TableCell>
        <TableCell component="th" scope="row">
          <Box gap={2} display="flex" alignItems="center">
          {row.gradoSeccion?.nombre || 'Sin grado/sección'}      
            </Box>
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
    <MenuItem onClick={() => onEdit(row)}>
      <Iconify icon="solar:pen-bold" />
      Editar
    </MenuItem>

    <MenuItem onClick={() => onDelete(row.id)} sx={{ color: 'error.main' }}>
      <Iconify icon="solar:trash-bin-trash-bold" />
      Eliminar
    </MenuItem>
  </MenuList>
</Popover>
    </>
  );
}

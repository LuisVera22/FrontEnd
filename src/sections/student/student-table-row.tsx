import { useCallback, useState } from 'react';

import Box from '@mui/material/Box';
import Checkbox from '@mui/material/Checkbox';
import IconButton from '@mui/material/IconButton';
import MenuItem, { menuItemClasses } from '@mui/material/MenuItem';
import MenuList from '@mui/material/MenuList';
import Popover from '@mui/material/Popover';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';

import { Avatar } from '@mui/material';

import { Iconify } from 'src/components/iconify';
import { LegalGuardianProps } from '../legalGuardian/legalGuardian-table-row';

// ----------------------------------------------------------------------

export type StudentProps = {
  id: number;
  code: string;
  name: string;
  lastName: string;
  gender: string;
  direction: string;
  birthdate: string;
  ImagenPath: string;
  imageBase64: string;
  legalGuardianId: number;
  legalGuardian: LegalGuardianProps | null;
};

type StudentTableRowProps = {
  row: StudentProps;
  selected: boolean;
  onSelectRow: () => void;
  onEdit: (student: StudentProps) => void;
  onDelete: (id: number) => void;
  assingLegalGuardian: (id: number) => void;
};

export function StudentTableRow({ 
  row,
  selected,
  onSelectRow,
  onEdit,
  onDelete,
  assingLegalGuardian,
}: StudentTableRowProps) {
  const [openPopover, setOpenPopover] = useState<HTMLButtonElement | null>(null);

  const handleOpenPopover = useCallback((event: React.MouseEvent<HTMLButtonElement>) => {
    setOpenPopover(event.currentTarget);
  }, []);

  const handleClosePopover = useCallback(() => {
    setOpenPopover(null);
  }, []);

  const date = new Date(row.birthdate);
  const formattedDate = `${String(date.getDate()).padStart(2, '0')}-${String(date.getMonth() + 1).padStart(2, '0')}-${date.getFullYear()}`;
  return (
    <>
      <TableRow hover tabIndex={-1} role="checkbox" selected={selected}>
        <TableCell padding="checkbox">
          <Checkbox disableRipple checked={selected} onChange={onSelectRow} />
        </TableCell>

        <TableCell>{row.code}</TableCell>

        <TableCell component="th" scope="row">
          <Box gap={2} display="flex" alignItems="center">
            <Avatar alt={row.name} src={`data:image/jpeg;base64,${row.imageBase64}`} />
            {row.name}
          </Box>
        </TableCell>

        <TableCell>{row.lastName}</TableCell>

        <TableCell>{row.direction}</TableCell>

        <TableCell>{formattedDate}</TableCell>

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

          {row.legalGuardianId === null ? (
            <MenuItem onClick={() => assingLegalGuardian(row.id)} sx={{color: 'warning.main'}}>
              <Iconify icon="mdi:account" />
              Asignar Ap.
            </MenuItem>
          ) :  null}
        </MenuList>
      </Popover>
    </>
  );
}
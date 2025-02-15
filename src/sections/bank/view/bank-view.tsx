import { useCallback, useEffect, useState } from 'react';

import { TextField } from '@mui/material';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Modal from '@mui/material/Modal';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableContainer from '@mui/material/TableContainer';
import TablePagination from '@mui/material/TablePagination';
import Typography from '@mui/material/Typography';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { appsettings } from 'src/settings/appsettings';

import { DashboardContent } from 'src/layouts/dashboard';

import { Iconify } from 'src/components/iconify';
import { Scrollbar } from 'src/components/scrollbar';

import { IBank } from 'src/interfaces/IBanks';

import { BankTableHead } from 'src/sections/bank/bank-table-head';
import { BankTableRow } from 'src/sections/bank/bank-table-row';
import { BankTableToolbar } from 'src/sections/bank/bank-table-toolbar';
import { TableEmptyRows } from 'src/sections/bank/table-empty-rows';
import { TableNoData } from 'src/sections/bank/table-no-data';
import { applyFilter, emptyRows, getComparator } from 'src/sections/bank/utils';

import type { BankProps } from 'src/sections/bank/bank-table-row';

// ----------------------------------------------------------------------
const token = localStorage.getItem('token');

export function BankView() {
const [banks, setBanks] = useState<IBank[]>([]);
const [openDialog, setOpenDialog] = useState(false);
const [open, setOpen] = useState(false);
const [_bankName, setBankName] = useState('');
const [bankToDelete, setBankToDelete] = useState<number | null>(null);
const [openEdit, setOpenEdit] = useState(false);
const [bankToEdit, setBankToEdit] = useState<number | null>(null);


// Obtener Bancos
const _banks = async () => {
  if (!token){
    console.error('No se encontró el token de autenticación');
      return;
  } 
  try {
    const response = await fetch(`${appsettings.apiUrl}Bank`, { 
      method: 'GET',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });
    if (response.ok) {
      const data = await response.json();
      setBanks(data);
    } else {
      console.error('Error al obtener los bancos:', response.status);
    }
  } catch (error) {
    console.error('Error en la petición:', error);
  }
};

useEffect(() => {
  _banks();
}, []);

// Registro de Bancos
const handleOpen = () => setOpen(true);
const handleClose = () => setOpen(false);
const handleSave = async () => {
  try {
    const response = await fetch(`${appsettings.apiUrl}Bank`, { 
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`},
      body: JSON.stringify({ bankName: _bankName }),
    });
    if (response.ok) {
      _banks();
      setOpen(false);
      setBankName('');
      toast.success('Banco registrado exitosamente', { autoClose: 3000, position: "top-right" });
    } else {
      console.error('Error al guardar el banco:', response.status);
      setBankName('');
      toast.error('Error al registrar el banco', { autoClose: 3000, position: "top-right" });
    }
  } catch (error) {
    console.error('Error en la petición:', error);
    setBankName('');
    toast.error('Error en la petición', { autoClose: 3000, position: "top-right" });
  }
};
const handleCancel = () => {
  setOpen(false);
  setOpenDialog(false);
  setOpenEdit(false);
  setBankToDelete(null);
  setBankName('');
  toast.info('Operación cancelada', { autoClose: 3000, position: "top-right" });
};

// Eliminar Bancos
const handleDelete = async (id: number) => {
  setBankToDelete(id);
  setOpenDialog(true);
};

const confirmDelete = async () => {
  try {
    const response = await fetch(`${appsettings.apiUrl}Bank/(id)?id=${bankToDelete}`, {
      method: 'DELETE',
      headers: { 
        'Accept': '*/*',
        'Authorization': `Bearer ${token}`},
    });
    if (response.ok) {
      _banks();
      setOpenDialog(false);
      toast.success('Banco eliminado exitosamente', { autoClose: 3000, position: "top-right" });
    } else {
      console.error('Error al eliminar el banco:', response.status);
      setOpenDialog(false);
      toast.error('Error al eliminar el banco', { autoClose: 3000, position: "top-right" });
    }
  } catch (error) {
    console.error('Error en la petición:', error);
    setOpenDialog(false);
    toast.error('Error en la petición', { autoClose: 3000, position: "top-right" });
  }
};

const handleCloseDialog = () => {
  setOpenDialog(false);
  setBankToDelete(null);
};

// Desactivar Bancos
const handleDesactivate = async (id: number) => {
  try {
    const response = await fetch(`${appsettings.apiUrl}Bank/desactivate/${id}`, {
      method: 'PUT',
      headers: {
        'Accept': '*/*',
        'Authorization': `Bearer ${token}`,
      },
    });
    if (response.ok) {
      _banks();
      toast.success('Banco desactivado exitosamente', {autoClose: 3000,position: "top-right",});
    } else {
      console.error('Error al desactivar el banco:', response.status);
      toast.error('Error al desactivar el banco', { autoClose: 3000, position: "top-right" });
    }
  } catch (error) {
    console.error('Error en la petición:', error);
    toast.error('Error en la petición', { autoClose: 3000, position: "top-right" });
  }
};

// Reactivar Bancos
const handleReinstate = async (id: number) => {
  try {
    const response = await fetch(`${appsettings.apiUrl}Bank/reinstate/${id}`, {
      method: 'PUT',
      headers: {
        'Accept': '*/*',
        'Authorization': `Bearer ${token}`,
      },
    });
    if (response.ok) {
      _banks();
      toast.success('Banco reingresado exitosamente', {autoClose: 3000,position: "top-right",});
    } else {
      console.error('Error al reingresar el banco:', response.status);
      toast.error('Error al reingresar el banco', { autoClose: 3000, position: "top-right" });
    }
  } catch (error) {
    console.error('Error en la petición:', error);
    toast.error('Error en la petición', { autoClose: 3000, position: "top-right" });
  }
};

// Función para editar un banco
const handleEdit = (bank: IBank) => {
  setBankName(bank.bankName);
  setBankToEdit(bank.id);
  setOpenEdit(true); 
};

// Función para guardar la edición
const handleSaveEdit = async () => {
  if (!bankToEdit) return;

  try {
    const response = await fetch(`${appsettings.apiUrl}Bank/${bankToEdit}`, {
      method: 'PUT',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`},
      body: JSON.stringify({ bankName: _bankName }),  
    });
    if (response.ok) {
      _banks();  
      setOpenEdit(false); 
      setBankName('');
      toast.success('Banco actualizado exitosamente', {
        autoClose: 3000,
        position: "top-right",
      });
    } else {
      console.error('Error al editar el banco:', response.status);
      setBankName('');
      toast.error('Error al editar el banco', {
        autoClose: 3000,
        position: "top-right",
      });
    }
  } catch (error) {
    console.error('Error en la petición:', error);
    setBankName('');
    toast.error('Error en la petición', { autoClose: 3000, position: "top-right" });
  }
};

  const table = useTable();

  const [filterName, setFilterName] = useState('');

  const dataFiltered: BankProps[] = applyFilter({
    inputData: banks,
    comparator: getComparator(table.order, table.orderBy),
    filterName,
  });

  const notFound = !dataFiltered.length;
  
  const userRole = localStorage.getItem('userRole');

  return (
    <DashboardContent>
      <Box display="flex" alignItems="center" mb={5}>
        <Typography variant="h4" flexGrow={1}>
          Bancos
        </Typography>
        {userRole === 'Administrador' && (
          <Button
            variant="contained"
            color="inherit"
            startIcon={<Iconify icon="mingcute:add-line" />}
            onClick={handleOpen}
          >
            Agregar Banco
          </Button>
        )}
      </Box>

      <Card>
        <BankTableToolbar
          numSelected={table.selected.length}
          filterName={filterName}
          onFilterName={(event: React.ChangeEvent<HTMLInputElement>) => {
            setFilterName(event.target.value);
            table.onResetPage();
          }}
        />

      <Modal open={open} onClose={handleClose}>
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 400,
            bgcolor: 'background.paper',
            boxShadow: 24,
            p: 4,
          }}
        >
          <Typography variant="h6" component="h2" mb={2}>
            Registrar Banco
          </Typography>
          <TextField
            fullWidth
            label="Nombre del Banco"
            value={_bankName}
            onChange={(e) => setBankName(e.target.value)}
            variant="outlined"
            margin="normal"
          />
          <Box mt={2} display="flex" justifyContent="flex-end">
            <Button onClick={handleCancel} sx={{ mr: 2 }}>
              Cancelar
            </Button>
            <Button variant="contained" onClick={handleSave}>
              Guardar
            </Button>
          </Box>
        </Box>
      </Modal>

        <Scrollbar>
          <TableContainer sx={{ overflow: 'unset' }}>
            <Table sx={{ minWidth: 800 }}>
              <BankTableHead
                order={table.order}
                orderBy={table.orderBy}
                rowCount={banks.length}
                numSelected={table.selected.length}
                onSort={table.onSort}
                onSelectAllRows={(checked) =>
                  table.onSelectAllRows(
                    checked,
                    banks.map((bank) => String(bank.id))
                  )
                }
                headLabel={[
                  { id: 'bankName', label: 'Nombre' },
                  { id: 'status', label: 'Estado' },
                  ...(userRole === 'Administrador' ? [{ id: '', label: '' }] : []),
                ]}
              />
              <TableBody>
                {dataFiltered
                  .slice(
                    table.page * table.rowsPerPage,
                    table.page * table.rowsPerPage + table.rowsPerPage
                  )
                  .map((row) => (
                    <BankTableRow
                      key={row.id}
                      row={row}
                      selected={table.selected.includes(String(row.id))}
                      onSelectRow={() => table.onSelectRow(String(row.id))}
                      onDelete={handleDelete}
                      onDesactivate={handleDesactivate}
                      onReinstate={handleReinstate}
                      onEdit={handleEdit}
                    />
                  ))}

                <TableEmptyRows
                  height={68}
                  emptyRows={emptyRows(table.page, table.rowsPerPage, banks.length)}
                />

                {notFound && <TableNoData searchQuery={filterName} />}
              </TableBody>
            </Table>
          </TableContainer>
        </Scrollbar>

        <TablePagination
          component="div"
          page={table.page}
          count={banks.length}
          rowsPerPage={table.rowsPerPage}
          onPageChange={table.onChangePage}
          rowsPerPageOptions={[5, 10, 25]}
          onRowsPerPageChange={table.onChangeRowsPerPage}
          labelRowsPerPage="Registros por página"
          labelDisplayedRows={({ from, to, count }) => `Página ${from}-${to} de ${count}`}
        />
      </Card>

      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>Confirmación de Eliminación</DialogTitle>
        <DialogContent>
          <Typography>
            ¿Estás seguro de que deseas eliminar este banco?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancel} color="primary">
            Cancelar
          </Button>
          <Button onClick={confirmDelete}>
            Eliminar
          </Button>
        </DialogActions>
      </Dialog>

      <Modal open={openEdit} onClose={() => setOpenEdit(false)}>
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 400,
            bgcolor: 'background.paper',
            boxShadow: 24,
            p: 4,
          }}
        >
          <Typography variant="h6" component="h2" mb={2}>
            Editar Banco
          </Typography>
          <TextField
            fullWidth
            label="Nombre del Banco"
            value={_bankName}
            onChange={(e) => setBankName(e.target.value)}
            variant="outlined"
            margin="normal"
          />
          <Box mt={2} display="flex" justifyContent="flex-end">
            <Button onClick={handleCancel} sx={{ mr: 2 }}>
              Cancelar
            </Button>
            <Button variant="contained" onClick={handleSaveEdit}>
              Guardar
            </Button>
          </Box>
        </Box>
      </Modal>

      <ToastContainer />
    </DashboardContent>
  );
}

// ----------------------------------------------------------------------

export function useTable() {
  const [page, setPage] = useState(0);
  const [orderBy, setOrderBy] = useState('bankName');
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [selected, setSelected] = useState<string[]>([]);
  const [order, setOrder] = useState<'asc' | 'desc'>('asc');

  const onSort = useCallback(
    (id: string) => {
      const isAsc = orderBy === id && order === 'asc';
      setOrder(isAsc ? 'desc' : 'asc');
      setOrderBy(id);
    },
    [order, orderBy]
  );

  const onSelectAllRows = useCallback((checked: boolean, newSelecteds: string[]) => {
    if (checked) {
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  }, []);

  const onSelectRow = useCallback(
    (inputValue: string) => {
      const newSelected = selected.includes(inputValue)
        ? selected.filter((value) => value !== inputValue)
        : [...selected, inputValue];

      setSelected(newSelected);
    },
    [selected]
  );

  const onResetPage = useCallback(() => {
    setPage(0);
  }, []);

  const onChangePage = useCallback((event: unknown, newPage: number) => {
    setPage(newPage);
  }, []);

  const onChangeRowsPerPage = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setRowsPerPage(parseInt(event.target.value, 10));
      onResetPage();
    },
    [onResetPage]
  );

  return {
    page,
    order,
    onSort,
    orderBy,
    selected,
    rowsPerPage,
    onSelectRow,
    onResetPage,
    onChangePage,
    onSelectAllRows,
    onChangeRowsPerPage,
  };
}
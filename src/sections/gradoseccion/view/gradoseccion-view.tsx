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

import { applyFilter, emptyRows, getComparator } from 'src/sections/gradoseccion/utils';

import { IGradoSeccion } from 'src/interfaces/IGradoSeccion';
import { GradoSeccionTableHead } from '../GradoSeccionTableHead';
import { GradoSeccionTableRow } from '../GradoSeccionTableRow';
import { GradoSeccionToolbar } from '../GradoSeccionTableToolbar';
import { TableEmptyRows } from '../table-emtpy-rows';
import { TableNoData } from '../table-no-data';

import type { GradoSeccionProps } from '../GradoSeccionTableRow';
// ----------------------------------------------------------------------

export function GradoSeccionView() {
const [gradoseccion, setGradoSeccion] = useState<IGradoSeccion[]>([]);
const [openDialog, setOpenDialog] = useState(false);
const [open, setOpen] = useState(false);
const [_gradoseccionName, setGradoSeccionName] = useState('');
const [gradoseccionToDelete, setGradoSeccionToDelete] = useState<number | null>(null);
const [openEdit, setOpenEdit] = useState(false);
const [gradoseccionToEdit, setGradoSeccionToEdit] = useState<number | null>(null);

const _gradoseccion = async () => {
  try {
    const response = await fetch(`${appsettings.apiUrl}GradoSeccion`, { method: 'GET' });
    if (response.ok) {
      const data: IGradoSeccion[] = await response.json();
      setGradoSeccion(data);
    } else {
      console.error('Error al obtener los grados y secciones:', response.status);
    }
  } catch (error) {
    console.error('Error en la petición:', error);
  }
};

useEffect(() => {
  _gradoseccion();
}, []);

const handleOpen = () => setOpen(true);
const handleClose = () => setOpen(false);
const handleSave = async () => {
  try {
    const response = await fetch(`${appsettings.apiUrl}GradoSeccion`, { 
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        nombre: _gradoseccionName,
      }),
    });
    if (response.ok) {
      _gradoseccion();
      setOpen(false);
      setGradoSeccionName('');
      toast.success('Grado y Seccion registrado exitosamente', { autoClose: 3000, position: "top-right" });
    } else {
      console.error('Error al guardar el Grado y Seccion:', response.status);
      toast.error('Error al registrar el Grado y Seccion', { autoClose: 3000, position: "top-right" });
    }
  } catch (error) {
    console.error('Error en la petición:', error);
    toast.error('Error en la petición', { autoClose: 3000, position: "top-right" });
  }
};
const handleCancel = () => {
  setOpen(false);
  setOpenDialog(false);
  setOpenEdit(false);
  setGradoSeccionToDelete(null);
  setGradoSeccionName('');
  toast.info('Operación cancelada', { autoClose: 3000, position: "top-right" });
};

const handleDelete = async (id: number) => {
  setGradoSeccionToDelete(id);
  setOpenDialog(true);
};

const confirmDelete = async () => {
  try {
    const response = await fetch(`${appsettings.apiUrl}GradoSeccion/${gradoseccionToDelete}`, {
      method: 'DELETE',
      headers: { 'Accept': '*/*' },
    });
    if (response.ok) {
      _gradoseccion();
      setOpenDialog(false);
      toast.success('Grado y Seccion eliminado exitosamente', { autoClose: 3000, position: "top-right" });
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
  setGradoSeccionToDelete(null);
};


const handleEdit = (gradoseccionEnter: IGradoSeccion) => {
  setGradoSeccionName(gradoseccionEnter.nombre);
  setGradoSeccionToEdit(gradoseccionEnter.id);
  setOpenEdit(true);
};

// Función para guardar la edición
const handleSaveEdit = async () => {
  if (!gradoseccionToEdit) return;

  try {
    const response = await fetch(`${appsettings.apiUrl}GradoSeccion/${gradoseccionToEdit}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        nombre: _gradoseccionName,
      }),
    });
    if (response.ok) {
      _gradoseccion();
      setOpenEdit(false);
      setGradoSeccionName('');
      toast.success('Grado Seccion actualizado exitosamente', {
        autoClose: 3000,
        position: "top-right",
      });
    } else {
      console.error('Error al editar el Grado y Seccion:', response.status);
      toast.error('Error al editar el Grado y Seccion', {
        autoClose: 3000,
        position: "top-right",
      });
    }
  } catch (error) {
    console.error('Error en la petición:', error);
    toast.error('Error en la petición', { autoClose: 3000, position: "top-right" });
  }
};

  const table = useTable();

  const [filterName, setFilterName] = useState('');

  const dataFiltered: GradoSeccionProps[] = applyFilter({
    inputData: gradoseccion,
    comparator: getComparator(table.order, table.orderBy),
    filterName,
  });

  const notFound = !!filterName;

  return (
    <DashboardContent>
      <Box display="flex" alignItems="center" mb={5}>
        <Typography variant="h4" flexGrow={1}>
          Grado y Seccion
        </Typography>
        <Button
          variant="contained"
          color="inherit"
          startIcon={<Iconify icon="mingcute:add-line" />}
          onClick={handleOpen}
        >
          Agregar Grado y Seccion
        </Button>
      </Box>

      <Card>
        <GradoSeccionToolbar
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
      Registrar Grado y Seccion
    </Typography>
    <TextField
      fullWidth
      label="Nombre del Grado y seccion"
      value={_gradoseccionName}
      onChange={(e) => setGradoSeccionName(e.target.value)}
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
              <GradoSeccionTableHead
                order={table.order}
                orderBy={table.orderBy}
                rowCount={gradoseccion.length}
                numSelected={table.selected.length}
                onSort={table.onSort}
                onSelectAllRows={(checked) =>
                  table.onSelectAllRows(
                    checked,
                    gradoseccion.map((gradoSeccion) => String(gradoSeccion.id))
                  )
                }
                headLabel={[
                  { id: 'nombre', label: 'Nombre' },
                  { id: '', label: '' },
                ]}
              />
              <TableBody>
                {dataFiltered
                  .slice(
                    table.page * table.rowsPerPage,
                    table.page * table.rowsPerPage + table.rowsPerPage
                  )
                  .map((row) => (
                    <GradoSeccionTableRow
                      key={row.id}
                      row={row}
                      selected={table.selected.includes(String(row.id))}
                      onSelectRow={() => table.onSelectRow(String(row.id))}
                      onDelete={handleDelete}
                      onEdit={handleEdit}
                    />
                  ))}

                <TableEmptyRows
                  height={68}
                  emptyRows={emptyRows(table.page, table.rowsPerPage, gradoseccion.length)}
                />

                {notFound && <TableNoData searchQuery={filterName} />}
              </TableBody>
            </Table>
          </TableContainer>
        </Scrollbar>

        <TablePagination
          component="div"
          page={table.page}
          count={gradoseccion.length}
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
            ¿Estás seguro de que deseas eliminar este Grado y Seccion?
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
            Editar Grado y Seccion
          </Typography>
          <TextField
            fullWidth
            label="Grado y Seccion"
            value={_gradoseccionName}
            onChange={(e) => setGradoSeccionName(e.target.value)}
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
  const [orderBy, setOrderBy] = useState('nombre');
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
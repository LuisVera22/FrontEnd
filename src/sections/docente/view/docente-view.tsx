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


import { IDocente } from 'src/interfaces/IDocente';
import { DocenteTableHead } from 'src/sections/docente/DocenteTableHead';
import { DocenteTableRow } from 'src/sections/docente/DocenteTableRow';
import { DocenteTableToolbar } from 'src/sections/docente/DocenteTableToolbar';
import { TableEmptyRows } from 'src/sections/docente/table-empty-rows';
import { TableNoData } from 'src/sections/docente/table-no-data';
import { applyFilter, emptyRows, getComparator } from 'src/sections/docente/utils';

import type { DocenteProps } from 'src/sections/docente/DocenteTableRow';

// ----------------------------------------------------------------------

const token = localStorage.getItem('token');

export function DocenteView() {
const [docentes, setDocentes] = useState<IDocente[]>([]);
const [openDialog, setOpenDialog] = useState(false);
const [open, setOpen] = useState(false);
const [_docenteName, setDocenteName] = useState('');
const [_docenteApellido, setDocenteApellido] = useState('');
const [_docenteDni, setDocenteDni] = useState('');
const [_docenteEspecialidad, setDocenteEspecialidad] = useState('');
const [docenteToDelete, setDocenteToDelete] = useState<number | null>(null);
const [openEdit, setOpenEdit] = useState(false);
const [docenteToEdit, setDocenteToEdit] = useState<number | null>(null);

// Obtener Docentes
const _docentes = async () => {
  try {
    const response = await fetch(`${appsettings.apiUrl}Docente`, { 
      method: 'GET', 
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });
    if (response.ok) {
      const data = await response.json();
      setDocentes(data);
    } else {
      console.error('Error al obtener los docentes:', response.status);
    }
  } catch (error) {
    console.error('Error en la petición:', error);
  }
};

useEffect(() => {
  _docentes();
}, []);

// Registro de Docentes
const handleOpen = () => setOpen(true);
const handleClose = () => setOpen(false);
const handleSave = async () => {
  try {
    const response = await fetch(`${appsettings.apiUrl}Docente`, { 
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        nombre: _docenteName,
        apellido: _docenteApellido,
        dni: _docenteDni,
        especialidad: _docenteEspecialidad
      }),
    });
    if (response.ok) {
      _docentes();
      setOpen(false);
      setDocenteName('');
      setDocenteApellido('');
      setDocenteDni('');
      setDocenteEspecialidad('');
      toast.success('Docente registrado exitosamente', { autoClose: 3000, position: "top-right" });
    } else {
      console.error('Error al guardar el docente:', response.status);
      toast.error('Error al registrar el docente', { autoClose: 3000, position: "top-right" });
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
  setDocenteToDelete(null);
  setDocenteName('');
  toast.info('Operación cancelada', { autoClose: 3000, position: "top-right" });
};

// Eliminar Docentes
const handleDelete = async (id: number) => {
  setDocenteToDelete(id);
  setOpenDialog(true);
};

const confirmDelete = async () => {
  try {
    const response = await fetch(`${appsettings.apiUrl}Docente/(id)?id=${docenteToDelete}`, {
      method: 'DELETE',
      headers: { 'Accept': '*/*' },
    });
    if (response.ok) {
      _docentes();
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
  setDocenteToDelete(null);
};

// Desactivar Docentes
const handleDesactivate = async (id: number) => {
  try {
    const response = await fetch(`${appsettings.apiUrl}Docente/desactivate/${id}`, {
      method: 'PUT',
      headers: {
        'Accept': '*/*',
      },
    });
    if (response.ok) {
      _docentes();
      toast.success('Docente desactivado exitosamente', {autoClose: 3000,position: "top-right",});
    } else {
      console.error('Error al desactivar el Docente:', response.status);
      toast.error('Error al desactivar el Docente', { autoClose: 3000, position: "top-right" });
    }
  } catch (error) {
    console.error('Error en la petición:', error);
    toast.error('Error en la petición', { autoClose: 3000, position: "top-right" });
  }
};

// Reactivar Bancos
const handleReinstate = async (id: number) => {
  try {
    const response = await fetch(`${appsettings.apiUrl}Docente/reinstate/${id}`, {
      method: 'PUT',
      headers: {
        'Accept': '*/*',
      },
    });
    if (response.ok) {
      _docentes();
      toast.success('Docente reingresado exitosamente', {autoClose: 3000,position: "top-right",});
    } else {
      console.error('Error al reingresar el Docente:', response.status);
      toast.error('Error al reingresar el Docente', { autoClose: 3000, position: "top-right" });
    }
  } catch (error) {
    console.error('Error en la petición:', error);
    toast.error('Error en la petición', { autoClose: 3000, position: "top-right" });
  }
};

// Función para editar un banco
const handleEdit = (docente: IDocente) => {
  setDocenteName(docente.nombre);
  setDocenteApellido(docente.apellido); // Asignar apellido
  setDocenteDni(docente.dni); // Asignar DNI
  setDocenteEspecialidad(docente.especialidad); // Asignar especialidad
  setDocenteToEdit(docente.id);
  setOpenEdit(true);
};

// Función para guardar la edición
const handleSaveEdit = async () => {
  if (!docenteToEdit) return;

  try {
    const response = await fetch(`${appsettings.apiUrl}Docente/${docenteToEdit}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        nombre: _docenteName,
        apellido: _docenteApellido,
        dni: _docenteDni,
        especialidad: _docenteEspecialidad
      }),
    });
    if (response.ok) {
      _docentes();
      setOpenEdit(false);
      setDocenteName('');
      setDocenteApellido('');
      setDocenteDni('');
      setDocenteEspecialidad('');
      toast.success('Docente actualizado exitosamente', {
        autoClose: 3000,
        position: "top-right",
      });
    } else {
      console.error('Error al editar el docente:', response.status);
      toast.error('Error al editar el docente', {
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

  const dataFiltered: DocenteProps[] = applyFilter({
    inputData: docentes,
    comparator: getComparator(table.order, table.orderBy),
    filterName,
  });

  const notFound = !dataFiltered.length;

  return (
    <DashboardContent>
      <Box display="flex" alignItems="center" mb={5}>
        <Typography variant="h4" flexGrow={1}>
          Docentes
        </Typography>
        <Button
          variant="contained"
          color="inherit"
          startIcon={<Iconify icon="mingcute:add-line" />}
          onClick={handleOpen}
        >
          Agregar Docente
        </Button>
      </Box>

      <Card>
        <DocenteTableToolbar
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
              Registrar Docente
            </Typography>
            <TextField
              fullWidth
              label="Nombre del Docente"
              value={_docenteName}
              onChange={(e) => setDocenteName(e.target.value)}
              variant="outlined"
              margin="normal"
            />
            <TextField
              fullWidth
              label="Apellido del Docente"
              value={_docenteApellido}
              onChange={(e) => setDocenteApellido(e.target.value)}
              variant="outlined"
              margin="normal"
            />
            <TextField
              fullWidth
              label="DNI del Docente"
              value={_docenteDni}
              onChange={(e) => setDocenteDni(e.target.value)}
              variant="outlined"
              margin="normal"
            />
            <TextField
              fullWidth
              label="Especialidad del Docente"
              value={_docenteEspecialidad}
              onChange={(e) => setDocenteEspecialidad(e.target.value)}
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
              <DocenteTableHead
                order={table.order}
                orderBy={table.orderBy}
                rowCount={docentes.length}
                numSelected={table.selected.length}
                onSort={table.onSort}
                onSelectAllRows={(checked) =>
                  table.onSelectAllRows(
                    checked,
                    docentes.map((docente) => String(docente.id))
                  )
                }
                headLabel={[
                  { id: 'name', label: 'Nombre' },
                  { id: 'apellido', label: 'Apellido' },
                  { id: 'dni', label: 'DNI' },
                  { id: 'especialidad', label: 'Especialidad' },
                  { id: 'estado', label: 'Estado' },
                  { id: '', label: ''},
                ]}
              />
              <TableBody>
                {dataFiltered
                  .slice(
                    table.page * table.rowsPerPage,
                    table.page * table.rowsPerPage + table.rowsPerPage
                  )
                  .map((row) => (
                    <DocenteTableRow
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
                  emptyRows={emptyRows(table.page, table.rowsPerPage, docentes.length)}
                />

                {notFound && <TableNoData searchQuery={filterName} />}
              </TableBody>
            </Table>
          </TableContainer>
        </Scrollbar>

        <TablePagination
          component="div"
          page={table.page}
          count={docentes.length}
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
            ¿Estás seguro de que deseas eliminar este Docente?
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
            Editar Docente
          </Typography>
          <TextField
            fullWidth
            label="Nombre del Docente"
            value={_docenteName}
            onChange={(e) => setDocenteName(e.target.value)}
            variant="outlined"
            margin="normal"
          />
           <TextField
            fullWidth
            label="Apellido del Docente"
            value={_docenteApellido}
            onChange={(e) => setDocenteApellido(e.target.value)}
            variant="outlined"
            margin="normal"
          />
           <TextField
            fullWidth
            label="Dni del Docente"
            value={_docenteDni}
            onChange={(e) => setDocenteDni(e.target.value)}
            variant="outlined"
            margin="normal"
          />
           <TextField
            fullWidth
            label="Especialidad del Docente"
            value={_docenteEspecialidad}
            onChange={(e) => setDocenteEspecialidad(e.target.value)}
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
  const [orderBy, setOrderBy] = useState('name');
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
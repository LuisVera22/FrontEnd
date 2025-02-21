import { useCallback, useEffect, useState } from 'react';

import { Autocomplete, List, ListItem, ListItemText, TextField } from '@mui/material';
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

import { IAsignacionDocente } from 'src/interfaces/IAsignacionDocente';
import { IDocente } from 'src/interfaces/IDocente';
import { IHorarios } from 'src/interfaces/IHorarios';

import { applyFilter, emptyRows, getComparator } from 'src/sections/asignaciondocente/utils';

import { IGradoSeccion } from 'src/interfaces/IGradoSeccion';
import { AsignacionDocenteTableHead } from '../AsignacionDocenteTableHead';
import { AsignacionDocenteTableRow } from '../AsignacionDocenteTableRow';
import { AsignacionDocenteToolbar } from '../AsignacionDocenteTableToolbar';
import { TableEmptyRows } from '../table-empty-rows';
import { TableNoData } from '../table-no-data';

import type { AsignacionDocenteProps } from '../AsignacionDocenteTableRow';
// ----------------------------------------------------------------------
const token = localStorage.getItem('token');

export function AsignacionDocenteView() {
  const [asignacionDocente, setAsignacionDocente] = useState<IAsignacionDocente[]>([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [open, setOpen] = useState(false);
  const [docentes, setDocentes] = useState<IDocente[]>([]);
  const [selectedDocente, setSelectedDocente] = useState<IDocente | null>(null);
  const [selectedGradoSeccion, setSelectedGradoSeccion] = useState<IGradoSeccion | null>(null);
  const [gradoseccion, setGradoSeccion] = useState<IGradoSeccion[]>([]);
  const [selectedHorarios, setSelectedHorarios] = useState<IHorarios[]>([]);
  const [horarios, setHorarios] = useState<IHorarios[]>([]);
  const [asignacionToDelete, setAsignacionToDelete] = useState<number | null>(null);
  const [openEdit, setOpenEdit] = useState(false);
  const [asignacionToEdit, setAsignacionToEdit] = useState<number | null>(null);
  
    const _asignacionDocente = async () => {
      try {
        const response = await fetch(`${appsettings.apiUrl}AsignacionDocente`, { method: 'GET' });
        if (response.ok) {
          const data: IAsignacionDocente[] = await response.json();
          setAsignacionDocente(data);
        } else {
          console.error('Error al obtener las asignaciones:', response.status);
        }
      } catch (error) {
        console.error('Error en la petición:', error);
      }
    };
  
   

    const _obtenerGradoSeccion = async () => {
      try {
        const response = await fetch(`${appsettings.apiUrl}GradoSeccion`, { method: 'GET' });
        if (response.ok) {
          const data: IGradoSeccion[] = await response.json();
          setGradoSeccion(data);
          console.log("Grados y secciones recibidos:", data);
        } else {
          console.error("Error al obtener grados y secciones:", response.status);
        }
      } catch (error) {
        console.error("Error en la petición:", error);
      }
    };
    const _horarios = async () => {
      try {
        const response = await fetch(`${appsettings.apiUrl}Horario`, { method: 'GET' });
        if (response.ok) {
          const data = await response.json();
          setHorarios(data);
        } else {
          console.error('Error al obtener los Horarios:', response.status);
        }
      } catch (error) {
        console.error('Error en la petición:', error);
      }
    };
    

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

     // Ejecuta la consulta cuando el componente se monta
     useEffect(() => {
      _asignacionDocente();
      _obtenerGradoSeccion();
      _docentes();
      _horarios();
    }, [setAsignacionDocente, setGradoSeccion, setDocentes]);




const handleOpen = () => setOpen(true);
const handleClose = () => setOpen(false);
const handleSave = async () => {
  if (!selectedDocente || !selectedGradoSeccion) {
    alert("Por favor, seleccione un Docente y un Grado Sección.");
    return;
}
const nuevaAsignacion = {
  docenteId: selectedDocente.id,
  gradoSeccionId: selectedGradoSeccion.id,
  horarios: selectedHorarios.map(h => h.id) 
};
    try{
      const response = await fetch(`${appsettings.apiUrl}AsignacionDocente`, { 
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(nuevaAsignacion),
      });
      if (response.ok) {
        const asignacionCreada: IAsignacionDocente = await response.json();

        // Refresca la lista de asignacionespf
        setAsignacionDocente(prev => [...prev, asignacionCreada]);
        setOpen(false);
        setSelectedDocente(null);
        setSelectedGradoSeccion(null);
        setSelectedHorarios([]);
        toast.success('Asignación registrada exitosamente', { autoClose: 3000, position: "top-right" });
      } else {
        console.error('Error al guardar la asignación:', response.status);
        toast.error('Error al registrar la asignación', { autoClose: 3000, position: "top-right" });
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
  setAsignacionToDelete(null);
  setSelectedDocente(null);
  setSelectedGradoSeccion(null);
  setSelectedHorarios([]);
  toast.info('Operación cancelada', { autoClose: 3000, position: "top-right" });
};

const handleDelete = async (id: number) => {
  setAsignacionToDelete(id);
  setOpenDialog(true);
};

const confirmDelete = async () => {
  try {
    const response = await fetch(`${appsettings.apiUrl}AsignacionDocente/${asignacionToDelete}`, {
      method: 'DELETE',
      headers: { 'Accept': '*/*' },
    });
    if (response.ok) {
      _asignacionDocente();
      setOpenDialog(false);
      toast.success('Asignacion Docente eliminado exitosamente', { autoClose: 3000, position: "top-right" });
    } else {
      console.error('Error al eliminar el asignacion:', response.status);
      setOpenDialog(false);
      toast.error('Error al eliminar el asignacion', { autoClose: 3000, position: "top-right" });
    }
  } catch (error) {
    console.error('Error en la petición:', error);
    setOpenDialog(false);
    toast.error('Error en la petición', { autoClose: 3000, position: "top-right" });
  }
};

const handleCloseDialog = () => {
  setOpenDialog(false);
  setAsignacionToDelete(null);
};


const handleEdit = (asignacionDocenteEnter: IAsignacionDocente) => {
  setSelectedDocente(asignacionDocenteEnter.docente);
  setSelectedGradoSeccion(asignacionDocenteEnter.gradoSeccion);
  setSelectedHorarios(asignacionDocenteEnter.horarios);
  setAsignacionToEdit(asignacionDocenteEnter.id);
  setOpenEdit(true);
};

// Función para guardar la edición
const handleSaveEdit = async () => {
  if (!asignacionToEdit || !selectedDocente || !selectedGradoSeccion) {
    toast.error('Seleccione un docente y un grado sección', {
      autoClose: 3000,
      position: "top-right",
    });
    return;
  }

  try {
    const nuevaAsignacion = {
      id: asignacionToEdit,
      docenteId: selectedDocente.id,  
      gradoSeccionId: selectedGradoSeccion.id, 
      horarios: selectedHorarios.map(h => h.id) 
    };

    const response = await fetch(`${appsettings.apiUrl}AsignacionDocente/${asignacionToEdit}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(nuevaAsignacion), 
    });

    if (response.ok) {
      _asignacionDocente(); 
      setOpenEdit(false);
      setSelectedDocente(null);
      setSelectedGradoSeccion(null);
      setSelectedHorarios([]);
      toast.success('Asignación actualizada exitosamente', {
        autoClose: 3000,
        position: "top-right",
      });
    } else {
      console.error('Error al editar la asignación:', response.status);
      toast.error('Error al editar la asignación', {
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

  const dataFiltered: AsignacionDocenteProps[] = applyFilter({
    inputData: asignacionDocente,
    comparator: getComparator(table.order, table.orderBy),
    filterName,
  });

  const notFound = !dataFiltered.length && !!filterName;

  return (
    <DashboardContent>
      <Box display="flex" alignItems="center" mb={5}>
        <Typography variant="h4" flexGrow={1}>
          Asignación de Docente
        </Typography>
        <Button
          variant="contained"
          color="inherit"
          startIcon={<Iconify icon="mingcute:add-line" />}
          onClick={handleOpen}
        >
          Asignar Docente
        </Button>
      </Box>

      <Card>
        <AsignacionDocenteToolbar
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
      Registrar Asignacion y Docente
    </Typography>
    <Autocomplete
        options={docentes}
        getOptionLabel={(option) => option.nombre}
        value={selectedDocente}
        onChange={(event, newValue) => setSelectedDocente(newValue)}
        renderInput={(params) => <TextField {...params} label="Seleccione Docente" variant="outlined" margin="normal" fullWidth />}
      />
       <Autocomplete
        options={gradoseccion}
        getOptionLabel={(option) => option.nombre}
        value={selectedGradoSeccion}
        onChange={(event, newValue) => setSelectedGradoSeccion(newValue)}
        renderInput={(params) => <TextField {...params} label="Seleccione Grado y Sección" variant="outlined" margin="normal" fullWidth />}
      />
    <Typography variant="h6" component="h2" mt={3}>
        Horarios Disponibles
      </Typography>
      <List>
        {horarios.map((horario, index) => (
          <ListItem key={index}>
            <ListItemText primary={horario.id} />
          </ListItem>
        ))}
      </List>
   
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
              <AsignacionDocenteTableHead
                order={table.order}
                orderBy={table.orderBy}
                rowCount={asignacionDocente.length}
                numSelected={table.selected.length}
                onSort={table.onSort}
                onSelectAllRows={(checked) =>
                  table.onSelectAllRows(
                    checked,
                    asignacionDocente.map((asignacionDocenteEnter) => String(asignacionDocenteEnter.id))
                  )
                }
                headLabel={[
                    { id: 'docente', label: 'Docente' },
                    { id: 'gradoSeccion', label: 'Grado y Sección' },
                  { id: 'horarios', label: 'Horarios' },

                            ]}
              />
              <TableBody>
                {dataFiltered
                  .slice(
                    table.page * table.rowsPerPage,
                    table.page * table.rowsPerPage + table.rowsPerPage
                  )
                  .map((row) => (
                    <AsignacionDocenteTableRow
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
            ¿Estás seguro de que deseas eliminar esta Asignacion?
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
            Editar Asignacion
          </Typography>
          <Autocomplete
      options={docentes} // Array de opciones de docentes
      getOptionLabel={(option) => option.nombre}
      value={selectedDocente}
      onChange={(event, newValue) => setSelectedDocente(newValue)}
      renderInput={(params) => (
        <TextField {...params} label="Docente" variant="outlined" margin="normal" fullWidth />
      )}
    />
  <Autocomplete
      options={gradoseccion} // Array de opciones para grados y secciones
      getOptionLabel={(option) => option.nombre}
      value={selectedGradoSeccion}
      onChange={(event, newValue) => setSelectedGradoSeccion(newValue)}
      renderInput={(params) => (
        <TextField {...params} label="Grado y Sección" variant="outlined" margin="normal" fullWidth />
      )}
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
  const [orderBy, setOrderBy] = useState('docente');
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
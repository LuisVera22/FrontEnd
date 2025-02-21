import { useCallback, useEffect, useState } from 'react';


import { Autocomplete, FormControl, InputLabel, MenuItem, Select } from '@mui/material';
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
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { appsettings } from 'src/settings/appsettings';

import { DashboardContent } from 'src/layouts/dashboard';

import { Iconify } from 'src/components/iconify';
import { Scrollbar } from 'src/components/scrollbar';


import { IGradoSeccion } from 'src/interfaces/IGradoSeccion';
import { IHorarios } from 'src/interfaces/IHorarios';
import { HorariosTableHead } from 'src/sections/horarios/HorariosTableHead';
import { HorariosTableRow } from 'src/sections/horarios/HorariosTableRow';
import { TableEmptyRows } from 'src/sections/horarios/table-empty-rows';
import { TableNoData } from 'src/sections/horarios/table-no-data';
import { applyFilter, emptyRows, getComparator } from 'src/sections/horarios/utils';

import { useParams } from 'react-router-dom';
import type { HorariosProps } from 'src/sections/horarios/HorariosTableRow';
import { HorariosTableToolbar } from '../HorariosTableToolbar';

// ----------------------------------------------------------------------

export function HorariosView() {
const [gradoSeccion, setGradoSeccion] = useState<IGradoSeccion[]>([]);
const [selectedGradoSeccion, setSelectedGradoSeccion] = useState<IGradoSeccion | null>(null);
const { id } = useParams<{ id: string }>(); // 'id' aquí será el id del gradoSeccion
const [horarios, setHorarios] = useState<IHorarios[]>([]);
const [openDialog, setOpenDialog] = useState(false);
const [open, setOpen] = useState(false);
const [_horariosHoraInicial, setHorariosHoraInicial] = useState('');
const [horariosHoraFin, setHorariosHoraFin] = useState('');
const [_horariosDiaSemana, setHorariosDiaSemana] = useState('');
const [horariosToDelete, setHorarioToDelete] = useState<number | null>(null);
const [openEdit, setOpenEdit] = useState(false);
const [horariosToEdit, setHorarioToEdit] = useState<number | null>(null);




const _horarios = useCallback(async () => {
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
}, []);

const _obtenerGradoSeccion = useCallback(async () => {
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
}, []);
const _horariosPorGradoSeccion = useCallback(async (idGradoSeccion: string) => {
  try {
    const response = await fetch(`${appsettings.apiUrl}Horario/porGradoSeccion/${idGradoSeccion}`, { method: 'GET' });
    if (response.ok) {
      const data = await response.json();
      setHorarios(data);
    } else {
      console.error('Error al obtener los Horarios por gradoSeccion:', response.status);
    }
  } catch (error) {
    console.error('Error en la petición:', error);
  }
}, []);

useEffect(() => {
  _obtenerGradoSeccion();
  if (id) {
    // Si hay un id (del gradoSeccion) en la URL, filtra los horarios
    _horariosPorGradoSeccion(id);
  } else {
    // Si no hay id, carga todos los horarios
    _horarios();
  }
}, [id, _horarios, _horariosPorGradoSeccion, _obtenerGradoSeccion]);



// Registro de Horarios
const handleOpen = () => setOpen(true);
const handleClose = () => setOpen(false);
const handleSave = async () => {
  const horarioData = {
    horaInicio: _horariosHoraInicial,
    horaFin: horariosHoraFin,
    diaSemana: _horariosDiaSemana,
    gradoSeccionId: selectedGradoSeccion?.id // ✅ Ahora se envía el ID correcto
  };

  try {
    const response = await fetch(`${appsettings.apiUrl}Horario`, { 
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(horarioData),
    });

    if (response.ok) {
      const horarioCreado: IHorarios = await response.json();
      setHorarios(prev => [...prev, horarioCreado]);
      setOpen(false);
      setHorariosHoraInicial('');
      setHorariosHoraFin('');
      setHorariosDiaSemana('');
      setSelectedGradoSeccion(null);
      toast.success('Horario registrado exitosamente', { autoClose: 3000, position: "top-right" });
    } else {
      console.error('Error al guardar el Horario:', response.status);
      toast.error('Error al registrar el Horario', { autoClose: 3000, position: "top-right" });
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
  setHorarioToDelete(null);
  setHorariosHoraInicial('');
  toast.info('Operación cancelada', { autoClose: 3000, position: "top-right" });
};

const handleDelete = async (horarioid : number) => {
  setHorarioToDelete(horarioid);
  setOpenDialog(true);
};

const confirmDelete = async () => {
  try {
    const response = await fetch(`${appsettings.apiUrl}Horario/${horariosToDelete}`, {
      method: 'DELETE',
      headers: { 'Accept': '*/*' },
    });
    if (response.ok) {
      _horarios();
      setOpenDialog(false);
      toast.success('Horario eliminado exitosamente', { autoClose: 3000, position: "top-right" });
    } else {
      console.error('Error al eliminar el Horario:', response.status);
      setOpenDialog(false);
      toast.error('Error al eliminar el Horario', { autoClose: 3000, position: "top-right" });
    }
  } catch (error) {
    console.error('Error en la petición:', error);
    setOpenDialog(false);
    toast.error('Error en la petición', { autoClose: 3000, position: "top-right" });
  }
};

const handleCloseDialog = () => {
  setOpenDialog(false);
  setHorarioToDelete(null);
};


// Función para editar un Horario
const handleEdit = (horario: IHorarios) => {
  setHorarioToEdit(horario.id);
  setHorariosHoraInicial(horario.horaInicio); // Copia el valor real
  setHorariosHoraFin(horario.horaFin); // Copia el valor real
  setHorariosDiaSemana(horario.diaSemana);
  setSelectedGradoSeccion(gradoSeccion.find(gs => gs.id === horario.gradoSeccion.id) || null);
  setOpenEdit(true);
};
const formatTimeWithSeconds = (time: string) => 
  time.length === 5 ? `${time}:00` : time; // Si es "HH:mm", agrega ":00"

// Función para guardar la edición
const handleSaveEdit = async () => {
  if (!horariosToEdit) return;

  const horarioData = {
    horaInicio: formatTimeWithSeconds(_horariosHoraInicial), // Formatear la hora
    horaFin: formatTimeWithSeconds(horariosHoraFin),
    diaSemana: _horariosDiaSemana,
    gradoSeccionId: selectedGradoSeccion?.id // Enviar el ID correcto
  };

  try {
    const response = await fetch(`${appsettings.apiUrl}Horario/${horariosToEdit}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(horarioData),
    });

    if (response.ok) {
      // Actualizar la lista de horarios sin duplicaciones
      setHorarios(prev => prev.map(h => h.id === horariosToEdit ? { ...h, ...horarioData } : h));
      setOpenEdit(false);
      setHorariosHoraInicial('');
      setHorariosHoraFin('');
      setHorariosDiaSemana('');
      setSelectedGradoSeccion(null);
      toast.success('Horario actualizado exitosamente', { autoClose: 3000, position: "top-right" });
    } else {
      console.error('Error al editar el Horario:', response.status);
      toast.error('Error al editar el Horario', { autoClose: 3000, position: "top-right" });
    }
  } catch (error) {
    console.error('Error en la petición:', error);
    toast.error('Error en la petición', { autoClose: 3000, position: "top-right" });
  }
};


  const table = useTable();

  const [filterName, setFilterName] = useState('');

  const dataFiltered: HorariosProps[] = applyFilter({
    inputData: horarios,
    comparator: getComparator(table.order, table.orderBy),
    filterName,
  });

  const notFound = !dataFiltered.length && !!filterName;

  return (
    <DashboardContent>
      <Box display="flex" alignItems="center" mb={5}>
        <Typography variant="h4" flexGrow={1}>
          Horarios
        </Typography>
        <Button
          variant="contained"
          color="inherit"
          startIcon={<Iconify icon="mingcute:add-line" />}
          onClick={handleOpen}
        >
          Agregar Horario
        </Button>
      </Box>

 {id ? (
      <Typography variant="h5" sx={{ mb: 2 }}>
        Horarios para el Grado Sección {id}
      </Typography>
    ) : (
      <Typography variant="h5" sx={{ mb: 2 }}>
        Todos los Horarios
      </Typography>
    )}

    
     
      




      <Card>
        <HorariosTableToolbar
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
      Registrar Horarios
    </Typography>
    <TextField
          fullWidth
          label="Hora de Inicio"
          type = "time"
          value={_horariosHoraInicial}
          onChange={(e) => setHorariosHoraInicial(e.target.value)}
          variant="outlined"
          margin="normal"
        />
       <TextField
          fullWidth
          label="Hora de Fin"
          type="time"
          value={horariosHoraFin}
          onChange={(e) => setHorariosHoraFin(e.target.value)}
          variant="outlined"
          margin="normal"
        />
   <TextField
          fullWidth
          label="Día de la Semana"
          value={_horariosDiaSemana}
          onChange={(e) => setHorariosDiaSemana(e.target.value)}
          variant="outlined"
          margin="normal"
        />
    <Autocomplete
           options={gradoSeccion}
           getOptionLabel={(option) => option.nombre}
           value={selectedGradoSeccion}
           onChange={(event, newValue) => setSelectedGradoSeccion(newValue)}
           renderInput={(params) => <TextField {...params} label="Seleccione Grado Seccion" variant="outlined" margin="normal" fullWidth />}
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
              <HorariosTableHead
                order={table.order}
                orderBy={table.orderBy}
                rowCount={horarios.length}
                numSelected={table.selected.length}
                onSort={table.onSort}
                onSelectAllRows={(checked) =>
                  table.onSelectAllRows(
                    checked,
                    horarios.map((horario) => String(horario.id))
                  )
                }
                headLabel={[
                  { id: 'horaInicio', label: 'Hora Inicio' },
                  { id: 'horaFin', label: 'Hora Fin' },
                  { id: 'diaSemana', label: 'Día Semana' },
                  { id: 'gradoSeccion', label: 'Grado Sección' },
                ]}
              />
              <TableBody>
                {dataFiltered
                  .slice(
                    table.page * table.rowsPerPage,
                    table.page * table.rowsPerPage + table.rowsPerPage
                  )
                  .map((row) => (
                    <HorariosTableRow
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
                  emptyRows={emptyRows(table.page, table.rowsPerPage, horarios.length)}
                />

                {notFound && <TableNoData searchQuery={filterName} />}
              </TableBody>
            </Table>
          </TableContainer>
        </Scrollbar>

        <TablePagination
          component="div"
          page={table.page}
          count={horarios.length}
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
            ¿Estás seguro de que deseas eliminar este Horario?
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
            Editar Horario
          </Typography>
          <TextField
            fullWidth
            label="Hora inicio"
            type = "time"
            value={_horariosHoraInicial}
            onChange={(e) => setHorariosHoraInicial(e.target.value)}
            variant="outlined"
            margin="normal"
          />
           <TextField
            fullWidth
            label="Hora final"
            type = "time"
            value={horariosHoraFin}
            onChange={(e) => setHorariosHoraFin(e.target.value)}
            variant="outlined"
            margin="normal"
          />
           <TextField
            fullWidth
            label="Dia de la Semana"
            value={_horariosDiaSemana}
            onChange={(e) => setHorariosDiaSemana(e.target.value)}
            variant="outlined"
            margin="normal"
          />
           <Autocomplete
           options={gradoSeccion}
           getOptionLabel={(option) => option.nombre}
           value={selectedGradoSeccion}
           onChange={(event, newValue) => setSelectedGradoSeccion(newValue)}
           renderInput={(params) => <TextField {...params} label="Seleccione Grado Seccion" variant="outlined" margin="normal" fullWidth />}
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
  const [orderBy, setOrderBy] = useState('diaSemana');
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
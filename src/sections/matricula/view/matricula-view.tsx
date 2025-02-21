import { useCallback, useEffect, useState } from 'react';


import { Autocomplete } from '@mui/material';
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
import { jsPDF } from "jspdf";


import { IMatricula } from 'src/interfaces/IMatricula';
import { IDocente } from 'src/interfaces/IDocente';
import { IStudent } from 'src/interfaces/IStudent';
import { ILegalGuardian } from 'src/interfaces/ILegalGuardian';
import { IGradoSeccion } from 'src/interfaces/IGradoSeccion';
import { IHorarios } from 'src/interfaces/IHorarios';
import { applyFilter, emptyRows, getComparator } from 'src/sections/matricula/utils';
import { MatriculaTableHead } from '../MatriculaTableHead';
import { MatriculaTableRow } from '../MatriculaTableRow';
import { TableEmptyRows } from '../table-empty-rows';
import { TableNoData } from '../table-no-data';
import type { MatriculaProps } from '../MatriculaTableRow';
import { MatriculaTableToolbar } from '../MatriculaTableToolbar';

// ----------------------------------------------------------------------


export function MatriculaView() {
const [matricula, setMatricula] = useState<IMatricula[]>([]);
const [_fechaMatricula, setFechaMatricula] =  useState('');
const [docente, setDocente] = useState<IDocente[]>([]);
const [selectedDocente, setSelectedDocente] = useState<IDocente | null>(null);
const [legalGuardian, setLegalGuardian] = useState<ILegalGuardian[]>([]);
const [selectedLegalGuardian, setSelectedLegalGuardian] = useState<ILegalGuardian | null>(null);   
const [student, setStudent] = useState<IStudent[]>([]);
const [selectedStudent, setSelectedStudent] = useState<IStudent | null>(null);
const [gradoSeccion, setGradoSeccion] = useState<IGradoSeccion[]>([]);
const [selectedGradoSeccion, setSelectedGradoSeccion] = useState<IGradoSeccion | null>(null);
const [horarios, setHorarios] = useState<IHorarios[]>([]);
const [selectedHorarios, setSelectedHorarios] = useState<IHorarios | null>(null);
const [openDialog, setOpenDialog] = useState(false);
const [open, setOpen] = useState(false);
const [matriculaToDelete, setMatriculaToDelete] = useState<number | null>(null);
const [openEdit, setOpenEdit] = useState(false);
const [matriculaToEdit, setMatriculaToEdit] = useState<number | null>(null);


const token = localStorage.getItem('token');


const _matricula = useCallback(async () => {
    try {
      const response = await fetch(`${appsettings.apiUrl}Matricula`, { 
        method: 'GET', 
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        setMatricula(data);
        console.log("Matrícula recibida:", data);
      } else {
        console.error('Error al obtener la Matricula:', response.status);
      }
    } catch (error) {
      console.error('Error en la petición:', error);
    }
  }, [token]);

  const _obtenerLegalGuardian = useCallback(async () => {
    try {
      const response = await fetch(`${appsettings.apiUrl}LegalGuardian`, { 
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });
      if (response.ok) {
          const data: ILegalGuardian[] = await response.json();
          setLegalGuardian(data);
          console.log("Apoderados recibidos", data);
      } else {
        console.error('Error al obtener LegalGuardian:', response.status);
      }
    } catch (error) {
      console.error('Error en la petición:', error);
    }
}, [token]);

const _obtenerStudent = useCallback(async () => {
    try {
      const response = await fetch(`${appsettings.apiUrl}Student`, { 
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });
      if (response.ok) {
          const data: IStudent[] = await response.json();
          setStudent(data);
          console.log("Estudiantes recibidos", data);
      } else {
        console.error('Error al obtener Student:', response.status);
      }
    } catch (error) {
      console.error('Error en la petición:', error);
    }
}, [token]);


  const _obtenerDocente = useCallback(async () => {
    try {
      const response = await fetch(`${appsettings.apiUrl}Docente`, { 
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });
      if (response.ok) {
          const data: IDocente[] = await response.json();
          setDocente(data);
          console.log("Docentes recibidos", data);
      } else {
        console.error('Error al obtener la Docente:', response.status);
      }
    } catch (error) {
      console.error('Error en la petición:', error);
    }
}, [token]);


const _obtenerHorario = useCallback(async () => {
  try {
    const response = await fetch(`${appsettings.apiUrl}Horario`, { method: 'GET' });
    if (response.ok) {
        const data: IHorarios[] = await response.json();
        setHorarios(data);
        console.log("Horarios recibidos", data)
    } else {
      console.error('Error al obtener el Horario:', response.status);
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
        const data: IHorarios[] = await response.json();
        setHorarios(data);
        console.log("Horarios filtrados:", data);
      } else {
        console.error('Error al obtener los Horarios por gradoSeccion:', response.status);
      }
    } catch (error) {
      console.error('Error en la petición:', error);
    }
  }, []);

useEffect(() => {
    _matricula();
    _obtenerLegalGuardian();
    _obtenerStudent();
    _obtenerDocente();
    _obtenerHorario();
    _obtenerGradoSeccion();
  }, [_matricula, _obtenerDocente, _obtenerHorario, _obtenerGradoSeccion, _obtenerLegalGuardian, _obtenerStudent]);

  useEffect(() => {
    if (selectedGradoSeccion) {
      const filteredHorarios = horarios.filter(
        (h) => h.gradoSeccion.id === selectedGradoSeccion.id
      );
      if (filteredHorarios.length > 0) {
        setSelectedHorarios(filteredHorarios[0]);
      } else {
        setSelectedHorarios(null);
      }
    } else {
      setSelectedHorarios(null);
    }
  }, [selectedGradoSeccion, horarios]);

  useEffect(() => {
    if (selectedStudent) {
      const filteredGuardian = legalGuardian.find(
        (lg) => lg.id === selectedStudent.legalGuardianId
      );
      console.log("Apoderado filtrado:", filteredGuardian);
      setSelectedLegalGuardian(filteredGuardian || null);
    } else {
      setSelectedLegalGuardian(null);
    }
  }, [selectedStudent, legalGuardian]);
  
// Registro de Matricula
const handleOpen = () => {setFechaMatricula(new Date().toISOString()); setOpen(true)} ;
const handleClose = () => setOpen(false);
const handleSave = async () => {
    const formattedFechaMatricula = _fechaMatricula 
    ? new Date(_fechaMatricula).toISOString() 
    : new Date().toISOString();

  const matriculaData = {
    fechaMatricula : formattedFechaMatricula,
    docenteId: selectedDocente?.id,
    studentId: selectedStudent?.id,
    legalGuardianId: selectedLegalGuardian?.id,
    gradoSeccionId: selectedGradoSeccion?.id,
    horarioId: selectedHorarios?.id,
    estado: true
  };

  try {
    const response = await fetch(`${appsettings.apiUrl}Matricula`, { 
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      
      body: JSON.stringify(matriculaData),
    });

    if (response.ok) {
      const matriculaCreada: IMatricula = await response.json();
      setMatricula(prev => [...prev, matriculaCreada as IMatricula]);
      setOpen(false);
      setFechaMatricula('');
      setSelectedDocente(null);
      setSelectedStudent(null);
      setSelectedLegalGuardian(null);
      setSelectedGradoSeccion(null);
      setSelectedHorarios(null);
      toast.success('Matricula registrada exitosamente', { autoClose: 3000, position: "top-right" });
    } else {
      console.error('Error al guardar la Matricula:', response.status);
      toast.error('Error al registrar la Matricula', { autoClose: 3000, position: "top-right" });
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
  setMatriculaToDelete(null);
  setFechaMatricula('');
  setSelectedDocente(null);
  setSelectedStudent(null);
  setSelectedLegalGuardian(null);
  setSelectedGradoSeccion(null);
  setSelectedHorarios(null);
  toast.info('Operación cancelada', { autoClose: 3000, position: "top-right" });
};

const handleDelete = async (matriculaId : number) => {
  setMatriculaToDelete(matriculaId);
  setOpenDialog(true);
};

const confirmDelete = async () => {
  try {
    const response = await fetch(`${appsettings.apiUrl}Matricula/${matriculaToDelete}`, {
      method: 'DELETE',
      headers: { 'Accept': '*/*' },
    });
    if (response.ok) {
      _matricula();
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
  setMatriculaToDelete(null);
};

// Desactivar Matricula
const handleDesactivate = async (id: number) => {
    try {
      const response = await fetch(`${appsettings.apiUrl}Matricula/desactivate/${id}`, {
        method: 'PUT',
        headers: {
          'Accept': '*/*',
        },
      });
      if (response.ok) {
        _matricula();
        toast.success('Matricula inhabilitada exitosamente', {autoClose: 3000,position: "top-right",});
      } else {
        console.error('Error al inhabilitar la Matricula:', response.status);
        toast.error('Error al inhabilitar la Matricula', { autoClose: 3000, position: "top-right" });
      }
    } catch (error) {
      console.error('Error en la petición:', error);
      toast.error('Error en la petición', { autoClose: 3000, position: "top-right" });
    }
  };

// Habilitar Matricula

const handleReinstate = async (id: number) => {
    try {
      const response = await fetch(`${appsettings.apiUrl}Matricula/reinstate/${id}`, {
        method: 'PUT',
        headers: {
          'Accept': '*/*',
        },
      });
      if (response.ok) {
        _matricula();
        toast.success('Matricula habilitada exitosamente', {autoClose: 3000,position: "top-right",});
      } else {
        console.error('Error al habilitar la Matricula:', response.status);
        toast.error('Error al habilitar la Matricula', { autoClose: 3000, position: "top-right" });
      }
    } catch (error) {
      console.error('Error en la petición:', error);
      toast.error('Error en la petición', { autoClose: 3000, position: "top-right" });
    }
  };

// Función para editar una Matrícula
const handleEdit = (matriculaIten: IMatricula) => {
    setMatriculaToEdit(matriculaIten.id);
    setFechaMatricula(matriculaIten.fechaMatricula);
    setSelectedDocente(docente.find(d => d.id === matriculaIten.docente.id) || null);
    setSelectedStudent(student.find(s => s.id === matriculaIten.student.id) || null);
    setSelectedLegalGuardian(legalGuardian.find(g => g.id === matriculaIten.legalGuardian?.id) || null);
    
    const _gradoSeccion = gradoSeccion.find(gs => gs.id === matriculaIten.gradoSeccion.id) || null;
    setSelectedGradoSeccion(_gradoSeccion);
    
    const horarioRelacionado = horarios.find(h => h.gradoSeccion.id === matriculaIten.gradoSeccion.id);
    setSelectedHorarios(horarioRelacionado || null);
    
    setOpenEdit(true); 
  };

  // Función para guardar la edición
  const handleSaveEdit = async () => {
    if (!matriculaToEdit) return;
    const formattedFechaMatricula = _fechaMatricula 
    ? new Date(_fechaMatricula).toISOString() 
    : new Date().toISOString(); 
    const matriculaData = {
      fechaMatricula: formattedFechaMatricula,
      docenteId: selectedDocente?.id,
      studentId: selectedStudent?.id,
      legalGuardianId: selectedLegalGuardian?.id,
      gradoSeccionId: selectedGradoSeccion?.id,
      horarioId: selectedHorarios?.id
    };
  
    try {
      const response = await fetch(`${appsettings.apiUrl}Matricula/${matriculaToEdit}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(matriculaData),
      });
  
      if (response.ok) {
        const matriculaActualizada: IMatricula = await response.json();
        setMatricula(prev =>
          prev.map(m =>
            m.id === matriculaToEdit ? matriculaActualizada : m
          )
        );     setOpenEdit(false);
        setFechaMatricula('');
        setSelectedDocente(null);
        setSelectedStudent(null);
        setSelectedLegalGuardian(null);
        setSelectedGradoSeccion(null);
        setSelectedHorarios(null);
        toast.success('Matrícula actualizada exitosamente', { autoClose: 3000, position: "top-right" });
      } else {
        console.error('Error al editar la Matrícula:', response.status);
        toast.error('Error al editar la Matrícula', { autoClose: 3000, position: "top-right" });
      }
    } catch (error) {
      console.error('Error en la petición:', error);
      toast.error('Error en la petición', { autoClose: 3000, position: "top-right" });
    }
  };
  

  const table = useTable();

  const [filterName, setFilterName] = useState('');

  const dataFiltered: MatriculaProps[] = applyFilter({
    inputData: matricula,
    comparator: getComparator(table.order, table.orderBy),
    filterName,
  });

  const notFound = !dataFiltered.length && !!filterName;
  console.log("Docentes:", docente);
  console.log("Estudiantes:", student);
  console.log("Apoderados:", legalGuardian);

  const generateReport = () => {
   // eslint-disable-next-line new-cap
    const doc = new jsPDF({
      orientation: "portrait",
      unit: "pt",
      format: "a4",
    });
  
    let yPosition = 40; 
  
    doc.setFontSize(18);
    doc.text("Reporte de Matrículas", 40, yPosition);
    yPosition += 30;
  
    doc.setFontSize(12);
    matricula.forEach((mat) => {
      const textLine = `ID: ${mat.id} - Estudiante: ${mat.student.name} ${mat.student.lastName} - Docente: ${mat.docente?.nombre} - Fecha: ${new Date(mat.fechaMatricula).toLocaleString()} - Estado: ${mat.estado ? "Activo" : "Inactivo"}`;
      doc.text(textLine, 40, yPosition);
      yPosition += 20;
      if (yPosition > doc.internal.pageSize.height - 40) {
        doc.addPage();
        yPosition = 40;
      }
    });
  
    const pdfBlob = doc.output("blob");
    const pdfUrl = URL.createObjectURL(pdfBlob);
    window.open(pdfUrl);
  };

  return (
    <DashboardContent>
      <Box display="flex" alignItems="center" mb={5}>
        <Typography variant="h4" flexGrow={1}>
          Matricula
        </Typography>
        <Button variant="contained" color="primary" onClick={generateReport}>
  Generar Reporte
</Button>
        <Button
          variant="contained"
          color="inherit"
          startIcon={<Iconify icon="mingcute:add-line" />}
          onClick={handleOpen}
        >
          Agregar Matricula
        </Button>
      </Box>

      




      <Card>
        <MatriculaTableToolbar
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
      Registrar Matricula
    </Typography>

    <TextField
  label="Fecha y Hora de Registro"
  variant="outlined"
  margin="normal"
  fullWidth
  value={new Date(_fechaMatricula).toLocaleString()} 
  InputProps={{ readOnly: true }} 
/>


    <Autocomplete
  options={docente}
  getOptionLabel={(option) => option.nombre}
  value={selectedDocente}
  onChange={(_, newValue) => setSelectedDocente(newValue)}
  renderInput={(params) => (
    <TextField 
      {...params} 
      label="Seleccione Docente" 
      variant="outlined" 
      margin="normal" 
      fullWidth 
      inputProps={{ ...params.inputProps, readOnly: true }}
    />
  )}
/>
<Autocomplete
  options={student}
  getOptionLabel={(option) => `${option.name} ${option.lastName}`}
  value={selectedStudent}
  onChange={(_, newValue) => setSelectedStudent(newValue)}
  renderInput={(params) => (
    <TextField 
      {...params} 
      label="Seleccione Estudiante" 
      variant="outlined" 
      margin="normal" 
      fullWidth 
      inputProps={{ ...params.inputProps, readOnly: true }}

    />
  )}
/>
<Autocomplete
  options={legalGuardian.filter(lg => lg.id === selectedStudent?.legalGuardianId)}
  getOptionLabel={(option) => `${option.name} ${option.lastName}`}
  value={selectedLegalGuardian}
  onChange={(_, newValue) => setSelectedLegalGuardian(newValue)}
  disabled
  renderInput={(params) => (
    <TextField 
      {...params} 
      label="Apoderado (AutoCompletado)" 
      variant="outlined" 
      margin="normal" 
      fullWidth 
      helperText={!selectedLegalGuardian ? 'No Apoderado seleccionado' : ''}
    />
  )}
/>
    <Autocomplete
  options={gradoSeccion}
  getOptionLabel={(option) => option.nombre}
  value={selectedGradoSeccion}
  onChange={(_, newValue) => setSelectedGradoSeccion(newValue)}
  renderInput={(params) => (
    <TextField 
      {...params} 
      label="Seleccione Grado Sección" 
      variant="outlined" 
      margin="normal" 
      fullWidth 
      inputProps={{ ...params.inputProps, readOnly: true }}

    />
  )}
/>
<Autocomplete
        // Se muestran solo los horarios filtrados para el gradoSeccion seleccionado
        options={horarios}
        getOptionLabel={(option) => `Horario ${option.id} - ${option.horaInicio} a ${option.horaFin}`}
        value={selectedHorarios}
        onChange={(_, newValue) => setSelectedHorarios(newValue)}
        disabled 
        renderInput={(params) => (
          <TextField 
            {...params} 
            label="Horario (Autocompletado)" 
            variant="outlined" 
            margin="normal" 
            fullWidth 
          />
        )}
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
              <MatriculaTableHead
                order={table.order}
                orderBy={table.orderBy}
                rowCount={matricula.length}
                numSelected={table.selected.length}
                onSort={table.onSort}
                onSelectAllRows={(checked) =>
                  table.onSelectAllRows(
                    checked,
                    matricula.map((matriculaItem) => String(matriculaItem.id))
                  )
                }
                headLabel={[
                  { id: 'fechaMatricula', label: 'Fecha Matricula' },
                  { id: 'student', label: 'Estudiante' },
                  { id: 'docente', label: 'Docente' },
                  { id: 'gradoSeccion', label: 'Grado Sección' },
                  { id: 'legalGuardian', label: 'Apoderado' },
                  { id: 'horario', label: 'Horario Id' },
                ]}
              />
              <TableBody>
                {dataFiltered
                  .slice(
                    table.page * table.rowsPerPage,
                    table.page * table.rowsPerPage + table.rowsPerPage
                  )
                  .map((row) => (
                    <MatriculaTableRow
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
                  emptyRows={emptyRows(table.page, table.rowsPerPage, dataFiltered.length)}
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
            ¿Estás seguro de que deseas eliminar esta Matricula?
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
  Editar Matrícula
</Typography>


<Autocomplete
  options={docente}
  getOptionLabel={(option) => option.nombre}
  value={selectedDocente}
  onChange={(_, newValue) => setSelectedDocente(newValue)}
  renderInput={(params) => (
    <TextField 
      {...params} 
      label="Seleccione Docente" 
      variant="outlined" 
      margin="normal" 
      fullWidth 
      inputProps={{ ...params.inputProps, readOnly: true }}
    />
  )}
/>
<Autocomplete
  options={student}
  getOptionLabel={(option) => `${option.name} ${option.lastName}`}
  value={selectedStudent}
  onChange={(_, newValue) => setSelectedStudent(newValue)}
  renderInput={(params) => (
    <TextField 
      {...params} 
      label="Seleccione Estudiante" 
      variant="outlined" 
      margin="normal" 
      fullWidth 
      inputProps={{ ...params.inputProps, readOnly: true }}

    />
  )}
/>
<Autocomplete
  options={legalGuardian.filter(lg => lg.id === selectedStudent?.legalGuardianId)} 
  getOptionLabel={(option) => `${option.name} ${option.lastName}`}
  value={selectedLegalGuardian}
  disabled
  onChange={(_, newValue) => setSelectedLegalGuardian(newValue)}
  renderInput={(params) => (
    <TextField 
      {...params} 
      label="Apoderado(AutoCompletado) " 
      variant="outlined" 
      margin="normal" 
      fullWidth 
      inputProps={{ ...params.inputProps, readOnly: true }}

    />
  )}
/>
    <Autocomplete
  options={gradoSeccion}
  getOptionLabel={(option) => option.nombre}
  value={selectedGradoSeccion}
  onChange={(_, newValue) => setSelectedGradoSeccion(newValue)}
  renderInput={(params) => (
    <TextField 
      {...params} 
      label="Seleccione Grado Sección" 
      variant="outlined" 
      margin="normal" 
      fullWidth 
      inputProps={{ ...params.inputProps, readOnly: true }}

    />
  )}
/>
<Autocomplete
        // Se muestran solo los horarios filtrados para el gradoSeccion seleccionado
        options={horarios}
        getOptionLabel={(option) => `Horario ${option.id} - ${option.horaInicio} a ${option.horaFin}`}
        value={selectedHorarios}
        onChange={(_, newValue) => setSelectedHorarios(newValue)}
        disabled // Lo hace de solo lectura
        renderInput={(params) => (
          <TextField 
            {...params} 
            label="Horario (Autocompletado)" 
            variant="outlined" 
            margin="normal" 
            fullWidth 
          />
        )}
      />
<Box mt={2} display="flex" justifyContent="flex-end">
  <Button onClick={handleCancel} sx={{ mr: 2 }}>
    Cancelar
  </Button>
  <Button variant="contained" onClick={handleSaveEdit}>
    Guardar Cambios
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
  const [orderBy, setOrderBy] = useState('fechaMatricula');
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
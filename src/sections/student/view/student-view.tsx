import { useCallback, useEffect, useState } from 'react';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableContainer from '@mui/material/TableContainer';
import TablePagination from '@mui/material/TablePagination';
import Typography from '@mui/material/Typography';

import { Checkbox, Dialog, DialogActions, DialogContent, DialogTitle, FormControl, FormControlLabel, InputLabel, MenuItem, Select, TextField } from '@mui/material';

import { IStudent } from 'src/interfaces/IStudent';
import { DashboardContent } from 'src/layouts/dashboard';

import { appsettings } from 'src/settings/appsettings';

import { Iconify } from 'src/components/iconify';
import { Scrollbar } from 'src/components/scrollbar';


import { StudentTableHead } from '../student-table-head';
import { StudentTableRow } from '../student-table-row';
import { StudentTableToolbar } from '../student-table-toolbar';
import { TableEmptyRows } from '../table-empty-rows';
import { TableNoData } from '../table-no-data';
import { applyFilter, emptyRows, getComparator } from '../utils';

import type { StudentProps } from '../student-table-row';

// ----------------------------------------------------------------------
const token = localStorage.getItem('token');
if (!token) {
  window.location.href = '/sign-in';
}
// ----------------------------------------------------------------------
export function StudentView() {
  const [open, setOpen] = useState(false);

  const [addLegalGuardian, setAddLegalGuardian] = useState(false);

  const [students, setStudents] = useState<IStudent[]>([]);

  const table = useTable();

  const [filterName, setFilterName] = useState('');

  const dataFiltered: StudentProps[] = applyFilter({
    inputData: students,
    comparator: getComparator(table.order, table.orderBy),
    filterName,
  });

  const notFound = !dataFiltered.length;

  const [newStudent, setNewStudent] = useState({
    code: '',
    name: '',
    lastName: '',
    gender: '',
    direction: '',
    birthdate: '',
    legalGuardianId: 0,
    legalGuardian: null,
  });

  const [newLegalGuardian, setNewLegalGuardian] = useState({
    identityDocument: '',
    name: '',
    lastName: '',
    gender: '',
    birthdate: '',
    cellphoneNumber: '',
    email: '',
    direction: '',
  });

  // Obtener Estudiantes
    const _students = async () => {
        if (!token){
            console.error('No se encontró el token de autenticación');
            return;
        }
        try {
            const response = await fetch(`${appsettings.apiUrl}Student`, { 
                method: 'GET',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
            });
            if (response.ok){
                const data = await response.json();
                setStudents(data);
            } else {
                console.error('Error al obtener los estudiantes:', response);
            }
        } catch (error) {
            console.error('Error en la petición:', error);
        }
    };

    useEffect(() => {
        _students();
    }, []);

  // Registrar Estudiante
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewStudent((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  
    // Si no se marca el checkbox de apoderado, asignamos `null` a legalGuardian
    const studentToSubmit = {
      ...newStudent,
      legalGuardian: addLegalGuardian ? newLegalGuardian : null,
    };
  
    try {
      const response = await fetch(`${appsettings.apiUrl}Student`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(studentToSubmit),
      });
  
      if (response.ok) {
        const data = await response.json();
        setStudents((prev) => [...prev, data]);
        handleClose();
      } else {
        console.error('Error al registrar el estudiante:', response);
      }
    } catch (error) {
      console.error('Error en la petición:', error);
    }
  };
  

  return (
    <DashboardContent>
      <Box display="flex" alignItems="center" mb={5}>
        <Typography variant="h4" flexGrow={1}>
          Estudiantes
        </Typography>
        <Button
          variant="contained"
          color="inherit"
          startIcon={<Iconify icon="mingcute:add-line" />}
          onClick={handleOpen}
        >
          Registrar estudiante
        </Button>
      </Box>
      
      <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
        <DialogTitle>Registrar Estudiante</DialogTitle>
        <DialogContent
          sx={{
            maxHeight: '60vh', // Limitar la altura máxima
            overflowY: 'auto', // Hacer que el contenido sea desplazable
          }}
        >
          <TextField
            label="DNI"
            value={newStudent.code}
            onChange={(e) => setNewStudent({ ...newStudent, code: e.target.value })}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Nombre"
            value={newStudent.name}
            onChange={(e) => setNewStudent({ ...newStudent, name: e.target.value })}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Apellido"
            value={newStudent.lastName}
            onChange={(e) => setNewStudent({ ...newStudent, lastName: e.target.value })}
            fullWidth
            margin="normal"
          />
          <FormControl fullWidth margin="normal">
            <InputLabel>Género</InputLabel>
            <Select
              value={newStudent.gender}
              onChange={(e) => setNewStudent({ ...newStudent, gender: e.target.value })}
            >
              <MenuItem value="varon">Varón</MenuItem>
              <MenuItem value="mujer">Mujer</MenuItem>
            </Select>
          </FormControl>
          <TextField
            label="Dirección"
            value={newStudent.direction}
            onChange={(e) => setNewStudent({ ...newStudent, direction: e.target.value })}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Fecha de nacimiento"
            type="date"
            value={newStudent.birthdate}
            onChange={(e) => setNewStudent({ ...newStudent, birthdate: e.target.value })}
            fullWidth
            margin="normal"
            InputLabelProps={{
              shrink: true,
            }}
          />

          <FormControlLabel
            control={
              <Checkbox
                checked={addLegalGuardian}
                onChange={(e) => setAddLegalGuardian(e.target.checked)}
                name="addLegalGuardian"
              />
            }
            label="Agregar apoderado"
          />

          {addLegalGuardian && (
            <>
              <TextField
                label="DNI del apoderado"
                value={newLegalGuardian.identityDocument}
                onChange={(e) =>
                  setNewLegalGuardian({
                    ...newLegalGuardian,
                    identityDocument: e.target.value,
                  })
                }
                fullWidth
                margin="normal"
              />
              <TextField
                label="Nombre del apoderado"
                value={newLegalGuardian.name}
                onChange={(e) =>
                  setNewLegalGuardian({
                    ...newLegalGuardian,
                    name: e.target.value,
                  })
                }
                fullWidth
                margin="normal"
              />
              <TextField
                label="Apellido del apoderado"
                value={newLegalGuardian.lastName}
                onChange={(e) =>
                  setNewLegalGuardian({
                    ...newLegalGuardian,
                    lastName: e.target.value,
                  })
                }
                fullWidth
                margin="normal"
              />
              <FormControl fullWidth margin="normal">
                <InputLabel>Género del apoderado</InputLabel>
                <Select
                  value={newLegalGuardian.gender}
                  onChange={(e) =>
                    setNewLegalGuardian({
                      ...newLegalGuardian,
                      gender: e.target.value,
                    })
                  }
                >
                  <MenuItem value="varon">Varón</MenuItem>
                  <MenuItem value="mujer">Mujer</MenuItem>
                </Select>
              </FormControl>
              <TextField
                label="Fecha de nacimiento del apoderado"
                type="date"
                value={newLegalGuardian.birthdate}
                onChange={(e) =>
                  setNewLegalGuardian({
                    ...newLegalGuardian,
                    birthdate: e.target.value,
                  })
                }
                fullWidth
                margin="normal"
                InputLabelProps={{
                  shrink: true,
                }}
              />
              <TextField
                label="Número de celular del apoderado"
                value={newLegalGuardian.cellphoneNumber}
                onChange={(e) =>
                  setNewLegalGuardian({
                    ...newLegalGuardian,
                    cellphoneNumber: e.target.value,
                  })
                }
                fullWidth
                margin="normal"
              />
              <TextField
                label="Correo electrónico del apoderado"
                value={newLegalGuardian.email}
                onChange={(e) =>
                  setNewLegalGuardian({
                    ...newLegalGuardian,
                    email: e.target.value,
                  })
                }
                fullWidth
                margin="normal"
              />
              <TextField
                label="Dirección del apoderado"
                value={newLegalGuardian.direction}
                onChange={(e) =>
                  setNewLegalGuardian({
                    ...newLegalGuardian,
                    direction: e.target.value,
                  })
                }
                fullWidth
                margin="normal"
              />
            </>
          )}
        </DialogContent>

        <DialogActions>
          <Button onClick={handleClose} color="primary" >
            Cancelar
          </Button>
          <Button onClick={handleSubmit} color="primary" variant="contained">
            Registrar
          </Button>
        </DialogActions>
      </Dialog>

      <Card>
        <StudentTableToolbar
          numSelected={table.selected.length}
          filterName={filterName}
          onFilterName={(event: React.ChangeEvent<HTMLInputElement>) => {
            setFilterName(event.target.value);
            table.onResetPage();
          }}
        />

        <Scrollbar>
          <TableContainer sx={{ overflow: 'unset' }}>
            <Table sx={{ minWidth: 800 }}>
              <StudentTableHead
                order={table.order}
                orderBy={table.orderBy}
                rowCount={students.length}
                numSelected={table.selected.length}
                onSort={table.onSort}
                onSelectAllRows={(checked) =>
                  table.onSelectAllRows(
                    checked,
                    students.map((student) => String(student.id))
                  )
                }
                headLabel={[
                  { id: 'code', label: 'DNI' },
                  { id: 'name', label: 'Nombre' },
                  { id: 'lastName', label: 'Apellido' },
                  { id: 'direcction', label: 'Dirección'},
                  { id: 'birthdate', label: 'Nacimiento' },
                  { id: '' },
                ]}
              />
              <TableBody>
                {dataFiltered
                  .slice(
                    table.page * table.rowsPerPage,
                    table.page * table.rowsPerPage + table.rowsPerPage
                  )
                  .map((row) => (
                    <StudentTableRow
                      key={row.id}
                      row={row}
                      selected={table.selected.includes(String(row.id))}
                      onSelectRow={() => table.onSelectRow(String(row.id))}
                    />
                  ))}

                <TableEmptyRows
                  height={68}
                  emptyRows={emptyRows(table.page, table.rowsPerPage, students.length)}
                />

                {notFound && <TableNoData searchQuery={filterName} />}
              </TableBody>
            </Table>
          </TableContainer>
        </Scrollbar>

        <TablePagination
          component="div"
          page={table.page}
          count={students.length}
          rowsPerPage={table.rowsPerPage}
          onPageChange={table.onChangePage}
          rowsPerPageOptions={[5, 10, 25]}
          onRowsPerPageChange={table.onChangeRowsPerPage}
          labelRowsPerPage="Registros por página"
          labelDisplayedRows={({ from, to, count }) => `Página ${from}-${to} de ${count}`}
        />
      </Card>
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
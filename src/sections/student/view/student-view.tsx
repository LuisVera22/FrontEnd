import { useCallback, useEffect, useState } from 'react';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableContainer from '@mui/material/TableContainer';
import TablePagination from '@mui/material/TablePagination';
import Typography from '@mui/material/Typography';


import { IStudent } from 'src/interfaces/IStudent';
import { DashboardContent } from 'src/layouts/dashboard';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { appsettings } from 'src/settings/appsettings';

import { Iconify } from 'src/components/iconify';
import { Scrollbar } from 'src/components/scrollbar';


import { StudentTableHead } from '../student-table-head';
import { StudentTableRow } from '../student-table-row';
import { StudentTableToolbar } from '../student-table-toolbar';
import { TableEmptyRows } from '../table-empty-rows';
import { TableNoData } from '../table-no-data';
import { applyFilter, emptyRows, getComparator } from '../utils';

import { StudentRegisterModal } from '../student-modal-register';
import type { StudentProps } from '../student-table-row';

// ----------------------------------------------------------------------
const token = localStorage.getItem('token');
if (!token) {
  window.location.href = '/sign-in';
}
// ----------------------------------------------------------------------
type LegalGuardian = {
  identityDocument: string;
  name: string;
  lastName: string;
  gender: string;
  birthdate: string;
  cellphoneNumber: string;
  email: string;
  direction: string;
};

type NewStudentRequest = {
  id: number
  code: string;
  name: string;
  lastName: string;
  direction: string;
  gender: string;
  birthdate: string;
  legalGuardianId?: number;
  legalGuardian?: LegalGuardian;
};

type StudentRequest = {
  id: number;
  code: string;
  name: string;
  lastName: string;
  direction: string;
  gender: string;
  birthdate: string;
  legalGuardianId?: number;
  legalGuardian?: LegalGuardian;
};

export function StudentView() {
  const [open, setOpen] = useState(false);

  const [students, setStudents] = useState<IStudent[]>([]);

  const table = useTable();

  const [filterName, setFilterName] = useState('');

  const dataFiltered: StudentProps[] = applyFilter({
    inputData: students,
    comparator: getComparator(table.order, table.orderBy),
    filterName,
  });

  const notFound = !dataFiltered.length;

  const [newStudent, setNewStudent] = useState<NewStudentRequest>({
    id: 0,
    code: '',
    name: '',
    lastName: '',
    direction: '',
    gender: '',
    birthdate: '',
    legalGuardianId: undefined,
    legalGuardian: undefined,
  });

  const [newLegalGuardian, setNewLegalGuardian] = useState({
    id: 0,
    identityDocument: '',
    name: '',
    lastName: '',
    gender: '',
    birthdate: '',
    cellphoneNumber: '',
    email: '',
    direction: '',
  });

  const handleEdit = (student: StudentProps) => {
    setNewStudent({
      id: student.id,
      code: student.code,
      name: student.name,
      lastName: student.lastName,
      gender: student.gender,
      direction: student.direction,
      birthdate: student.birthdate,
      legalGuardianId: student.legalGuardianId,
      legalGuardian: undefined,
    });
    setOpen(true);
  };  

  const [addLegalGuardian, setAddLegalGuardian] = useState(false);

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
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  
  const resetState = () => {
    setNewStudent({
      id: 0,
      code: '',
      name: '',
      lastName: '',
      direction: '',
      gender: '',
      birthdate: '',
      legalGuardianId: undefined,
      legalGuardian: undefined,
    });
  };

  const handleSubmit = async (studentData: NewStudentRequest | StudentRequest, isEdit: boolean) => {
    if (!token) {
      console.error('No se encontró el token de autenticación');
      return;
    }

    try {
      let response;
      if (isEdit) {
        // Actualización (PUT)
        response = await fetch(`${appsettings.apiUrl}Student/${studentData.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify(studentData),
        });
      } else {
        // Registro (POST)
        response = await fetch(`${appsettings.apiUrl}Student`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify(studentData),
        });
      }

      if (response.ok) {
        const data = await response.json();
        toast.success(isEdit ? 'Estudiante editado exitosamente' : 'Estudiante registrado exitosamente', {
          autoClose: 3000,
          position: "top-right",
        });
        // Reiniciar estado después de una solicitud exitosa
        resetState();
        setOpen(false);
      } else {
        throw new Error('Error en la solicitud');
      }
    } catch (error) {
      console.error('Error en la petición:', error);
      toast.error('Hubo un error al procesar la solicitud', {
        autoClose: 3000,
        position: "top-right",
      });
    }
  };
  
  // Eliminar Estudiante
  const handleDelete = async (studentId: number) => {
    if (!token) {
      console.error('No se encontró el token de autenticación');
      return;
    }
  
    try {
      const response = await fetch(`${appsettings.apiUrl}Student/${studentId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });
  
      if (response.ok) {
        setStudents((prev) => prev.filter(student => student.id !== studentId));
        toast.success('Estudiante eliminado exitosamente', {
                  autoClose: 3000,
                  position: "top-right",
                });
      } else {
        console.error('Error al eliminar el estudiante:', response);
        toast.error('Error al eliminar el etudiante.', {
          autoClose: 3000,
          position: "top-right",
        });
      }
    } catch (error) {
      console.error('Error en la petición:', error);
      toast.error('Error en la petición.', {
        autoClose: 3000,
        position: "top-right",
      });
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
      
      <StudentRegisterModal
        open={open}
        onClose={handleClose}
        onSubmit={handleSubmit}
        student={newStudent}
        setStudent={setNewStudent}
        addLegalGuardian={addLegalGuardian}
        setAddLegalGuardian={setAddLegalGuardian}
        newLegalGuardian={newLegalGuardian}
        setNewLegalGuardian={setNewLegalGuardian}
      />


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
                      onEdit={() => handleEdit(row)}
                      onDelete={(id) => handleDelete(id)}
                      assingLegalGuardian={(id) => console.log(id)}
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
import { useCallback, useEffect, useState } from 'react';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableContainer from '@mui/material/TableContainer';
import TablePagination from '@mui/material/TablePagination';
import Typography from '@mui/material/Typography';

import { DashboardContent } from 'src/layouts/dashboard';

import { IStudent } from 'src/interfaces/IStudent';

import { ToastContainer } from 'react-toastify';
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

import { RegisterStudentModal } from '../student-modal-register';
import type { StudentProps } from '../student-table-row';

// ----------------------------------------------------------------------
const token = localStorage.getItem('token');
if (!token) {
  window.location.href = '/sign-in';
}
// ----------------------------------------------------------------------

export function StudentView() {
  const table = useTable();
  const [openModal, setOpenModal] = useState(false);
  const [students, setStudents] = useState<IStudent[]>([]);
  const [filterName, setFilterName] = useState('');

  const dataFiltered: StudentProps[] = applyFilter({
    inputData: students,
    comparator: getComparator(table.order, table.orderBy),
    filterName,
  });

  const notFound = !dataFiltered.length;

  // Obtener estudiantes
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

  // Registro de estudiantes
  const handleOpenModal = () => {
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  const handleRegisterStudent = (student: IStudent) => {
    setStudents((prev) => [...prev, student]);
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
          onClick={handleOpenModal}
        >
          Registrar Estudiante
        </Button>
      </Box>

      <RegisterStudentModal
        open={openModal}
        onClose={handleCloseModal}
        onRegister={handleRegisterStudent}
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
                    students.map((studentSelected) => String(studentSelected.id))
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
                      onEdit={() => (row)}
                      onDelete={(id) => (id)}
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

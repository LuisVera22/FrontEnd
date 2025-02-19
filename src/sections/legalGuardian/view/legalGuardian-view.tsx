import { useCallback, useEffect, useState } from 'react';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableContainer from '@mui/material/TableContainer';
import TablePagination from '@mui/material/TablePagination';
import Typography from '@mui/material/Typography';

import { ILegalGuardian } from 'src/interfaces/ILegalGuardian';
import { DashboardContent } from 'src/layouts/dashboard';

import { appsettings } from 'src/settings/appsettings';

import { Iconify } from 'src/components/iconify';
import { Scrollbar } from 'src/components/scrollbar';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { TableEmptyRows } from '../table-empty-rows';
import { TableNoData } from '../table-no-data';
import { applyFilter, emptyRows, getComparator } from '../utils';

import { EditLegalGuardianModal } from '../legalGuardian-modal-edit';
import { AddLegalGuardianModal } from '../legalGuardian-modal-register';
import { LegalGuardianTableHead } from '../legalGuardian-table-head';
import { LegalGuardianTableRow, type LegalGuardianProps } from '../legalGuardian-table-row';
import { LegalGuardianTableToolbar } from '../legalGuardian-table-toolbar';

// ----------------------------------------------------------------------
const token = localStorage.getItem('token');
if (!token) {
  window.location.href = '/sign-in';
}

const emptyGuardian: ILegalGuardian = {
  id: 0,
  identityDocument: '',
  name: '',
  lastName: '',
  gender: '',
  birthdate: '', 
  cellphoneNumber: '',
  email: '',
  direction: '',
};

export function LegalGuardianView() {
  const [legalGuardians, setLegalGuardians] = useState<ILegalGuardian[]>([]);
  const [openModal, setOpenModal] = useState(false);
  const [selectedGuardian, setSelectedGuardian] = useState<ILegalGuardian | null>(null);
  const [openEditModal, setOpenEditModal] = useState(false);
  const table = useTable();

  const [filterName, setFilterName] = useState('');

  const dataFiltered: LegalGuardianProps[] = applyFilter({
    inputData: legalGuardians,
    comparator: getComparator(table.order, table.orderBy),
    filterName,
  });

  const notFound = !dataFiltered.length;

  // Obtener Apoderado
    const _legalGuardians = async () => {
        if (!token){
            console.error('No se encontró el token de autenticación');
            return;
        }
        try {
            const response = await fetch(`${appsettings.apiUrl}LegalGuardian`, { 
                method: 'GET',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
            });
            if (response.ok){
                const data = await response.json();
                setLegalGuardians(data);
            } else {
                console.error('Error al obtener los apoderados:', response);
            }
        } catch (error) {
            console.error('Error en la petición:', error);
        }
    };
  
  // Crear Apoderado
  const handleSave = async (newGuardian: ILegalGuardian) => {
    if (!token) {
      console.error('No se encontró el token de autenticación');
      return;
    }

    try {
      const response = await fetch(`${appsettings.apiUrl}LegalGuardian`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(newGuardian),
      });

      if (response.ok) {
        const savedGuardian = await response.json();
        setLegalGuardians((prevGuardians) => [...prevGuardians, savedGuardian]);
        _legalGuardians();
        setOpenModal(false); 
        toast.success('Apoderado creado exitosamente', {
                autoClose: 3000,
                position: "top-right",
              });
      } else {
        console.error('Error al registrar el apoderado:', response);
      }
    } catch (error) {
      console.error('Error en la petición:', error);
    }
  };

  // Eliminar Apoderado
  const handleDelete = async (id: number) => {
    if (!token) {
      console.error('No se encontró el token de autenticación');
      return;
    }
  
    try {
      const response = await fetch(`${appsettings.apiUrl}LegalGuardian/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });
  
      if (response.ok) {
        setLegalGuardians(legalGuardians.filter((guardian) => guardian.id !== id));
        toast.success('Apoderado eliminado exitosamente', {
          autoClose: 3000,
          position: "top-right",
        });
      } else {
        console.error('Error al eliminar el apoderado:', response);
      }
    } catch (error) {
      console.error('Error en la petición:', error);
    }
  };

  // Editar Apoderado
  const handleEdit = (id: number) => {
    const guardian = legalGuardians.find((lg) => lg.id === id);
    if (guardian) {
      setSelectedGuardian(guardian);
      setOpenEditModal(true);
    }
  };
  
  const handleSaveEdit = async (updatedGuardian: ILegalGuardian) => {
    if (!token) {
      console.error('No se encontró el token de autenticación');
      return;
    }
  
    try {
      const response = await fetch(`${appsettings.apiUrl}LegalGuardian/${updatedGuardian.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(updatedGuardian),
      });
  
      const responseText = await response.text();
  
      if (response.ok) {
        try {
          const updatedData = JSON.parse(responseText);
  
          setLegalGuardians((prevGuardians) =>
            prevGuardians.map((guardian) =>
              guardian.id === updatedData.id ? updatedData : guardian
            )
          );
          _legalGuardians();
          setOpenEditModal(false);
          toast.success('Apoderado actualizado exitosamente', {
                  autoClose: 3000,
                  position: "top-right",
                });
        } catch (e) {
          console.error('Error al parsear JSON:', e);
          console.error('Respuesta no válida:', responseText);
        }
      } else {
        console.error('Error al actualizar el apoderado:', responseText);
      }
    } catch (error) {
      console.error('Error en la petición:', error);
    }
  };  

    useEffect(() => {
      _legalGuardians();
    }, []);
  
  
  return (
    <DashboardContent>
      <Box display="flex" alignItems="center" mb={5}>
        <Typography variant="h4" flexGrow={1}>
          Apoderados
        </Typography>
        <Button
          variant="contained"
          color="inherit"
          startIcon={<Iconify icon="mingcute:add-line" />}
          onClick={() => setOpenModal(true)}
        >
          Registrar apoderado
        </Button>
      </Box>

      <Card>
        <LegalGuardianTableToolbar
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
              <LegalGuardianTableHead
                order={table.order}
                orderBy={table.orderBy}
                rowCount={legalGuardians.length}
                numSelected={table.selected.length}
                onSort={table.onSort}
                onSelectAllRows={(checked) =>
                  table.onSelectAllRows(
                    checked,
                    legalGuardians.map((legalGuardian) => String(legalGuardian.id))
                  )
                }
                headLabel={[
                  { id: 'identityDocument', label: 'DNI' },
                  { id: 'name', label: 'Nombre' },
                  { id: 'lastName', label: 'Apellido' },
                  { id: 'direcction', label: 'Dirección'},
                  { id: 'cellphoneNumber', label: 'Celular' },
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
                    <LegalGuardianTableRow
                      key={row.id}
                      row={row}
                      selected={table.selected.includes(String(row.id))}
                      onSelectRow={() => table.onSelectRow(String(row.id))}
                      onDelete={() => handleDelete(row.id)}
                      onEdit={() => handleEdit(row.id)}
                    />
                  ))}

                <TableEmptyRows
                  height={68}
                  emptyRows={emptyRows(table.page, table.rowsPerPage, legalGuardians.length)}
                />

                {notFound && <TableNoData searchQuery={filterName} />}
              </TableBody>
            </Table>
          </TableContainer>
        </Scrollbar>

        <TablePagination
          component="div"
          page={table.page}
          count={legalGuardians.length}
          rowsPerPage={table.rowsPerPage}
          onPageChange={table.onChangePage}
          rowsPerPageOptions={[5, 10, 25]}
          onRowsPerPageChange={table.onChangeRowsPerPage}
          labelRowsPerPage="Registros por página"
          labelDisplayedRows={({ from, to, count }) => `Página ${from}-${to} de ${count}`}
        />

        <AddLegalGuardianModal
          open={openModal}
          onClose={() => setOpenModal(false)}
          onSave={handleSave}
        />

        <EditLegalGuardianModal
          open={openEditModal}
          onClose={() => setOpenEditModal(false)}
          onSave={handleSaveEdit}
          initialData={selectedGuardian || emptyGuardian}
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
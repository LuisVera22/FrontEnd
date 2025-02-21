import { useCallback, useEffect, useState } from 'react';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableContainer from '@mui/material/TableContainer';
import TablePagination from '@mui/material/TablePagination';
import Typography from '@mui/material/Typography';

import { appsettings } from 'src/settings/appsettings';

import { DashboardContent } from 'src/layouts/dashboard';

import { Iconify } from 'src/components/iconify';
import { Scrollbar } from 'src/components/scrollbar';

import { Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';

import { PaymentTypesTableHead } from '../paymentTypes-table-head';
import { PaymentTypesTableRow } from '../paymentTypes-table-row';
import { PaymentTypesTableToolbar } from '../paymentTypes-table-toolbar';
import { TableEmptyRows } from '../table-empty-rows';
import { TableNoData } from '../table-no-data';
import { applyFilter, emptyRows, getComparator } from '../utils';

import type { PaymentTypesProps } from '../paymentTypes-table-row';

// ----------------------------------------------------------------------
const token = localStorage.getItem('token');

export function PaymentTypesView() {
  const table = useTable();
  const [paymentTypes, setPaymentTypes] = useState<PaymentTypesProps[]>([]);
  const [filterName, setFilterName] = useState('');
  const [openModal, setOpenModal] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [modalType, setModalType] = useState<'success' | 'error' | 'info' | 'confirmation'>('info');
  const [itemToDelete, setItemToDelete] = useState<number | null>(null);

  const dataFiltered: PaymentTypesProps[] = applyFilter({
    inputData: paymentTypes,
    comparator: getComparator(table.order, table.orderBy),
    filterName,
  });

  const notFound = !dataFiltered.length;

  const openDialog = (message: string, type: 'success' | 'error' | 'info' | 'confirmation') => {
    setModalMessage(message);
    setModalType(type);
    setOpenModal(true);
  };
  
  const closeDialog = () => {
    setOpenModal(false);
  };

  // Obtener Tipos de Pago
  const _paymentTypes = async () => {
    if (!token){
      console.error('No se encontró el token de autenticación');
        return;
    } 
    try {
      const response = await fetch(`${appsettings.apiUrl}PaymentType`, { 
        method: 'GET',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        setPaymentTypes(data);
      } else {
        console.error('Error al obtener los bancos:', response.status);
      }
    } catch (error) {
      console.error('Error en la petición:', error);
    }
  };

  useEffect(() => {
    _paymentTypes();
  }, []);

  // Eliminar Tipo de Pago
  const handleDeleteClick = (id: number) => {
    setItemToDelete(id); 
    openDialog('¿Estás seguro de que deseas eliminar este tipo de pago?', 'confirmation');
  };
  
  const _deletePaymentType = async (id: number) => {
    if (!token) {
      openDialog('Error: No se encontró el token de autenticación', 'error');
      return;
    }
  
    try {
      const response = await fetch(`${appsettings.apiUrl}PaymentType/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });
  
      if (response.ok) {
        setPaymentTypes((prev) => prev.filter((item) => item.id !== id));
        openDialog('Tipo de pago eliminado exitosamente', 'success');
      } else {
        openDialog('Error al eliminar el tipo de pago', 'error');
      }
    } catch (error) {
      openDialog('Error en la petición', 'error');
    }
  }; 

  // Desactivar y restaurar
  const handleDesactivate = (id: number) => {
    openDialog('¿Estás seguro de que deseas desactivar este tipo de pago?', 'confirmation');
  };
  
  const _desactivatePaymentType = async (id: number) => {
    if (!token) {
      openDialog('Error: No se encontró el token de autenticación', 'error');
      return;
    }

    try {
      const response = await fetch(`${appsettings.apiUrl}PaymentType/desactivate/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        setPaymentTypes((prev) => prev.map((item) => (item.id === id ? { ...item, status: false } : item)));
        openDialog('Tipo de pago desactivado exitosamente', 'success');
        _paymentTypes()
      } else {
        openDialog('Error al desactivar el tipo de pago', 'error');
      }
    } catch (error) {
      openDialog('Error en la petición', 'error');
    }
  };

  const handleReinstate = (id: number) => {
    openDialog('¿Estás seguro de que deseas restaurar este tipo de pago?', 'confirmation');
  };

  const _reinstatePaymentType = async (id: number) => {
    if (!token) {
      openDialog('Error: No se encontró el token de autenticación', 'error');
      return;
    }

    try {
      const response = await fetch(`${appsettings.apiUrl}PaymentType/reinstate/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        setPaymentTypes((prev) => prev.map((item) => (item.id === id ? { ...item, status: true } : item)));
        openDialog('Tipo de pago restaurado exitosamente', 'success');
        _paymentTypes();
      } else {
        openDialog('Error al restaurar el tipo de pago', 'error');
      }
    } catch (error) {
      openDialog('Error en la petición', 'error');
    }
  };

  return (
    <DashboardContent>
      <Box display="flex" alignItems="center" mb={5}>
        <Typography variant="h4" flexGrow={1}>
          Tipos de Pago
        </Typography>
        <Button
          variant="contained"
          color="inherit"
          startIcon={<Iconify icon="mingcute:add-line" />}
        >
          Agregar Tipo de Pago
        </Button>
      </Box>

      <Card>
        <PaymentTypesTableToolbar
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
              <PaymentTypesTableHead
                order={table.order}
                orderBy={table.orderBy}
                rowCount={paymentTypes.length}
                numSelected={table.selected.length}
                onSort={table.onSort}
                onSelectAllRows={(checked) =>
                  table.onSelectAllRows(
                    checked,
                    paymentTypes.map((paymentTypesEnter) => String(paymentTypesEnter.id))
                  )
                }
                headLabel={[
                  { id: 'description', label: 'Descripción' },
                  { id: 'status', label: 'Estado' },
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
                    <PaymentTypesTableRow
                      key={row.id}
                      row={row}
                      selected={table.selected.includes(String(row.id))}
                      onSelectRow={() => table.onSelectRow(String(row.id))}
                      onDelete={() => handleDeleteClick(row.id)}
                      onDesactivate={() => handleDesactivate(row.id)} 
                      onReinstate={() => handleReinstate(row.id)}
                      onEdit={() => (row)}
                    />
                  ))}

                <TableEmptyRows
                  height={68}
                  emptyRows={emptyRows(table.page, table.rowsPerPage, paymentTypes.length)}
                />

                {notFound && <TableNoData searchQuery={filterName} />}
              </TableBody>
            </Table>
          </TableContainer>
        </Scrollbar>

        <TablePagination
          component="div"
          page={table.page}
          count={paymentTypes.length}
          rowsPerPage={table.rowsPerPage}
          onPageChange={table.onChangePage}
          rowsPerPageOptions={[5, 10, 25]}
          onRowsPerPageChange={table.onChangeRowsPerPage}
          labelRowsPerPage="Registros por página"
          labelDisplayedRows={({ from, to, count }) => `Página ${from}-${to} de ${count}`}
        />
      </Card>
      
      <Dialog open={openModal} onClose={closeDialog}>
        <DialogTitle>{modalType === 'confirmation' ? 'Confirmación' : 'Notificación'}</DialogTitle>
        <DialogContent>
          <div>
            {modalType === 'confirmation' ? (
              <p>{modalMessage}</p>
            ) : (
              <p>{modalMessage}</p>
            )}
          </div>
        </DialogContent>
        <DialogActions>
          {modalType === 'confirmation' ? (
            <>
              <Button onClick={closeDialog} color="primary">
                Cancelar
              </Button>
              <Button
                onClick={() => {
                  if (itemToDelete) {
                    _deletePaymentType(itemToDelete);
                  }
                  closeDialog();
                }}
                color="error"
              >
                Eliminar
              </Button>
            </>
          ) : (
            <Button onClick={closeDialog} color="primary">
              Aceptar
            </Button>
          )}
        </DialogActions>

      </Dialog>
    </DashboardContent>
  );
}

// ----------------------------------------------------------------------

export function useTable() {
  const [page, setPage] = useState(0);
  const [orderBy, setOrderBy] = useState('description');
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

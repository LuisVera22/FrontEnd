import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Unstable_Grid2';
import { useEffect, useState } from 'react';

import { _tasks, _timeline } from 'src/_mock';
import { DashboardContent } from 'src/layouts/dashboard';

import { appsettings } from 'src/settings/appsettings';

import { AnalyticsStudentsAndLegalGuardian } from '../analytics-current-visits';
import { AnalyticsEnrrolledStudents } from '../analytics-enrrolled-students';
import { AnalyticsOrderTimeline } from '../analytics-order-timeline';
import { AnalyticsTasks } from '../analytics-tasks';
import { AnalyticsWidgetSummary } from '../analytics-widget-summary';

// ----------------------------------------------------------------------

const givenName = localStorage.getItem('givenName');

type GenderCounts = {
  maleStudents: number;
  femaleStudents: number;
  maleGuardians: number;
  femaleGuardians: number;
};

type MonthlyCountDto = {
  year: number;
  month: number;
  count: number;
};

type StatisticsDto = {
  total: number;
  percentageChange: number;
  monthlyCounts: MonthlyCountDto[];
};

type MonthlyGenderStudentCountDTO = {
  total: number;
  maleStudentCount: MonthlyCountDto[];
  femaleStudentCount: MonthlyCountDto[];
}

// Función para obtener los últimos 8 meses
const getLast8Months = () => {
  const months: string[] = [];
  const currentDate = new Date();

  for (let i = 7; i >= 0; i -= 1) {
    const month = new Date(currentDate);
    month.setMonth(currentDate.getMonth() - i);
    const monthName = month.toLocaleString('default', { month: 'short' });
    const year = month.getFullYear();
    months.push(`${monthName} ${year}`);
  }

  return months;
};

// Función para obtener los últimos 9 meses
const getLast9Months = () => {
  const months: string[] = [];
  const currentDate = new Date();

  for (let i = 8; i >= 0; i -= 1) {
    const month = new Date(currentDate);
    month.setMonth(currentDate.getMonth() - i);
    const monthName = month.toLocaleString('default', { month: 'short' });
    const year = month.getFullYear();
    months.push(`${monthName} ${year}`);
  }

  return months;
};

const fetchGenderCounts = async () => {
  try {
    const response = await fetch(`${appsettings.apiUrl}Analytics/genderCounts`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Error al obtener los datos');
    }

    return await response.json();
  } catch (error) {
    console.error('Error:', error);
    return null;
  }
};

const fetchStudentStatistics = async (): Promise<StatisticsDto | null> => {
  try {
    const response = await fetch(`${appsettings.apiUrl}Analytics/registeredStudents`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Error al obtener los datos');
    }

    return await response.json();
  } catch (error) {
    console.error('Error:', error);
    return null;
  }
};

const fetchTeachersStatistics = async (): Promise<StatisticsDto | null> => {
  try {
    const response = await fetch(`${appsettings.apiUrl}Analytics/registeredTeachers`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Error al obtener los datos');
    }

    return await response.json();
  } catch (error) {
    console.error('Error:', error);
    return null;
  }
};

const fetchStudentStatisticsByGender = async (): Promise<MonthlyGenderStudentCountDTO | null> => {
  try {
    const response = await fetch(`${appsettings.apiUrl}Analytics/registeredStudentsByGender`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Error al obtener los datos');
    }

    return await response.json();
  } catch (error) {
    console.error('Error:', error);
    return null;
  }
};

export function OverviewAnalyticsView() {
  const [data, setData] = useState<GenderCounts | null>(null);
  const [data2, setData2] = useState<StatisticsDto | null>(null);
  const [teachersData, setTeachersData] = useState<StatisticsDto | null>(null);
  const [studentsData, setStudentsData] = useState<MonthlyGenderStudentCountDTO | null>(null);

  useEffect(() => {
    fetchGenderCounts().then((result) => {
      if (result) {
        setData(result);
      }
    });
  }, []);

  useEffect(() => {
    fetchStudentStatistics().then((result) => {
      if (result) {
        setData2(result);
      }
    });
  }, []);

  useEffect(() => {
    fetchTeachersStatistics().then((result) => {
      if (result) {
        setTeachersData(result);
      }
    });
  }, []);

  useEffect(() => {
    fetchStudentStatisticsByGender().then((result) => {
      if (result) {
        setStudentsData(result);
      }
    });
  }, []);

  const last8Months = getLast8Months();
  const last9Months = getLast9Months();

  const subheader = `(${data2?.percentageChange || 0}%) en los últimos 9 meses`;

  return (
    <DashboardContent maxWidth="xl">
      <Typography variant="h4" sx={{ mb: { xs: 3, md: 5 } }}>
        Hola {givenName}, Bienvenido nuevamente 👋
      </Typography>

      <Grid container spacing={3}>
        <Grid xs={12} sm={6} md={3}>
          <AnalyticsWidgetSummary
            title="Docentes"
            percent={teachersData?.percentageChange || 0}
            total={teachersData?.total || 0}
            icon={<img alt="icon" src="/assets/icons/glass/ic-glass-bag.svg" />}
            chart={{
              categories: last8Months,
            series: teachersData?.monthlyCounts.map((month) => month.count) || [],
            }}
          />
        </Grid>

        <Grid xs={12} sm={6} md={3}>
          <AnalyticsWidgetSummary
            title="Estudiantes"
            percent={data2?.percentageChange || 0}
            total={data2?.total || 0}
            color="secondary"
            icon={<img alt="icon" src="/assets/icons/glass/ic-glass-users.svg" />}
            chart={{
              categories: last8Months,
              series: data2?.monthlyCounts.map((month) => month.count) || [],
            }}
          />
        </Grid>

        <Grid xs={12} sm={6} md={3}>
          <AnalyticsWidgetSummary
            title="Cobros Pendientes"
            percent={2.8}
            total={1723315}
            color="warning"
            icon={<img alt="icon" src="/assets/icons/glass/ic-glass-buy.svg" />}
            chart={{
              categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'],
              series: [40, 70, 50, 28, 70, 75, 7, 64],
            }}
          />
        </Grid>

        <Grid xs={12} sm={6} md={3}>
          <AnalyticsWidgetSummary
            title="Cobros Realizados"
            percent={3.6}
            total={234}
            color="error"
            icon={<img alt="icon" src="/assets/icons/glass/ic-glass-message.svg" />}
            chart={{
              categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'],
              series: [56, 30, 23, 54, 47, 40, 62, 73],
            }}
          />
        </Grid>

        <Grid xs={12} md={6} lg={4}>
          <AnalyticsStudentsAndLegalGuardian
            title="Alumnos y Apoderados"
            chart={{
              series: [
                { label: 'Alumnos', value: data?.maleStudents || 0 },
                { label: 'Alumnas', value: data?.femaleStudents || 0 },
                { label: 'Apoderados', value: data?.maleGuardians || 0 },
                { label: 'Apoderadas', value: data?.femaleGuardians || 0 },
              ],
            }}
          />
        </Grid>

        <Grid xs={12} md={6} lg={8}>
          <AnalyticsEnrrolledStudents
            title="Estudiantes Registrados"
            subheader= {subheader}
            chart={{
              categories: last9Months,
              series: [
                { name: 'Varones', data: studentsData?.maleStudentCount.map((month) => month.count) || [] },
                { name: 'Mujeres', data: studentsData?.femaleStudentCount.map((month) => month.count) || [] },
              ],
            }}
          />
        </Grid>

        <Grid xs={12} md={6} lg={4}>
          <AnalyticsOrderTimeline title="Order timeline" list={_timeline} />
        </Grid>

        <Grid xs={12} md={6} lg={8}>
          <AnalyticsTasks title="Tasks" list={_tasks} />
        </Grid>
      </Grid>
    </DashboardContent>
  );
}

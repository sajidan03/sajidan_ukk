import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import { type BreadcrumbItem } from '@/types';
import { Head, usePage } from '@inertiajs/react';
import {
  Calendar,
  Users,
  School,
  Newspaper,
  Image,
  Activity,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement
);

interface DashboardData {
  total_guru: number;
  total_siswa: number;
  total_berita: number;
  total_galeri: number;
  total_ekskul: number;
  total_users: number;
  statistik_siswa: { kelas: string; jumlah: number }[];
  statistik_guru: { bidang: string; jumlah: number }[];
  recent_activities: {
    id: number;
    user_name: string;
    activity: string;
    created_at: string;
  }[];
}

interface ProfilSekolah {
    id: number
    nama_sekolah: string
    alamat: string
    email: string
    telepon: string
    visi_misi: string
    foto: string
    created_at: string
    updated_at: string
}
interface PageProps{
    profil?:  ProfilSekolah
}
const breadcrumbs: BreadcrumbItem[] = [
  {
    title: 'Dashboard operator',
    href: dashboard().url,
  },
];
export default function Dashboard() {
  const { props } = usePage<{ dashboardData: DashboardData,}>();
  const dashboardData = props.dashboardData;

  const [currentTime, setCurrentTime] = useState(new Date());
  const [isClient, setIsClient] = useState(false);
  useEffect(() => {
    setIsClient(true);
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

//   const formatNumber = (num: number) =>
//     new Intl.NumberFormat('id-ID').format(num);

  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });

  const formatTime = (dateString: string) =>
    new Date(dateString).toLocaleTimeString('id-ID', {
      hour: '2-digit',
      minute: '2-digit',
    });

  const siswaChartData = {
    labels: dashboardData.statistik_siswa.map((item) => `Kelas ${item.kelas}`),
    datasets: [
      {
        label: 'Jumlah Siswa',
        data: dashboardData.statistik_siswa.map((item) => item.jumlah),
        backgroundColor: 'rgba(59, 130, 246, 0.8)',
        borderColor: 'rgba(59, 130, 246, 1)',
        borderWidth: 1,
        borderRadius: 6,
      },
    ],
  };

  const siswaChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      title: {
        display: true,
        text: `Distribusi Siswa per Kelas, Jumlah siswa ${dashboardData.total_siswa}`,
      },
    },
  };

  // Chart Guru
  const guruChartData = {
    labels: dashboardData.statistik_guru.map((item) => item.bidang),
    datasets: [
      {
        label: 'Jumlah Guru',
        data: dashboardData.statistik_guru.map((item) => item.jumlah),
        backgroundColor: [
          'rgba(255, 99, 132, 0.8)',
          'rgba(54, 162, 235, 0.8)',
          'rgba(255, 206, 86, 0.8)',
          'rgba(75, 192, 192, 0.8)',
          'rgba(153, 102, 255, 0.8)',
        ],
      },
    ],
  };

  const guruChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'right' as const },
      title: {
        display: true,
        text: `Distribusi Guru per Bidang, Jumlah guru : ${dashboardData.total_guru}`,
      },

    },
  };

  if (!isClient) {
    return (
      <AppLayout breadcrumbs={breadcrumbs}>
        <Head title="Dashboard" />
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Dashboard Admin SMK YPC" />
      <div className="flex flex-col gap-6 p-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Dashboard Operator {}</h1>
          </div>
          <div className="text-right">
            <div className="text-2xl font-mono text-blue-600">
              {currentTime.toLocaleTimeString('id-ID')}
            </div>
            <div className="text-sm text-muted-foreground">
              {currentTime.toLocaleDateString('id-ID', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </div>
          </div>
        </div>

        {/* Grid Statistik */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
          <StatCard title="Total Guru" value={dashboardData.total_guru} icon={<Users />} color="blue" />
          <StatCard title="Total Siswa" value={dashboardData.total_siswa} icon={<School />} color="green" />
          <StatCard title="Total Berita" value={dashboardData.total_berita} icon={<Newspaper />} color="amber" />
          <StatCard title="Galeri Foto" value={dashboardData.total_galeri} icon={<Image />} color="purple" />
          <StatCard title="Ekstrakurikuler" value={dashboardData.total_ekskul} icon={<Activity />} color="red" />
          <StatCard title="Admin Sistem" value={dashboardData.total_users} icon={<Users />} color="gray" />
        </div>

        {/* Charts */}
        <div className="grid gap-6 md:grid-cols-2">
          <ChartBox title="Statistik Siswa" data={siswaChartData} options={siswaChartOptions} />
          <ChartBox title="Statistik Guru" data={guruChartData} options={guruChartOptions} />
        </div>

        {/* Aktivitas Terbaru */}
        <div className="rounded-lg border bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-semibold">Aktivitas Terbaru</h2>
          {dashboardData.recent_activities.length > 0 ? (
            <div className="space-y-4">
              {dashboardData.recent_activities.map((activity) => (
                <div key={activity.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex gap-3 items-center">
                    <div className="p-2 bg-blue-100 rounded-full">
                      <Activity className="h-4 w-4 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-medium">{activity.user_name}</p>
                      <p className="text-sm text-muted-foreground">{activity.activity}</p>
                    </div>
                  </div>
                  <div className="text-right text-xs text-muted-foreground">
                    {formatDate(activity.created_at)} {formatTime(activity.created_at)}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <Calendar className="h-12 w-12 mx-auto mb-2 opacity-50" />
              <p>Belum ada aktivitas</p>
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  );
}

function StatCard({ title, value, icon, color }: { title: string; value: number; icon: any; color: string }) {
  return (
    <div className="rounded-lg border bg-white p-4 shadow-sm flex justify-between items-center">
      <div>
        <h3 className="text-sm text-muted-foreground">{title}</h3>
        <p className="text-2xl font-bold">{value}</p>
      </div>
      <div className={`rounded-full bg-${color}-100 p-2`}>{icon}</div>
    </div>
  );
}

function ChartBox({ title, data, options }: any) {
  return (
    <div className="rounded-lg border bg-white p-6 shadow-sm">
      <div className="h-80">
        <Bar options={options} data={data} />
      </div>
    </div>
  );
}

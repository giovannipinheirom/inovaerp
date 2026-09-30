'use client';
import { MetricCard } from '@/components/dashboard/metric-card';
import { AlertCircle, CheckCircle2, Clock, CheckSquare } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend } from 'recharts';

const SLA_DATA = [
  { name: 'No Prazo', value: 85, color: '#24A148' },
  { name: 'Atrasado', value: 15, color: '#DA1E28' },
];

const DEADLINE_DATA = [
  { name: 'Semana 1', noPrazo: 40, venceHoje: 5, atrasado: 2 },
  { name: 'Semana 2', noPrazo: 35, venceHoje: 8, atrasado: 5 },
  { name: 'Semana 3', noPrazo: 50, venceHoje: 2, atrasado: 1 },
];

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-600">Visão Geral</h1>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <MetricCard 
          title="Tarefas Pendentes"
          value="24"
          icon={CheckSquare}
          iconColor="bg-primary-light text-primary"
          trend={{ value: 12, isPositive: false }}
        />
        <MetricCard 
          title="Em Andamento"
          value="18"
          icon={Clock}
          iconColor="bg-warning-bg text-warning"
          trend={{ value: 5, isPositive: true }}
        />
        <MetricCard 
          title="Concluídas no Mês"
          value="142"
          icon={CheckCircle2}
          iconColor="bg-success-bg text-success"
          trend={{ value: 24, isPositive: true }}
        />
        <MetricCard 
          title="Atrasadas"
          value="3"
          icon={AlertCircle}
          iconColor="bg-danger-bg text-danger"
          trend={{ value: -2, isPositive: true }} 
        />
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Semáforo de Prazos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={DEADLINE_DATA} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <RechartsTooltip />
                  <Legend />
                  <Bar dataKey="noPrazo" name="No Prazo" stackId="a" fill="#24A148" />
                  <Bar dataKey="venceHoje" name="Vence Hoje" stackId="a" fill="#F1C21B" />
                  <Bar dataKey="atrasado" name="Atrasado" stackId="a" fill="#DA1E28" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Conformidade de SLA</CardTitle>
          </CardHeader>
          <CardContent className="flex justify-center items-center">
            <div className="h-[300px] w-full relative flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={SLA_DATA}
                    innerRadius={80}
                    outerRadius={110}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {SLA_DATA.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <RechartsTooltip />
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute flex flex-col items-center justify-center pointer-events-none">
                <span className="text-4xl font-bold text-success">85%</span>
                <span className="text-sm text-gray-500">Dentro do prazo</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

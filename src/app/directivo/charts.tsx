"use client";

import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

const tickStyle = { fontSize: 12, fontFamily: "var(--font-sans)", fill: "#5a5282" };
const tooltipContentStyle = {
  fontFamily: "var(--font-sans)",
  fontSize: 13,
  borderRadius: 10,
  border: "1px solid #e9e2dd",
  boxShadow: "0 8px 20px -6px rgb(62 53 106 / 0.2)",
};
const tooltipLabelStyle = { fontFamily: "var(--font-sans)", fontWeight: 700, color: "#2b2450" };
const legendStyle = { fontFamily: "var(--font-sans)", fontSize: 13, color: "#473f73" };

export function AlumnosPorNivelChart({ data }: { data: { level: string; alumnos: number }[] }) {
  return (
    <ResponsiveContainer width="100%" height={260}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e9e2dd" />
        <XAxis dataKey="level" tick={tickStyle} />
        <YAxis allowDecimals={false} tick={tickStyle} />
        <Tooltip contentStyle={tooltipContentStyle} labelStyle={tooltipLabelStyle} cursor={{ fill: "#f6f2ef" }} />
        <Bar dataKey="alumnos" name="Alumnos" fill="#3E356A" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}

const PAGO_COLORS: Record<string, string> = {
  PAGADO: "#0098B2",
  PENDIENTE: "#B9770E",
  VENCIDO: "#BD3138",
};

const PAGO_LABELS: Record<string, string> = {
  PAGADO: "Pagado",
  PENDIENTE: "Pendiente",
  VENCIDO: "Vencido",
};

export function EstadoPagosChart({ data }: { data: { status: string; cantidad: number }[] }) {
  const labeled = data.map((d) => ({ ...d, label: PAGO_LABELS[d.status] ?? d.status }));
  return (
    <ResponsiveContainer width="100%" height={260}>
      <PieChart>
        <Tooltip contentStyle={tooltipContentStyle} labelStyle={tooltipLabelStyle} />
        <Legend wrapperStyle={legendStyle} formatter={(value) => PAGO_LABELS[value] ?? value} />
        <Pie
          data={labeled}
          dataKey="cantidad"
          nameKey="status"
          outerRadius={90}
          label={(entry) => (entry.payload as { label: string }).label}
        >
          {labeled.map((entry) => (
            <Cell key={entry.status} fill={PAGO_COLORS[entry.status] ?? "#b3a9a4"} />
          ))}
        </Pie>
      </PieChart>
    </ResponsiveContainer>
  );
}

const currencyFmt = new Intl.NumberFormat("es-AR", { style: "currency", currency: "ARS", maximumFractionDigits: 0 });

export function PagosHistoricoChart({
  data,
}: {
  data: { period: string; pagado: number; pendiente: number; vencido: number }[];
}) {
  return (
    <ResponsiveContainer width="100%" height={280}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e9e2dd" />
        <XAxis dataKey="period" tick={tickStyle} />
        <YAxis tick={tickStyle} tickFormatter={(v) => currencyFmt.format(v)} width={90} />
        <Tooltip
          contentStyle={tooltipContentStyle}
          labelStyle={tooltipLabelStyle}
          formatter={(value) => currencyFmt.format(Number(value))}
          cursor={{ fill: "#f6f2ef" }}
        />
        <Legend wrapperStyle={legendStyle} />
        <Bar dataKey="pagado" stackId="a" fill={PAGO_COLORS.PAGADO} name="Pagado" />
        <Bar dataKey="pendiente" stackId="a" fill={PAGO_COLORS.PENDIENTE} name="Pendiente" />
        <Bar dataKey="vencido" stackId="a" fill={PAGO_COLORS.VENCIDO} radius={[4, 4, 0, 0]} name="Vencido" />
      </BarChart>
    </ResponsiveContainer>
  );
}

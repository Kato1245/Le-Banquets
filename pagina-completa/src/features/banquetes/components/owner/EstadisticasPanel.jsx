const EstadisticasPanel = ({ totalBanquetes, stats }) => {
  const statsList = [
    {
      label: "Banquetes Publicados",
      value: totalBanquetes,
      icon: "🏰",
      color: "text-primary",
      bg: "bg-primary/10",
    },
    {
      label: "Visitas este mes",
      value: stats?.totalVistas || 0,
      icon: "👀",
      color: "text-info",
      bg: "bg-info/10",
    },
    {
      label: "Solicitudes recibidas",
      value: stats?.totalSolicitudes || 0,
      icon: "📩",
      color: "text-success",
      bg: "bg-success/10",
    },
  ];

  return (
    <div>
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
        {statsList.map((s, i) => (
          <div
            key={i}
            className={`rounded-3xl p-6 border border-base-content/5 ${s.bg} flex flex-col items-center text-center`}
          >
            <span className="text-4xl mb-3">{s.icon}</span>
            <span className={`text-3xl font-black ${s.color} mb-1`}>
              {s.value}
            </span>
            <span className="text-xs font-bold uppercase tracking-widest opacity-50">
              {s.label}
            </span>
          </div>
        ))}
      </div>

      <div className="alert bg-base-200 border border-base-300 rounded-2xl">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5 shrink-0 opacity-40"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <span className="text-sm opacity-60">
          Las estadísticas de tus espacios se activan para proveer datos a medida que los usuarios los visitan.
        </span>
      </div>
    </div>
  );
};

export default EstadisticasPanel;

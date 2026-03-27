const PerfilEmpresaPanel = ({ user }) => {
  return (
    <div className="max-w-2xl">
      <div className="card bg-base-200 border border-base-300 rounded-3xl overflow-hidden mb-6">
        <div className="card-body p-8">
          <div className="flex items-center gap-6 mb-6">
            <div className="w-20 h-20 rounded-2xl bg-primary text-primary-content flex items-center justify-center text-3xl font-black shadow-lg">
              {(user?.nombre || "P").charAt(0).toUpperCase()}
            </div>
            <div>
              <h3 className="text-2xl font-black">
                {user?.nombre || "Propietario"}
              </h3>
              <p className="text-sm opacity-60 font-medium">{user?.email}</p>
              <div className="badge badge-info badge-outline mt-2 font-bold text-[10px] tracking-widest">
                PROPIETARIO
              </div>
            </div>
          </div>

          <div className="divider opacity-20 my-2" />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
            {[
              { label: "Teléfono", value: user?.telefono || "No registrado" },
              { label: "Documento", value: user?.documento || "No registrado" },
              {
                label: "Miembro desde",
                value: user?.createdAt
                  ? new Date(user.createdAt).toLocaleDateString("es", {
                    year: "numeric",
                    month: "long",
                  })
                  : "—",
              },
              {
                label: "ID de cuenta",
                value: user?.id ? `${user.id.substring(0, 12)}...` : "—",
              },
            ].map((item, i) => (
              <div
                key={i}
                className="flex justify-between items-center p-4 bg-base-100 rounded-2xl border border-base-content/5"
              >
                <span className="opacity-50 font-bold uppercase text-[10px] tracking-widest">
                  {item.label}
                </span>
                <span className="font-semibold font-mono text-xs">
                  {item.value}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="alert alert-info bg-info/10 border-info/20 rounded-2xl">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5 shrink-0"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
          />
        </svg>
        <span className="text-sm">
          Para editar los datos de tu perfil, ve a{" "}
          <strong>Configuración de Perfil</strong> desde el menú de usuario.
        </span>
      </div>
    </div>
  );
};

export default PerfilEmpresaPanel;

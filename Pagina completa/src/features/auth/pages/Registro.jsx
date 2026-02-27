import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';

const Register = () => {
  const { register, error: authError } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    nombre: '',
    email: '',
    password: ''
  });

  const [loading, setLoading] = useState(false);
  const [localError, setLocalError] = useState(null);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
    setLocalError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setLocalError(null);

    try {
      await register('usuario', {
        nombre: form.nombre,
        email: form.email,
        contrasena: form.password
      });
      navigate('/banquetes');
    } catch (err) {
      console.error("Registration component error:", err);
    } finally {
      setLoading(false);
    }
  };

  const displayError = localError || authError;

  return (
    <div className="min-h-screen flex items-center justify-center bg-base-200 px-4">

      <div className="card w-full max-w-md bg-base-100 shadow-2xl border border-primary/10">
        <div className="card-body">

          <h2 className="text-3xl font-bold text-center text-primary mb-6">
            Crear cuenta
          </h2>

          {displayError && (
            <div className="alert alert-error mb-4 shadow-sm">
              <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              <span>{displayError}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">

            <div className="form-control">
              <label className="label">
                <span className="label-text">Nombre completo</span>
              </label>
              <input
                type="text"
                name="nombre"
                placeholder="Tu nombre"
                className="input input-bordered focus:input-primary w-full"
                value={form.nombre}
                onChange={handleChange}
                required
                disabled={loading}
              />
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text">Correo electrónico</span>
              </label>
              <input
                type="email"
                name="email"
                placeholder="correo@ejemplo.com"
                className="input input-bordered focus:input-primary w-full"
                value={form.email}
                onChange={handleChange}
                required
                disabled={loading}
              />
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text">Contraseña</span>
              </label>
              <input
                type="password"
                name="password"
                placeholder="********"
                className="input input-bordered focus:input-primary w-full"
                value={form.password}
                onChange={handleChange}
                required
                disabled={loading}
                minLength={6}
              />
            </div>

            <div className="form-control mt-6">
              <button
                type="submit"
                className={`btn btn-primary w-full ${loading ? 'loading' : ''}`}
                disabled={loading}
              >
                {loading ? 'Creando cuenta...' : 'Registrarse'}
              </button>
            </div>

          </form>

          <div className="text-center mt-4 text-sm">
            ¿Ya tienes cuenta?{' '}
            <Link to="/login" className="text-primary hover:underline font-semibold">
              Inicia sesión
            </Link>
          </div>

          <div className="divider text-xs opacity-50">O TAMBIÉN</div>

          <div className="text-center text-sm">
            ¿Eres dueño de un banquete?{' '}
            <Link to="/registro-propietario" className="text-primary hover:underline font-semibold">
              Regístrate como propietario
            </Link>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Register;
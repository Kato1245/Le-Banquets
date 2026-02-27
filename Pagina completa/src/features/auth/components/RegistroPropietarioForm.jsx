import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';

const RegistroPropietarioForm = () => {
    const { register, error: authError } = useAuth();
    const navigate = useNavigate();

    const [form, setForm] = useState({
        nombre: '',
        email: '',
        contrasena: '',
        documento: '',
        telefono: '',
        rut: ''
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
            await register('propietario', form);
            navigate('/banquetes');
        } catch (err) {
            console.error("Registration error:", err);
        } finally {
            setLoading(false);
        }
    };

    const displayError = localError || authError;

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            {displayError && (
                <div className="alert alert-error shadow-sm mb-4">
                    <span>{displayError}</span>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="form-control">
                    <label className="label"><span className="label-text">Nombre Completo</span></label>
                    <input
                        type="text" name="nombre" value={form.nombre} onChange={handleChange}
                        className="input input-bordered focus:input-primary w-full" required disabled={loading}
                    />
                </div>
                <div className="form-control">
                    <label className="label"><span className="label-text">Email Corporativo</span></label>
                    <input
                        type="email" name="email" value={form.email} onChange={handleChange}
                        className="input input-bordered focus:input-primary w-full" required disabled={loading}
                    />
                </div>
                <div className="form-control">
                    <label className="label"><span className="label-text">Documento / ID</span></label>
                    <input
                        type="text" name="documento" value={form.documento} onChange={handleChange}
                        className="input input-bordered focus:input-primary w-full" disabled={loading}
                    />
                </div>
                <div className="form-control">
                    <label className="label"><span className="label-text">Teléfono de Contacto</span></label>
                    <input
                        type="text" name="telefono" value={form.telefono} onChange={handleChange}
                        className="input input-bordered focus:input-primary w-full" disabled={loading}
                    />
                </div>
                <div className="form-control">
                    <label className="label"><span className="label-text">RUT Empresa</span></label>
                    <input
                        type="text" name="rut" value={form.rut} onChange={handleChange}
                        className="input input-bordered focus:input-primary w-full" disabled={loading}
                    />
                </div>
                <div className="form-control">
                    <label className="label"><span className="label-text">Contraseña</span></label>
                    <input
                        type="password" name="contrasena" value={form.contrasena} onChange={handleChange}
                        className="input input-bordered focus:input-primary w-full" required disabled={loading}
                        minLength={6}
                    />
                </div>
            </div>

            <div className="form-control mt-6">
                <button
                    type="submit"
                    className={`btn btn-primary w-full ${loading ? 'loading' : ''}`}
                    disabled={loading}
                >
                    {loading ? 'Procesando...' : 'Registrar Empresa'}
                </button>
            </div>
        </form>
    );
};

export default RegistroPropietarioForm;

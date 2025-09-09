import { Link } from "react-router-dom"

const navbar = () => {
    return (
        <div className="navbar bg-base-100 shadow-sm">
            <div className="flex-1">
                <Link to="/" className="btn btn-ghost text-xl">Le Banquets</Link>
            </div>
            <div className="flex-none">
                <ul className="menu menu-horizontal px-1">
                    <li>
                        <Link to="/Login">Iniciar Sesión</Link>
                    </li>

                    <li>
                        <Link to="/Registro">Registro</Link>
                    </li>
                </ul>
            </div>
        </div>
    )

}

export default navbar
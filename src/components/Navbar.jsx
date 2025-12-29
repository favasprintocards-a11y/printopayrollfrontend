import { logout } from "../utils/auth";

export default function Navbar() {
  return (
    <nav className="bg-blue-700 text-white py-3 px-6 flex justify-between">
      <h1 className="font-bold">Prnto Payroll</h1>
      <button onClick={logout} className="bg-red-500 px-3 py-1 rounded">
        Logout
      </button>
    </nav>
  );
}

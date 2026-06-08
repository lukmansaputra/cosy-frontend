import { NavLink } from "react-router-dom";

export default function Sidebar() {
  return (
    <aside className="w-64 border-r p-4">
      <h1 className="mb-6 text-xl font-bold">Cosy</h1>

      <nav className="flex flex-col gap-2">
        <NavLink to="/">Dashboard</NavLink>

        <NavLink to="/customers">Customers</NavLink>

        <NavLink to="/surveys">Surveys</NavLink>

        <NavLink to="/projects">Projects</NavLink>
      </nav>
    </aside>
  );
}

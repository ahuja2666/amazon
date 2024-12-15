import React from "react";
import { Link } from "react-router-dom";

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[rgb(0,115,230)]">
      <div className="text-white text-center">
        <h1 className="text-5xl font-bold mb-8 text-shadow">Welcome to</h1>
        <div className="mb-8">
          <img
            src={require("./seller-central_logo-white.svg")}
            alt="logo"
            style={{ height: "auto", width: "220px" }}
          />
        </div>
        <nav className="inline-flex rounded-lg bg-white bg-opacity-20 p-1">
          {[
            // { name: "Sales Orders", route: "/profits" },
            { name: "Sales Orders", route: "/profit-calculator" },
            { name: "Purchase Orders", route: "/inventory" },
            { name: "Payments", route: "/payments" },
          ].map((tab, index) => (
            <Link
              key={tab.route}
              to={tab.route}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors duration-150 ease-in-out
              `}
            >
              {tab.name}
            </Link>
          ))}
        </nav>
      </div>
    </div>
  );
}

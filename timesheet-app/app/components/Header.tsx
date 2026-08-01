"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ChevronDown, LogOut } from "lucide-react";

const Header = () => {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [loginData, setLoginData] = useState<any>(null)

  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("login") || "{}");
    setLoginData(user?.user);

    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // logout handler
  const handleLogout = () => {
    localStorage.removeItem("user_token");
    localStorage.removeItem("login");
    router.push("/login");
  };

  return (
    <header className="w-full bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between relative z-50">
      <div className="flex items-center gap-6">
        <span className="text-2xl font-extrabold tracking-tight text-gray-900">
          ticktock
        </span>
        <span className="text-sm font-medium text-gray-500">Timesheets</span>
      </div>

      <div className="relative" ref={dropdownRef}>
        <button
          onClick={() => setIsOpen((prev) => !prev)}
          className="flex items-center gap-2 text-gray-700 hover:text-gray-900 font-medium text-sm focus:outline-none select-none transition-colors"
        >
          <span>{loginData?.name}</span>
          <ChevronDown
            size={16}
            className={`transition-transform duration-200 ${isOpen ? "rotate-180" : ""
              }`}
          />
        </button>

        {/* header profile/logout section */}
        {isOpen && (
          <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-100 py-1 z-50 animate-in fade-in slide-in-from-top-1 duration-150">
            <div className="px-4 py-2 border-b border-gray-100">
              <p className="text-xs font-semibold text-gray-900">{loginData?.name}</p>
              <p className="text-xs text-gray-500 truncate">{loginData?.email}</p>
            </div>

            <button
              onClick={handleLogout}
              className="w-full text-left px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2 transition-colors"
            >
              <LogOut size={16} />
              <span>Log out</span>
            </button>
          </div>
        )}
      </div>
    </header>
  );
}

export default Header;
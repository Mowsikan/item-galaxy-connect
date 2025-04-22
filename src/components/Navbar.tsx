import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, Search, Package, LogIn, LogOut } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <nav className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center">
              <Package className="h-8 w-8 text-lost" />
              <span className="ml-2 text-xl font-bold">Lost & Found</span>
            </Link>
          </div>
          
          <div className="hidden md:flex items-center space-x-4">
            <Link to="/" className="px-3 py-2 text-sm font-medium rounded-md hover:bg-gray-100">
              Dashboard
            </Link>
            {user && (
              <>
                <Link to="/report-lost" className="px-3 py-2 text-sm font-medium rounded-md hover:bg-gray-100">
                  Report Lost
                </Link>
                <Link to="/report-found" className="px-3 py-2 text-sm font-medium rounded-md hover:bg-gray-100">
                  Report Found
                </Link>
              </>
            )}
            <Button size="sm" variant="outline" className="ml-4">
              <Search className="h-4 w-4 mr-2" />
              Search
            </Button>
            {user ? (
              <Button onClick={logout} size="sm" variant="ghost">
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            ) : (
              <Button onClick={() => navigate('/login')} size="sm" variant="ghost">
                <LogIn className="h-4 w-4 mr-2" />
                Login
              </Button>
            )}
          </div>
          
          <div className="flex items-center md:hidden">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <Menu className="h-6 w-6" />
            </Button>
          </div>
        </div>
      </div>
      
      {isMenuOpen && (
        <div className="md:hidden animate-fade-in">
          <div className="px-2 pt-2 pb-3 space-y-1">
            <Link 
              to="/" 
              className="block px-3 py-2 rounded-md text-base font-medium hover:bg-gray-100"
              onClick={() => setIsMenuOpen(false)}
            >
              Dashboard
            </Link>
            {user && (
              <>
                <Link 
                  to="/report-lost" 
                  className="block px-3 py-2 rounded-md text-base font-medium hover:bg-gray-100"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Report Lost
                </Link>
                <Link 
                  to="/report-found" 
                  className="block px-3 py-2 rounded-md text-base font-medium hover:bg-gray-100"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Report Found
                </Link>
              </>
            )}
            <div className="pt-2 space-y-2">
              <Button variant="outline" className="w-full">
                <Search className="h-4 w-4 mr-2" />
                Search
              </Button>
              {user ? (
                <Button onClick={logout} variant="ghost" className="w-full">
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </Button>
              ) : (
                <Button onClick={() => navigate('/login')} variant="ghost" className="w-full">
                  <LogIn className="h-4 w-4 mr-2" />
                  Login
                </Button>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;

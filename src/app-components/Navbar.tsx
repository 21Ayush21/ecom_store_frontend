import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { ShoppingCart, User } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import {
  DropdownMenuItem,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import axios from "axios";

const Navbar = () => {
  const { user, loading, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
  };
  return (
    <header className="bg-white shadow-md flex flex-row justify-between items-center p-4 z-10">
      <h1 className="text-2xl font-bold">
        <Link to="/home">Logo</Link>
      </h1>
      <nav>
        <ul className="flex flex-row space-x-4 px-10 font-lato items-center ">
          {loading ? (
            <li>Loading...</li>
          ) : user ? (
            <>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost">
                    <User />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem>
                    <span className="font-lato font-medium text-sm">
                      {user.email}
                    </span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    {" "}
                    <Link to="/profile">
                      <span className="font-lato font-medium text-sm">
                        Profile
                      </span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <Button
                      variant="ghost"
                      className="px-0 py-0 h-5"
                      onClick={handleLogout}
                    >
                      <span className="font-lato font-medium text-sm">
                        Logout
                      </span>
                    </Button>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <>
              <li>
                <Link to="/login">Login</Link>
              </li>
              <li>
                <Link to="/signup" className="pl-3">
                  Sign Up
                </Link>
              </li>
            </>
          )}

          <li>
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <ShoppingCart className=" w-4" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px]">
                <div className="flex flex-col gap-4">
                  <h2 className="text-lg font-semibold">Sidebar Content</h2>
                  {/* Add your sidebar content here */}
                  <nav className="flex flex-col gap-2">
                    <a href="#" className="text-sm hover:underline">
                      Menu Item 1
                    </a>
                    <a href="#" className="text-sm hover:underline">
                      Menu Item 2
                    </a>
                    <a href="#" className="text-sm hover:underline">
                      Menu Item 3
                    </a>
                  </nav>
                </div>
              </SheetContent>
            </Sheet>
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default Navbar;

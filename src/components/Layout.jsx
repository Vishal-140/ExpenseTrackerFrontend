import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import { Outlet } from "react-router-dom";

export default function Layout() {
    return (
        <div className="h-screen overflow-hidden bg-bgDark flex">

            <div className="fixed left-0 top-0 h-screen w-56">
                <Sidebar />
            </div>

            <div className="ml-56 flex flex-col flex-1">

                <div className="sticky top-0 z-30">
                    <Navbar />
                </div>

                <div className="flex-1 overflow-y-auto bg-gradient-to-b from-bgDark to-black/30 p-6">
                    <Outlet />
                </div>

            </div>
        </div>
    );
}

import Link from "next/link";

export default function Navbar() {
    return (
        <nav className="navbar">
            
            <div className="navbar-left">
                S u z a n   T a d h a
            </div>
        
            <div className="navbar-right">
                <Link href="/menu">Menu</Link>
            </div>
        </nav>
    );
}
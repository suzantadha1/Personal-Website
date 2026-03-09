import Link from "next/link";

export default function Menu() {
    return (
        <div className="menu-page">

            <div className="menu-links">
                <Link href="/">Home </Link>
                <Link href="/about">About</Link>
                <Link href="/projects">Projects</Link>
                <Link href="/contact">Contact</Link>
            </div>
        </div>
    );
}

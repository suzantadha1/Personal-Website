import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-row gap-4">
      <Link href="/about">About</Link>
      <Link href="/contact">Contact</Link>
      <Link href="/projects">Projects</Link>
    </div>
  );
}

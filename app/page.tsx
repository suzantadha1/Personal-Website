//page.tsx

import Image from "next/image";
import Link from "next/link";
import Mypage from "./components/mypage";
import Navbar from "./components/navbar";
export default function Home() {
  return (
    <div>
    <Navbar/>
    <Mypage />
    </div>
  );
}

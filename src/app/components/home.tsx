"use client";
import { useRouter } from "next/navigation";

export const Home = () => {
  const router = useRouter();
  return (
    <div>
      <button
        onClick={() => router.push("/pages")}
        className="rounded-md bg-green-500 hover:bg-red-500 px-6 py-3 mt-100 ml-10 font-bold text-xl transition-all duration-300"
      >
        Start Game
      </button>
    </div>
  );
};


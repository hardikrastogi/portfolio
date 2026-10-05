import { Navbar } from "@/components/navbar";
import { About } from "@/components/sections/about";
import { Experience } from "@/components/sections/experience";
import { Hero } from "@/components/sections/hero";
import { ProjectDetails } from "@/components/sections/project-details";
import { Stack } from "@/components/sections/stack";

export default function Home() {
  return (
    <>
      <Navbar />
      <main className="flex-1">
        <Hero />
        <Experience />
        <Stack />
        <ProjectDetails />
        <About />
      </main>
    </>
  );
}

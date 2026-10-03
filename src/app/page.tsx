import { Navbar } from "@/components/navbar";
import { About } from "@/components/sections/about";
import { Hero } from "@/components/sections/hero";
import { ProjectDetails } from "@/components/sections/project-details";
import { ProjectShowcase } from "@/components/sections/project-showcase";
import { Stack } from "@/components/sections/stack";

export default function Home() {
  return (
    <>
      <Navbar />
      <main className="flex-1">
        <Hero />
        <ProjectShowcase />
        <Stack />
        <ProjectDetails />
        <About />
      </main>
    </>
  );
}

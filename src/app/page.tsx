import { WaitlistTable } from "@/app/_components/waitlist-table";
import { HydrateClient } from "@/trpc/server";

export default async function Home() {
  return (
    <HydrateClient>
      <main className="flex min-h-screen flex-col items-center bg-black text-white">
        <div className="container flex flex-col gap-12 px-4 py-16">
          <h1 className="text-5xl font-extrabold tracking-tight text-center sm:text-[5rem]">
            Waitlist Dashboard
          </h1>

          <WaitlistTable />
        </div>
      </main>
    </HydrateClient>
  );
}

import type { GetStaticProps } from "next";
import { Geist, Geist_Mono } from "next/font/google";

import type { PayloadResponse, Word } from "@/interfaces/word";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

type HomeProps = {
  words: Word[];
};

export const getStaticProps: GetStaticProps<HomeProps> = async () => {
  const response = await fetch("https://admin.uig.me/api/words");
  const data: PayloadResponse = await response.json();

  return {
    props: {
      words: data.docs ?? [],
    },
    revalidate: 60,
  };
};

export default function Home({ words }: HomeProps) {
  return (
    <main
      className={`${geistSans.className} ${geistMono.className} min-h-screen bg-zinc-50 py-12 text-zinc-900`}
    >
      <section className="mx-auto flex w-full max-w-3xl flex-col gap-6 rounded-3xl bg-white p-8 shadow-lg shadow-zinc-200">
        <header className="flex flex-col gap-2">
          <p className="text-sm uppercase tracking-[0.2em] text-zinc-500">
            Uyghur Interactive Glossary
          </p>
          <h1 className="text-3xl font-semibold text-zinc-900">
            Learn everyday Uyghur vocabulary
          </h1>
          <p className="text-base text-zinc-600">
            This list syncs from <code>admin.uig.me</code> and showcases Uyghur,
            English, and Turkish word pairs fetched at build time.
          </p>
        </header>

        <ul className="divide-y divide-zinc-100 rounded-2xl border border-zinc-100 bg-white">
          {words.map((word) => (
            <li key={word.id} className="flex flex-col gap-1 px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-xl font-medium text-zinc-900">
                  {word.word_uyghur}
                </p>
                <p className="text-sm text-zinc-500">Turkish: {word.word_turkish}</p>
              </div>
              <p className="text-lg font-semibold text-emerald-600">
                {word.word_english}
              </p>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}

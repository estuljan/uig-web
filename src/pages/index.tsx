import type { GetStaticProps } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { useEffect, useRef, useState } from "react";

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

const CMS_BASE_URL = "https://admin.uig.me";
const WORDS_ENDPOINT = `${CMS_BASE_URL}/api/words?depth=1`;
const FALLBACK_WORDS: Word[] = [
  {
    id: "fallback-1",
    word_uyghur: "salam",
    word_english: "hello",
    word_turkish: "merhaba",
    pronunciation: null,
  },
];

const resolvePronunciationUrl = (
  pronunciation: Word["pronunciation"]
): string | undefined => {
  if (!pronunciation) {
    return undefined;
  }

  const normalizeUrl = (path: string) => {
    if (!path) {
      return undefined;
    }

    if (path.startsWith("http")) {
      return path;
    }

    const normalizedPath = path.startsWith("/")
      ? path
      : path.startsWith("media/")
        ? `/${path}`
        : `/media/${path}`;
    return `${CMS_BASE_URL}${normalizedPath}`;
  };

  if (typeof pronunciation === "string") {
    return normalizeUrl(pronunciation);
  }

  if (pronunciation.url) {
    return normalizeUrl(pronunciation.url);
  }

  if (pronunciation.filename) {
    return normalizeUrl(pronunciation.filename);
  }

  return undefined;
};

export const getStaticProps: GetStaticProps<HomeProps> = async () => {
  try {
    const response = await fetch(WORDS_ENDPOINT);

    if (!response.ok) {
      throw new Error(`CMS responded with ${response.status}`);
    }

    const data: PayloadResponse = await response.json();

    return {
      props: {
        words: data.docs ?? FALLBACK_WORDS,
      },
      revalidate: 60,
    };
  } catch (error) {
    console.error("Failed to fetch glossary words from CMS", error);
    return {
      props: {
        words: FALLBACK_WORDS,
      },
      revalidate: 60,
    };
  }
};

export default function Home({ words }: HomeProps) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeAudioId, setActiveAudioId] = useState<string | null>(null);

  useEffect(() => {
    if (typeof Audio === "undefined") {
      return;
    }

    const audioElement = new Audio();
    const handleEnded = () => setActiveAudioId(null);

    audioElement.addEventListener("ended", handleEnded);
    audioRef.current = audioElement;

    return () => {
      audioElement.removeEventListener("ended", handleEnded);
      audioElement.pause();
      audioRef.current = null;
    };
  }, []);

  const handlePronunciationToggle = (wordId: string, audioUrl: string) => {
    const audioElement = audioRef.current;

    if (!audioElement) {
      return;
    }

    if (activeAudioId) {
      audioElement.pause();
      audioElement.currentTime = 0;
    }

    if (activeAudioId === wordId) {
      setActiveAudioId(null);
      return;
    }

    audioElement.src = audioUrl;

    void audioElement
      .play()
      .then(() => setActiveAudioId(wordId))
      .catch((error) => {
        console.error("Unable to play pronunciation audio", error);
        setActiveAudioId(null);
      });
  };

  const normalizedSearchTerm = searchTerm.toLowerCase();
  const filteredWords = words.filter(
    ({ word_uyghur, word_english }) =>
      word_uyghur.toLowerCase().includes(normalizedSearchTerm) ||
      word_english.toLowerCase().includes(normalizedSearchTerm)
  );

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

        <input
          type="text"
          placeholder="Search in Uyghur or English..."
          value={searchTerm}
          onChange={(event) => setSearchTerm(event.target.value)}
          className="w-full rounded-2xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-base text-zinc-900 placeholder:text-zinc-400 focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-400/20"
        />

        <ul className="divide-y divide-zinc-100 rounded-2xl border border-zinc-100 bg-white">
          {filteredWords.length === 0 ? (
            <li className="flex flex-col items-center gap-2 px-6 py-10 text-center">
              <p className="text-lg font-semibold text-zinc-900">
                No matching entries yet
              </p>
              <p className="text-sm text-zinc-500">
                Try another keyword or clear the search to see the full list.
              </p>
            </li>
          ) : (
            filteredWords.map((word) => {
              const pronunciationUrl = resolvePronunciationUrl(
                word.pronunciation
              );

              return (
                <li
                  key={word.id}
                  className="flex flex-col gap-3 px-6 py-4 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div>
                    <p className="text-xl font-medium text-zinc-900">
                      {word.word_uyghur}
                    </p>
                    <p className="text-sm text-zinc-500">
                      Turkish: {word.word_turkish}
                    </p>
                  </div>
                  <div className="flex flex-col items-start gap-2 text-left sm:items-end sm:text-right">
                    <p className="text-lg font-semibold text-emerald-600">
                      {word.word_english}
                    </p>
                    {pronunciationUrl && (
                      <button
                        type="button"
                        onClick={() =>
                          handlePronunciationToggle(word.id, pronunciationUrl)
                        }
                        className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400/60 ${
                          activeAudioId === word.id
                            ? "border-emerald-500 bg-emerald-50 text-emerald-700"
                            : "border-emerald-100 text-emerald-600 hover:bg-emerald-50"
                        }`}
                      >
                        <span
                          aria-hidden="true"
                          className={`h-2 w-2 rounded-full ${
                            activeAudioId === word.id
                              ? "bg-emerald-600"
                              : "bg-emerald-400"
                          }`}
                        />
                        {activeAudioId === word.id
                          ? "Stop pronunciation"
                          : "Play pronunciation"}
                      </button>
                    )}
                  </div>
                </li>
              );
            })
          )}
        </ul>
      </section>
    </main>
  );
}

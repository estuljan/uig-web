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

const DEFAULT_CMS_BASE_URL = "https://admin.uig.me";
const CMS_BASE_URL = (() => {
  const envUrl =
    process.env.NEXT_PUBLIC_CMS_BASE_URL ??
    process.env.CMS_BASE_URL ??
    DEFAULT_CMS_BASE_URL;

  const sanitizedUrl = envUrl.trim().replace(/\/$/, "");
  return sanitizedUrl.length > 0 ? sanitizedUrl : DEFAULT_CMS_BASE_URL;
})();
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
  const hasSearchTerm = normalizedSearchTerm.trim().length > 0;
  const visibleWords = hasSearchTerm ? filteredWords : [];

  return (
    <main
      className={`${geistSans.className} ${geistMono.className} flex min-h-screen items-center justify-center bg-zinc-50 px-6 py-12 text-zinc-900`}
    >
      <section className="w-full max-w-2xl space-y-6">
        <input
          type="text"
          placeholder="Search in Uyghur or English..."
          value={searchTerm}
          onChange={(event) => setSearchTerm(event.target.value)}
          className="w-full rounded-2xl border border-zinc-200 bg-white px-6 py-4 text-base text-zinc-900 placeholder:text-zinc-400 focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-400/20"
        />

        {hasSearchTerm && (
          <ul className="divide-y divide-zinc-100 rounded-2xl border border-zinc-100 bg-white">
            {visibleWords.length === 0 ? (
              <li className="px-6 py-10 text-center text-sm text-zinc-500">
                No matching words found.
              </li>
            ) : (
              visibleWords.map((word) => {
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
                    <div className="flex items-center gap-3">
                      <p className="text-lg font-semibold text-emerald-600">
                        {word.word_english}
                      </p>
                      {pronunciationUrl && (
                        <button
                          type="button"
                          onClick={() =>
                            handlePronunciationToggle(word.id, pronunciationUrl)
                          }
                          aria-label={
                            activeAudioId === word.id
                              ? "Stop pronunciation"
                              : "Play pronunciation"
                          }
                          className={`inline-flex h-10 w-10 items-center justify-center rounded-full border transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400/60 ${
                            activeAudioId === word.id
                              ? "border-emerald-500 bg-emerald-50 text-emerald-600"
                              : "border-emerald-100 text-emerald-600 hover:bg-emerald-50"
                          }`}
                        >
                          <span className="sr-only">
                            {activeAudioId === word.id
                              ? "Stop pronunciation"
                              : "Play pronunciation"}
                          </span>
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="currentColor"
                            className="h-5 w-5"
                            aria-hidden="true"
                          >
                            <path d="M3 9.75a.75.75 0 0 1 .75-.75h2.69l2.87-2.869A1.5 1.5 0 0 1 11.379 7.5v9a1.5 1.5 0 0 1-2.07 1.389L6.44 15H3.75A.75.75 0 0 1 3 14.25zm13.58-3.583a.75.75 0 0 1 1.06 0A7.47 7.47 0 0 1 20.25 12a7.47 7.47 0 0 1-2.61 5.833.75.75 0 0 1-1.02-1.097A5.97 5.97 0 0 0 18.75 12a5.97 5.97 0 0 0-2.13-4.736.75.75 0 0 1-.037-1.097m-2.12 2.12a.75.75 0 0 1 1.06 0A4.47 4.47 0 0 1 17.25 12a4.47 4.47 0 0 1-1.73 3.713.75.75 0 0 1-1.02-1.097A2.97 2.97 0 0 0 15.75 12a2.97 2.97 0 0 0-1.25-2.463.75.75 0 0 1-.037-1.25z" />
                          </svg>
                        </button>
                      )}
                    </div>
                  </li>
                );
              })
            )}
          </ul>
        )}
      </section>
    </main>
  );
}

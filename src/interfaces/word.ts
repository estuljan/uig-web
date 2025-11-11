export interface Word {
  id: string;
  word_uyghur: string;
  word_english: string;
  word_turkish: string;
  pronunciation?: PayloadMedia | string | null;
}

export interface PayloadMedia {
  id?: string;
  filename?: string;
  mimeType?: string;
  filesize?: number;
  url?: string;
}

export interface PayloadResponse {
  docs: Word[];
}

export interface WordSearchResponse {
  docs: Word[];
  total: number;
  page: number;
  limit?: number;
  totalPages?: number;
  hasNextPage?: boolean;
}

export interface Word {
  id: string;
  word_uyghur: string;
  word_english: string;
  word_turkish: string;
}

export interface PayloadResponse {
  docs: Word[];
}

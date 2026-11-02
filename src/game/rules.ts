/**
 * Logik dan peraturan permainan Roda Pusingan Kata Kerja 3D
 * Murid Sekolah Rendah Malaysia Tahap 1 (Tahun 1 - 3)
 */

export interface KataKerjaItem {
  kataKerja: string;
  gambar: string;
  gambarUrl: string;
  pilihanSalah: [string, string];
  ayatContoh: string;
}

export const KATA_KERJA_DATA: KataKerjaItem[] = [
  {
    kataKerja: "makan",
    gambar: "🍽️",
    gambarUrl: "",
    pilihanSalah: ["tidur", "berlari"],
    ayatContoh: "Adik makan nasi."
  },
  {
    kataKerja: "minum",
    gambar: "🥤",
    gambarUrl: "",
    pilihanSalah: ["menulis", "melompat"],
    ayatContoh: "Kakak minum air."
  },
  {
    kataKerja: "tidur",
    gambar: "😴",
    gambarUrl: "",
    pilihanSalah: ["membaca", "menari"],
    ayatContoh: "Bayi tidur di katil."
  },
  {
    kataKerja: "berlari",
    gambar: "🏃",
    gambarUrl: "",
    pilihanSalah: ["duduk", "mandi"],
    ayatContoh: "Ali berlari di padang."
  },
  {
    kataKerja: "melompat",
    gambar: "🤸",
    gambarUrl: "",
    pilihanSalah: ["makan", "menyanyi"],
    ayatContoh: "Katak melompat tinggi."
  },
  {
    kataKerja: "menulis",
    gambar: "✍️",
    gambarUrl: "",
    pilihanSalah: ["minum", "berjalan"],
    ayatContoh: "Murid menulis di buku."
  },
  {
    kataKerja: "membaca",
    gambar: "📖",
    gambarUrl: "",
    pilihanSalah: ["berlari", "tidur"],
    ayatContoh: "Ibu membaca cerita."
  },
  {
    kataKerja: "mandi",
    gambar: "🛁",
    gambarUrl: "",
    pilihanSalah: ["makan", "melompat"],
    ayatContoh: "Adik mandi pagi."
  },
  {
    kataKerja: "menyanyi",
    gambar: "🎤",
    gambarUrl: "",
    pilihanSalah: ["duduk", "menulis"],
    ayatContoh: "Kami menyanyi bersama."
  },
  {
    kataKerja: "menari",
    gambar: "💃",
    gambarUrl: "",
    pilihanSalah: ["tidur", "minum"],
    ayatContoh: "Dia menari dengan gembira."
  },
  {
    kataKerja: "duduk",
    gambar: "🪑",
    gambarUrl: "",
    pilihanSalah: ["berlari", "makan"],
    ayatContoh: "Murid duduk di kerusi."
  },
  {
    kataKerja: "berjalan",
    gambar: "🚶",
    gambarUrl: "",
    pilihanSalah: ["tidur", "menulis"],
    ayatContoh: "Ayah berjalan ke kedai."
  }
];

export interface AnswerHistory {
  index: number;
  verb: string;
  firstTryCorrect: boolean;
  scoreEarned: number;
}

/**
 * Pengiraan mata:
 * - Percubaan pertama: 10 mata
 * - Percubaan kedua: 5 mata
 * - Lain-lain: 0 mata
 */
export function calculateScore(attemptNumber: number): number {
  if (attemptNumber === 1) return 10;
  if (attemptNumber === 2) return 5;
  return 0;
}

/**
 * Sistem Bintang:
 * - 1 bintang bagi setiap 3 jawapan betul berturut-turut pada percubaan pertama
 * - Jika salah pada percubaan pertama, rentetan (streak) diset semula ke 0
 */
export function updateStreakAndStars(
  currentStreak: number,
  currentStars: number,
  isFirstTryCorrect: boolean
): { newStreak: number; newStars: number; earnedStar: boolean } {
  if (isFirstTryCorrect) {
    const newStreak = currentStreak + 1;
    const earnedStar = newStreak % 3 === 0;
    const newStars = currentStars + (earnedStar ? 1 : 0);
    return { newStreak, newStars, earnedStar };
  } else {
    return { newStreak: 0, newStars: currentStars, earnedStar: false };
  }
}

/**
 * Lencana "Pakar Kata Kerja Asas 🏅":
 * Dibuka apabila murid menjawab sekurang-kurangnya 8 daripada 10 soalan pertama
 * dengan betul pada percubaan pertama.
 */
export function checkBadgeUnlocked(history: AnswerHistory[]): boolean {
  const first10 = history.slice(0, 10);
  const correctCount = first10.filter((h) => h.firstTryCorrect).length;
  return correctCount >= 8;
}

/**
 * Mengambil baki indeks kata kerja yang belum diselesaikan
 */
export function getRemainingIndices(
  totalCount: number,
  completedIndices: number[]
): number[] {
  const completedSet = new Set(completedIndices);
  const remaining: number[] = [];
  for (let i = 0; i < totalCount; i++) {
    if (!completedSet.has(i)) {
      remaining.push(i);
    }
  }
  return remaining;
}

/**
 * Membuang 1 pilihan salah (50/50) apabila salah pada percubaan pertama
 */
export function eliminateOneWrongOption(
  options: string[],
  correctWord: string
): string[] {
  const wrongOptions = options.filter((opt) => opt !== correctWord);
  if (wrongOptions.length <= 1) return options;
  // Pilih satu pilihan salah untuk dibuang
  const toRemove = wrongOptions[Math.floor(Math.random() * wrongOptions.length)];
  return options.filter((opt) => opt !== toRemove);
}

/**
 * Susun acak pilihan jawapan
 */
export function shuffleArray<T>(arr: T[]): T[] {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

/**
 * Format ayat contoh dengan menebalkan kata kerja
 */
export function formatExampleSentence(sentence: string, verb: string): { before: string; match: string; after: string } {
  const lowerSentence = sentence.toLowerCase();
  const lowerVerb = verb.toLowerCase();
  const idx = lowerSentence.indexOf(lowerVerb);
  if (idx === -1) {
    return { before: sentence, match: "", after: "" };
  }
  return {
    before: sentence.slice(0, idx),
    match: sentence.slice(idx, idx + verb.length),
    after: sentence.slice(idx + verb.length),
  };
}

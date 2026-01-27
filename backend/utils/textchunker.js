/**
 * Normalize and split text into overlapping word-based chunks
 *
 * @param {string} text
 * @param {number} chunkSize
 * @param {number} overlap
 * @returns {Array<{ chunkIndex: number, content: string }>}
 */
export const chunkText = (text, chunkSize = 180, overlap = 40) => {
  if (!text || typeof text !== "string") return [];

  const cleanText = text
    .replace(/-\n/g, "")
    .replace(/\n+/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  const words = cleanText.split(" ");
  const chunks = [];

  let start = 0;
  let index = 0;

  while (start < words.length) {
    const end = start + chunkSize;
    const chunkWords = words.slice(start, end);

    chunks.push({
      chunkIndex: index,
      content: chunkWords.join(" "),
    });

    index++;
    start += chunkSize - overlap;
  }

  return chunks;
};

/**
 * Find most relevant chunks using improved keyword scoring
 *
 * @param {Array<{ chunkIndex: number, content: string }>} chunks
 * @param {string} query
 * @param {number} maxChunks
 * @returns {Array<{ chunkIndex: number, content: string, score: number }>}
 */
export const findRelevantChunks = (chunks, query, maxChunks = 3) => {
  if (!Array.isArray(chunks) || !query) return [];

  const queryTerms = query
    .toLowerCase()
    .split(/\s+/)
    .filter(t => t.length > 2);

  const scored = chunks.map(chunk => {
    const text = chunk.content.toLowerCase();
    let score = 0;

    for (const term of queryTerms) {
      if (text.includes(term)) score += 4;
    }

    // bonus for longer, meaningful chunks
    score += Math.min(text.length / 300, 5);

    return { ...chunk, score };
  });

  return scored
    .filter(c => c.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, maxChunks);
};

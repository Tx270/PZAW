import { getDB } from "./db.js";

function randomChoice(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

async function main() {
  const db = await getDB();

  const names = [
    "LoFi Drum Loop", "Trap HiHat Roll", "Trap 808 Bass", "Jazz Piano Chords",
    "EDM Lead Riff", "EDM Chords", "Ambient Pad", "Cinematic Boom",
    "Rock Drum Loop", "Funk Bassline", "Funk Guitar Riff", "Orchestral Strings",
    "Orchestral Brass", "Synth Arp"
  ];

  const authors = [
    "OpenBeats", "BeatForge", "FreeKeys", "SkyWave", "AtmosLab",
    "FilmTools", "RawDrums", "GrooveLab", "Symphoria", "ModularWave"
  ];

  const keys = [
    "Cmaj","Cmin","C#maj","C#min","Dmaj","Dmin","D#maj","D#min",
    "Emaj","Emin","Fmaj","Fmin","F#maj","F#min","Gmaj","Gmin",
    "G#maj","G#min","Amaj","Amin","A#maj","A#min","Bmaj","Bmin","N/A"
  ];

  const descriptions = [
    "Soft lofi-style drum groove.",
    "Warm dusty beat.",
    "Fast rolling hihats.",
    "Punchy 808 bass.",
    "Smooth jazz-inspired chords.",
    "Warm chord progression.",
    "Energetic festival riff.",
    "Big room chords.",
    "Slow evolving pad.",
    "Breathy pad texture.",
    "Deep cinematic boom hit.",
    "Trailer impact sound.",
    "Clean rock beat.",
    "Punchy groove.",
    "Slap-style funky bassline.",
    "Clean funky riff.",
    "Legato string ensemble.",
    "Bold brass section.",
    "Steady analog arpeggio.",
    "Warm poly arp."
  ];

  for (let i = 0; i < 20; i++) {
    const name = randomChoice(names);
    const author = randomChoice(authors);
    const key = randomChoice(keys);
    const tempo = Math.floor(Math.random() * (250 - 30 + 1)) + 30;
    const description = randomChoice(descriptions);

    await db.run(
      `INSERT INTO samples (name, author, key, tempo, description, created_at)
       VALUES (?, ?, ?, ?, ?, datetime('now'))`,
      [name, author, key, tempo, description]
    );
  }

  console.log("Dodano 20 losowych sampli");
  await db.close();
}

main().catch(err => console.error(err));

import { internalMutation } from "./_generated/server";
import { v } from "convex/values";

// Seed data for populating the database with sample hosts and guests.
// Run with:   npx convex run seed:seedProfiles
// Clear with: npx convex run seed:clearSeed

const YEAR = 365 * 24 * 60 * 60 * 1000;
const now = Date.now();
// Build a dob timestamp from an approximate age.
const dob = (age: number) => now - age * YEAR;

const SEED_PREFIX = "seed_";

const SEED_HOSTS = [
  {
    id: "seed_host_01",
    name: "David Cohen",
    email: "david.cohen@example.com",
    data: {
      dob: dob(42),
      phoneNumber: "+972-50-123-4501",
      address: "Rehov Yafo 23, Mahane Yehuda, Jerusalem, Israel",
      lat: 31.7857,
      lng: 35.2125,
      floor: "2",
      entrance: "A",
      hasDisabilityAccess: false,
      kashrout: "Mehadrin" as const,
      sector: "Dati" as const,
      ethnicity: "Sefardi" as const,
      languages: ["he", "fr", "en"],
      likesSinging: true,
      likesDivreiTorah: true,
      notes: "Famille chaleureuse, table de Chabat traditionnelle avec chants.",
    },
  },
  {
    id: "seed_host_02",
    name: "Sarah Levi",
    email: "sarah.levi@example.com",
    data: {
      dob: dob(38),
      phoneNumber: "+972-52-234-5602",
      address: "Rehov Rabbi Akiva 56, Bnei Brak, Israel",
      lat: 32.0807,
      lng: 34.8338,
      floor: "Rez-de-chaussée",
      hasDisabilityAccess: true,
      kashrout: "Badatz" as const,
      sector: "Haredi" as const,
      ethnicity: "Ashkenazi" as const,
      languages: ["he", "en", "ru"],
      notes: "Accès handicapé. Repas mehadrin, ambiance chaleureuse.",
    },
  },
  {
    id: "seed_host_03",
    name: "Yossi Mizrahi",
    email: "yossi.mizrahi@example.com",
    data: {
      dob: dob(50),
      phoneNumber: "+972-54-345-6703",
      address: "Sderot Ben Gurion 10, Lev Hair, Tel Aviv, Israel",
      lat: 32.0769,
      lng: 34.7745,
      floor: "5",
      entrance: "B",
      hasDisabilityAccess: false,
      kashrout: "Rabbanut" as const,
      sector: "Traditional" as const,
      ethnicity: "Mizrahi" as const,
      languages: ["he", "ar", "en"],
      likesSinging: true,
      notes: "Cuisine mizrahi maison. Ouvert à tous les invités.",
    },
  },
  {
    id: "seed_host_04",
    name: "Rivka Friedman",
    email: "rivka.friedman@example.com",
    data: {
      dob: dob(33),
      phoneNumber: "+972-58-456-7804",
      address: "Rehov Herzl 14, Hadar, Haifa, Israel",
      lat: 32.8156,
      lng: 34.9892,
      floor: "3",
      hasDisabilityAccess: false,
      kashrout: "Mehadrin" as const,
      sector: "Dati" as const,
      ethnicity: "Ashkenazi" as const,
      languages: ["he", "en", "es"],
      notes: "Vue sur la baie de Haïfa. Invités étudiants bienvenus.",
    },
  },
  {
    id: "seed_host_05",
    name: "Avi Peretz",
    email: "avi.peretz@example.com",
    data: {
      dob: dob(45),
      phoneNumber: "+972-50-567-8905",
      address: "Rehov HaPalmach 8, Ramot, Beer Sheva, Israel",
      lat: 31.2518,
      lng: 34.7913,
      floor: "1",
      entrance: "C",
      hasDisabilityAccess: true,
      kashrout: "Regular" as const,
      sector: "Traditional" as const,
      ethnicity: "Mizrahi" as const,
      languages: ["he", "fr", "ar"],
      notes: "Grande maison dans le Néguev, place pour plusieurs invités.",
    },
  },
  {
    id: "seed_host_06",
    name: "Esther Klein",
    email: "esther.klein@example.com",
    data: {
      dob: dob(29),
      phoneNumber: "+972-52-678-9006",
      address: "Rehov Weizmann 31, Merkaz, Netanya, Israel",
      lat: 32.3215,
      lng: 34.8532,
      floor: "4",
      hasDisabilityAccess: false,
      kashrout: "Mehadrin" as const,
      sector: "Haredi" as const,
      ethnicity: "Ashkenazi" as const,
      languages: ["he", "en", "de"],
      likesDivreiTorah: true,
      notes: "Proche de la mer. Repas avec divrei Torah.",
    },
  },
  {
    id: "seed_host_07",
    name: "Moshe Azoulay",
    email: "moshe.azoulay@example.com",
    data: {
      dob: dob(55),
      phoneNumber: "+972-54-789-0107",
      address: "Rehov Jabotinsky 45, Em HaMoshavot, Petah Tikva, Israel",
      lat: 32.084,
      lng: 34.8878,
      floor: "2",
      hasDisabilityAccess: false,
      kashrout: "Badatz" as const,
      sector: "Dati" as const,
      ethnicity: "Sefardi" as const,
      languages: ["he", "fr", "en", "ar"],
      likesSinging: true,
      likesDivreiTorah: true,
      notes: "Famille nombreuse, ambiance festive et chaleureuse.",
    },
  },
  {
    id: "seed_host_08",
    name: "Tamar Shapira",
    email: "tamar.shapira@example.com",
    data: {
      dob: dob(36),
      phoneNumber: "+972-58-890-1208",
      address: "Rehov Emek Dotan 7, Kiryat HaYovel, Modiin, Israel",
      lat: 31.8928,
      lng: 35.0107,
      floor: "Maison individuelle",
      hasDisabilityAccess: true,
      kashrout: "Mehadrin" as const,
      sector: "Dati" as const,
      ethnicity: "Other" as const,
      languages: ["he", "en", "it", "pt"],
      notes: "Jardin, idéal pour les familles avec enfants.",
    },
  },
];

const SEED_GUESTS = [
  {
    id: "seed_guest_01",
    name: "Noa Bar",
    email: "noa.bar@example.com",
    data: {
      dob: dob(24),
      region: "Jerusalem",
      gender: "Female" as const,
      sector: "Dati" as const,
      ethnicity: "Ashkenazi" as const,
      languages: ["he", "en"],
      notes: "Étudiante en séminaire, cherche une famille pour Chabat.",
    },
  },
  {
    id: "seed_guest_02",
    name: "Eitan Gold",
    email: "eitan.gold@example.com",
    data: {
      dob: dob(27),
      region: "Tel Aviv",
      gender: "Male" as const,
      sector: "Traditional" as const,
      ethnicity: "Mizrahi" as const,
      languages: ["he", "ru", "en"],
      notes: "Nouveau olé, souhaite découvrir le Chabat en famille.",
    },
  },
  {
    id: "seed_guest_03",
    name: "Léa et Daniel Amar",
    email: "lea.daniel.amar@example.com",
    data: {
      dob: dob(31),
      region: "Haifa",
      gender: "Couple" as const,
      sector: "Dati" as const,
      ethnicity: "Sefardi" as const,
      languages: ["he", "fr"],
      notes: "Jeune couple, flexibles sur les horaires.",
    },
  },
  {
    id: "seed_guest_04",
    name: "Miriam Stern",
    email: "miriam.stern@example.com",
    data: {
      dob: dob(22),
      region: "Bnei Brak",
      gender: "Female" as const,
      sector: "Haredi" as const,
      ethnicity: "Ashkenazi" as const,
      languages: ["he", "en", "de"],
      notes: "Cherche un repas mehadrin proche du centre.",
    },
  },
  {
    id: "seed_guest_05",
    name: "Yonatan Ben David",
    email: "yonatan.bendavid@example.com",
    data: {
      dob: dob(35),
      region: "Beer Sheva",
      gender: "Male" as const,
      sector: "Secular" as const,
      ethnicity: "Other" as const,
      languages: ["he", "en", "es"],
      notes: "Soldat en service, disponible certains Chabbats.",
    },
  },
  {
    id: "seed_guest_06",
    name: "Hannah Roth",
    email: "hannah.roth@example.com",
    data: {
      dob: dob(26),
      region: "Netanya",
      gender: "Female" as const,
      sector: "Dati" as const,
      ethnicity: "Ashkenazi" as const,
      languages: ["en", "fr", "he"],
      notes: "Touriste de longue durée, parle anglais et français.",
    },
  },
];

export const seedProfiles = internalMutation({
  args: {},
  returns: v.object({
    usersCreated: v.number(),
    hostsCreated: v.number(),
    guestsCreated: v.number(),
  }),
  handler: async (ctx) => {
    let usersCreated = 0;
    let hostsCreated = 0;
    let guestsCreated = 0;

    const ensureUser = async (
      id: string,
      name: string,
      email: string,
      role: "host" | "guest",
    ) => {
      const existing = await ctx.db
        .query("users")
        .withIndex("by_authUserId", (q) => q.eq("authUserId", id))
        .first();
      if (existing) return false;
      await ctx.db.insert("users", {
        authUserId: id,
        role,
        isVerified: true,
        email,
        name,
      });
      usersCreated++;
      return true;
    };

    for (const h of SEED_HOSTS) {
      const created = await ensureUser(h.id, h.name, h.email, "host");
      if (!created) continue;
      await ctx.db.insert("hosts", { authUserId: h.id, ...h.data });
      hostsCreated++;
    }

    for (const g of SEED_GUESTS) {
      const created = await ensureUser(g.id, g.name, g.email, "guest");
      if (!created) continue;
      await ctx.db.insert("guests", { authUserId: g.id, ...g.data });
      guestsCreated++;
    }

    return { usersCreated, hostsCreated, guestsCreated };
  },
});

// Removes everything inserted by `seedProfiles` (matched by the seed_ prefix).
export const clearSeed = internalMutation({
  args: {},
  returns: v.object({ deleted: v.number() }),
  handler: async (ctx) => {
    let deleted = 0;

    const tables = ["users", "hosts", "guests"] as const;
    for (const table of tables) {
      const docs = await ctx.db.query(table).collect();
      for (const doc of docs) {
        if (doc.authUserId.startsWith(SEED_PREFIX)) {
          await ctx.db.delete(doc._id);
          deleted++;
        }
      }
    }

    return { deleted };
  },
});

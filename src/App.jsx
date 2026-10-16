import React, { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import {
  Brain, Moon, Sun, Volume2, VolumeX, Trophy, Users, UserRound, Globe2,
  Settings, ArrowLeft, RotateCcw, Pause, Play, Clock3, Target, Zap,
  Sparkles, Medal, ChevronRight, X, Check, Copy, Info, House, BarChart3,
  Trash2, LogIn, ArrowRight, User,
  Circle, Square, Triangle, Pentagon, Hexagon, Octagon, Star, Diamond, CircleDot, CircleDashed, SquareDashed, Shapes, RectangleHorizontal, RectangleVertical, Plus, Minus, Equal, Asterisk, Cross, Divide, Percent, Hash, Slash,
  Heart, Cloud, Umbrella, Music, Droplet, Flame, Snowflake, Shield, ShieldCheck, Crown, Anchor, Flag, Gem, Bell, AlertCircle,
  Menu,
  Bird, Rabbit, Snail, Turtle, Fish, Rat, Worm, Squirrel, PawPrint, Shell, Cat, Dog, Bug,
  Rocket, Satellite, SatelliteDish, Orbit, Earth, Telescope, MoonStar, StarOff, StarHalf, Space, CloudMoon, CloudSun, SunMoon, SunDim, SunMedium, SunSnow, CloudSunRain, CloudMoonRain, Sunrise, Sunset,
  Laptop, Smartphone, Gamepad2, Headphones, Camera, Watch, Keyboard, Mouse, Tv, Speaker, HardDrive, Printer, Battery, Plug, Cpu, Wifi, Bluetooth, Radio, Calculator, Lightbulb, Monitor, Tablet, Mic, Webcam,
  Coffee, Book, Pencil, Scissors, Ticket, Gift, Plane, Car, Bus, Train, Bike, Compass, Map, Briefcase, ShoppingCart, CreditCard, Glasses, Key, Lock, Mail, Phone, Video,
  ChevronDown, ChevronUp, Instagram, Linkedin, Code2, FolderGit2, PlaneTakeoff, Link2, CircleUserRound
} from 'lucide-react';

const DIFFICULTIES = {
  Easy: { pairs: 6, time: 120, multiplier: 1 },
  Normal: { pairs: 8, time: 180, multiplier: 1.25 },
  Medium: { pairs: 12, time: 240, multiplier: 1.5 },
  Hard: { pairs: 18, time: 360, multiplier: 2 },
  Extreme: { pairs: 24, time: 480, multiplier: 2.5 },
};
const createAnimalIcon = (paths) => {
  const AnimalIcon = ({ size = 24, strokeWidth = 2, ...props }) => (
    <svg {...props} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
      {paths.map((path) => <path key={path} d={path} />)}
    </svg>
  );
  return AnimalIcon;
};
const LionIcon = createAnimalIcon(['M12 3 14 4l2.5-.5L18 6l2.5 1-.5 3 1 2-1.5 2.5.5 2.5-3 1.5-1 2.5-3-.5L12 22l-2-1.5-3 .5-1-2.5L3 17l.5-2.5L2 12l1-2-.5-3L5 6l1.5-2.5L9 4z', 'M9 10h.01', 'M15 10h.01', 'M10 14q2 2 4 0', 'M12 12v1']);
const PandaIcon = createAnimalIcon(['M6 4 9 6', 'M18 4 15 6', 'M4 11a8 8 0 1 0 16 0 8 8 0 0 0-16 0Z', 'M7.5 9.5a2 2 0 0 0 2.7 2.7', 'M16.5 9.5a2 2 0 0 1-2.7 2.7', 'M10 15q2 2 4 0', 'M12 13v1']);
const ElephantIcon = createAnimalIcon(['M5 10a7 7 0 0 1 14 0v2', 'M5 9q-3 0-3 3t3 3', 'M19 9q3 0 3 3t-3 3', 'M9 11h.01', 'M15 11h.01', 'M12 13v3q0 3 2 3', 'M8 19v2', 'M17 19v2']);
const FoxIcon = createAnimalIcon(['M4 4 10 7', 'M20 4 14 7', 'M4 4l1 9 7 7 7-7 1-9-7 3h-2z', 'M8.5 11h.01', 'M15.5 11h.01', 'M10 14q2 1 4 0', 'M12 12v1']);
const BearIcon = createAnimalIcon(['M5 7 3 4l5 1', 'M19 7l2-3-5 1', 'M4 11a8 8 0 1 0 16 0 8 8 0 0 0-16 0Z', 'M8.5 10h.01', 'M15.5 10h.01', 'M9 14q3 3 6 0', 'M12 12v1']);
const FrogIcon = createAnimalIcon(['M4 11a8 7 0 0 0 16 0', 'M5 10a3 3 0 1 1 6 0', 'M13 10a3 3 0 1 1 6 0', 'M7 10h.01', 'M9 10h.01', 'M15 10h.01', 'M17 10h.01', 'M9 15q3 2 6 0']);
const OwlIcon = createAnimalIcon(['M4 5 9 8', 'M20 5l-5 3', 'M5 8a7 7 0 0 0 14 0v8l-3-2H8l-3 2z', 'M7 10a2 2 0 1 0 4 0 2 2 0 0 0-4 0Z', 'M13 10a2 2 0 1 0 4 0 2 2 0 0 0-4 0Z', 'M12 12l-1 2h2z']);
const WhaleIcon = createAnimalIcon(['M3 14q1-7 10-7 5 0 7 4l2-2v6l-3-1q-3 4-10 3-5-1-6-3Z', 'M8 12h.01', 'M13 7q0-2-2-3']);
const ButterflyIcon = createAnimalIcon(['M12 12q-4-8-8-5-3 4 7 7-6 0-6 5 4 2 7-5', 'M12 12q4-8 8-5 3 4-7 7 6 0 6 5-4 2-7-5', 'M12 7v11', 'M12 7l-2-2', 'M12 7l2-2']);
const BeeIcon = createAnimalIcon(['M8 9q-4-5-5 0t5 3', 'M16 9q4-5 5 0t-5 3', 'M8 12a4 5 0 1 0 8 0 4 5 0 0 0-8 0Z', 'M9 10h6', 'M9 13h6', 'M10 7l-1-2', 'M14 7l1-2']);
const PenguinIcon = createAnimalIcon(['M12 3a7 9 0 0 0-7 9v6l3 2h8l3-2v-6a7 9 0 0 0-7-9Z', 'M9 11h.01', 'M15 11h.01', 'M11 13l1 2 1-2', 'M9 16q3 2 6 0', 'M5 13 2 16', 'M19 13l3 3']);
const THEMES = {
  Symbols: [Circle, Square, Triangle, Pentagon, Hexagon, Octagon, Star, Diamond, CircleDot, CircleDashed, SquareDashed, Shapes, RectangleHorizontal, RectangleVertical, Plus, Minus, X, Equal, Asterisk, Cross, Divide, Percent, Hash, Slash],
  Space: [Rocket, Satellite, SatelliteDish, Orbit, Earth, Telescope, Moon, MoonStar, Sun, Star, StarOff, StarHalf, Sparkles, Space, CloudMoon, CloudSun, SunMoon, SunDim, SunMedium, SunSnow, CloudSunRain, CloudMoonRain, Sunrise, Sunset],
  Tech: [Laptop, Smartphone, Gamepad2, Headphones, Camera, Watch, Keyboard, Mouse, Tv, Speaker, HardDrive, Printer, Battery, Plug, Cpu, Wifi, Bluetooth, Radio, Calculator, Lightbulb, Monitor, Tablet, Mic, Webcam],
  Everyday: [Coffee, Book, Pencil, Scissors, Ticket, Gift, Trophy, Medal, Plane, Car, Bus, Train, Bike, Compass, Map, Briefcase, ShoppingCart, CreditCard, Glasses, Key, Lock, Mail, Phone, Video],
  Animals: [Cat, Dog, PawPrint, Bird, Fish, Rabbit, Snail, Turtle, Rat, Worm, Squirrel, Bug, Shell, LionIcon, PandaIcon, ElephantIcon, FoxIcon, BearIcon, FrogIcon, OwlIcon, WhaleIcon, ButterflyIcon, BeeIcon, PenguinIcon]
};
const STORE = 'flipmate-v1';
const createGameId = () => window.crypto?.randomUUID?.() || `${Date.now()}-${Math.random().toString(36).slice(2)}`;
const PROFILE_HISTORY_OWNER_MIGRATION = 1;
const migrateProfileHistory = (data) => {
  if (data.profileHistoryOwnerMigration >= PROFILE_HISTORY_OWNER_MIGRATION) return data;

  const profileNames = typeof data.displayName === 'string' && data.displayName.trim()
    ? new Set([data.displayName, data.lastSoloName]
      .filter((name) => typeof name === 'string' && name.trim())
      .map((name) => name.trim().toLowerCase()))
    : new Set();
  const history = Array.isArray(data.history) && profileNames.size
    ? data.history.map((record) => {
      if (!record || record.mode !== 'solo' || record.profileOwnerId !== undefined) return record;
      return typeof record.name === 'string' && profileNames.has(record.name.trim().toLowerCase())
        ? { ...record, profileOwnerId: data.profileId }
        : record;
    })
    : data.history;

  return {
    ...data,
    history,
    profileHistoryOwnerMigration: PROFILE_HISTORY_OWNER_MIGRATION
  };
};
const readStore = () => {
  try {
    const raw = localStorage.getItem(STORE);
    if (!raw) {
      return {
        profileId: createGameId(),
        displayName: '',
        hasProfile: false
      };
    }
    const data = JSON.parse(raw);
    if (!data.profileId) {
      data.profileId = createGameId();
    }
    Object.assign(data, migrateProfileHistory(data));
    const hasProfile = Boolean(data.displayName && typeof data.displayName === 'string' && data.displayName.trim());
    data.hasProfile = hasProfile;
    return data;
  } catch {
    const fallbackId = 'profile-default';
    return {
      profileId: fallbackId,
      displayName: '',
      hasProfile: false
    };
  }
};
const saveStore = (data) => { try { localStorage.setItem(STORE, JSON.stringify(data)); } catch { /* private browsing may block storage */ } };
const shuffle = (items) => { const a = [...items]; for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1));[a[i], a[j]] = [a[j], a[i]]; } return a; };
const makeDeck = (pairs, theme) => {
  const icons = THEMES[theme];
  if (!icons || icons.length < pairs || new Set(icons.slice(0, pairs)).size !== pairs) {
    throw new Error(`Theme "${theme}" does not contain ${pairs} unique icons.`);
  }
  return shuffle(icons.slice(0, pairs).flatMap((Icon, index) => [
    { id: `${theme}-${index}-a`, pair: index, Icon },
    { id: `${theme}-${index}-b`, pair: index, Icon }
  ]));
};
const formatTime = (s) => `${Math.floor(Math.max(0, s) / 60).toString().padStart(2, '0')}:${(Math.max(0, s) % 60).toString().padStart(2, '0')}`;

export const isReservedDeveloperName = (rawName) => {
  if (!rawName) return false;
  const clean = rawName.toLowerCase().replace(/[\s\-_.,/\\|~`!@#$%^&*()[\]{}]+/g, '');
  if (/^jb(dev|devs|developer|developers|devloper|devlopers|developr)$/.test(clean)) {
    return true;
  }
  return false;
};

// Centralized restricted terms definition by language
const RESTRICTED_TERMS_BY_LANGUAGE = {
  malayalamNative: [
    'മൈര്',
    'മൈരേ',
    'മൈരൻ',
    'അണ്ടി',
    'ഫണ്ട',
    'ഫണ്ടേ',
    'തന്ത',
    'തള്ള',
    'തന്തയില്ലാത്തവൻ',
    'തന്തയില്ലാത്ത',
    'തായോളി',
    'പൂറൻ',
    'പൂറ്',
    'ഫണ്ടാച്ചി',
    'ഫണ്ടേച്ചി',
    'ഇല്ലാത്തവൻ',
    'ഇല്ലാത്ത'
  ],
  malayalamManglish: [
    'myree',
    'myren',
    'myr',
    'myre',
    'myran',
    'myre pooran',
    'andi',
    'funda',
    'funde',
    'thantha',
    'thalla',
    'thantha ella',
    'thayoli',
    'fundachi',
    'fundechi',
    'pooran',
    'pooru',
    'ellathavan',
    'ellatha'
  ],
  english: [
    'fuck',
    'fucker',
    'fucking',
    'shit',
    'bitch',
    'asshole',
    'bastard',
    'cunt',
    'dick',
    'pussy',
    'slut',
    'whore',
    'faggot',
    'nigger',
    'nigga',
    'retard',
    'motherfucker',
    'cock',
    'twat',
    'wanker',
    'prick',
    'blowjob',
    'dumbass'
  ],
  hindiDevanagari: [
    'मादरचोद',
    'मादरचोध',
    'बहनचोद',
    'भेनचोद',
    'भोसड़ीके',
    'भोसड़ी',
    'भोसडीके',
    'भोसडी',
    'चूतिया',
    'चुतिया',
    'चूत',
    'गांडू',
    'गांड',
    'लौड़ा',
    'लौडे',
    'लौडा',
    'लण्ड',
    'लंड',
    'रंडी',
    'हरामी',
    'कुतिया',
    'कमीना',
    'कमीने'
  ],
  hindiHinglish: [
    'madarchod',
    'madarchodh',
    'madar chod',
    'bhenchod',
    'behenchod',
    'benchod',
    'bhen chod',
    'bhosdike',
    'bhosadike',
    'bhosdi',
    'bhosadi',
    'chutiya',
    'chutiye',
    'chutiyapa',
    'chootiya',
    'choot',
    'chut',
    'gaandu',
    'gandu',
    'gaand',
    'gand',
    'lauda',
    'lawda',
    'lavda',
    'loda',
    'lund',
    'raand',
    'randi',
    'harami',
    'kutiya',
    'kameena',
    'kaminey',
    'kamine'
  ],
  tamilNative: [
    'ஓத்தா',
    'ஒத்தா',
    'தேவடியா',
    'தேவிடியா',
    'புண்டை',
    'சுன்னி'
  ],
  tamilTanglish: [
    'othaa',
    'otha',
    'thevadiya',
    'thevidya',
    'pundai',
    'poolu',
    'sunni'
  ]
};

const SEP = '[\\s\\-_.,*~#!@$%^&()[\\]{}|/\\\\]*';
// Indic Unicode ranges:
// Devanagari: \u0900-\u097F (Hindi, Marathi)
// Bengali: \u0980-\u09FF (Bengali)
// Gurmukhi: \u0A00-\u0A7F (Punjabi)
// Gujarati: \u0A80-\u0AFF (Gujarati)
// Tamil: \u0B80-\u0BFF (Tamil)
// Telugu: \u0C00-\u0C7F (Telugu)
// Kannada: \u0C80-\u0CFF (Kannada)
// Malayalam: \u0D00-\u0D7F (Malayalam)
// Arabic/Urdu: \u0600-\u06FF (Urdu)
const INDIC_RANGES = '\\u0900-\\u097F\\u0980-\\u09FF\\u0A00-\\u0A7F\\u0A80-\\u0AFF\\u0B80-\\u0BFF\\u0C00-\\u0C7F\\u0C80-\\u0CFF\\u0D00-\\u0D7F\\u0600-\\u06FF';
const BOUNDARY_PRE = `(?:^|[^a-z${INDIC_RANGES}])`;
const BOUNDARY_POST = `(?:[^a-z${INDIC_RANGES}]|$)`;

const buildPattern = (term) => {
  const parts = term.trim().split(/\s+/).map((word) => {
    return Array.from(word).map((ch) => `${ch}+`).join(SEP);
  });
  return parts.join('[\\s\\-_.,*~#!@$%^&()[\\]{}|/\\\\]+');
};

const COMPILED_PATTERNS = Object.entries(RESTRICTED_TERMS_BY_LANGUAGE).reduce((acc, [lang, terms]) => {
  acc[lang] = terms.map((term) => {
    const inner = buildPattern(term);
    return new RegExp(`${BOUNDARY_PRE}${inner}${BOUNDARY_POST}`, 'i');
  });
  return acc;
}, {});

const SEP_CHAR = '[\\s\\-_.,*~#!@$%^&()[\\]{}|/\\\\]*';
const JITHU_COMBO_REGEX = new RegExp(
  `j+${SEP_CHAR}i+${SEP_CHAR}t+${SEP_CHAR}h+${SEP_CHAR}u+${SEP_CHAR}(?:myr|andi|fund|thanth|thall|thayol|pooran|pooru|ellath|bhenchod|madarchod|chutiya|bhosd|gaand|gand|lauda|lavda|lund|randi|harami|pundai|thevadiya|othaa|otha|fuck|shit|bitch|cunt|dick|puss|slut|asshole|bastard)|(?:myr|andi|fund|thanth|thall|thayol|pooran|pooru|ellath|bhenchod|madarchod|chutiya|bhosd|gaand|gand|lauda|lavda|lund|randi|harami|pundai|thevadiya|othaa|otha|fuck|shit|bitch|cunt|dick|puss|slut|asshole|bastard)${SEP_CHAR}j+${SEP_CHAR}i+${SEP_CHAR}t+${SEP_CHAR}h+${SEP_CHAR}u+`,
  'i'
);

const MULTI_BLOCKED_COMBO_REGEX = /(?:andi|myr[a-z]*|fund[a-z]*|thall[a-z]*|thanth[a-z]*|thayol[a-z]*|pooran|pooru|ellath[a-z]*|bhenchod|madarchod|chutiya|bhosd[a-z]*|gaand[a-z]*|gand[a-z]*|lauda|lavda|lund|randi|harami|pundai|thevadiya|othaa|otha|fuck[a-z]*|shit[a-z]*|bitch[a-z]*|cunt|dick)(?:andi|myr[a-z]*|fund[a-z]*|thall[a-z]*|thanth[a-z]*|thayol[a-z]*|pooran|pooru|ellath[a-z]*|bhenchod|madarchod|chutiya|bhosd[a-z]*|gaand[a-z]*|gand[a-z]*|lauda|lavda|lund|randi|harami|pundai|thevadiya|othaa|otha|fuck[a-z]*|shit[a-z]*|bitch[a-z]*|cunt|dick)/i;

export const hasBlockedTerms = (rawName) => {
  if (!rawName) return false;
  // Unicode normalize NFKC to handle character decompositions and full-width forms
  const lower = rawName.normalize('NFKC').toLowerCase();

  // Combinations of Jithu with restricted terms
  if (JITHU_COMBO_REGEX.test(lower)) {
    return true;
  }

  // Combinations across restricted roots (e.g. andimyren, fundamyre, thayolimyr, bhenchodmyre)
  const compressed = lower.replace(new RegExp(`[^a-z0-9${INDIC_RANGES}]+`, 'g'), '');
  if (MULTI_BLOCKED_COMBO_REGEX.test(compressed)) {
    return true;
  }

  // Check language categories
  for (const langList of Object.values(COMPILED_PATTERNS)) {
    for (const regex of langList) {
      if (regex.test(lower)) {
        return true;
      }
    }
  }

  return false;
};

export const validatePlayerName = (rawName, { allowEmpty = false } = {}) => {
  if (rawName === undefined || rawName === null || rawName === '') {
    if (allowEmpty) return { valid: true };
    return { valid: false, error: 'Please enter a name.' };
  }

  const name = String(rawName);

  if (name.length > 20) {
    return { valid: false, error: 'Name must be 20 characters or fewer.' };
  }

  if (name.startsWith(' ') || name.endsWith(' ')) {
    return { valid: false, error: 'Name cannot have leading or trailing spaces.' };
  }

  if (name.includes('  ')) {
    return { valid: false, error: 'Name cannot contain consecutive spaces.' };
  }

  // Only English letters, digits, and valid single spaces
  if (!/^[A-Za-z0-9 ]+$/.test(name)) {
    return { valid: false, error: 'Name can only contain English letters, digits, and spaces.' };
  }

  // At least one letter
  if (!/[A-Za-z]/.test(name)) {
    return { valid: false, error: 'Name must contain at least one letter.' };
  }

  // Every space-separated segment must contain at least one letter
  const segments = name.split(' ');
  for (const seg of segments) {
    if (!/[A-Za-z]/.test(seg)) {
      return { valid: false, error: 'Every word segment must contain at least one letter.' };
    }
  }

  if (isReservedDeveloperName(name)) {
    return { valid: false, error: 'This name is reserved for the developer. Please choose a different name.' };
  }

  if (hasBlockedTerms(name)) {
    return { valid: false, error: 'This name contains disallowed language. Please choose a different name.' };
  }

  return { valid: true };
};

const getLeaderboardParams = () => {
  try {
    const params = new URLSearchParams(window.location.search);
    const tab = params.get('tab') || params.get('mode');
    const diff = params.get('difficulty') || params.get('diff');
    return { tab, diff };
  } catch {
    return { tab: null, diff: null };
  }
};
const VALID_ROUTES = new Set(['home', 'setup', 'game', 'leaderboard', 'history', 'multiplayer-history', 'profile', 'settings', 'online', 'how-to-play', 'about-developer']);
const getPageFromPath = (pathname) => {
  const path = pathname.split('/').filter(Boolean).join('/');
  if (!path) return 'home';
  const normalizedPath = path.replaceAll('_', '-');
  return VALID_ROUTES.has(normalizedPath) ? normalizedPath.replaceAll('-', '_') : 'not_found';
};

export class ErrorBoundary extends React.Component {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    if (import.meta.env.DEV) {
      console.error('FlipMate caught a rendering error:', error, errorInfo);
    }
  }

  render() {
    if (!this.state.hasError) return this.props.children;

    const goHome = () => {
      window.history.pushState(null, '', '/');
      this.setState({ hasError: false });
    };

    return (
      <div className={`app error-boundary-app${readStore().dark ? ' dark' : ''}`}>
        <main className="container">
          <section className="error-page" role="alert">
            <div className="error-card">
              <div className="error-illustration" aria-hidden="true">
                <span className="error-memory-card error-memory-card-left" />
                <span className="error-memory-card error-memory-card-right" />
                <span className="error-memory-card error-memory-card-missing">?</span>
              </div>
              <span className="eyebrow">A LITTLE MIX-UP</span>
              <h1>Something went wrong</h1>
              <p>FlipMate hit an unexpected snag. Your saved game data is still safe.</p>
              <div className="error-actions">
                <button className="btn primary" onClick={() => this.setState({ hasError: false })}>
                  <RotateCcw size={16} /> Try Again
                </button>
                <button className="btn secondary" onClick={goHome}>
                  <House size={16} /> Back to Home
                </button>
              </div>
            </div>
          </section>
        </main>
      </div>
    );
  }
}

export const isProfileMatchRecord = (r, currentProfileName) => {
  if (!r || !r.name || !currentProfileName) return false;
  return r.name.trim().toLowerCase() === currentProfileName.trim().toLowerCase();
};

export const isPlayerRecord = (r, target, fallbackName) => {
  const targetName = (typeof target === 'string' && target.trim()) ? target : fallbackName;
  return isProfileMatchRecord(r, targetName);
};

export const calculatePlayerStats = (historyList, currentProfileName, persistedData = {}) => {
  const targetName = (typeof currentProfileName === 'string' && currentProfileName.trim() && currentProfileName !== persistedData?.profileId)
    ? currentProfileName.trim()
    : (persistedData?.displayName || '').trim();
  const ownerId = persistedData?.profileId;

  const isTargetRecord = (r) => ownerId
    ? r?.profileOwnerId === ownerId
    : r?.mode === 'solo' && isProfileMatchRecord(r, targetName);

  const seenProfileMatches = new Set();
  let totalGamesPlayed = 0;
  let totalPairsMatched = 0;
  let totalOverallScore = 0;
  let bestSoloScore = null;
  const difficultyCounts = {};
  const completedSoloGames = [];
  const seenWinMatches = new Set();
  let historyMultiWins = 0;

  (historyList || []).forEach((r) => {
    if (!r || !isTargetRecord(r)) return;

    const isSolo = r.mode === 'solo';
    const isMulti = r.mode === 'local' || r.mode === 'multiplayer';
    if (!isSolo && !isMulti) return;

    const diffConfig = DIFFICULTIES[r.difficulty];
    const expectedPairs = diffConfig?.pairs;
    if (expectedPairs == null) return;

    if (isSolo) {
      const isCompleted = typeof r.completedPairs === 'number'
        ? r.completedPairs >= expectedPairs
        : (typeof r.moves === 'number' && r.moves >= expectedPairs && (r.score > 0));
      if (!isCompleted) return;

      const matchKey = `solo-${r.id || r.sessionId || `${r.date}-${r.score}`}`;
      if (seenProfileMatches.has(matchKey)) return;
      seenProfileMatches.add(matchKey);

      totalGamesPlayed += 1;
      const pairs = (typeof r.completedPairs === 'number' ? r.completedPairs : expectedPairs);
      totalPairsMatched += pairs;
      const scoreNum = Number(r.score);
      if (Number.isFinite(scoreNum)) {
        totalOverallScore += scoreNum;
        if (bestSoloScore === null || scoreNum > bestSoloScore) {
          bestSoloScore = scoreNum;
        }
      }

      if (r.difficulty) {
        difficultyCounts[r.difficulty] = (difficultyCounts[r.difficulty] || 0) + 1;
      }

      completedSoloGames.push(r);
    } else {
      if (typeof r.completedPairs !== 'number' && typeof r.score !== 'number') return;
      const matchKey = `multi-${r.sessionId || (r.id ? r.id.split('-').slice(0, -1).join('-') : null) || r.date}-${(r.name || '').trim().toLowerCase()}`;
      if (seenProfileMatches.has(matchKey)) return;
      seenProfileMatches.add(matchKey);

      totalGamesPlayed += 1;
      if (typeof r.completedPairs === 'number' && r.completedPairs > 0) {
        totalPairsMatched += r.completedPairs;
      }
      const scoreNum = Number(r.score);
      if (Number.isFinite(scoreNum) && scoreNum > 0) {
        totalOverallScore += scoreNum;
      }

      if (r.difficulty) {
        difficultyCounts[r.difficulty] = (difficultyCounts[r.difficulty] || 0) + 1;
      }

      if (r.matchResult === 'winner') {
        const winKey = `win-${r.sessionId || (r.id ? r.id.split('-').slice(0, -1).join('-') : null) || r.date}`;
        if (!seenWinMatches.has(winKey)) {
          seenWinMatches.add(winKey);
          historyMultiWins += 1;
        }
      }
    }
  });

  let mostPlayedDifficulty = null;
  const diffEntries = Object.entries(difficultyCounts);
  if (diffEntries.length > 0) {
    diffEntries.sort((a, b) => b[1] - a[1]);
    const maxCount = diffEntries[0][1];
    const topDiffs = diffEntries.filter(([, count]) => count === maxCount);
    if (topDiffs.length === 1) {
      mostPlayedDifficulty = topDiffs[0][0];
    }
  }

  const bestScoreRecord = completedSoloGames.length
    ? [...completedSoloGames].sort((a, b) => {
        if ((b.score || 0) !== (a.score || 0)) return (b.score || 0) - (a.score || 0);
        return (a.seconds || Infinity) - (b.seconds || Infinity);
      })[0]
    : null;

  const validTimeGames = completedSoloGames.filter((r) => typeof r.seconds === 'number' && r.seconds > 0);
  const fastestRecord = validTimeGames.length
    ? [...validTimeGames].sort((a, b) => {
        if (a.seconds !== b.seconds) return a.seconds - b.seconds;
        return (b.score || 0) - (a.score || 0);
      })[0]
    : null;

  const validMovesGames = completedSoloGames.filter((r) => {
    const minPairs = DIFFICULTIES[r.difficulty]?.pairs || 1;
    return typeof r.moves === 'number' && r.moves >= minPairs;
  });
  const fewestMovesRecord = validMovesGames.length
    ? [...validMovesGames].sort((a, b) => {
        if (a.moves !== b.moves) return a.moves - b.moves;
        return (a.seconds || Infinity) - (b.seconds || Infinity);
      })[0]
    : null;

  const playerMultiWins = historyMultiWins;

  return {
    gamesPlayed: totalGamesPlayed,
    pairsMatched: totalPairsMatched,
    overallScore: totalOverallScore,
    bestSoloScore,
    mostPlayedDifficulty,
    multiplayerWins: playerMultiWins,
    bestScoreRecord,
    fastestRecord,
    fewestMovesRecord
  };
};

const getProfileHomeStats = (historyList, currentProfileName, persistedData) => {
  return calculatePlayerStats(historyList, currentProfileName, persistedData);
};

export default function App() {
  const [persisted, setPersisted] = useState(readStore);
  const [dark, setDark] = useState(readStore().dark ?? false);
  const [sound, setSound] = useState(readStore().sound ?? true);
  const [page, setPage] = useState(() => {
    return getPageFromPath(window.location.pathname);
  });
  const previousPage = useRef(page);
  useLayoutEffect(() => {
    const previousScrollRestoration = window.history.scrollRestoration;
    window.history.scrollRestoration = 'manual';
    return () => {
      window.history.scrollRestoration = previousScrollRestoration;
    };
  }, []);
  useLayoutEffect(() => {
    if (previousPage.current === page) return;
    previousPage.current = page;
    window.scrollTo(0, 0);
  }, [page]);
  const [mode, setMode] = useState('solo');
  const [difficulty, setDifficulty] = useState('Normal');
  const [theme, setTheme] = useState('Random');
  const [activeTheme, setActiveTheme] = useState('Symbols');
  const [playerNames, setPlayerNames] = useState(['', '', '', '']);
  const [playerCount, setPlayerCount] = useState(2);
  const [turnBased, setTurnBased] = useState(true);
  const [deck, setDeck] = useState([]);
  const [flipped, setFlipped] = useState([]);
  const [matched, setMatched] = useState([]);
  const [scores, setScores] = useState([0, 0, 0, 0]);
  const [activePlayer, setActivePlayer] = useState(0);
  const [moves, setMoves] = useState(0);
  const [playerMoves, setPlayerMoves] = useState([0, 0, 0, 0]);
  const [seconds, setSeconds] = useState(0);
  const [running, setRunning] = useState(false);
  const [paused, setPaused] = useState(false);
  const [gameStatus, setGameStatus] = useState('ready');
  const [hintUsed, setHintUsed] = useState(false);
  const [notice, setNotice] = useState('');
  const [roomCode, setRoomCode] = useState('');
  const [roomCreated, setRoomCreated] = useState(false);
  const [hasProfile, setHasProfile] = useState(() => Boolean(readStore().hasProfile));
  const [welcomeNameInput, setWelcomeNameInput] = useState('');
  const [welcomeError, setWelcomeError] = useState('');
  const [profileName, setProfileName] = useState(() => persisted.displayName || 'Player');
  const [soloPlayerName, setSoloPlayerName] = useState(() => persisted.lastSoloName || persisted.displayName || 'Player');
  const [isEditingName, setIsEditingName] = useState(false);
  const [editNameInput, setEditNameInput] = useState(() => persisted.displayName || 'Player');
  const [profileNameError, setProfileNameError] = useState('');
  const currentProfileId = persisted.profileId || 'profile-default';

  const frozenSoloPlayerName = useRef(soloPlayerName);
  const frozenSoloProfileOwnerId = useRef(null);
  const frozenMatchSlots = useRef([]);

  const homeStats = useMemo(() => {
    return getProfileHomeStats(persisted.history, profileName, persisted);
  }, [persisted.history, profileName, persisted]);
  const [leaderboardFilter, setLeaderboardFilter] = useState(() => {
    const { tab, diff } = getLeaderboardParams();
    if (tab === 'solo' && diff && Object.keys(DIFFICULTIES).includes(diff)) {
      return diff;
    }
    return 'Easy';
  });
  const [leaderboardMode, setLeaderboardMode] = useState(() => {
    const { tab } = getLeaderboardParams();
    if (tab === 'solo') return 'solo';
    if (tab === 'multiplayer') return 'multiplayer';
    return 'overall';
  });
  const [multiplayerView, setMultiplayerView] = useState('top_players');
  const [expandedPlayer, setExpandedPlayer] = useState(null);
  const [historyFilter, setHistoryFilter] = useState('Easy');
  const [historySort, setHistorySort] = useState('newest');
  const [historyPlayerFilter, setHistoryPlayerFilter] = useState('');
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const [historyMenuOpen, setHistoryMenuOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [setupActiveSection, setSetupActiveSection] = useState(null);
  const [setupSubmitted, setSetupSubmitted] = useState(false);
  const startAt = useRef(null);
  const activeGameId = useRef(null);
  const recordedGameId = useRef(null);
  const hintTimer = useRef(null);
  const noticeTimer = useRef(null);
  const historyMenuRef = useRef(null);
  const headerRef = useRef(null);
  const settings = DIFFICULTIES[difficulty];
  const isMultiplayer = mode === 'local';
  const selectedPlayers = Array.from({ length: playerCount }).map((_, i) => (playerNames[i] || '').trim() || `Player ${i + 1}`);
  const currentName = selectedPlayers[activePlayer] || `Player ${activePlayer + 1}`;
  const totalPairs = settings.pairs;
  const complete = matched.length === deck.length && deck.length > 0;
  const accuracy = moves ? Math.round((matched.length / 2 / moves) * 100) : 0;
  const isGameplayActive = page === 'game' && (gameStatus === 'playing' || gameStatus === 'paused');
  const isGameFlow = page === 'setup' || page === 'game';
  
  const soloTrimmed = soloPlayerName.trim();
  const soloValidation = soloTrimmed ? validatePlayerName(soloTrimmed) : null;
  const isSoloInvalid = Boolean(soloValidation && !soloValidation.valid);
  const soloValidationError = soloValidation?.error || '';

  const handleWelcomeSubmit = (e) => {
    e.preventDefault();
    const trimmed = welcomeNameInput.trim();
    const validation = validatePlayerName(trimmed);
    if (!validation.valid) {
      setWelcomeError(validation.error);
      return;
    }
    setWelcomeError('');
    const pid = persisted.profileId || createGameId();
    const updated = {
      ...persisted,
      profileId: pid,
      displayName: trimmed,
      hasProfile: true,
      lastSoloName: trimmed
    };
    setPersisted(updated);
    saveStore({
      ...updated,
      dark,
      sound,
      displayName: trimmed,
      profileId: pid
    });
    setProfileName(trimmed);
    setSoloPlayerName(trimmed);
    setHasProfile(true);
    setPage('home');
  };

  useEffect(() => {
    saveStore({
      ...persisted,
      profileId: currentProfileId,
      dark,
      sound,
      displayName: profileName,
      lastSoloName: soloPlayerName
    });
  }, [persisted, dark, sound, profileName, soloPlayerName, currentProfileId]);
  useEffect(() => {
    if (!running || paused || gameStatus !== 'playing') return undefined;
    const id = window.setInterval(() => {
      if (startAt.current) setSeconds(Math.floor((Date.now() - startAt.current) / 1000));
    }, 250);
    return () => window.clearInterval(id);
  }, [running, paused, gameStatus]);
  useEffect(() => {
    if (mode !== 'solo' || gameStatus !== 'playing' || !settings.time) return;
    if (seconds >= settings.time) finishGame(activeGameId.current, true);
    // finishGame is intentionally triggered only when the time limit is reached.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [seconds]);
  useEffect(() => () => { window.clearTimeout(hintTimer.current); window.clearTimeout(noticeTimer.current); }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (headerRef.current && !headerRef.current.contains(event.target)) {
        setHistoryMenuOpen(false);
        setMobileMenuOpen(false);
      }
    };
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        const mobileMenuWasOpen = headerRef.current?.querySelector('.main-nav')?.classList.contains('mobile-open');
        setHistoryMenuOpen(false);
        setMobileMenuOpen(false);
        if (mobileMenuWasOpen) headerRef.current?.querySelector('.mobile-menu-toggle')?.focus();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscape);
    return () => { document.removeEventListener('mousedown', handleClickOutside); document.removeEventListener('keydown', handleEscape); };
  }, []);

  useEffect(() => {
    document.title = 'FlipMate — by JB Devs';
    const handlePopState = () => {
      const targetPage = getPageFromPath(window.location.pathname);
      setPage(targetPage);
      if (targetPage === 'leaderboard') {
        const { tab, diff } = getLeaderboardParams();
        if (tab === 'solo') {
          setLeaderboardMode('solo');
          if (diff && Object.keys(DIFFICULTIES).includes(diff)) {
            setLeaderboardFilter(diff);
          } else {
            setLeaderboardFilter('Easy');
          }
        } else if (tab === 'multiplayer') {
          setLeaderboardMode('multiplayer');
          setMultiplayerView('top_players');
        } else {
          setLeaderboardMode('overall');
          setLeaderboardFilter('Easy');
        }
      }
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const toast = (message) => { setNotice(message); window.clearTimeout(noticeTimer.current); noticeTimer.current = window.setTimeout(() => setNotice(''), 2600); };
  const startGame = (chosenMode = mode) => {
    if (chosenMode === 'solo') {
      const effectiveSoloName = soloPlayerName.trim() || profileName || 'Player';
      const soloCheck = validatePlayerName(effectiveSoloName);
      if (!soloCheck.valid) {
        setSetupSubmitted(true);
        toast(soloCheck.error);
        return;
      }
      frozenSoloPlayerName.current = effectiveSoloName;
      frozenSoloProfileOwnerId.current = effectiveSoloName.trim().toLowerCase() === profileName.trim().toLowerCase()
        ? currentProfileId
        : null;
    }
    if (chosenMode === 'local') {
      const activeNames = [];
      for (let i = 0; i < playerCount; i++) {
        const raw = (playerNames[i] || '').trim() || `Player ${i + 1}`;
        const check = validatePlayerName(raw);
        if (!check.valid) {
          setSetupSubmitted(true);
          toast(`Player ${i + 1}: ${check.error}`);
          return;
        }
        activeNames.push(raw);
      }
      if (new Set(activeNames.map(n => n.toLowerCase())).size !== playerCount) {
        setSetupSubmitted(true);
        toast('Player names must be unique for this match.');
        return;
      }
      frozenMatchSlots.current = activeNames;
    }
    setSetupSubmitted(false);
    window.clearTimeout(hintTimer.current);
    activeGameId.current = createGameId();
    recordedGameId.current = null;
    setMode(chosenMode);
    const resolvedTheme = theme === 'Random' ? Object.keys(THEMES)[Math.floor(Math.random() * Object.keys(THEMES).length)] : theme;
    setActiveTheme(resolvedTheme);
    const pairs = DIFFICULTIES[difficulty].pairs;
    setDeck(makeDeck(pairs, resolvedTheme)); setFlipped([]); setMatched([]); setScores([0, 0, 0, 0]); setPlayerMoves([0, 0, 0, 0]); setActivePlayer(0); setMoves(0); setSeconds(0); setPaused(false); setRunning(true); setGameStatus('playing'); setHintUsed(false); startAt.current = Date.now(); setPage('game');
  };
  const finishGame = useCallback((gameId, timedOut = false, completedPairs = matched.length / 2) => {
    if (!gameId || activeGameId.current !== gameId || recordedGameId.current === gameId) return;
    recordedGameId.current = gameId;
    setRunning(false); setPaused(false); setGameStatus(timedOut ? 'timeout' : 'complete');
    const current = readStore();
    const inGameSoloName = frozenSoloPlayerName.current || (soloPlayerName || '').trim() || profileName || 'Player';
    const isMeaningful = moves > 0;
    let newHistoryItems = [];
    let updatedMultiWins = { ...(current.multiplayerWins || {}) };

    if (isMeaningful) {
      if (isMultiplayer) {
        const slots = (frozenMatchSlots.current && frozenMatchSlots.current.length === playerCount)
          ? frozenMatchSlots.current
          : Array.from({ length: playerCount }).map((_, i) => (playerNames[i] || '').trim() || `Player ${i + 1}`);

        const playerStats = [];
        for (let i = 0; i < playerCount; i++) {
          if (playerMoves[i] > 0 || scores[i] > 0) {
            const calculatedScore = Math.max(0, Math.round(scores[i] * 100 * settings.multiplier - playerMoves[i] * 5 - seconds));
            const calculatedAcc = playerMoves[i] ? Math.round((scores[i] / playerMoves[i]) * 100) : 0;
            playerStats.push({
              index: i,
              score: calculatedScore,
              pairs: scores[i] || 0,
              accuracy: calculatedAcc,
              moves: playerMoves[i] || 0
            });
          }
        }
        
        let winnerIndex = -1;
        let isTie = false;
        
        if (playerStats.length > 0) {
          playerStats.sort((a, b) => {
            if (b.pairs !== a.pairs) return b.pairs - a.pairs;
            if (b.score !== a.score) return b.score - a.score;
            if (b.accuracy !== a.accuracy) return b.accuracy - a.accuracy;
            return a.moves - b.moves;
          });
          
          if (playerStats.length === 1) {
            winnerIndex = playerStats[0].index;
          } else {
            const first = playerStats[0];
            const second = playerStats[1];
            if (first.pairs === second.pairs && first.score === second.score && first.accuracy === second.accuracy && first.moves === second.moves) {
              isTie = true;
            } else {
              winnerIndex = first.index;
            }
          }
        }

        if (winnerIndex !== -1 && !isTie) {
          const winnerName = slots[winnerIndex];
          if (winnerName) {
            updatedMultiWins[winnerName] = (updatedMultiWins[winnerName] || 0) + 1;
          }
        }

        for (let i = 0; i < playerCount; i++) {
          if (playerMoves[i] > 0 || scores[i] > 0) {
            const matchResult = isTie ? 'tie' : (i === winnerIndex ? 'winner' : 'loser');
            newHistoryItems.push({
              id: `${gameId}-${i}`,
              sessionId: gameId,
              mode,
              difficulty,
              score: Math.max(0, Math.round(scores[i] * 100 * settings.multiplier - playerMoves[i] * 5 - seconds)),
              moves: playerMoves[i],
              seconds,
              completedPairs: scores[i],
              date: new Date().toISOString(),
              name: slots[i],
              matchResult
            });
          }
        }
      } else {
        newHistoryItems.push({
          id: gameId,
          sessionId: gameId,
          mode,
          difficulty,
          score: Math.max(0, Math.round(completedPairs * 100 * settings.multiplier - moves * 5 - seconds)),
          moves,
          seconds,
          completedPairs,
          date: new Date().toISOString(),
          name: inGameSoloName,
          profileOwnerId: frozenSoloProfileOwnerId.current
        });
      }
    }
    const history = isMeaningful ? [...newHistoryItems, ...(current.history || []).filter((r) => r.sessionId !== gameId && r.id !== gameId && !r.id?.startsWith(`${gameId}-`))].slice(0, 50) : (current.history || []);
    const bests = { ...(current.bests || {}) };
    newHistoryItems.forEach((item) => {
      if (item.mode !== 'solo') return;
      const bKey = `solo-${difficulty}`;
      if (!bests[bKey] || item.score > bests[bKey].score) bests[bKey] = item;
    });
    const updated = {
      ...current,
      profileId: currentProfileId,
      history,
      bests,
      multiplayerWins: updatedMultiWins,
      gamesPlayed: (current.gamesPlayed || 0) + 1,
      totalPairs: (current.totalPairs || 0) + completedPairs
    };
    setPersisted(updated);
    saveStore({
      ...updated,
      dark,
      sound,
      displayName: profileName,
      lastSoloName: soloPlayerName
    });
  }, [mode, isMultiplayer, scores, matched.length, settings.multiplier, moves, seconds, difficulty, playerNames, soloPlayerName, profileName, currentProfileId, dark, sound, playerMoves, playerCount]);

  useEffect(() => {
    if (complete && gameStatus === 'playing') finishGame(activeGameId.current, false, deck.length / 2);
  }, [complete, gameStatus, deck.length, finishGame]);

  const chooseCard = (card) => {
    if (gameStatus !== 'playing' || paused || flipped.length >= 2 || matched.includes(card.id) || flipped.includes(card.id)) return;
    const gameId = activeGameId.current;
    if (!running) { setRunning(true); startAt.current = Date.now() - seconds * 1000; }
    const next = [...flipped, card.id]; setFlipped(next);
    if (next.length !== 2) return;
    setMoves((n) => n + 1);
    setPlayerMoves((old) => { const updated = [...old]; updated[activePlayer] += 1; return updated; });
    const first = deck.find((c) => c.id === next[0]);
    if (first && first.pair === card.pair) {
      window.setTimeout(() => {
        if (activeGameId.current !== gameId) return;
        setMatched((old) => [...old, ...next]);
        setScores((oldScores) => { const updated = [...oldScores]; updated[activePlayer] += 1; return updated; });
        setFlipped([]);
        if (isMultiplayer && !turnBased) {
          setActivePlayer((p) => (p + 1) % playerCount);
        }
        if (sound) { try { const ctx = new (window.AudioContext || window.webkitAudioContext)(); const osc = ctx.createOscillator(); const gain = ctx.createGain(); osc.connect(gain); gain.connect(ctx.destination); osc.frequency.value = 660; gain.gain.value = 0.035; osc.start(); osc.stop(ctx.currentTime + 0.07); osc.onended = () => ctx.close(); } catch { /* sound is optional */ } }
      }, 280);
    } else {
      window.setTimeout(() => {
        if (activeGameId.current !== gameId) return;
        setFlipped([]);
        if (isMultiplayer) {
          setActivePlayer((p) => (p + 1) % playerCount);
        }
      }, 780);
    }
  };
  const useHint = () => {
    if (mode !== 'solo') return;
    if (hintUsed || gameStatus !== 'playing' || paused) return toast('You have already used your hint.');
    const pair = deck.find((c) => !matched.includes(c.id) && !flipped.includes(c.id));
    if (!pair) return;
    const pairCards = deck.filter((c) => c.pair === pair.pair && !matched.includes(c.id));
    setFlipped(pairCards.map((c) => c.id)); setHintUsed(true); toast('Hint used — no leaderboard bonus for this round.');
    hintTimer.current = window.setTimeout(() => setFlipped([]), 950);
  };
  const handlePauseToggle = () => {
    if (paused) startAt.current = Date.now() - seconds * 1000;
    setPaused(!paused);
  };
  const resetGame = () => { startGame(mode); };
  const copyRoom = async () => { try { await navigator.clipboard.writeText(roomCode); toast('Room code copied.'); } catch { toast(`Share this code: ${roomCode}`); } };
  const { bests, multiBests, multiTopPlayers, multiMatches, overallTopPlayers, overallStats, historyList, allPlayers, multiWins } = useMemo(() => {
    const seenIds = new Set();
    const cleanHistory = [...(persisted.history || [])].filter(r => {
      if (!r.id) return true;
      if (seenIds.has(r.id)) return false;
      seenIds.add(r.id);
      return true;
    });

    const multiWins = persisted.multiplayerWins || {};
    let bestsArray = [];
    const playerDiffs = new window.Map();
    let multiBestsArray = [];
    const multiPlayerDiffs = new window.Map();

    cleanHistory.forEach((r) => {
      if (!r || r.score === 0) return;
      const isSolo = r.mode === 'solo';
      const isMulti = r.mode === 'local' || r.mode === 'multiplayer';
      if (!isSolo && !isMulti) return;
      const pName = (r.name || 'Player').trim();
      const key = `${pName.toLowerCase()}-${r.difficulty}`;
      if (isSolo) {
        if (!playerDiffs.has(key)) playerDiffs.set(key, []);
        playerDiffs.get(key).push(r);
      } else if (isMulti) {
        if (!multiPlayerDiffs.has(key)) multiPlayerDiffs.set(key, []);
        multiPlayerDiffs.get(key).push(r);
      }
    });

    for (const records of playerDiffs.values()) {
      records.sort((a, b) => {
        if (b.score !== a.score) return b.score - a.score;
        const accA = a.moves ? Math.round((a.completedPairs / a.moves) * 100) : 0;
        const accB = b.moves ? Math.round((b.completedPairs / b.moves) * 100) : 0;
        if (accA !== accB) return accB - accA;
        if (a.moves !== b.moves) return (a.moves || Infinity) - (b.moves || Infinity);
        return (a.seconds || Infinity) - (b.seconds || Infinity);
      });
      bestsArray.push(records[0]);
    }

    for (const records of multiPlayerDiffs.values()) {
      records.sort((a, b) => {
        if (b.score !== a.score) return b.score - a.score;
        const accA = a.moves ? Math.round((a.completedPairs / a.moves) * 100) : 0;
        const accB = b.moves ? Math.round((b.completedPairs / b.moves) * 100) : 0;
        if (accA !== accB) return accB - accA;
        if (a.moves !== b.moves) return (a.moves || Infinity) - (b.moves || Infinity);
        return (a.seconds || Infinity) - (b.seconds || Infinity);
      });
      multiBestsArray.push(records[0]);
    }

    bestsArray.sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score;
      const accA = a.moves ? Math.round((a.completedPairs / a.moves) * 100) : 0;
      const accB = b.moves ? Math.round((b.completedPairs / b.moves) * 100) : 0;
      if (accA !== accB) return accB - accA;
      if (a.moves !== b.moves) return (a.moves || Infinity) - (b.moves || Infinity);
      return (a.seconds || Infinity) - (b.seconds || Infinity);
    });

    multiBestsArray.sort((a, b) => {
      const winsA = multiWins[a.name] || 0;
      const winsB = multiWins[b.name] || 0;
      if (winsA !== winsB) return winsB - winsA;
      if (b.score !== a.score) return b.score - a.score;
      return b.completedPairs - a.completedPairs;
    });

    const isMultiMode = (r) => Boolean(r && (r.mode === 'local' || r.mode === 'multiplayer'));
    const multiPlayerStatsMap = new window.Map();
    const seenMatchPlayer = new Set();
    cleanHistory.filter(isMultiMode).forEach((r) => {
      const pName = (r.name || 'Player').trim();
      const pKey = pName.toLowerCase();
      const matchKey = `${r.sessionId || `legacy-${r.date}`}-${pKey}`;
      if (seenMatchPlayer.has(matchKey)) return;
      seenMatchPlayer.add(matchKey);

      let stat = multiPlayerStatsMap.get(pKey);
      if (!stat) {
        stat = {
          playerKey: pKey,
          name: pName,
          totalScore: 0,
          gamesPlayed: 0,
          completedPairs: 0,
          moves: 0,
          wins: 0
        };
        multiPlayerStatsMap.set(pKey, stat);
      }
      stat.totalScore += r.score || 0;
      stat.gamesPlayed += 1;
      stat.completedPairs += r.completedPairs || 0;
      stat.moves += r.moves || 0;
      if (r.matchResult === 'winner') {
        stat.wins += 1;
      }
    });

    let multiTopPlayers = Array.from(multiPlayerStatsMap.values());
    multiTopPlayers.forEach((stat) => {
      const fromWins = multiWins[stat.name] || 0;
      stat.wins = Math.max(stat.wins, fromWins);
    });

    multiTopPlayers.sort((a, b) => {
      if (b.wins !== a.wins) return b.wins - a.wins;
      if (b.completedPairs !== a.completedPairs) return b.completedPairs - a.completedPairs;
      if (b.totalScore !== a.totalScore) return b.totalScore - a.totalScore;
      const accA = a.moves ? (a.completedPairs / a.moves) : 0;
      const accB = b.moves ? (b.completedPairs / b.moves) : 0;
      if (accA !== accB) return accB - accA;
      return 0;
    });

    let currentMultiRank = 1;
    for (let i = 0; i < multiTopPlayers.length; i++) {
      if (i > 0) {
        const prev = multiTopPlayers[i - 1];
        const curr = multiTopPlayers[i];
        const prevAcc = prev.moves ? (prev.completedPairs / prev.moves) : 0;
        const currAcc = curr.moves ? (curr.completedPairs / curr.moves) : 0;
        const isTie = prev.wins === curr.wins &&
                      prev.completedPairs === curr.completedPairs &&
                      prev.totalScore === curr.totalScore &&
                      prevAcc === currAcc;
        if (!isTie) {
          currentMultiRank = i + 1;
        }
      }
      multiTopPlayers[i].displayRank = currentMultiRank;
    }

    const multiRecords = cleanHistory.filter(isMultiMode);
    const multiMatchesMap = new window.Map();
    multiRecords.forEach((r) => {
      const k = r.sessionId || `legacy-${r.date}`;
      if (!multiMatchesMap.has(k)) {
        multiMatchesMap.set(k, { id: k, date: r.date, difficulty: r.difficulty, records: [] });
      }
      multiMatchesMap.get(k).records.push(r);
    });

    const compareMatchPlayers = (a, b) => {
      const aPairs = a.completedPairs ?? 0;
      const bPairs = b.completedPairs ?? 0;
      if (bPairs !== aPairs) return bPairs - aPairs;

      const aScore = a.score ?? 0;
      const bScore = b.score ?? 0;
      if (bScore !== aScore) return bScore - aScore;

      const aAcc = (a.moves && a.completedPairs != null) ? (a.completedPairs / a.moves) : (a.moves ? 0 : -1);
      const bAcc = (b.moves && b.completedPairs != null) ? (b.completedPairs / b.moves) : (b.moves ? 0 : -1);
      if (bAcc !== aAcc) return bAcc - aAcc;

      const aMoves = a.moves ?? Infinity;
      const bMoves = b.moves ?? Infinity;
      if (aMoves !== bMoves) return aMoves - bMoves;

      return 0;
    };

    const isMatchPlayerTie = (a, b) => {
      const aPairs = a.completedPairs ?? 0;
      const bPairs = b.completedPairs ?? 0;
      if (aPairs !== bPairs) return false;

      const aScore = a.score ?? 0;
      const bScore = b.score ?? 0;
      if (aScore !== bScore) return false;

      const aAcc = (a.moves && a.completedPairs != null) ? (a.completedPairs / a.moves) : (a.moves ? 0 : -1);
      const bAcc = (b.moves && b.completedPairs != null) ? (b.completedPairs / b.moves) : (b.moves ? 0 : -1);
      if (aAcc !== bAcc) return false;

      const aMoves = a.moves ?? Infinity;
      const bMoves = b.moves ?? Infinity;
      if (aMoves !== bMoves) return false;

      return true;
    };

    multiMatchesMap.forEach((match) => {
      const sortedRecords = [...match.records].sort(compareMatchPlayers);
      let currentRank = 1;
      match.records = sortedRecords.map((row, idx, arr) => {
        if (idx > 0) {
          if (!isMatchPlayerTie(arr[idx - 1], row)) {
            currentRank = idx + 1;
          }
        }
        return { ...row, calculatedRank: currentRank };
      });
    });

    const multiMatches = Array.from(multiMatchesMap.values());
    multiMatches.sort((a, b) => new Date(b.date || 0) - new Date(a.date || 0));

    const overallPlayerMap = new window.Map();
    const overallMatchKeys = new Set();
    const overallSeenPlayerMatches = new Set();
    const overallSeenWins = new Set();
    let overallTotalScore = 0;
    let overallTotalPairs = 0;

    const getOverallMatchKey = (r, index) => {
      if (isMultiMode(r)) {
        return `multi-${r.sessionId || (r.id ? r.id.split('-').slice(0, -1).join('-') : null) || `legacy-${r.date || index}`}`;
      }
      return `solo-${r.sessionId || r.id || `${r.date || index}-${(r.name || 'Player').trim().toLowerCase()}`}`;
    };

    cleanHistory.forEach((r, index) => {
      if (!r || (!isMultiMode(r) && r.mode !== 'solo')) return;

      const matchKey = getOverallMatchKey(r, index);
      overallMatchKeys.add(matchKey);
      const playerName = (r.name || 'Player').trim() || 'Player';
      const playerKey = playerName.toLowerCase();
      const difficulty = r.difficulty || 'Unknown';
      const groupKey = JSON.stringify([playerKey, difficulty]);
      const playerMatchKey = isMultiMode(r)
        ? JSON.stringify([matchKey, playerKey, difficulty])
        : JSON.stringify([matchKey]);
      if (overallSeenPlayerMatches.has(playerMatchKey)) return;
      overallSeenPlayerMatches.add(playerMatchKey);

      const score = Number(r.score);
      if (Number.isFinite(score)) overallTotalScore += score;
      if (typeof r.completedPairs === 'number' && Number.isFinite(r.completedPairs)) {
        overallTotalPairs += r.completedPairs;
      }

      let player = overallPlayerMap.get(groupKey);
      if (!player) {
        player = {
          name: playerName,
          difficulty,
          totalScore: 0,
          gamesPlayed: 0,
          wins: 0
        };
        overallPlayerMap.set(groupKey, player);
      }
      if (Number.isFinite(score)) player.totalScore += score;
      player.gamesPlayed += 1;

      if (isMultiMode(r) && r.matchResult === 'winner') {
        player.wins += 1;
        overallSeenWins.add(JSON.stringify([matchKey, playerKey]));
      }
    });

    const difficultyOrder = Object.keys(DIFFICULTIES);
    const overallTopPlayers = Array.from(overallPlayerMap.values()).sort((a, b) => {
      if (b.totalScore !== a.totalScore) return b.totalScore - a.totalScore;
      if (b.gamesPlayed !== a.gamesPlayed) return b.gamesPlayed - a.gamesPlayed;
      if (b.wins !== a.wins) return b.wins - a.wins;
      const nameOrder = a.name.localeCompare(b.name, undefined, { sensitivity: 'base' });
      if (nameOrder !== 0) return nameOrder;
      return difficultyOrder.indexOf(a.difficulty) - difficultyOrder.indexOf(b.difficulty);
    });

    let hList = [...cleanHistory];
    const pSet = new Set(cleanHistory.map((r) => (r.name || 'Player').trim()));

    bestsArray = bestsArray.filter((r) => r.difficulty === leaderboardFilter);
    multiBestsArray = multiBestsArray.filter((r) => r.difficulty === leaderboardFilter);
    hList = hList.filter((r) => r.difficulty === historyFilter);

    if (historyPlayerFilter) {
      hList = hList.filter((r) => (r.name || 'Player').trim() === historyPlayerFilter);
    }

    if (historySort === 'score') hList.sort((a, b) => b.score - a.score);
    else if (historySort === 'time') hList.sort((a, b) => (a.seconds || Infinity) - (b.seconds || Infinity));

    return {
      bests: bestsArray.slice(0, 50),
      multiBests: multiBestsArray.slice(0, 50),
      multiTopPlayers: multiTopPlayers.slice(0, 50),
      multiMatches,
      overallTopPlayers: overallTopPlayers.map((player, index) => ({ ...player, displayRank: index + 1 })),
      overallStats: {
        totalScore: overallTotalScore,
        gamesPlayed: overallMatchKeys.size,
        pairsMatched: overallTotalPairs,
        multiplayerWins: overallSeenWins.size
      },
      historyList: hList,
      allPlayers: Array.from(pSet),
      multiWins
    };
  }, [persisted.history, persisted.multiplayerWins, leaderboardFilter, historyFilter, historySort, historyPlayerFilter]);
  const bestSolo = (persisted.history || []).filter((r) => r.mode === 'solo').sort((a, b) => b.score - a.score)[0];
  const renderRankBadge = (rank) => {
    if (rank === 1) {
      return <span className="rank-badge gold" title="1st Place"><Trophy size={11} strokeWidth={2.4} aria-hidden="true" /> 01</span>;
    }
    if (rank === 2) {
      return <span className="rank-badge silver" title="2nd Place"><Medal size={11} strokeWidth={2.4} aria-hidden="true" /> 02</span>;
    }
    if (rank === 3) {
      return <span className="rank-badge bronze" title="3rd Place"><Medal size={11} strokeWidth={2.4} aria-hidden="true" /> 03</span>;
    }
    return <span className="rank-badge neutral">{String(rank).padStart(2, '0')}</span>;
  };
  const nav = (next, options = {}) => {
    if (next === 'leaderboard') {
      if (options.mode === 'solo') {
        setLeaderboardMode('solo');
        if (options.difficulty && Object.keys(DIFFICULTIES).includes(options.difficulty)) {
          setLeaderboardFilter(options.difficulty);
        } else {
          setLeaderboardFilter('Easy');
        }
      } else if (options.mode === 'multiplayer') {
        setLeaderboardMode('multiplayer');
        setMultiplayerView('top_players');
      } else {
        setLeaderboardMode('overall');
        setLeaderboardFilter('Easy');
        setMultiplayerView('top_players');
      }
    } else if (next !== page) {
      if (next === 'history' || next === 'multiplayer_history') setHistoryFilter('Easy');
    }
    setPage(next);
    setSetupSubmitted(false);
    setNotice('');
    setHistoryMenuOpen(false);
    setMobileMenuOpen(false);
    let path = next === 'home' ? '/' : `/${next.replaceAll('_', '-')}`;
    if (next === 'leaderboard' && options.mode) {
      const searchParams = new URLSearchParams();
      searchParams.set('tab', options.mode);
      if (options.mode === 'solo' && options.difficulty && Object.keys(DIFFICULTIES).includes(options.difficulty)) {
        searchParams.set('difficulty', options.difficulty);
      }
      path += `?${searchParams.toString()}`;
    }
    if (window.location.pathname + window.location.search !== path) {
      window.history.pushState(null, '', path);
    }
  };
  const toggleMobileMenu = () => {
    const open = !mobileMenuOpen;
    setMobileMenuOpen(open);
    if (open) {
      window.requestAnimationFrame(() => headerRef.current?.querySelector('#main-navigation .nav-link')?.focus());
    }
  };
  const gridColumns = difficulty === 'Easy' || difficulty === 'Normal' ? 4 : difficulty === 'Extreme' ? 8 : 6;
  const gridRows = difficulty === 'Easy' ? 3 : difficulty === 'Extreme' || difficulty === 'Hard' ? 6 : 4;
  const gridGap = difficulty === 'Extreme' ? 4 : difficulty === 'Hard' ? 6 : 8;
  const gridPadding = difficulty === 'Extreme' ? 6 : difficulty === 'Hard' ? 8 : 10;

  const maxCardHeight = difficulty === 'Easy' || difficulty === 'Normal' ? 135 : 185;
  const maxBoardWidth = gridColumns * 170 + (gridColumns - 1) * gridGap + gridPadding * 2 + 2;
  const maxBoardHeight = gridRows * maxCardHeight + (gridRows - 1) * gridGap + gridPadding * 2 + 2;
  const maxDesktopBoardHeight = gridRows * 155 + (gridRows - 1) * gridGap + gridPadding * 2 + 2;

  if (!hasProfile) {
    return (
      <div className={`app${dark ? ' dark' : ''}`}>
        <main className="container">
          <section className="welcome-screen-wrap" aria-labelledby="welcome-title">
            <div className="welcome-card">
              <div className="welcome-icon-badge" aria-hidden="true">
                <Brain size={36} strokeWidth={2.2} />
              </div>
              <span className="eyebrow">GET STARTED</span>
              <h1 id="welcome-title">Welcome to FlipMate!</h1>
              <p className="welcome-message">Let's get to know you.</p>

              <form className="welcome-form" onSubmit={handleWelcomeSubmit}>
                <label className="field-label" htmlFor="welcome-name-input">
                  What should we call you?
                  <input
                    id="welcome-name-input"
                    type="text"
                    maxLength={20}
                    value={welcomeNameInput}
                    onChange={(e) => {
                      setWelcomeNameInput(e.target.value);
                      if (welcomeError) setWelcomeError('');
                    }}
                    placeholder="Enter your name"
                    autoFocus
                    style={{ borderColor: welcomeError ? 'var(--danger)' : undefined }}
                  />
                </label>
                {welcomeError && (
                  <span className="welcome-error-msg" role="alert">
                    <AlertCircle size={14} /> {welcomeError}
                  </span>
                )}
                <button type="submit" className="btn primary full-btn welcome-submit-btn">
                  Start Playing <ChevronRight size={17} />
                </button>
              </form>
              <div className="welcome-note">
                <Info size={14} />
                <span>Your name will be saved on this device.</span>
              </div>
            </div>
          </section>
        </main>
      </div>
    );
  }

  return <div className={`${dark ? 'app dark' : 'app'} ${isGameplayActive ? 'immersive-mode' : ''}`}>
    {!isGameFlow && page !== 'not_found' && <header className="topbar" ref={headerRef}>
      <button className="brand" onClick={() => nav('home')} aria-label="FlipMate home"><span className="brand-mark"><img src="/logo.png" alt="FlipMate logo" /></span><span><strong>FlipMate</strong><small>by JB Devs</small></span></button>
      <nav id="main-navigation" className={`main-nav${mobileMenuOpen ? ' mobile-open' : ''}`} aria-label="Main navigation">
        <button className={page === 'home' ? 'nav-link active' : 'nav-link'} onClick={() => { nav('home'); setMobileMenuOpen(false); }}><House size={16} /> Home</button>
        <button className={page === 'leaderboard' ? 'nav-link active' : 'nav-link'} onClick={() => { nav('leaderboard'); setMobileMenuOpen(false); }}><Trophy size={16} /> Leaderboard</button>
        <div className="nav-dropdown" ref={historyMenuRef}>
          <button className={(page === 'history' || page === 'multiplayer_history') ? 'nav-link active' : 'nav-link'} onClick={() => setHistoryMenuOpen(!historyMenuOpen)} aria-expanded={historyMenuOpen} aria-haspopup="true"><Clock3 size={16} /> History <ChevronDown size={14} style={{ marginLeft: '-2px', transform: historyMenuOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} /></button>
          {historyMenuOpen && <div className="dropdown-menu">
            <button className={page === 'history' ? 'dropdown-item active' : 'dropdown-item'} onClick={() => { nav('history'); setHistoryMenuOpen(false); setMobileMenuOpen(false); }}><UserRound size={14} /> Solo History</button>
            <button className={page === 'multiplayer_history' ? 'dropdown-item active' : 'dropdown-item'} onClick={() => { nav('multiplayer_history'); setHistoryMenuOpen(false); setMobileMenuOpen(false); }}><Users size={14} /> Multiplayer History</button>
          </div>}
        </div>
        <button className={page === 'how_to_play' ? 'nav-link active' : 'nav-link'} onClick={() => { nav('how_to_play'); setMobileMenuOpen(false); }}><Book size={16} /> Game Guide</button>
        <button className={page === 'about_developer' ? 'nav-link active' : 'nav-link'} onClick={() => { nav('about_developer'); setMobileMenuOpen(false); }}><Code2 size={16} /> About Developer</button>
        <button className={page === 'profile' ? 'nav-link active' : 'nav-link'} onClick={() => { nav('profile'); setMobileMenuOpen(false); }}><CircleUserRound size={16} /> Profile</button>
        <button className={page === 'settings' ? 'nav-link active mobile-nav-settings' : 'nav-link mobile-nav-settings'} onClick={() => { nav('settings'); setMobileMenuOpen(false); }}><Settings size={16} /> Settings</button>
      </nav>
      <div className="top-actions">
        <button className="icon-btn theme-toggle-btn" title={dark ? 'Switch to light mode' : 'Switch to dark mode'} aria-label={dark ? 'Switch to light mode' : 'Switch to dark mode'} onClick={() => setDark((v) => !v)}>{dark ? <Sun size={18} aria-hidden="true" /> : <Moon size={18} aria-hidden="true" />}</button>
        <button className="icon-btn settings-btn desktop-only" title="Settings" aria-label="Settings" onClick={() => nav('settings')}><Settings size={18} aria-hidden="true" /></button>
        <button className="avatar desktop-only" aria-label="Profile" onClick={() => nav('profile')}>{(profileName.trim()[0] || 'P').toUpperCase()}</button>
        <button className="icon-btn mobile-menu-toggle" aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'} aria-expanded={mobileMenuOpen} aria-controls="main-navigation" onClick={toggleMobileMenu}>{mobileMenuOpen ? <X size={18} aria-hidden="true" /> : <Menu size={18} aria-hidden="true" />}</button>
      </div>
    </header>}

    <main className="container">
      {page === 'not_found' && (
        <section className="error-page" aria-labelledby="not-found-title">
          <div className="error-card">
            <div className="error-illustration" aria-hidden="true">
              <span className="error-memory-card error-memory-card-left" />
              <span className="error-memory-card error-memory-card-right" />
              <span className="error-memory-card error-memory-card-missing">?</span>
            </div>
            <span className="eyebrow">MEMORY NOT FOUND</span>
            <h1 id="not-found-title">404 - Page Not Found</h1>
            <p>Looks like this page has wandered off the board. It doesn’t exist, but your next game is just a click away.</p>
            <div className="error-actions">
              <button className="btn primary" onClick={() => nav('home')}>
                <House size={16} /> Back to Home
              </button>
            </div>
          </div>
        </section>
      )}
      {page === 'home' && <>
        <section className="section-block game-modes-block">
          <div className="section-heading">
            <div>
              <span className="eyebrow">YOUR DASHBOARD</span>
              <h2>Choose how you want to play</h2>
              <p className="section-subtext">Pick a mode and get ready to test your memory.</p>
            </div>
          </div>
          <div className="mode-grid">
            <button className="mode-card" onClick={() => { setMode('solo'); nav('setup'); }}>
              <span className="mode-icon lavender"><UserRound size={22} /></span>
              <span className="mode-title">Play Solo</span>
              <span className="mode-description">Beat your best score and sharpen your memory in a solo challenge.</span>
              <span className="mode-footer">Play alone <ChevronRight size={16} /></span>
            </button>
            <button className="mode-card" onClick={() => { setMode('local'); nav('setup'); }}>
              <span className="mode-icon mint"><Users size={22} /></span>
              <span className="mode-title">Play with Friends</span>
              <span className="mode-description">Take turns with 2–4 players locally on one device.</span>
              <span className="mode-footer">Play together <ChevronRight size={16} /></span>
            </button>
            <button
              className="mode-card mode-card-online is-disabled"
              disabled
              aria-disabled="true"
              title="Online Multiplayer is coming soon"
            >
              <span className="mode-icon lavender"><Globe2 size={22} /></span>
              <span className="coming-badge">Coming Soon</span>
              <span className="mode-title">Online Multiplayer</span>
              <span className="mode-description">Create private rooms and challenge friends on their own devices.</span>
              <span className="mode-footer">Unavailable for now</span>
            </button>
          </div>
        </section>

        <section className="quick-stats" aria-label="Player statistics">
          <div className="stat">
            <span className="stat-icon"><Target size={18} /></span>
            <div>
              <small>Games Played</small>
              <strong>{homeStats.gamesPlayed}</strong>
            </div>
          </div>
          <div className="stat">
            <span className="stat-icon"><Trophy size={18} /></span>
            <div>
              <small>Overall Score</small>
              <strong>{homeStats.overallScore.toLocaleString()}</strong>
            </div>
          </div>
          <div className="stat">
            <span className="stat-icon"><Sparkles size={18} /></span>
            <div>
              <small>Pairs Matched</small>
              <strong>{homeStats.pairsMatched.toLocaleString()}</strong>
            </div>
          </div>
        </section>

        <div className="hero-art home-illustration" aria-label="Decorative memory cards">
          <div className="floating-card card-one"><span>◆</span></div>
          <div className="floating-card card-two"><span>●</span></div>
          <div className="floating-card card-three"><span>▲</span></div>
          <div className="art-caption"><span className="caption-dot" /> YOUR NEXT LITTLE WIN</div>
        </div>

        <section className="bottom-strip">
          <div className="strip-icon"><Trophy size={20} /></div>
          <div>
            <strong>Ready to climb the rankings?</strong>
            <p>Your local results are saved on this device. Online rankings can be enabled with Supabase.</p>
          </div>
          <button className="btn text-btn" onClick={() => nav('leaderboard')}>View scores <ChevronRight size={16} /></button>
        </section>
      </>}
      {page === 'setup' && <section className="setup-wrap"><button className="back-link" onClick={() => nav('home')}><ArrowLeft size={16} /> Back home</button><div className="page-title"><span className="eyebrow">MAKE IT YOUR GAME</span><h1>{mode === 'solo' ? 'Solo challenge' : 'Play together'}</h1><p>{mode === 'solo' ? 'Pick a difficulty, choose a theme, and see how sharp your memory is.' : 'Add your players, pick a challenge, and pass the device around.'}</p></div><div className="setup-grid"><div className={`setup-panel ${setupActiveSection === 'difficulty' ? 'expanded' : 'collapsed'}`}><button type="button" className="setup-panel-header" onClick={() => setSetupActiveSection(prev => prev === 'difficulty' ? null : 'difficulty')} aria-expanded={setupActiveSection === 'difficulty'}><div className="panel-heading"><span className="step-number">01</span><div className="panel-heading-text"><h3>Choose difficulty</h3><p className="panel-heading-desc">More pairs means a bigger challenge.</p></div></div><div className="setup-panel-summary"><span className="summary-pill">{difficulty} · {difficulty === 'Easy' ? '4 × 3' : difficulty === 'Normal' ? '4 × 4' : difficulty === 'Medium' ? '6 × 4' : difficulty === 'Hard' ? '6 × 6' : '8 × 6'} · {settings.pairs * 2} cards · {settings.time / 60} min</span></div><span className="expand-chevron" aria-hidden="true"><ChevronDown size={18} style={{ transform: setupActiveSection === 'difficulty' ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} /></span></button><div className={`setup-expandable-content ${setupActiveSection === 'difficulty' ? 'open' : ''}`}><div className="difficulty-list">{Object.entries(DIFFICULTIES).map(([name, value]) => <button key={name} className={difficulty === name ? 'difficulty-option selected' : 'difficulty-option'} onClick={() => { setDifficulty(name); setSetupActiveSection(null); }}><span className="radio-dot" /><span className="difficulty-label"><strong>{name}</strong><small>{value.pairs * 2} cards ({value.pairs} pairs) · {value.time / 60} min</small></span><span className="difficulty-size">{name === 'Easy' ? '4 × 3' : name === 'Normal' ? '4 × 4' : name === 'Medium' ? '6 × 4' : name === 'Hard' ? '6 × 6' : '8 × 6'}</span></button>)}</div></div></div><div className={`setup-panel ${setupActiveSection === 'theme' ? 'expanded' : 'collapsed'}`}><button type="button" className="setup-panel-header" onClick={() => setSetupActiveSection(prev => prev === 'theme' ? null : 'theme')} aria-expanded={setupActiveSection === 'theme'}><div className="panel-heading"><span className="step-number">02</span><div className="panel-heading-text"><h3>Choose a card theme</h3><p className="panel-heading-desc">Just a little personality.</p></div></div><div className="setup-panel-summary"><span className="summary-pill"><span className="pill-theme-preview" style={{ display: 'inline-flex', gap: '3px', marginRight: '6px', opacity: 0.85, verticalAlign: '-2px' }}>{theme === 'Random' ? <Sparkles size={13} /> : theme === 'Symbols' ? <><Circle size={12} /><Triangle size={12} /></> : theme === 'Space' ? <><Rocket size={12} /><Earth size={12} /></> : theme === 'Animals' ? <><Cat size={12} /><PawPrint size={12} /></> : theme === 'Tech' ? <><Laptop size={12} /><Gamepad2 size={12} /></> : <><Coffee size={12} /><Book size={12} /></>}</span>{theme}</span></div><span className="expand-chevron" aria-hidden="true"><ChevronDown size={18} style={{ transform: setupActiveSection === 'theme' ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} /></span></button><div className={`setup-expandable-content ${setupActiveSection === 'theme' ? 'open' : ''}`}><div className="theme-options"><button className={theme === 'Random' ? 'theme-option selected' : 'theme-option'} onClick={() => { setTheme('Random'); setSetupActiveSection(null); }}><span style={{ display: 'flex', gap: '4px', opacity: 0.8 }}><Sparkles size={14} /></span><span>Random</span></button>{Object.keys(THEMES).map((name) => <button key={name} className={theme === name ? 'theme-option selected' : 'theme-option'} onClick={() => { setTheme(name); setSetupActiveSection(null); }}><span style={{ display: 'flex', gap: '4px', opacity: 0.8 }}>{name === 'Symbols' ? <><Circle size={14} /><Triangle size={14} /><Square size={14} /></> : name === 'Space' ? <><Rocket size={14} /><Earth size={14} /><Satellite size={14} /></> : name === 'Animals' ? <><Cat size={14} /><Dog size={14} /><PawPrint size={14} /></> : name === 'Tech' ? <><Laptop size={14} /><Gamepad2 size={14} /><Cpu size={14} /></> : <><Coffee size={14} /><Book size={14} /><Gift size={14} /></>}</span><span>{name}</span></button>)}</div></div></div><div className="setup-panel players-panel"><div className="panel-heading"><span className="step-number">03</span><div><h3>{mode === 'solo' ? 'Your player name' : 'Meet the players'}</h3><p>{mode === 'solo' ? 'Your name appears in your results.' : 'Customize player display names for this match.'}</p></div></div>{mode === 'solo' ? <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}><label className="field-label">Match Display Name<input value={soloPlayerName} maxLength={20} onChange={(e) => setSoloPlayerName(e.target.value)} placeholder="Enter your name" style={{ borderColor: isSoloInvalid ? 'var(--danger)' : undefined }} /></label>{isSoloInvalid && <span style={{ color: 'var(--danger)', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '4px', marginTop: '-4px', marginBottom: '8px' }}><AlertCircle size={13} /> {soloValidationError}</span>}</div> : <><div className="player-count">{[2, 3, 4].map((n) => <button key={n} className={playerCount === n ? 'count-btn selected' : 'count-btn'} onClick={() => setPlayerCount(n)}>{n} players</button>)}</div><div className="player-fields">{Array.from({ length: playerCount }).map((_, i) => { const rawDisp = playerNames[i] || ''; const tDisp = rawDisp.trim(); const nameVal = tDisp ? validatePlayerName(tDisp) : null; const isDispDisallowed = Boolean(nameVal && !nameVal.valid); const lowerList = Array.from({ length: playerCount }).map((__, j) => { const r = (playerNames[j] || '').trim(); return r ? r.toLowerCase() : `player ${j + 1}`; }); const effectiveName = tDisp ? tDisp.toLowerCase() : `player ${i + 1}`; const isDup = lowerList.filter((n) => n === effectiveName).length > 1; const isInvalid = isDup || isDispDisallowed; const errorMessage = isDup ? 'Player names must be unique for this match.' : nameVal?.error; return <div key={i} style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}><label className="field-label">Player {i + 1} Display Name<input maxLength={20} value={rawDisp} onChange={(e) => { const val = e.target.value; setPlayerNames((old) => { const next = [...old]; next[i] = val; return next; }); }} placeholder={`Player ${i + 1}`} style={{ borderColor: isInvalid ? 'var(--danger)' : undefined }} /></label>{isInvalid && <span style={{ color: 'var(--danger)', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '4px', marginTop: '-4px', marginBottom: '8px' }}><AlertCircle size={13} /> {errorMessage}</span>}</div>; })}</div><label className="check-row"><input type="checkbox" checked={turnBased} onChange={(e) => setTurnBased(e.target.checked)} /><span><strong>Matching pair earns another turn</strong><small>Turn passes to the next player after a mismatch.</small></span></label></>}
        <div className="setup-summary">
          {mode === 'solo' ? (
            <>
              <div><span>Board</span><strong>{settings.pairs * 2} cards</strong></div>
              <div><span>Time limit</span><strong>{settings.time / 60} min</strong></div>
              <div><span>Theme</span><strong>{theme}</strong></div>
            </>
          ) : (
            <>
              <div><span>Game mode</span><strong>{playerCount} players</strong></div>
              <div><span>Board</span><strong>{settings.pairs * 2} cards</strong></div>
              <div><span>Difficulty</span><strong>{difficulty}</strong></div>
            </>
          )}
        </div><button className="btn primary full-btn" onClick={() => startGame(mode)}>{mode === 'solo' ? 'Start challenge' : 'Start game'} <ChevronRight size={17} /></button>{mode === 'solo' && <p className="fine-print"><Info size={13} /> No account needed to play locally.</p>}</div></div></section>}

      {page === 'game' && <section className={`game-wrap ${isMultiplayer ? 'multiplayer' : ''}`}><div className="game-top"><button className="back-link" onClick={() => { setRunning(false); nav('home'); }}><ArrowLeft size={16} /> Leave game</button><span className="game-chip">{mode === 'solo' ? 'SOLO CHALLENGE' : 'LOCAL MULTIPLAYER'} · {difficulty.toUpperCase()}</span></div><div className="game-heading"><div><span className="eyebrow">STAY FOCUSED</span><h1>{gameStatus === 'playing' ? 'Find your pairs.' : gameStatus === 'complete' ? 'Nicely done!' : gameStatus === 'timeout' ? 'Time is up.' : 'Ready when you are.'}</h1><p>{gameStatus === 'complete' ? 'Here is how you did this round.' : gameStatus === 'timeout' ? 'Every attempt helps you improve. Give it another go.' : mode === 'solo' ? 'Find all matching pairs with as few moves as possible.' : `${currentName}'s turn — find a pair to score a point.`}</p></div>{gameStatus === 'playing' && <button className="btn secondary small-btn" onClick={handlePauseToggle}>{paused ? <Play size={15} /> : <Pause size={15} />} {paused ? 'Resume' : 'Pause'}</button>}</div>
        {gameStatus !== 'complete' && gameStatus !== 'timeout' && <div className="game-metrics"><div className="metric"><span className="metric-icon"><Clock3 size={17} /></span><div><small>{mode === 'solo' ? 'Elapsed time' : 'Elapsed time'}</small><strong>{formatTime(seconds)}</strong></div></div><div className="metric"><span className="metric-icon"><RotateCcw size={17} /></span><div><small>Moves</small><strong>{moves}</strong></div></div><div className="metric"><span className="metric-icon"><Target size={17} /></span><div><small>Pairs found</small><strong>{matched.length / 2}<em> / {totalPairs}</em></strong></div></div>{mode === 'local' && <div className="metric active-turn"><span className="metric-icon"><Users size={17} /></span><div><small>Current turn</small><strong>{currentName}</strong></div></div>}</div>}
        {mode === 'local' && <div className="scoreboard">{selectedPlayers.map((name, i) => <div key={i} className={activePlayer === i && gameStatus === 'playing' ? 'score-player active' : 'score-player'}><span className="player-avatar">{(name.trim()[0] || '?').toUpperCase()}</span><span className="score-name">{name || `Player ${i + 1}`}</span><strong>{scores[i]}</strong></div>)}</div>}
        {gameStatus === 'playing' && <div className={`card-grid ${settings.pairs >= 18 ? 'dense' : ''} ${settings.pairs >= 24 ? 'extra-dense' : ''}`} style={{ '--columns': gridColumns, '--rows': gridRows, '--card-gap': `${gridGap}px`, '--board-padding': `${gridPadding}px`, '--min-board-height': `${gridRows * 44 + (gridRows - 1) * gridGap + 2 * gridPadding + 2}px`, '--max-board-width': `${maxBoardWidth}px`, '--max-board-height': `${maxBoardHeight}px`, '--max-desktop-board-height': `${maxDesktopBoardHeight}px` }}>{deck.map((card) => { const revealed = flipped.includes(card.id) || matched.includes(card.id); const Icon = card.Icon; return <button key={card.id} className={`memory-card ${revealed ? 'revealed' : ''} ${matched.includes(card.id) ? 'matched' : ''}`} onClick={() => chooseCard(card)} disabled={paused || matched.includes(card.id) || flipped.length >= 2 || flipped.includes(card.id)} aria-label={revealed ? `Card ${card.pair + 1}${matched.includes(card.id) ? ', matched' : ''}` : 'Hidden card'}><span className="card-back" aria-hidden="true"><span className="card-mark"><Brain size="100%" strokeWidth={1.8} /></span></span><span className="card-front" aria-hidden="true"><Icon className="card-icon" size="50%" strokeWidth={1.8} /></span></button>; })}</div>}
        {paused && <div className="pause-overlay"><div className="pause-card"><span className="mode-icon lavender"><Pause size={22} /></span><h2>Take a breather.</h2><p>Your solo timer is paused. Come back when you're ready.</p><button className="btn primary" onClick={handlePauseToggle}><Play size={16} /> Resume game</button></div></div>}
        {(gameStatus === 'complete' || gameStatus === 'timeout') && <div className="results-panel"><div className="result-icon">{gameStatus === 'complete' ? <Trophy size={25} /> : <Clock3 size={25} />}</div><span className="eyebrow">ROUND SUMMARY</span><h2>{gameStatus === 'complete' ? (mode === 'local' ? `${(frozenMatchSlots.current && frozenMatchSlots.current[scores.indexOf(Math.max(...scores))]) || selectedPlayers[scores.indexOf(Math.max(...scores))] || 'Player'} wins!` : 'You did it!') : 'Keep practising.'}</h2><p>{gameStatus === 'complete' ? 'Nice focus. Here are your results.' : 'You can restart and try to beat the timer.'}</p><div className="result-stats"><div><small>Score</small><strong>{mode === 'local' ? Math.max(...scores) * 100 : Math.max(0, Math.round((matched.length / 2) * 100 * settings.multiplier - moves * 5 - seconds))}</strong></div><div><small>Moves</small><strong>{moves}</strong></div><div><small>Time</small><strong>{formatTime(seconds)}</strong></div><div><small>Accuracy</small><strong>{accuracy}%</strong></div></div><div className="result-actions"><button className="btn primary" onClick={() => startGame(mode)}><RotateCcw size={16} /> Play again</button><button className="btn secondary" onClick={() => { if (mode === 'solo') { nav('leaderboard', { mode: 'solo', difficulty }); } else { nav('leaderboard', { mode: 'multiplayer' }); } }}><Trophy size={16} /> Leaderboard</button><button className="btn secondary" onClick={() => nav('home')}>Home</button></div></div>}
        {gameStatus === 'playing' && <div className="game-tools">{mode === 'solo' && <button className="btn secondary small-btn" onClick={useHint} disabled={hintUsed}><Sparkles size={15} /> {hintUsed ? 'Hint used' : 'Use a hint'}</button>}<span>Matched cards stay visible. Take your time.</span><button className="icon-btn sound-toggle" title={sound ? 'Mute sound' : 'Enable sound'} aria-label={sound ? 'Mute sound' : 'Enable sound'} onClick={() => setSound((v) => !v)}>{sound ? <Volume2 size={17} aria-hidden="true" /> : <VolumeX size={17} aria-hidden="true" />}</button></div>}
      </section>}

      {page === 'leaderboard' && <section className="content-page">
        <button className="back-link" onClick={() => nav('home')}><ArrowLeft size={16} /> Back home</button>
        <div className="page-title"><span className="eyebrow">A LITTLE FRIENDLY COMPETITION</span><h1>Leaderboard</h1><p>Your best local results, collected on this device.</p></div>
        <div className="leaderboard-card">
          <div className="leaderboard-head">
            <div>
              <div className="leaderboard-mode-tabs">
                <button className={`count-btn ${leaderboardMode === 'overall' ? 'selected' : ''}`} onClick={() => setLeaderboardMode('overall')}>Overall</button>
                <button className={`count-btn ${leaderboardMode === 'solo' ? 'selected' : ''}`} onClick={() => setLeaderboardMode('solo')}>Solo</button>
                <button className={`count-btn ${leaderboardMode === 'multiplayer' ? 'selected' : ''}`} onClick={() => setLeaderboardMode('multiplayer')}>Multiplayer</button>
              </div>
              <p>{leaderboardMode === 'overall' ? 'Combined solo and multiplayer results · Local device' : leaderboardMode === 'solo' ? 'Top solo score per player · Filter by difficulty' : multiplayerView === 'top_players' ? 'Player rankings across all multiplayer games · Local device' : 'Full match history and participant breakdowns · Local device'}</p>
            </div>
            <span className="local-badge"><BarChart3 size={14} /> Local results</span>
          </div>
          {leaderboardMode === 'solo' && <div className="leaderboard-filters" style={{ display: 'flex', gap: '12px', padding: '14px', flexWrap: 'wrap', borderBottom: '1px solid var(--line)', alignItems: 'center', justifyContent: 'space-between' }}><div style={{ display: 'flex', gap: '8px' }}>{['Easy', 'Normal', 'Medium', 'Hard', 'Extreme'].map((f) => (<button key={f} className={`count-btn ${leaderboardFilter === f ? 'selected' : ''}`} onClick={() => setLeaderboardFilter(f)} style={{ padding: '6px 12px', fontSize: '11px', flex: '0 0 auto', width: 'auto' }}>{f}</button>))}</div><span style={{ fontSize: '12px', color: 'var(--muted)' }}>Showing {leaderboardFilter} difficulty</span></div>}
          {leaderboardMode === 'multiplayer' && <div className="leaderboard-filters" style={{ display: 'flex', gap: '12px', padding: '14px 20px', flexWrap: 'wrap', borderBottom: '1px solid var(--line)', alignItems: 'center', justifyContent: 'space-between' }}><div style={{ display: 'flex', gap: '8px' }}><button className={`count-btn ${multiplayerView === 'top_players' ? 'selected' : ''}`} onClick={() => setMultiplayerView('top_players')} style={{ padding: '6px 14px', fontSize: '11px', flex: '0 0 auto', width: 'auto' }}><Trophy size={13} style={{ marginRight: '5px', verticalAlign: '-2px' }} />Top Players</button><button className={`count-btn ${multiplayerView === 'recent_matches' ? 'selected' : ''}`} onClick={() => setMultiplayerView('recent_matches')} style={{ padding: '6px 14px', fontSize: '11px', flex: '0 0 auto', width: 'auto' }}><Users size={13} style={{ marginRight: '5px', verticalAlign: '-2px' }} />Recent Matches</button></div><span style={{ fontSize: '12px', color: 'var(--muted)' }}>{multiplayerView === 'top_players' ? `${multiTopPlayers.length} ranked player${multiTopPlayers.length === 1 ? '' : 's'}` : `${multiMatches.length} completed match${multiMatches.length === 1 ? '' : 'es'}`}</span></div>}
          {leaderboardMode === 'overall' && (
            <>
              <div className="overall-section-heading"><Trophy size={16} /><h2>Top Players</h2><span>{overallTopPlayers.length} ranked entries</span></div>
              {overallTopPlayers.length ? (
                <div className="leaderboard-list overall-leaderboard-list">
                  <div className="leader-row overall-top-row table-header">
                    <span>Rank</span><span>Player</span><span>Difficulty</span><span>Total Score</span><span>Games</span><span>MP Wins</span>
                  </div>
                  {overallTopPlayers.map((row) => (
                    <div className="leader-row overall-top-row" key={`${row.name.toLowerCase()}-${row.difficulty}`}>
                      <span className="rank-cell">{renderRankBadge(row.displayRank)}</span>
                      <span className="leader-player-clean" title={row.name}><span className="player-display-name">{row.name}</span></span>
                      <span><span className="difficulty-pill">{row.difficulty}</span></span>
                      <strong>{row.totalScore.toLocaleString()}</strong>
                      <span className="overall-number">{row.gamesPlayed}</span>
                      <span className={`overall-number ${row.wins ? 'overall-win-count' : ''}`}>{row.wins}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="empty-state overall-empty-state"><span className="empty-icon"><Trophy size={24} /></span><h3>No match records yet</h3><p>Play a solo or multiplayer game to appear on the overall leaderboard.</p><button className="btn primary" onClick={() => nav('setup')}>Start a game</button></div>
              )}
            </>
          )}
      {leaderboardMode === 'solo' && (
        bests.length ? (
          <div className="leaderboard-list">
            <div className="leader-row solo-row table-header">
              <span>Rank</span>
              <span>Player</span>
              <span style={{ whiteSpace: 'nowrap', textAlign: 'right' }}>Best Score</span>
              <span style={{ textAlign: 'center' }}>Details</span>
            </div>
            {bests.map((row, i) => {
              const acc = row.moves ? Math.round((row.completedPairs / row.moves) * 100) : 0;
              const totalPairs = (DIFFICULTIES[row.difficulty] || DIFFICULTIES[leaderboardFilter] || { pairs: 6 }).pairs;
              const isExpanded = expandedPlayer === `solo-${row.name || i}`;
              return (
                <React.Fragment key={row.name || (row.id || `${row.date}-${i}`)}>
                  <div
                    className="leader-row solo-row"
                    style={{ cursor: 'pointer' }}
                    onClick={() => setExpandedPlayer(isExpanded ? null : `solo-${row.name || i}`)}
                  >
                    <span className="rank-cell">{renderRankBadge(i + 1)}</span>
                    <span className="leader-player-clean" title={row.name}>
                      <span className="player-display-name">{row.name || 'Player'}</span>
                    </span>
                    <strong style={{ textAlign: 'right' }}>{row.score.toLocaleString()}</strong>
                    <span style={{ textAlign: 'center', display: 'flex', justifyContent: 'center' }}>
                      <button
                        type="button"
                        className="row-toggle-btn"
                        aria-label={isExpanded ? `Hide statistics for ${row.name || 'Player'}` : `View statistics for ${row.name || 'Player'}`}
                        onClick={(e) => {
                          e.stopPropagation();
                          setExpandedPlayer(isExpanded ? null : `solo-${row.name || i}`);
                        }}
                      >
                        {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                      </button>
                    </span>
                  </div>
                  {isExpanded && (
                    <div className="player-expanded-panel solo-expanded-panel">
                      <div className="expanded-stat">
                        <small>Completion Time</small>
                        <strong>{row.seconds ? formatTime(row.seconds) : '—'}</strong>
                      </div>
                      <div className="expanded-stat">
                        <small>Total Moves</small>
                        <strong>{row.moves || 0}</strong>
                      </div>
                      <div className="expanded-stat">
                        <small>Pairs Matched</small>
                        <strong>{row.completedPairs != null ? row.completedPairs : totalPairs} / {totalPairs}</strong>
                      </div>
                      <div className="expanded-stat">
                        <small>Accuracy</small>
                        <strong>{acc}%</strong>
                      </div>
                    </div>
                  )}
                </React.Fragment>
              );
            })}
          </div>
        ) : (
          <div className="empty-state">
            <span className="empty-icon"><Trophy size={24} /></span>
            <h3>No solo scores for {leaderboardFilter}</h3>
            <p>Complete a solo game on {leaderboardFilter} difficulty to appear on this board.</p>
            <button className="btn primary" onClick={() => nav('setup')}>Play {leaderboardFilter}</button>
          </div>
        )
      )}
      {leaderboardMode === 'multiplayer' && multiplayerView === 'top_players' && (
        multiTopPlayers.length ? (
          <div className="leaderboard-list">
            <div className="leader-row multi-top-row table-header">
              <span>Rank</span>
              <span>Player</span>
              <span style={{ whiteSpace: 'nowrap', textAlign: 'right' }}>Total Score</span>
              <span style={{ textAlign: 'right' }}>Games</span>
              <span style={{ textAlign: 'right' }}>MP Wins</span>
              <span style={{ textAlign: 'center' }}>Details</span>
            </div>
            {multiTopPlayers.map((row, i) => {
              const acc = row.moves ? Math.round((row.completedPairs / row.moves) * 100) : 0;
              const isExpanded = expandedPlayer === `multi-${row.name || i}`;
              return (
                <React.Fragment key={row.name || i}>
                  <div
                    className="leader-row multi-top-row"
                    style={{ cursor: 'pointer' }}
                    onClick={() => setExpandedPlayer(isExpanded ? null : `multi-${row.name || i}`)}
                  >
                    <span className="rank-cell">{renderRankBadge(row.displayRank ?? (i + 1))}</span>
                    <span className="leader-player-clean" title={row.name}>
                      <span className="player-display-name">{row.name || 'Player'}</span>
                    </span>
                    <strong style={{ textAlign: 'right' }}>{row.totalScore.toLocaleString()}</strong>
                    <span style={{ textAlign: 'right' }}>{row.gamesPlayed}</span>
                    <span style={{ textAlign: 'right', fontWeight: 600, color: row.wins > 0 ? 'var(--green)' : 'inherit' }}>
                      {row.wins}
                    </span>
                    <span style={{ textAlign: 'center', display: 'flex', justifyContent: 'center' }}>
                      <button
                        type="button"
                        className="row-toggle-btn"
                        aria-label={isExpanded ? `Hide statistics for ${row.name || 'Player'}` : `View statistics for ${row.name || 'Player'}`}
                        onClick={(e) => {
                          e.stopPropagation();
                          setExpandedPlayer(isExpanded ? null : `multi-${row.name || i}`);
                        }}
                      >
                        {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                      </button>
                    </span>
                  </div>
                  {isExpanded && (
                    <div className="player-expanded-panel multi-expanded-panel">
                      <div className="expanded-stat">
                        <small>Pairs Matched</small>
                        <strong>{row.completedPairs.toLocaleString()}</strong>
                      </div>
                      <div className="expanded-stat">
                        <small>Total Moves</small>
                        <strong>{row.moves.toLocaleString()}</strong>
                      </div>
                      <div className="expanded-stat">
                        <small>Accuracy</small>
                        <strong>{acc}%</strong>
                      </div>
                    </div>
                  )}
                </React.Fragment>
              );
            })}
          </div>
        ) : (
          <div className="empty-state">
            <span className="empty-icon"><Trophy size={24} /></span>
            <h3>No multiplayer records yet</h3>
            <p>Gather some friends and play local multiplayer on this device to see rankings.</p>
            <button className="btn primary" onClick={() => nav('setup')}>Start multiplayer game</button>
          </div>
        )
      )}

      {leaderboardMode === 'multiplayer' && multiplayerView === 'recent_matches' && (
        multiMatches.length ? (
          <div className="multi-matches-container">
            <div className="match-cards-grid">
              {multiMatches.map((match, mIdx, arr) => (
                <div key={match.id} className="match-card">
                  <div className="match-card-top">
                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                      <span className="match-number-tag">Match {arr.length - mIdx}</span>
                      {match.difficulty ? <span className="difficulty-pill">{match.difficulty}</span> : null}
                    </div>
                    <span className="match-date-tag">
                      {match.date ? new Date(match.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }) : '—'}
                    </span>
                  </div>
                  <div className="match-player-table">
                    <div className="match-table-head">
                      <span>Player</span>
                      <span style={{ textAlign: 'right' }}>Score</span>
                      <span style={{ textAlign: 'right' }}>Moves</span>
                      <span style={{ textAlign: 'center' }}>Result</span>
                    </div>
                    {match.records.map((row, rIdx) => {
                      const rank = row.calculatedRank ?? (rIdx + 1);
                      const hasWinnerTie = match.records.filter(r => (r.calculatedRank ?? 1) === 1).length > 1;
                      const isWin = rank === 1 && !hasWinnerTie;
                      const isDraw = rank === 1 && hasWinnerTie;
                      return (
                        <div className={`match-table-row ${isWin ? 'is-winner' : ''}`} key={row.id || `${match.id}-${rIdx}`}>
                          <span className="match-player-name">{row.name || 'Player'}</span>
                          <span className="match-player-score">{(row.score ?? 0).toLocaleString()}</span>
                          <span className="match-player-moves">{row.moves ?? '—'}</span>
                          <span className="match-player-result">
                            {isWin && (
                              <span className="result-pill winner">
                                <Trophy size={11} strokeWidth={2.4} aria-hidden="true" /> Winner
                              </span>
                            )}
                            {isDraw && (
                              <span className="result-pill draw">Draw</span>
                            )}
                            {!isWin && !isDraw && rank === 2 && (
                              <span className="result-pill second">2nd</span>
                            )}
                            {!isWin && !isDraw && rank === 3 && (
                              <span className="result-pill third">3rd</span>
                            )}
                            {!isWin && !isDraw && rank === 4 && (
                              <span className="result-pill fourth">4th</span>
                            )}
                            {!isWin && !isDraw && rank > 4 && (
                              <span className="result-pill neutral">{rank}th</span>
                            )}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="empty-state">
            <span className="empty-icon"><Users size={24} /></span>
            <h3>No completed matches yet</h3>
            <p>Play a multiplayer game with friends to record match history.</p>
            <button className="btn primary" onClick={() => nav('setup')}>Start multiplayer game</button>
          </div>
        )
      )}
      <div className="leaderboard-note"><Info size={15} /><p>This is a local leaderboard stored in this browser. A shared global leaderboard requires the Supabase backend to be configured.</p></div></div></section>}
      {page === 'history' && <section className="content-page"><button className="back-link" onClick={() => nav('home')}><ArrowLeft size={16} /> Back home</button><div className="page-title"><span className="eyebrow">YOUR PAST ROUNDS</span><h1>Solo Game History</h1><p>All recorded solo games saved on this device.</p></div><div className="leaderboard-card"><div className="leaderboard-head"><div><p>All recorded solo games · Local device</p></div><span className="local-badge"><Clock3 size={14} /> Game history</span></div><div className="leaderboard-filters" style={{ display: 'flex', gap: '12px', padding: '14px', flexWrap: 'wrap', borderBottom: '1px solid var(--line)', alignItems: 'center', justifyContent: 'space-between' }}><div className="history-filter-controls" style={{ display: 'flex', gap: '8px' }}><select aria-label="Filter by difficulty" className="history-difficulty-select" value={historyFilter} onChange={(e) => setHistoryFilter(e.target.value)} style={{ fontSize: '11px', padding: '6px', borderRadius: '6px', border: '1px solid var(--line)', background: 'var(--surface-2)', color: 'var(--text)' }}>{Object.keys(DIFFICULTIES).map((f) => <option key={f} value={f}>{f}</option>)}</select><select value={historyPlayerFilter} onChange={(e) => setHistoryPlayerFilter(e.target.value)} style={{ fontSize: '11px', padding: '6px', borderRadius: '6px', border: '1px solid var(--line)', background: 'var(--surface-2)', color: 'var(--text)' }}><option value="">All players</option>{allPlayers.map(p => <option key={p} value={p}>{p}</option>)}</select><select value={historySort} onChange={(e) => setHistorySort(e.target.value)} style={{ fontSize: '11px', padding: '6px', borderRadius: '6px', border: '1px solid var(--line)', background: 'var(--surface-2)', color: 'var(--text)' }}><option value="newest">Newest first</option><option value="score">Highest score</option><option value="time">Fastest time</option></select></div></div>{historyList.filter(r => r.mode === 'solo').length ? <div className="leaderboard-list"><div className="leader-row table-header history-row"><span>No.</span><span>Player</span><span className="history-col-diff">Diff</span><span style={{ textAlign: 'right' }}>Score</span><span style={{ textAlign: 'right' }}>Time</span><span style={{ textAlign: 'right' }}>Moves</span><span className="history-col-acc" style={{ textAlign: 'right' }}>Acc.</span><span style={{ whiteSpace: 'nowrap', textAlign: 'right' }}>Date</span></div>{historyList.filter(r => r.mode === 'solo').slice(0, 100).map((row, i) => { const acc = row.moves ? Math.round((row.completedPairs / row.moves) * 100) : 0; return <div className="leader-row history-row" key={row.id || `${row.date}-${i}`}><span className="rank">{String(i + 1).padStart(2, '0')}</span><span className="leader-player" title="Solo"><span className="player-avatar">{(row.name || 'P')[0].toUpperCase()}</span>{row.name || 'Player'}</span><span className="history-col-diff">{row.difficulty}</span><strong style={{ textAlign: 'right' }}>{row.score.toLocaleString()}</strong><span style={{ textAlign: 'right' }}>{row.seconds ? formatTime(row.seconds) : '—'}</span><span style={{ textAlign: 'right' }}>{row.moves || 0}</span><span className="history-col-acc" style={{ textAlign: 'right' }}>{acc}%</span><span style={{ whiteSpace: 'nowrap', textAlign: 'right' }}>{row.date ? new Date(row.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }) : '—'}</span></div>; })}</div> : <div className="empty-state"><span className="empty-icon"><Clock3 size={24} /></span><h3>No games yet</h3><p>Complete a solo round and your results will show up here.</p><button className="btn primary" onClick={() => nav('setup')}>Start a game</button></div>}<div className="leaderboard-note"><Info size={15} /><p>Your game history is stored locally in this browser.</p></div></div></section>}
      {page === 'multiplayer_history' && <section className="content-page"><button className="back-link" onClick={() => nav('home')}><ArrowLeft size={16} /> Back home</button><div className="page-title"><span className="eyebrow">YOUR PAST ROUNDS</span><h1>Multiplayer History</h1><p>All recorded multiplayer matches on this device.</p></div><div className="leaderboard-card"><div className="leaderboard-head"><div><p>All recorded multiplayer games · Local device</p></div><span className="local-badge"><Users size={14} /> Match history</span></div><div className="leaderboard-filters" style={{ display: 'flex', gap: '12px', padding: '14px', flexWrap: 'wrap', borderBottom: '1px solid var(--line)', alignItems: 'center', justifyContent: 'space-between' }}><div className="history-filter-controls" style={{ display: 'flex', gap: '8px' }}><select aria-label="Filter by difficulty" className="history-difficulty-select" value={historyFilter} onChange={(e) => setHistoryFilter(e.target.value)} style={{ fontSize: '11px', padding: '6px', borderRadius: '6px', border: '1px solid var(--line)', background: 'var(--surface-2)', color: 'var(--text)' }}>{Object.keys(DIFFICULTIES).map((f) => <option key={f} value={f}>{f}</option>)}</select><select value={historyPlayerFilter} onChange={(e) => setHistoryPlayerFilter(e.target.value)} style={{ fontSize: '11px', padding: '6px', borderRadius: '6px', border: '1px solid var(--line)', background: 'var(--surface-2)', color: 'var(--text)' }}><option value="">All players</option>{allPlayers.map(p => <option key={p} value={p}>{p}</option>)}</select><select value={historySort} onChange={(e) => setHistorySort(e.target.value)} style={{ fontSize: '11px', padding: '6px', borderRadius: '6px', border: '1px solid var(--line)', background: 'var(--surface-2)', color: 'var(--text)' }}><option value="newest">Newest first</option><option value="score">Highest score</option><option value="time">Fastest time</option></select></div></div>{historyList.filter(r => r.mode !== 'solo').length ? <div className="match-list" style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '16px' }}>{(() => {
        const multiRecords = historyList.filter(r => r.mode !== 'solo').slice(0, 100);
        const groups = new window.Map();
        multiRecords.forEach(r => {
          const k = r.sessionId || `legacy-${r.date}`;
          if (!groups.has(k)) groups.set(k, { id: k, date: r.date, difficulty: r.difficulty, records: [] });
          groups.get(k).records.push(r);
        });
        return Array.from(groups.values()).map((match, mIdx, arr) => (
          <div key={match.id} className="match-card" style={{ background: 'var(--surface)', borderRadius: '12px', border: '1px solid var(--line)', overflow: 'hidden' }}>
            <div className="match-head" style={{ padding: '14px 18px', borderBottom: '1px solid var(--line)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--surface-2)' }}>
              <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                <strong style={{ fontSize: '13px', color: 'var(--text)' }}>Match {arr.length - mIdx}</strong>
                <span className="local-badge" style={{ fontSize: '10px', padding: '3px 8px', background: 'var(--surface)', border: '1px solid var(--line)', margin: 0 }}>{match.difficulty}</span>
              </div>
              <span style={{ fontSize: '12px', color: 'var(--muted)', fontWeight: 500 }}>{match.date ? new Date(match.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }) : '—'}</span>
            </div>
            <div className="leaderboard-list">
              <div className="leader-row match-row table-header" style={{ borderBottom: '1px solid var(--line)', opacity: 0.8 }}>
                <span>Player</span>
                <span style={{ textAlign: 'right' }}>Score</span>
                <span>Result</span>
                <span style={{ textAlign: 'right' }}>Moves</span>
                <span style={{ textAlign: 'right' }}>Acc.</span>
              </div>
              {match.records.map((row, i) => {
                const acc = row.moves ? Math.round((row.completedPairs / row.moves) * 100) : 0;
                return <div className="leader-row match-row" key={row.id || i} style={{ borderBottom: i < match.records.length - 1 ? '1px solid var(--line)' : 'none' }}>
                  <span className="leader-player" title="Local Multiplayer">
                    <span className="player-avatar">{(row.name || 'P')[0].toUpperCase()}</span>
                    {row.name || 'Player'}
                  </span>
                  <strong style={{ fontSize: '13px', color: 'var(--text)', textAlign: 'right' }}>{row.score.toLocaleString()}</strong>
                  <span style={{ color: row.matchResult === 'winner' ? 'var(--green)' : row.matchResult === 'tie' ? 'inherit' : 'var(--muted)', textTransform: 'capitalize', display: 'flex', gap: '5px', alignItems: 'center', fontWeight: row.matchResult === 'winner' ? 600 : 500 }}>
                    {row.matchResult === 'winner' && <Trophy size={13} strokeWidth={2.5} />}
                    {row.matchResult === 'winner' ? 'Winner' : row.matchResult === 'tie' ? 'Draw' : row.matchResult === 'loser' ? 'Loser' : '—'}
                  </span>
                  <span style={{ textAlign: 'right' }}>{row.moves || 0}</span>
                  <span style={{ textAlign: 'right' }}>{acc}%</span>
                </div>;
              })}
            </div>
          </div>
        ));
      })()}</div> : <div className="empty-state"><span className="empty-icon"><Users size={24} /></span><h3>No matches yet</h3><p>Complete a multiplayer match and your results will show up here.</p><button className="btn primary" onClick={() => nav('setup')}>Start a game</button></div>}<div className="leaderboard-note"><Info size={15} /><p>Your game history is stored locally in this browser.</p></div></div></section>}
      {page === 'profile' && (() => {
        const stats = calculatePlayerStats(persisted.history, profileName, persisted);
        const {
          gamesPlayed: totalGamesPlayed,
          pairsMatched: totalPairsMatched,
          overallScore: totalOverallScore,
          multiplayerWins: playerMultiWins,
          bestScoreRecord,
          fastestRecord,
          fewestMovesRecord
        } = stats;

        return (
          <section className="content-page focus-page">
            <button className="back-link" onClick={() => nav('home')}>
              <ArrowLeft size={16} /> Back home
            </button>
            <div className="page-title">
              <span className="eyebrow">YOUR PROGRESS</span>
              <h1>Player profile</h1>
              <p>Your stats and personal records on this device.</p>
            </div>

            <div className="profile-dashboard">
              {/* Profile Header */}
              <div className="profile-header-card">
                <div className="profile-identity">
                  <div className="profile-avatar">
                    {((isEditingName ? editNameInput : profileName).trim()[0] || 'P').toUpperCase()}
                  </div>
                  <div className="profile-user-info">
                    <div className="profile-name-row">
                      <h2>{profileName || 'Player'}</h2>
                      {!isEditingName && (
                        <button
                          type="button"
                          className="profile-edit-btn"
                          onClick={() => {
                            setEditNameInput(profileName);
                            setProfileNameError('');
                            setIsEditingName(true);
                          }}
                          aria-label="Edit profile name"
                        >
                          <Pencil size={13} />
                          <span>Edit name</span>
                        </button>
                      )}
                    </div>
                    <p className="profile-subtitle">FlipMate Player</p>
                  </div>
                </div>

                {isEditingName ? (
                  <form
                    className="profile-edit-form"
                    onSubmit={(e) => {
                      e.preventDefault();
                      const trimmed = editNameInput.trim();
                      const validation = validatePlayerName(trimmed);
                      if (!validation.valid) {
                        setProfileNameError(validation.error);
                        return;
                      }
                      setProfileNameError('');
                      const finalName = trimmed;
                      setProfileName(finalName);
                      const updated = {
                        ...persisted,
                        displayName: finalName
                      };
                      setPersisted(updated);
                      saveStore({
                        ...updated,
                        dark,
                        sound,
                        displayName: finalName
                      });
                      setIsEditingName(false);
                      toast('Profile name updated.');
                    }}
                  >
                    <div className="profile-input-group">
                      <input
                        value={editNameInput}
                        maxLength={20}
                        autoFocus
                        onChange={(e) => {
                          setEditNameInput(e.target.value);
                          if (profileNameError) setProfileNameError('');
                        }}
                        placeholder="Enter profile name"
                        aria-label="Profile name"
                        style={{ borderColor: profileNameError ? 'var(--danger)' : undefined }}
                      />
                      <div className="profile-form-actions">
                        <button type="submit" className="btn primary small-btn">
                          <Check size={13} /> Save
                        </button>
                        <button
                          type="button"
                          className="btn secondary small-btn"
                          onClick={() => {
                            setEditNameInput(profileName);
                            setProfileNameError('');
                            setIsEditingName(false);
                          }}
                        >
                          <X size={13} /> Cancel
                        </button>
                      </div>
                    </div>
                    {profileNameError && (
                      <span style={{ color: 'var(--danger)', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '4px', marginTop: '6px' }}>
                        <AlertCircle size={13} /> {profileNameError}
                      </span>
                    )}
                    <span className="profile-input-hint">Your profile owner name on this device (up to 20 characters).</span>
                  </form>
                ) : null}
              </div>

              {/* 4 Statistics Cards */}
              <div className="profile-stats-grid">
                <div className="profile-stat-box">
                  <small>Games Played</small>
                  <strong>{totalGamesPlayed}</strong>
                </div>
                <div className="profile-stat-box">
                  <small>Total Pairs Matched</small>
                  <strong>{totalPairsMatched}</strong>
                </div>
                <div className="profile-stat-box">
                  <small>Overall Score</small>
                  <strong>{totalOverallScore.toLocaleString()}</strong>
                </div>
                <div className="profile-stat-box">
                  <small>Multiplayer Wins</small>
                  <strong>{playerMultiWins}</strong>
                </div>
              </div>

              {/* Personal Records */}
              <div className="profile-sections-grid">
                <div className="profile-panel">
                  <div className="profile-panel-head">
                    <Trophy size={16} className="panel-icon" />
                    <h3>Personal Records</h3>
                  </div>
                  <div className="records-list">
                    <div className="record-item">
                      <div className="record-label-group">
                        <span className="record-name">Best Solo Score</span>
                        {bestScoreRecord?.difficulty && (
                          <span className="record-diff">{bestScoreRecord.difficulty}</span>
                        )}
                      </div>
                      <strong className="record-value">
                        {bestScoreRecord ? bestScoreRecord.score.toLocaleString() : '—'}
                      </strong>
                    </div>
                    <div className="record-item">
                      <div className="record-label-group">
                        <span className="record-name">Fastest Completion</span>
                        {fastestRecord?.difficulty && (
                          <span className="record-diff">{fastestRecord.difficulty}</span>
                        )}
                      </div>
                      <strong className="record-value">
                        {fastestRecord ? formatTime(fastestRecord.seconds) : '—'}
                      </strong>
                    </div>
                    <div className="record-item">
                      <div className="record-label-group">
                        <span className="record-name">Fewest Moves</span>
                        {fewestMovesRecord?.difficulty && (
                          <span className="record-diff">{fewestMovesRecord.difficulty}</span>
                        )}
                      </div>
                      <strong className="record-value">
                        {fewestMovesRecord ? fewestMovesRecord.moves : '—'}
                      </strong>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </section>
        );
      })()}

      {page === 'settings' && (
        <section className="content-page focus-page">
          <div className="settings-container">
            <button className="back-link" onClick={() => nav('home')}>
              <ArrowLeft size={16} /> Back home
            </button>
            <div className="page-title">
              <span className="eyebrow">MAKE IT COMFORTABLE</span>
              <h1>Settings</h1>
              <p>Customize your experience and manage saved preferences.</p>
            </div>
            <div className="settings-card">
            <div className="setting-row">
              <span className="setting-icon">
                {dark ? <Moon size={18} /> : <Sun size={18} />}
              </span>
              <div className="setting-copy">
                <strong>Appearance</strong>
                <small>Choose light or dark theme.</small>
              </div>
              <button
                className="toggle-pill"
                onClick={() => setDark((v) => !v)}
                aria-label={`Switch to ${dark ? 'Light' : 'Dark'} theme`}
              >
                {dark ? 'Dark' : 'Light'}
                <span className={dark ? 'toggle-knob on' : 'toggle-knob'} />
              </button>
            </div>
            <div className="setting-row">
              <span className="setting-icon">
                {sound ? <Volume2 size={18} /> : <VolumeX size={18} />}
              </span>
              <div className="setting-copy">
                <strong>Sound effects</strong>
                <small>Play subtle audio cues when finding a match.</small>
              </div>
              <button
                className={sound ? 'switch on' : 'switch'}
                aria-label="Toggle sound"
                onClick={() => setSound((v) => !v)}
              >
                <span />
              </button>
            </div>
            <div className="setting-row setting-row-action">
              <span className="setting-icon">
                <BarChart3 size={18} />
              </span>
              <div className="setting-copy">
                <strong>Local data</strong>
                <small>Manage local game history, best records, and saved scores.</small>
              </div>
              <button
                type="button"
                className="btn danger-btn"
                onClick={() => setShowClearConfirm(true)}
              >
                <Trash2 size={13} aria-hidden="true" /> Clear data
              </button>
            </div>
            <div className="settings-foot">
              <Info size={14} />
              <p>FlipMate stores records locally. Online rooms and cross-device sync will be enabled once backend integration is connected.</p>
            </div>
          </div>
        </div>

          {showClearConfirm && (
            <div className="modal-backdrop" onClick={() => setShowClearConfirm(false)}>
              <div
                className="confirm-modal"
                onClick={(e) => e.stopPropagation()}
                role="dialog"
                aria-modal="true"
                aria-labelledby="clear-modal-title"
              >
                <div className="confirm-modal-header">
                  <span className="confirm-modal-icon">
                    <Trash2 size={20} />
                  </span>
                  <div>
                    <h3 id="clear-modal-title">Clear local game data?</h3>
                    <p className="confirm-modal-subtitle">This action cannot be undone.</p>
                  </div>
                </div>
                <div className="confirm-modal-body">
                  <p>The following information saved on this browser will be permanently deleted:</p>
                  <ul className="confirm-delete-list">
                    <li>Solo and multiplayer match history</li>
                    <li>Personal records and best scores</li>
                    <li>Lifetime stats (games played, pairs matched)</li>
                  </ul>
                  <p className="confirm-preserve-note">
                    Your display name and sound/theme preferences will be kept.
                  </p>
                </div>
                <div className="confirm-modal-actions">
                  <button
                    type="button"
                    className="btn secondary small-btn"
                    onClick={() => setShowClearConfirm(false)}
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    className="btn danger-solid-btn small-btn"
                    onClick={() => {
                      const clean = {
                        profileId: currentProfileId,
                        displayName: profileName,
                        hasProfile: true,
                        lastSoloName: soloPlayerName
                      };
                      setPersisted(clean);
                      saveStore({ ...clean, dark, sound });
                      setShowClearConfirm(false);
                      toast('Local game data cleared.');
                    }}
                  >
                    Yes, clear data
                  </button>
                </div>
              </div>
            </div>
          )}
        </section>
      )}

      {page === 'online' && <section className="content-page"><button className="back-link" onClick={() => nav('home')}><ArrowLeft size={16} /> Back home</button><div className="page-title" style={{ textAlign: 'center', margin: '40px 0 20px' }}><span className="local-badge" style={{ display: 'inline-block', marginBottom: '16px', background: 'var(--surface-2)', border: '1px solid var(--line)' }}><Sparkles size={14} /> COMING SOON</span><h1 style={{ marginBottom: '12px' }}>Online Multiplayer</h1><p style={{ maxWidth: '400px', margin: '0 auto', fontSize: '15px' }}>Play FlipMate with friends, wherever they are.</p></div><div className="settings-card" style={{ maxWidth: '500px', margin: '0 auto', textAlign: 'center', padding: '40px 20px' }}><div className="mode-icon peach" style={{ width: '60px', height: '60px', margin: '0 auto 24px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Globe2 size={32} /></div><p style={{ color: 'var(--muted)', lineHeight: '1.6', marginBottom: '32px', maxWidth: '400px', margin: '0 auto' }}>We're working on online multiplayer, including private rooms, friend invitations, and real-time matches. Stay tuned for updates.</p><div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px', textAlign: 'left', marginBottom: '32px' }}><div style={{ display: 'flex', alignItems: 'center', gap: '12px', background: 'var(--surface-2)', padding: '12px 16px', borderRadius: '12px', border: '1px solid var(--line)' }}><Lock size={18} style={{ color: 'var(--text)' }} /><span style={{ fontSize: '13px', fontWeight: 500 }}>Private Rooms</span></div><div style={{ display: 'flex', alignItems: 'center', gap: '12px', background: 'var(--surface-2)', padding: '12px 16px', borderRadius: '12px', border: '1px solid var(--line)' }}><Users size={18} style={{ color: 'var(--text)' }} /><span style={{ fontSize: '13px', fontWeight: 500 }}>Invite Friends</span></div><div style={{ display: 'flex', alignItems: 'center', gap: '12px', background: 'var(--surface-2)', padding: '12px 16px', borderRadius: '12px', border: '1px solid var(--line)' }}><Zap size={18} style={{ color: 'var(--text)' }} /><span style={{ fontSize: '13px', fontWeight: 500 }}>Real-Time Matches</span></div><div style={{ display: 'flex', alignItems: 'center', gap: '12px', background: 'var(--surface-2)', padding: '12px 16px', borderRadius: '12px', border: '1px solid var(--line)' }}><Trophy size={18} style={{ color: 'var(--text)' }} /><span style={{ fontSize: '13px', fontWeight: 500 }}>Online Leaderboards</span></div></div><button className="btn primary" onClick={() => nav('home')} style={{ padding: '0 32px' }}>Back to Home</button></div></section>}
      {page === 'how_to_play' && (
        <section className="content-page">
          <button className="back-link" onClick={() => nav('home')}>
            <ArrowLeft size={16} /> Back home
          </button>

          {/* 1. HERO */}
          <div className="page-title">
            <span className="eyebrow">OFFICIAL MANUAL</span>
            <h1>FlipMate Game Guide</h1>
            <p>Everything you need to sharpen your memory and master the game.</p>
          </div>

          <div className="guide-hero-banner">
            <div className="guide-highlights-grid">
              <div className="guide-highlight-card">
                <span className="guide-highlight-icon lavender"><Brain size={18} /></span>
                <div className="guide-highlight-text">
                  <strong>Memory Matching</strong>
                  <small>Classic card pairs with modern scoring</small>
                </div>
              </div>
              <div className="guide-highlight-card">
                <span className="guide-highlight-icon mint"><Zap size={18} /></span>
                <div className="guide-highlight-text">
                  <strong>5 Difficulty Levels</strong>
                  <small>Easy to Extreme with timed challenges</small>
                </div>
              </div>
              <div className="guide-highlight-card">
                <span className="guide-highlight-icon peach"><Users size={18} /></span>
                <div className="guide-highlight-text">
                  <strong>Solo & Multiplayer</strong>
                  <small>Personal mastery or pass-and-play fun</small>
                </div>
              </div>
            </div>
          </div>

          <div className="section-block" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {/* 2. HOW TO PLAY STEPS */}
            <div className="guide-card-panel">
              <h3><Info size={18} style={{ color: 'var(--accent)' }} /> How to Play</h3>
              <p>Master the fundamental matching loop in three simple steps:</p>
              <div className="guide-steps-grid">
                <div className="guide-step-card">
                  <div className="guide-step-top">
                    <span className="guide-step-num">STEP 01</span>
                    <RotateCcw size={16} style={{ color: 'var(--accent)' }} />
                  </div>
                  <h4>Flip</h4>
                  <p>Select any two face-down cards on the grid to reveal their hidden icons.</p>
                </div>
                <div className="guide-step-card">
                  <div className="guide-step-top">
                    <span className="guide-step-num">STEP 02</span>
                    <Check size={16} style={{ color: 'var(--green)' }} />
                  </div>
                  <h4>Match</h4>
                  <p>Matching cards remain permanently revealed. Non-matching cards turn face down again.</p>
                </div>
                <div className="guide-step-card">
                  <div className="guide-step-top">
                    <span className="guide-step-num">STEP 03</span>
                    <Trophy size={16} style={{ color: 'var(--accent)' }} />
                  </div>
                  <h4>Complete</h4>
                  <p>Locate and match all pairs on the board before the round timer expires.</p>
                </div>
              </div>
            </div>

            {/* 3. DIFFICULTY LEVELS */}
            <div className="guide-card-panel">
              <h3><Zap size={18} style={{ color: 'var(--accent)' }} /> Difficulty Levels</h3>
              <p>Choose from five calibrated difficulty tiers based directly on official game configurations:</p>
              <div className="guide-diff-grid">
                {Object.entries(DIFFICULTIES).map(([diffName, config]) => {
                  const dimensions = diffName === 'Easy' ? '4 × 3' : diffName === 'Normal' ? '4 × 4' : diffName === 'Medium' ? '6 × 4' : diffName === 'Hard' ? '6 × 6' : '8 × 6';
                  return (
                    <div key={diffName} className="guide-diff-card">
                      <div className="guide-diff-header">
                        <strong>{diffName}</strong>
                        <span className="local-badge" style={{ padding: '2px 7px', fontSize: '11px' }}>{config.multiplier}× mult</span>
                      </div>
                      <div className="guide-diff-specs">
                        <span>Grid Size: <strong>{dimensions}</strong></span>
                        <span>Total Cards: <strong>{config.pairs * 2}</strong></span>
                        <span>Pairs to Match: <strong>{config.pairs}</strong></span>
                        <span>Time Limit: <strong>{Math.floor(config.time / 60)} min</strong></span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* 4. GAME MODES */}
            <div className="guide-card-panel">
              <h3><Users size={18} style={{ color: 'var(--accent)' }} /> Game Modes</h3>
              <div className="guide-modes-grid">
                <div className="guide-mode-card">
                  <h4><UserRound size={17} style={{ color: 'var(--accent)' }} /> Solo Challenge</h4>
                  <p>Race against the countdown timer to find all pairs, minimize your total moves, and set record personal best scores.</p>
                  <ul>
                    <li>Leaderboard bonus for speed and high accuracy</li>
                    <li>One optional hint available per match</li>
                    <li>Individual match performance stored in your history</li>
                  </ul>
                </div>
                <div className="guide-mode-card">
                  <h4><Users size={17} style={{ color: 'var(--accent)' }} /> Local Multiplayer</h4>
                  <p>Pass-and-play competition for 2 to 4 players on a shared device with customized player names.</p>
                  <ul>
                    <li>Turn-based rotation with optional extra-turn on match</li>
                    <li>Separate move counters and match score per player</li>
                    <li>Independent multiplayer win tracking</li>
                  </ul>
                </div>
                <div className="guide-mode-card" style={{ opacity: 0.9 }}>
                  <h4>
                    <Globe2 size={17} style={{ color: 'var(--accent)' }} />
                    <span>Online Multiplayer</span>
                    <span className="local-badge" style={{ fontSize: '10px', marginLeft: 'auto' }}>In Development</span>
                  </h4>
                  <p>An online multiplayer mode is currently in active development to allow remote matchmaking and private rooms across devices.</p>
                  <ul style={{ color: 'var(--muted)', fontStyle: 'italic' }}>
                    <li>Feature is not currently available</li>
                    <li>No official release date has been confirmed</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* 5. SCORING AND ACCURACY & 6. CARD THEMES */}
            <div className="guide-two-col">
              <div className="guide-card-panel">
                <h3><Target size={18} style={{ color: 'var(--accent)' }} /> Scoring and Accuracy</h3>
                <p>FlipMate rewards both speed and disciplined memory recall:</p>
                <ul className="guide-panel-list">
                  <li><strong>Move:</strong> One attempt turning over two cards counts as exactly one move.</li>
                  <li><strong>Formula:</strong> Points scale with matched pairs and difficulty multiplier, with deductions for extra moves and elapsed seconds: <code>(Pairs × 100 × Multiplier) - (Moves × 5) - Seconds</code>.</li>
                  <li><strong>Accuracy:</strong> Calculated precisely as completed pairs divided by total moves multiplied by 100 <code>((Pairs / Moves) × 100)</code>.</li>
                  <li><strong>Tie-Breaking:</strong> Multiplayer standings rank by pairs, score, accuracy, and fewest moves.</li>
                </ul>
              </div>

              <div className="guide-card-panel">
                <h3><Sparkles size={18} style={{ color: 'var(--accent)' }} /> Card Themes</h3>
                <p>Customize the look and feel of the board with distinct icon sets:</p>
                <div className="guide-themes-pills">
                  <span className="guide-theme-pill"><Sparkles size={13} style={{ color: 'var(--accent)' }} /> Random</span>
                  {Object.keys(THEMES).map((themeName) => (
                    <span key={themeName} className="guide-theme-pill">
                      {themeName === 'Symbols' ? <Circle size={13} /> : themeName === 'Space' ? <Rocket size={13} /> : themeName === 'Tech' ? <Laptop size={13} /> : themeName === 'Everyday' ? <Coffee size={13} /> : <Cat size={13} />}
                      {themeName}
                    </span>
                  ))}
                </div>
                <p style={{ marginTop: '8px', fontSize: '12px' }}>
                  Choosing <strong>Random</strong> selects one consistent theme for that match and keeps it uniform across all cards until the game finishes.
                </p>
              </div>
            </div>

            {/* 7. RESPECTFUL PLAYER NAMES & 8. TIPS FOR BETTER RESULTS */}
            <div className="guide-two-col">
              <div className="guide-card-panel">
                <h3><ShieldCheck size={18} style={{ color: 'var(--accent)' }} /> Respectful Player Names</h3>
                <p>FlipMate maintains a family-friendly, welcoming environment for everyone:</p>
                <ul className="guide-panel-list">
                  <li><strong>Prohibited Terms:</strong> Offensive, abusive, vulgar, or insulting terms are strictly disallowed in both profile and in-game names.</li>
                  <li><strong>Reserved Identities:</strong> Developer and brand identities (such as <strong>JB Devs</strong>) are protected against impersonation.</li>
                  <li><strong>Multilingual Filtering:</strong> Validation automatically scans English, Hindi (Devanagari & Hinglish), Malayalam (Script & Manglish), and Tamil terms. Coverage is determined by our curated restricted dictionaries.</li>
                  <li><strong>Validation Prompts:</strong> If a name is flagged, please select a different appropriate name to continue.</li>
                </ul>
              </div>

              <div className="guide-card-panel">
                <h3><Star size={18} style={{ color: 'var(--accent)' }} /> Tips for Better Results</h3>
                <p>Improve your memory recall and climb the leaderboards with these proven strategies:</p>
                <div className="guide-tips-grid">
                  <div className="guide-tip-item">
                    <strong>Grid Spatial Memory</strong>
                    <span>Anchor cards by corner and edge positions rather than trying to memorize the whole grid at once.</span>
                  </div>
                  <div className="guide-tip-item">
                    <strong>Avoid Blind Guessing</strong>
                    <span>Every random click adds to your move count and degrades your final completion accuracy.</span>
                  </div>
                  <div className="guide-tip-item">
                    <strong>Pace Your Opening</strong>
                    <span>Use early moves deliberately to survey card locations before making aggressive matching runs.</span>
                  </div>
                  <div className="guide-tip-item">
                    <strong>Theme Associations</strong>
                    <span>Mentally categorize similar shapes or icons to quickly connect pairs when their match appears.</span>
                  </div>
                </div>
              </div>
            </div>

            {/* QUICK ACTIONS */}
            <div className="guide-bottom-actions">
              <button className="btn primary" onClick={() => { setMode('solo'); nav('setup'); }}>
                Play Solo <ChevronRight size={16} />
              </button>
              <button className="btn secondary" onClick={() => { setMode('local'); nav('setup'); }}>
                <Users size={16} /> Play Together
              </button>
            </div>
          </div>
        </section>
      )}
      {page === 'about_developer' && <section className="content-page about-page">
        <button className="back-link" onClick={() => nav('home')}><ArrowLeft size={16} /> Back home</button>
        <div className="page-title">
          <span className="eyebrow">ABOUT THE DEVELOPER</span>
          <h1>Built by JB Devs</h1>
        </div>
        <div className="about-sections">
          <div className="section-block about-card profile-intro-card">
            <div className="profile-header">
              <div className="profile-photo-container">
                <img src="/images/developer-profile.jpg" alt="Developer profile photo" className="profile-photo" onError={(e) => { e.currentTarget.style.display = 'none'; const placeholder = e.currentTarget.nextElementSibling; if (placeholder) placeholder.style.display = 'flex'; }} />
                <div className="mode-icon peach profile-photo-placeholder" style={{ display: 'none', margin: 0, width: '100%', height: '100%', alignItems: 'center', justifyContent: 'center', borderRadius: 'inherit' }}>
                  <User size={32} />
                </div>
              </div>
              <div className="profile-content about-intro-copy">
                <h2>I'm Jithu Biju — a Full-Stack Developer</h2>
                <span className="local-badge about-qualification">BCA Graduate (2026)</span>
                <p>A BCA graduate passionate about web development and building practical digital experiences. I enjoy turning ideas into functional, user-friendly websites and applications while continuously improving my development skills.</p>
              </div>
            </div>
          </div>

          <div className="section-block about-card">
            <h3 className="about-card-title"><Code2 size={18} /> What I Do</h3>
            <ul className="about-what-list">
              <li>Build responsive, user-friendly web interfaces.</li>
              <li>Develop interactive applications using JavaScript and React.</li>
              <li>Work on full-stack applications using the MERN stack.</li>
              <li>Build backend functionality and work with APIs and databases.</li>
            </ul>
          </div>

          <div className="section-block about-card">
            <h3 className="about-card-title"><Cpu size={18} /> Technologies I Work With</h3>
            <div className="about-tech-grid">
              <div className="about-tech-group">
                <h4>Frontend</h4>
                <div className="about-tech-badges">
                  <span className="tech-badge">HTML</span>
                  <span className="tech-badge">CSS</span>
                  <span className="tech-badge mern-badge">JavaScript</span>
                  <span className="tech-badge mern-badge">React</span>
                  <span className="tech-badge">Vite</span>
                </div>
              </div>
              <div className="about-tech-group">
                <h4>Backend</h4>
                <div className="about-tech-badges">
                  <span className="tech-badge mern-badge">Node.js</span>
                  <span className="tech-badge mern-badge">Express.js</span>
                  <span className="tech-badge">Python</span>
                  <span className="tech-badge">Django</span>
                  <span className="tech-badge">PHP</span>
                </div>
              </div>
              <div className="about-tech-group">
                <h4>Database</h4>
                <div className="about-tech-badges">
                  <span className="tech-badge mern-badge">MongoDB</span>
                  <span className="tech-badge">MySQL</span>
                  <span className="tech-badge">SQLite</span>
                </div>
              </div>
              <div className="about-tech-group">
                <h4>Tools</h4>
                <div className="about-tech-badges">
                  <span className="tech-badge">Git</span>
                  <span className="tech-badge">GitHub</span>
                  <span className="tech-badge">VS Code</span>
                </div>
              </div>
            </div>
          </div>

          <div className="section-block about-card">
            <h3 className="about-card-title"><Brain size={18} /> Why FlipMate?</h3>
            <p className="about-card-copy">FlipMate is a memory-matching game built to explore interactive web development, game logic, responsive UI design, and browser-based data storage. Building it has helped me practise React, state management, and creating a more complete user experience.</p>
          </div>

          <div className="section-block about-card">
            <h3 className="about-card-title"><Sparkles size={18} /> What's Coming Next?</h3>
            <div className="about-coming-badge">
              <span className="local-badge"><Globe2 size={13} /> Online Multiplayer — In Development</span>
            </div>
            <p className="about-card-copy">An online multiplayer mode is being developed to let players connect and compete remotely across devices. Please note that this feature is currently in active development, is not yet available, and no official release date has been confirmed.</p>
          </div>

          <div className="section-block about-card">
            <h3 className="about-card-title"><Link2 size={18} /> Let's Connect</h3>
            <p className="about-connect-copy">Interested in my work or want to connect? Find me here.</p>
            <div className="about-connect-links">
              <a href="https://jithu-portfolio-alpha.vercel.app/" target="_blank" rel="noopener noreferrer" className="btn secondary" aria-label="Visit Jithu Biju's portfolio (opens in a new tab)"><Briefcase size={16} /> Portfolio</a>
              <a href="https://www.linkedin.com/in/jithu-biju-/" target="_blank" rel="noopener noreferrer" className="btn secondary" aria-label="Visit Jithu Biju on LinkedIn (opens in a new tab)"><Linkedin size={16} /> LinkedIn</a>
              <a href="https://www.instagram.com/j.i.t.h.u_/" target="_blank" rel="noopener noreferrer" className="btn secondary" aria-label="Visit Jithu Biju on Instagram (opens in a new tab)"><Instagram size={16} /> Instagram</a>
            </div>
          </div>
        </div>
      </section>}
    </main>
    {!isGameFlow && page !== 'settings' && page !== 'profile' && page !== 'not_found' && <footer className="footer-new">
      <div className="footer-content">
        <div className="footer-brand-area">
          <div className="footer-brand" style={{ marginBottom: '12px' }}>
            <span className="brand-mark small"><img src="/logo.png" alt="FlipMate logo" /></span>
            <span><strong>FlipMate</strong></span>
          </div>
          <p style={{ color: 'var(--muted)', fontSize: '13px', lineHeight: '1.5', maxWidth: '250px', margin: 0 }}>
            Flip. Match. Win.
          </p>
        </div>
        <div className="footer-links-area">
          <strong>Quick Links</strong>
          <div className="footer-links">
            <button className="footer-link" onClick={() => nav('home')}>Home</button>
            <button className="footer-link" onClick={() => nav('leaderboard')}>Leaderboard</button>
            <button className="footer-link" onClick={() => nav('history')}>History</button>
            <button className="footer-link" onClick={() => nav('about_developer')}>About Developer</button>
          </div>
        </div>
        <div className="footer-social-area">
          <strong>Connect</strong>
          <div className="footer-socials">
            <a href="https://jithu-portfolio-alpha.vercel.app/" target="_blank" rel="noreferrer" aria-label="Portfolio" className="footer-social-link"><Briefcase size={18} /></a>
            <a href="https://www.linkedin.com/in/jithu-biju-/" target="_blank" rel="noreferrer" aria-label="LinkedIn" className="footer-social-link"><Linkedin size={18} /></a>
            <a href="https://www.instagram.com/j.i.t.h.u_/" target="_blank" rel="noreferrer" aria-label="Instagram" className="footer-social-link"><Instagram size={18} /></a>
          </div>
        </div>
      </div>
      <div className="footer-bottom">
        <span style={{ fontSize: '12px', color: 'var(--muted)' }}>© {new Date().getFullYear()} JB Devs. All rights reserved.</span>
        <span style={{ fontSize: '12px', color: 'var(--muted)', fontWeight: 500 }}>FlipMate v1.3.0</span>
      </div>
    </footer>}
    {notice && <div className="toast" role="status"><Check size={16} />{notice}</div>}
    {showHelp && <div className="modal-backdrop" onClick={() => setShowHelp(false)}><section className="help-modal" onClick={(e) => e.stopPropagation()}><button className="modal-close" onClick={() => setShowHelp(false)} aria-label="Close help"><X size={18} /></button><span className="mode-icon lavender"><Brain size={22} /></span><h2>How to play</h2><p>Flip two cards and look for matching symbols. In solo mode, try to finish with fewer moves. In local multiplayer, collect the most pairs to win.</p><div className="help-rule"><span>01</span><p><strong>Flip</strong><br />Choose any two hidden cards.</p></div><div className="help-rule"><span>02</span><p><strong>Match</strong><br />Matching pairs stay face up and score a point in multiplayer.</p></div><div className="help-rule"><span>03</span><p><strong>Remember</strong><br />If the cards don't match, they turn back over. Use what you saw next turn.</p></div><button className="btn primary full-btn" onClick={() => setShowHelp(false)}>Got it</button></section></div>}
  </div>;
}

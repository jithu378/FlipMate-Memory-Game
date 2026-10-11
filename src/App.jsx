import React, { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import {
  Brain, Moon, Sun, Volume2, VolumeX, Trophy, Users, UserRound, Globe2,
  Settings, ArrowLeft, RotateCcw, Pause, Play, Clock3, Target, Zap,
  Sparkles, Medal, ChevronRight, X, Check, Copy, Info, House, BarChart3,
  Trash2, LogIn, ArrowRight, User,
  Circle, Square, Triangle, Hexagon, Octagon, Star, Diamond, Heart, Cloud, Umbrella, Music, Droplet, Flame, Snowflake, Shield, Crown, Anchor, Flag, Gem, Bell, AlertCircle,
  Menu,
  Leaf, Trees, TreePine, Flower, Flower2, Bug, Bird, Rabbit, Snail, Turtle, Fish, Mountain, MountainSnow, Waves, CloudRain, CloudLightning, Wind, Sprout, Feather, Clover, Rat, Worm, Apple, Cherry,
  Laptop, Smartphone, Gamepad2, Headphones, Camera, Watch, Keyboard, Mouse, Tv, Speaker, HardDrive, Printer, Battery, Plug, Cpu, Wifi, Bluetooth, Radio, Calculator, Lightbulb, Monitor, Tablet, Mic, Webcam,
  Coffee, Book, Pencil, Scissors, Ticket, Gift, Plane, Car, Bus, Train, Bike, Compass, Map, Briefcase, ShoppingCart, CreditCard, Glasses, Key, Lock, Mail, Phone, Video,
  ChevronDown, ChevronUp, Instagram, Linkedin, Code2, FolderGit2, PlaneTakeoff, Link2, CircleUserRound
} from 'lucide-react';

const DIFFICULTIES = {
  Easy: { pairs: 6, time: 90, multiplier: 1 },
  Normal: { pairs: 8, time: 120, multiplier: 1.25 },
  Medium: { pairs: 12, time: 180, multiplier: 1.5 },
  Hard: { pairs: 18, time: 240, multiplier: 2 },
  Extreme: { pairs: 24, time: 300, multiplier: 2.5 },
};
const THEMES = {
  Symbols: [Circle, Square, Triangle, Hexagon, Octagon, Star, Diamond, Heart, Cloud, Sun, Moon, Umbrella, Music, Zap, Droplet, Flame, Snowflake, Shield, Crown, Anchor, Flag, Sparkles, Gem, Bell],
  Nature: [Leaf, Trees, TreePine, Flower, Flower2, Bug, Bird, Rabbit, Snail, Turtle, Fish, Mountain, MountainSnow, Waves, CloudRain, CloudLightning, Wind, Sprout, Feather, Clover, Rat, Worm, Apple, Cherry],
  Tech: [Laptop, Smartphone, Gamepad2, Headphones, Camera, Watch, Keyboard, Mouse, Tv, Speaker, HardDrive, Printer, Battery, Plug, Cpu, Wifi, Bluetooth, Radio, Calculator, Lightbulb, Monitor, Tablet, Mic, Webcam],
  Everyday: [Coffee, Book, Pencil, Scissors, Ticket, Gift, Trophy, Medal, Plane, Car, Bus, Train, Bike, Compass, Map, Briefcase, ShoppingCart, CreditCard, Glasses, Key, Lock, Mail, Phone, Video]
};
const STORE = 'mindflip-v1';
const PALETTE = ['#f87171', '#fb923c', '#fbbf24', '#a3e635', '#34d399', '#2dd4bf', '#38bdf8', '#818cf8', '#c084fc', '#f472b6', '#fb7185', '#e879f9'];
const readStore = () => { try { return JSON.parse(localStorage.getItem(STORE) || '{}'); } catch { return {}; } };
const saveStore = (data) => { try { localStorage.setItem(STORE, JSON.stringify(data)); } catch { /* private browsing may block storage */ } };
const shuffle = (items) => { const a = [...items]; for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1));[a[i], a[j]] = [a[j], a[i]]; } return a; };
const makeDeck = (pairs, theme) => shuffle(THEMES[theme].slice(0, pairs).flatMap((Icon, index) => [{ id: `${index}-a-${Math.random()}`, pair: index, Icon, color: PALETTE[index % PALETTE.length] }, { id: `${index}-b-${Math.random()}`, pair: index, Icon, color: PALETTE[index % PALETTE.length] }]));
const formatTime = (s) => `${Math.floor(Math.max(0, s) / 60).toString().padStart(2, '0')}:${(Math.max(0, s) % 60).toString().padStart(2, '0')}`;
const createGameId = () => window.crypto?.randomUUID?.() || `${Date.now()}-${Math.random().toString(36).slice(2)}`;

export default function App() {
  const [persisted, setPersisted] = useState(readStore);
  const [dark, setDark] = useState(readStore().dark ?? false);
  const [sound, setSound] = useState(readStore().sound ?? true);
  const [page, setPage] = useState(() => {
    const path = window.location.pathname.slice(1);
    const validPages = ['home', 'setup', 'game', 'leaderboard', 'history', 'multiplayer-history', 'profile', 'settings', 'online', 'how-to-play', 'about-developer'];
    return validPages.includes(path) ? path.replace('-', '_') : 'home';
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
  const [customName, setCustomName] = useState(persisted.displayName || 'Player');
  const [leaderboardFilter, setLeaderboardFilter] = useState('Easy');
  const [leaderboardMode, setLeaderboardMode] = useState('overall');
  const [expandedPlayer, setExpandedPlayer] = useState(null);
  const [historyFilter, setHistoryFilter] = useState('Easy');
  const [historySort, setHistorySort] = useState('newest');
  const [historyPlayerFilter, setHistoryPlayerFilter] = useState('');
  const [showHelp, setShowHelp] = useState(false);
  const [historyMenuOpen, setHistoryMenuOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const startAt = useRef(null);
  const activeGameId = useRef(null);
  const recordedGameId = useRef(null);
  const hintTimer = useRef(null);
  const noticeTimer = useRef(null);
  const historyMenuRef = useRef(null);
  const headerRef = useRef(null);
  const settings = DIFFICULTIES[difficulty];
  const isMultiplayer = mode === 'local';
  const currentName = playerNames[activePlayer] || `Player ${activePlayer + 1}`;
  const totalPairs = settings.pairs;
  const complete = matched.length === deck.length && deck.length > 0;
  const accuracy = moves ? Math.round((matched.length / 2 / moves) * 100) : 0;
  const isGameplayActive = page === 'game' && (gameStatus === 'playing' || gameStatus === 'paused');
  const activeNames = playerNames.slice(0, playerCount).map(n => n.trim());
  const lowerNames = activeNames.map(n => n.toLowerCase());
  const isValidMultiplayer = mode !== 'local' || (!activeNames.some(n => !n) && new Set(lowerNames).size === activeNames.length);

  useEffect(() => { saveStore({ ...persisted, dark, sound, displayName: customName }); }, [persisted, dark, sound, customName]);
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
    const handlePopState = () => {
      const path = window.location.pathname.slice(1);
      const validPages = ['home', 'setup', 'game', 'leaderboard', 'history', 'multiplayer-history', 'profile', 'settings', 'online', 'how-to-play', 'about-developer'];
      setPage(validPages.includes(path) ? path.replace('-', '_') : 'home');
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const toast = (message) => { setNotice(message); window.clearTimeout(noticeTimer.current); noticeTimer.current = window.setTimeout(() => setNotice(''), 2600); };
  const startGame = (chosenMode = mode) => {
    if (chosenMode === 'local' && !isValidMultiplayer) return;
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
    const result = { id: gameId, mode, difficulty, theme: activeTheme, score: isMultiplayer ? Math.max(...scores) * 100 : Math.max(0, Math.round(completedPairs * 100 * settings.multiplier - moves * 5 - seconds)), moves, seconds, completedPairs, date: new Date().toISOString(), name: isMultiplayer ? playerNames[scores.indexOf(Math.max(...scores))] : (customName || 'Player') };
    const isMeaningful = moves > 0;
    let newHistoryItems = [];
    let updatedMultiWins = { ...(current.multiplayerWins || {}) };
    
    if (isMeaningful) {
      if (isMultiplayer) {
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
          const winnerName = (playerNames[winnerIndex] || `Player ${winnerIndex + 1}`).trim();
          updatedMultiWins[winnerName] = (updatedMultiWins[winnerName] || 0) + 1;
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
              name: playerNames[i] || `Player ${i + 1}`,
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
          name: customName || 'Player'
        });
      }
    }
    const history = isMeaningful ? [...newHistoryItems, ...(current.history || []).filter(r => r.sessionId !== gameId && r.id !== gameId && !r.id?.startsWith(`${gameId}-`))].slice(0, 50) : (current.history || []);
    const bestKey = `${mode}-${difficulty}`;
    const bests = { ...(current.bests || {}) };
    newHistoryItems.forEach(item => {
      if (item.mode !== 'solo') return;
      const bKey = `solo-${difficulty}`;
      if (!bests[bKey] || item.score > bests[bKey].score) bests[bKey] = item;
    });
    const updated = { ...current, history, bests, multiplayerWins: updatedMultiWins, gamesPlayed: (current.gamesPlayed || 0) + 1, totalPairs: (current.totalPairs || 0) + completedPairs };
    setPersisted(updated); saveStore({ ...updated, dark, sound, displayName: customName });
  }, [mode, isMultiplayer, scores, matched.length, settings.multiplier, moves, seconds, difficulty, playerNames, customName, dark, sound, playerMoves, playerCount]);

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
        if (sound) { try { const ctx = new (window.AudioContext || window.webkitAudioContext)(); const osc = ctx.createOscillator(); const gain = ctx.createGain(); osc.connect(gain); gain.connect(ctx.destination); osc.frequency.value = 660; gain.gain.value = 0.035; osc.start(); osc.stop(ctx.currentTime + 0.07); osc.onended = () => ctx.close(); } catch { /* sound is optional */ } }
      }, 280);
    } else {
      window.setTimeout(() => { if (activeGameId.current !== gameId) return; setFlipped([]); if (isMultiplayer && turnBased) setActivePlayer((p) => (p + 1) % playerCount); }, 780);
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
  const resetGame = () => { setRunning(false); setPaused(false); setGameStatus('ready'); setPage('setup'); setDeck([]); setFlipped([]); setMatched([]); };
  const copyRoom = async () => { try { await navigator.clipboard.writeText(roomCode); toast('Room code copied.'); } catch { toast(`Share this code: ${roomCode}`); } };
  const createRoom = () => { const code = Math.random().toString(36).slice(2, 8).toUpperCase(); setRoomCode(code); setRoomCreated(true); toast('Demo room created locally. Online sync needs Supabase setup.'); };
  const { bests, multiBests, multiTopPlayers, multiMatches, overallStats, historyList, allPlayers, multiWins } = useMemo(() => {
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

    cleanHistory.forEach(r => {
      if (r.score === 0) return;
      const pName = (r.name || 'Player').trim();
      const key = `${pName}-${r.difficulty}`;
      if (r.mode === 'solo') {
        if (!playerDiffs.has(key)) playerDiffs.set(key, []);
        playerDiffs.get(key).push(r);
      } else {
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

    const overallStatsMap = new window.Map();
    cleanHistory.forEach(r => {
      const pName = (r.name || 'Player').trim();
      
      let stat = overallStatsMap.get(pName);
      if (!stat) {
        stat = { name: pName, totalScore: 0, gamesPlayed: 0, completedPairs: 0, moves: 0, wins: multiWins[pName] || 0 };
        overallStatsMap.set(pName, stat);
      }
      
      stat.totalScore += r.score;
      stat.gamesPlayed += 1;
      stat.completedPairs += r.completedPairs || 0;
      stat.moves += r.moves || 0;
    });

    let overallStatsArray = Array.from(overallStatsMap.values());
    overallStatsArray.sort((a, b) => {
      if (b.totalScore !== a.totalScore) return b.totalScore - a.totalScore;
      if (b.wins !== a.wins) return b.wins - a.wins;
      return b.completedPairs - a.completedPairs;
    });

    const multiPlayerStatsMap = new window.Map();
    const seenMatchPlayer = new Set();
    cleanHistory.filter(r => r.mode !== 'solo').forEach(r => {
      const pName = (r.name || 'Player').trim();
      const matchKey = `${r.sessionId || `legacy-${r.date}`}-${pName}`;
      if (seenMatchPlayer.has(matchKey)) return;
      seenMatchPlayer.add(matchKey);

      let stat = multiPlayerStatsMap.get(pName);
      if (!stat) {
        stat = { name: pName, totalScore: 0, gamesPlayed: 0, completedPairs: 0, moves: 0, wins: multiWins[pName] || 0 };
        multiPlayerStatsMap.set(pName, stat);
      }
      stat.totalScore += r.score || 0;
      stat.gamesPlayed += 1;
      stat.completedPairs += r.completedPairs || 0;
      stat.moves += r.moves || 0;
    });

    let multiTopPlayers = Array.from(multiPlayerStatsMap.values());
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

    const multiRecords = cleanHistory.filter(r => r.mode !== 'solo').slice(0, 100);
    const multiMatchesMap = new window.Map();
    multiRecords.forEach(r => {
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

    let hList = [...cleanHistory];
    const pSet = new Set(cleanHistory.map(r => (r.name || 'Player').trim()));

    bestsArray = bestsArray.filter((r) => r.difficulty === leaderboardFilter);
    multiBestsArray = multiBestsArray.filter((r) => r.difficulty === leaderboardFilter);
    hList = hList.filter((r) => r.difficulty === historyFilter);

    if (historyPlayerFilter) {
      hList = hList.filter(r => (r.name || 'Player').trim() === historyPlayerFilter);
    }

    if (historySort === 'score') hList.sort((a, b) => b.score - a.score);
    else if (historySort === 'time') hList.sort((a, b) => (a.seconds || Infinity) - (b.seconds || Infinity));

    return { bests: bestsArray.slice(0, 50), multiBests: multiBestsArray.slice(0, 50), multiTopPlayers: multiTopPlayers.slice(0, 50), multiMatches, overallStats: overallStatsArray.slice(0, 50), historyList: hList, allPlayers: Array.from(pSet), multiWins };
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
  const nav = (next) => {
    if (next !== page) {
      if (next === 'leaderboard') { setLeaderboardFilter('Easy'); setLeaderboardMode('overall'); }
      if (next === 'history' || next === 'multiplayer_history') setHistoryFilter('Easy');
    }
    setPage(next);
    setNotice('');
    setHistoryMenuOpen(false);
    setMobileMenuOpen(false);
    const path = next === 'home' ? '/' : `/${next.replace('_', '-')}`;
    if (window.location.pathname !== path) {
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
  const selectedPlayers = playerNames.slice(0, playerCount);
  const gridColumns = difficulty === 'Easy' || difficulty === 'Normal' ? 4 : difficulty === 'Extreme' ? 8 : 6;
  const gridRows = difficulty === 'Easy' ? 3 : difficulty === 'Extreme' || difficulty === 'Hard' ? 6 : 4;
  const gridGap = difficulty === 'Extreme' ? 4 : difficulty === 'Hard' ? 6 : 8;
  const gridPadding = difficulty === 'Extreme' ? 6 : difficulty === 'Hard' ? 8 : 10;

  const maxCardHeight = difficulty === 'Easy' || difficulty === 'Normal' ? 135 : 185;
  const maxBoardWidth = gridColumns * 170 + (gridColumns - 1) * gridGap + gridPadding * 2 + 2;
  const maxBoardHeight = gridRows * maxCardHeight + (gridRows - 1) * gridGap + gridPadding * 2 + 2;
  const maxDesktopBoardHeight = gridRows * 155 + (gridRows - 1) * gridGap + gridPadding * 2 + 2;

  return <div className={`${dark ? 'app dark' : 'app'} ${isGameplayActive ? 'immersive-mode' : ''}`}>
    {!isGameplayActive && <header className="topbar" ref={headerRef}>
      <button className="brand" onClick={() => nav('home')} aria-label="MindFlip home"><span className="brand-mark"><img src="/logo.png" alt="MindFlip logo" /></span><span><strong>mindflip</strong><small>by JB Devs</small></span></button>
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
        <button className={page === 'how_to_play' ? 'nav-link active' : 'nav-link'} onClick={() => { nav('how_to_play'); setMobileMenuOpen(false); }}><Book size={16} /> How to Play</button>
        <button className={page === 'about_developer' ? 'nav-link active' : 'nav-link'} onClick={() => { nav('about_developer'); setMobileMenuOpen(false); }}><Code2 size={16} /> About Developer</button>
        <button className={page === 'profile' ? 'nav-link active' : 'nav-link'} onClick={() => { nav('profile'); setMobileMenuOpen(false); }}><CircleUserRound size={16} /> Profile</button>
        <button className={page === 'settings' ? 'nav-link active mobile-nav-settings' : 'nav-link mobile-nav-settings'} onClick={() => { nav('settings'); setMobileMenuOpen(false); }}><Settings size={16} /> Settings</button>
      </nav>
      <div className="top-actions">
        <button className="icon-btn theme-toggle-btn" title={dark ? 'Switch to light mode' : 'Switch to dark mode'} aria-label={dark ? 'Switch to light mode' : 'Switch to dark mode'} onClick={() => setDark((v) => !v)}>{dark ? <Sun size={18} aria-hidden="true" /> : <Moon size={18} aria-hidden="true" />}</button>
        <button className="icon-btn settings-btn desktop-only" title="Settings" aria-label="Settings" onClick={() => nav('settings')}><Settings size={18} aria-hidden="true" /></button>
        <button className="avatar desktop-only" aria-label="Profile" onClick={() => nav('profile')}>{(customName.trim()[0] || 'P').toUpperCase()}</button>
        <button className="icon-btn mobile-menu-toggle" aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'} aria-expanded={mobileMenuOpen} aria-controls="main-navigation" onClick={toggleMobileMenu}>{mobileMenuOpen ? <X size={18} aria-hidden="true" /> : <Menu size={18} aria-hidden="true" />}</button>
      </div>
    </header>}

    <main className="container">
      {page === 'home' && <>
        <section className="section-block game-modes-block">
          <div className="section-heading">
            <div>
              <span className="eyebrow">GAME MODES</span>
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
            <button className="mode-card mode-card-online" onClick={() => nav('online')}>
              <span className="mode-icon lavender"><Globe2 size={22} /></span>
              <span className="coming-badge">Coming Soon</span>
              <span className="mode-title">Online Multiplayer</span>
              <span className="mode-description">Create private rooms and challenge friends on their own devices.</span>
              <span className="mode-footer">Coming soon <ChevronRight size={16} /></span>
            </button>
          </div>
        </section>

        <section className="quick-stats">
          <div className="stat"><span className="stat-icon"><Target size={18} /></span><div><small>Games played</small><strong>{persisted.gamesPlayed || 0}</strong></div></div>
          <div className="stat"><span className="stat-icon"><Trophy size={18} /></span><div><small>Personal best</small><strong>{bestSolo ? bestSolo.score.toLocaleString() : '—'}</strong></div></div>
          <div className="stat"><span className="stat-icon"><Sparkles size={18} /></span><div><small>Pairs matched</small><strong>{persisted.totalPairs || 0}</strong></div></div>
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
      {page === 'setup' && <section className="setup-wrap"><button className="back-link" onClick={() => nav('home')}><ArrowLeft size={16} /> Back home</button><div className="page-title"><span className="eyebrow">MAKE IT YOUR GAME</span><h1>{mode === 'solo' ? 'Solo challenge' : 'Play together'}</h1><p>{mode === 'solo' ? 'Pick a difficulty, choose a theme, and see how sharp your memory is.' : 'Add your players, pick a challenge, and pass the device around.'}</p></div><div className="setup-grid"><div className="setup-panel"><div className="panel-heading"><span className="step-number">01</span><div><h3>Choose difficulty</h3><p>More pairs means a bigger challenge.</p></div></div><div className="difficulty-list">{Object.entries(DIFFICULTIES).map(([name, value]) => <button key={name} className={difficulty === name ? 'difficulty-option selected' : 'difficulty-option'} onClick={() => setDifficulty(name)}><span className="radio-dot" /><span className="difficulty-label"><strong>{name}</strong><small>{value.pairs} pairs · {value.time / 60} min</small></span><span className="difficulty-size">{name === 'Easy' ? '4 × 3' : name === 'Normal' ? '4 × 4' : name === 'Medium' ? '6 × 4' : name === 'Hard' ? '6 × 6' : '8 × 6'}</span></button>)}</div><div className="panel-heading theme-heading"><span className="step-number">02</span><div><h3>Choose a card theme</h3><p>Just a little personality.</p></div></div><div className="theme-options"><button className={theme === 'Random' ? 'theme-option selected' : 'theme-option'} onClick={() => setTheme('Random')}><span style={{ display: 'flex', gap: '4px', opacity: 0.8 }}><Sparkles size={14} /></span><span>Random</span></button>{Object.keys(THEMES).map((name) => <button key={name} className={theme === name ? 'theme-option selected' : 'theme-option'} onClick={() => setTheme(name)}><span style={{ display: 'flex', gap: '4px', opacity: 0.8 }}>{name === 'Symbols' ? <><Circle size={14} /><Triangle size={14} /><Square size={14} /></> : name === 'Nature' ? <><Leaf size={14} /><Flower size={14} /><Bird size={14} /></> : name === 'Tech' ? <><Laptop size={14} /><Gamepad2 size={14} /><Cpu size={14} /></> : <><Coffee size={14} /><Book size={14} /><Gift size={14} /></>}</span><span>{name}</span></button>)}</div></div><div className="setup-panel players-panel"><div className="panel-heading"><span className="step-number">03</span><div><h3>{mode === 'solo' ? 'Your player name' : 'Meet the players'}</h3>{mode === 'solo' && <p>Your name appears in your results.</p>}</div></div>{mode === 'solo' ? <label className="field-label">Display name<input value={customName} maxLength={20} onChange={(e) => setCustomName(e.target.value)} placeholder="Enter your name" /></label> : <><div className="player-count">{[2, 3, 4].map((n) => <button key={n} className={playerCount === n ? 'count-btn selected' : 'count-btn'} onClick={() => setPlayerCount(n)}>{n} players</button>)}</div><div className="player-fields">{selectedPlayers.map((name, i) => { const tName = name.trim(); const lower = tName.toLowerCase(); const isEmpty = tName === ''; const isDup = !isEmpty && lowerNames.filter(n => n === lower).length > 1; return <div key={i} style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}><label className="field-label">Player {i + 1}<input maxLength={20} value={name} onChange={(e) => setPlayerNames((old) => old.map((n, j) => j === i ? e.target.value : n))} placeholder={`Player ${i + 1}`} style={{ borderColor: (isEmpty || isDup) ? 'var(--danger)' : undefined }} /></label>{(isEmpty || isDup) && <span style={{ color: 'var(--danger)', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '4px', marginTop: '-4px', marginBottom: '8px' }}><AlertCircle size={13} /> {isEmpty ? 'Please enter a name for every active player.' : 'Player names must be unique.'}</span>}</div>; })}</div><label className="check-row"><input type="checkbox" checked={turnBased} onChange={(e) => setTurnBased(e.target.checked)} /><span><strong>Matching pair earns another turn</strong><small>Turn passes to the next player after a mismatch.</small></span></label></>}
        <div className="setup-summary"><div><span>Game mode</span><strong>{mode === 'solo' ? 'Solo' : `${playerCount} players`}</strong></div><div><span>Board</span><strong>{settings.pairs * 2} cards</strong></div><div><span>Difficulty</span><strong>{difficulty}</strong></div></div><button className="btn primary full-btn" disabled={mode === 'local' && !isValidMultiplayer} onClick={() => startGame(mode)}>{mode === 'solo' ? 'Start challenge' : 'Start game'} <ChevronRight size={17} /></button>{mode === 'solo' && <p className="fine-print"><Info size={13} /> No account needed to play locally.</p>}</div></div></section>}

      {page === 'game' && <section className={`game-wrap ${isMultiplayer ? 'multiplayer' : ''}`}><div className="game-top"><button className="back-link" onClick={() => { setRunning(false); nav('home'); }}><ArrowLeft size={16} /> Leave game</button><span className="game-chip">{mode === 'solo' ? 'SOLO CHALLENGE' : 'LOCAL MULTIPLAYER'} · {difficulty.toUpperCase()}</span><button className="icon-btn" title="Restart game" aria-label="Restart game" onClick={resetGame}><RotateCcw size={17} aria-hidden="true" /></button></div><div className="game-heading"><div><span className="eyebrow">STAY FOCUSED</span><h1>{gameStatus === 'playing' ? 'Find your pairs.' : gameStatus === 'complete' ? 'Nicely done!' : gameStatus === 'timeout' ? 'Time is up.' : 'Ready when you are.'}</h1><p>{gameStatus === 'complete' ? 'Here is how you did this round.' : gameStatus === 'timeout' ? 'Every attempt helps you improve. Give it another go.' : mode === 'solo' ? 'Find all matching pairs with as few moves as possible.' : `${currentName}'s turn — find a pair to score a point.`}</p></div>{gameStatus === 'playing' && <button className="btn secondary small-btn" onClick={handlePauseToggle}>{paused ? <Play size={15} /> : <Pause size={15} />} {paused ? 'Resume' : 'Pause'}</button>}</div>
        {gameStatus !== 'complete' && gameStatus !== 'timeout' && <div className="game-metrics"><div className="metric"><span className="metric-icon"><Clock3 size={17} /></span><div><small>{mode === 'solo' ? 'Elapsed time' : 'Elapsed time'}</small><strong>{formatTime(seconds)}</strong></div></div><div className="metric"><span className="metric-icon"><RotateCcw size={17} /></span><div><small>Moves</small><strong>{moves}</strong></div></div><div className="metric"><span className="metric-icon"><Target size={17} /></span><div><small>Pairs found</small><strong>{matched.length / 2}<em> / {totalPairs}</em></strong></div></div>{mode === 'local' && <div className="metric active-turn"><span className="metric-icon"><Users size={17} /></span><div><small>Current turn</small><strong>{currentName}</strong></div></div>}</div>}
        {mode === 'local' && <div className="scoreboard">{selectedPlayers.map((name, i) => <div key={i} className={activePlayer === i && gameStatus === 'playing' ? 'score-player active' : 'score-player'}><span className="player-avatar">{(name.trim()[0] || '?').toUpperCase()}</span><span className="score-name">{name || `Player ${i + 1}`}</span><strong>{scores[i]}</strong></div>)}</div>}
        {gameStatus === 'playing' && <div className={`card-grid ${settings.pairs >= 18 ? 'dense' : ''} ${settings.pairs >= 24 ? 'extra-dense' : ''}`} style={{ '--columns': gridColumns, '--rows': gridRows, '--card-gap': `${gridGap}px`, '--board-padding': `${gridPadding}px`, '--min-board-height': `${gridRows * 44 + (gridRows - 1) * gridGap + 2 * gridPadding + 2}px`, '--max-board-width': `${maxBoardWidth}px`, '--max-board-height': `${maxBoardHeight}px`, '--max-desktop-board-height': `${maxDesktopBoardHeight}px` }}>{deck.map((card) => { const revealed = flipped.includes(card.id) || matched.includes(card.id); const Icon = card.Icon; return <button key={card.id} className={`memory-card ${revealed ? 'revealed' : ''} ${matched.includes(card.id) ? 'matched' : ''}`} onClick={() => chooseCard(card)} disabled={paused || matched.includes(card.id) || flipped.length >= 2 || flipped.includes(card.id)} aria-label={revealed ? `Card ${card.pair + 1}${matched.includes(card.id) ? ', matched' : ''}` : 'Hidden card'}><span className="card-back"><span className="card-mark">m.</span></span><span className="card-front" style={{ color: matched.includes(card.id) ? 'var(--green)' : card.color }}><Icon size="50%" strokeWidth={2.2} /></span></button>; })}</div>}
        {paused && <div className="pause-overlay"><div className="pause-card"><span className="mode-icon lavender"><Pause size={22} /></span><h2>Take a breather.</h2><p>Your solo timer is paused. Come back when you're ready.</p><button className="btn primary" onClick={handlePauseToggle}><Play size={16} /> Resume game</button></div></div>}
        {(gameStatus === 'complete' || gameStatus === 'timeout') && <div className="results-panel"><div className="result-icon">{gameStatus === 'complete' ? <Trophy size={25} /> : <Clock3 size={25} />}</div><span className="eyebrow">ROUND SUMMARY</span><h2>{gameStatus === 'complete' ? (mode === 'local' ? `${playerNames[scores.indexOf(Math.max(...scores))] || 'Player'} wins!` : 'You did it!') : 'Keep practising.'}</h2><p>{gameStatus === 'complete' ? 'Nice focus. Here are your results.' : 'You can restart and try to beat the timer.'}</p><div className="result-stats"><div><small>Score</small><strong>{mode === 'local' ? Math.max(...scores) * 100 : Math.max(0, Math.round((matched.length / 2) * 100 * settings.multiplier - moves * 5 - seconds))}</strong></div><div><small>Moves</small><strong>{moves}</strong></div><div><small>Time</small><strong>{formatTime(seconds)}</strong></div><div><small>Accuracy</small><strong>{accuracy}%</strong></div></div><div className="result-actions"><button className="btn primary" onClick={() => startGame(mode)}><RotateCcw size={16} /> Play again</button><button className="btn secondary" onClick={() => nav('home')}>Home</button></div></div>}
        {gameStatus === 'playing' && <div className="game-tools">{mode === 'solo' && <button className="btn secondary small-btn" onClick={useHint} disabled={hintUsed}><Sparkles size={15} /> {hintUsed ? 'Hint used' : 'Use a hint'}</button>}<span>Matched cards stay visible. Take your time.</span><button className="icon-btn sound-toggle" title={sound ? 'Mute sound' : 'Enable sound'} aria-label={sound ? 'Mute sound' : 'Enable sound'} onClick={() => setSound((v) => !v)}>{sound ? <Volume2 size={17} aria-hidden="true" /> : <VolumeX size={17} aria-hidden="true" />}</button></div>}
      </section>}

      {page === 'leaderboard' && <section className="content-page"><button className="back-link" onClick={() => nav('home')}><ArrowLeft size={16} /> Back home</button><div className="page-title"><span className="eyebrow">A LITTLE FRIENDLY COMPETITION</span><h1>Leaderboard</h1><p>Your best local results, collected on this device.</p></div><div className="leaderboard-card"><div className="leaderboard-head"><div><div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}><button className={`count-btn ${leaderboardMode === 'overall' ? 'selected' : ''}`} onClick={() => setLeaderboardMode('overall')} style={{ padding: '6px 12px', fontSize: '11px' }}>Overall</button><button className={`count-btn ${leaderboardMode === 'solo' ? 'selected' : ''}`} onClick={() => setLeaderboardMode('solo')} style={{ padding: '6px 12px', fontSize: '11px' }}>Solo</button><button className={`count-btn ${leaderboardMode === 'multiplayer' ? 'selected' : ''}`} onClick={() => setLeaderboardMode('multiplayer')} style={{ padding: '6px 12px', fontSize: '11px' }}>Multiplayer</button></div><p>{leaderboardMode === 'overall' ? 'Aggregate performance across all recorded games' : leaderboardMode === 'solo' ? 'Top solo score per player · Filter by difficulty' : 'Rankings & completed match breakdown · Local device'}</p></div><span className="local-badge"><BarChart3 size={14} /> Local results</span></div>{leaderboardMode === 'solo' && <div className="leaderboard-filters" style={{ display: 'flex', gap: '12px', padding: '14px', flexWrap: 'wrap', borderBottom: '1px solid var(--line)', alignItems: 'center', justifyContent: 'space-between' }}><div style={{ display: 'flex', gap: '8px' }}>{['Easy', 'Normal', 'Medium', 'Hard', 'Extreme'].map((f) => (<button key={f} className={`count-btn ${leaderboardFilter === f ? 'selected' : ''}`} onClick={() => setLeaderboardFilter(f)} style={{ padding: '6px 12px', fontSize: '11px', flex: '0 0 auto', width: 'auto' }}>{f}</button>))}</div><span style={{ fontSize: '12px', color: 'var(--muted)' }}>Showing {leaderboardFilter} difficulty</span></div>}
      {leaderboardMode === 'overall' && (
        overallStats.length ? (
          <div className="leaderboard-list">
            <div className="leader-row overall-row table-header">
              <span>Rank</span>
              <span>Player</span>
              <span style={{ whiteSpace: 'nowrap', textAlign: 'right' }}>Total Score</span>
              <span style={{ textAlign: 'right' }}>Games</span>
              <span style={{ textAlign: 'right' }} title="Confirmed multiplayer wins only">MP Wins</span>
              <span style={{ textAlign: 'center' }}>Details</span>
            </div>
            {overallStats.map((row, i) => {
              const acc = row.moves ? Math.round((row.completedPairs / row.moves) * 100) : 0;
              const isExpanded = expandedPlayer === row.name;
              return (
                <React.Fragment key={row.name || i}>
                  <div className="leader-row overall-row" style={{ cursor: 'pointer' }} onClick={() => setExpandedPlayer(isExpanded ? null : row.name)}>
                    <span className="rank-cell">{renderRankBadge(i + 1)}</span>
                    <span className="leader-player-clean" title={row.name}>
                      <span className="player-display-name">{row.name || 'Player'}</span>
                    </span>
                    <strong style={{ textAlign: 'right' }}>{row.totalScore.toLocaleString()}</strong>
                    <span style={{ textAlign: 'right' }}>{row.gamesPlayed}</span>
                    <span style={{ textAlign: 'right' }}>{row.wins || 0}</span>
                    <span style={{ textAlign: 'center', display: 'flex', justifyContent: 'center' }}>
                      <button
                        type="button"
                        className="row-toggle-btn"
                        aria-label={isExpanded ? `Hide statistics for ${row.name}` : `View statistics for ${row.name}`}
                        onClick={(e) => { e.stopPropagation(); setExpandedPlayer(isExpanded ? null : row.name); }}
                      >
                        {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                      </button>
                    </span>
                  </div>
                  {isExpanded && (
                    <div className="player-expanded-panel">
                      <div className="expanded-stat">
                        <small>Pairs Matched</small>
                        <strong>{row.completedPairs.toLocaleString()}</strong>
                      </div>
                      <div className="expanded-stat">
                        <small>Total Moves</small>
                        <strong>{row.moves.toLocaleString()}</strong>
                      </div>
                      <div className="expanded-stat">
                        <small>Overall Accuracy</small>
                        <strong>{acc}%</strong>
                      </div>
                    </div>
                  )}
                </React.Fragment>
              );
            })}
            <p style={{ fontSize: '11px', color: 'var(--muted)', textAlign: 'right', padding: '10px 16px', margin: 0 }}>
              * MP Wins represents confirmed multiplayer wins only. Solo games are not counted as MP wins.
            </p>
          </div>
        ) : (
          <div className="empty-state">
            <span className="empty-icon"><Trophy size={24} /></span>
            <h3>No scores yet</h3>
            <p>Play your first round and your overall standing will show up here.</p>
            <button className="btn primary" onClick={() => nav('setup')}>Start a game</button>
          </div>
        )
      )}
      {leaderboardMode === 'solo' && (
        bests.length ? (
          <div className="leaderboard-list">
            <div className="leader-row solo-clean-row table-header">
              <span>Rank</span>
              <span>Player</span>
              <span style={{ whiteSpace: 'nowrap', textAlign: 'right' }}>Best Score</span>
              <span style={{ textAlign: 'right' }}>Time</span>
              <span style={{ textAlign: 'right' }}>Moves</span>
              <span style={{ textAlign: 'right' }}>Acc.</span>
              <span style={{ whiteSpace: 'nowrap', textAlign: 'right' }}>Date</span>
            </div>
            {bests.map((row, i) => {
              const acc = row.moves ? Math.round((row.completedPairs / row.moves) * 100) : 0;
              return (
                <div className="leader-row solo-clean-row" key={row.name || (row.id || `${row.date}-${i}`)}>
                  <span className="rank-cell">{renderRankBadge(i + 1)}</span>
                  <span className="leader-player-clean" title={row.name}>
                    <span className="player-display-name">{row.name || 'Player'}</span>
                  </span>
                  <strong style={{ textAlign: 'right' }}>{row.score.toLocaleString()}</strong>
                  <span style={{ textAlign: 'right' }}>{row.seconds ? formatTime(row.seconds) : '—'}</span>
                  <span style={{ textAlign: 'right' }}>{row.moves || 0}</span>
                  <span style={{ textAlign: 'right' }}>{acc}%</span>
                  <span style={{ whiteSpace: 'nowrap', textAlign: 'right' }}>{row.date ? new Date(row.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }) : '—'}</span>
                </div>
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
      {leaderboardMode === 'multiplayer' && (
        <div className="multi-leaderboard-container">
          <div className="multi-section">
            <div className="multi-section-head">
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Trophy size={16} style={{ color: 'var(--accent)' }} />
                <h3 style={{ margin: 0, fontSize: '14px', fontWeight: 700 }}>Top Players</h3>
              </div>
              <span style={{ fontSize: '11px', color: 'var(--muted)' }}>Ranked by MP wins & score</span>
            </div>
            {multiTopPlayers.length ? (
              <div className="leaderboard-list">
                <div className="leader-row multi-top-row table-header">
                  <span>Rank</span>
                  <span>Player</span>
                  <span style={{ whiteSpace: 'nowrap', textAlign: 'right' }}>Total Score</span>
                  <span style={{ textAlign: 'right' }}>Games</span>
                  <span style={{ textAlign: 'right' }}>MP Wins</span>
                </div>
                {multiTopPlayers.map((row, i) => (
                  <div className="leader-row multi-top-row" key={row.name || i}>
                    <span className="rank-cell">{renderRankBadge(row.displayRank ?? (i + 1))}</span>
                    <span className="leader-player-clean" title={row.name}>
                      <span className="player-display-name">{row.name || 'Player'}</span>
                    </span>
                    <strong style={{ textAlign: 'right' }}>{row.totalScore.toLocaleString()}</strong>
                    <span style={{ textAlign: 'right' }}>{row.gamesPlayed}</span>
                    <span style={{ textAlign: 'right', fontWeight: 600, color: row.wins > 0 ? 'var(--green)' : 'inherit' }}>{row.wins}</span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="empty-state" style={{ padding: '28px 16px' }}>
                <span className="empty-icon" style={{ width: '40px', height: '40px', marginBottom: '10px' }}><Users size={20} /></span>
                <h3 style={{ fontSize: '14px' }}>No multiplayer records yet</h3>
                <p style={{ fontSize: '12px' }}>Gather some friends and play local multiplayer on this device.</p>
              </div>
            )}
          </div>

          <div className="multi-section" style={{ marginTop: '24px' }}>
            <div className="multi-section-head">
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Users size={16} style={{ color: 'var(--accent)' }} />
                <h3 style={{ margin: 0, fontSize: '14px', fontWeight: 700 }}>Recent Matches</h3>
              </div>
              <span style={{ fontSize: '11px', color: 'var(--muted)' }}>{multiMatches.length} completed match{multiMatches.length === 1 ? '' : 'es'}</span>
            </div>
            {multiMatches.length ? (
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
            ) : (
              <div className="empty-state" style={{ padding: '28px 16px' }}>
                <p style={{ fontSize: '12px', margin: 0 }}>No completed matches recorded yet.</p>
              </div>
            )}
          </div>
        </div>
      )}
      <div className="leaderboard-note"><Info size={15} /><p>This is a local leaderboard stored in this browser. A shared global leaderboard requires the Supabase backend to be configured.</p></div></div></section>}
      {page === 'history' && <section className="content-page"><button className="back-link" onClick={() => nav('home')}><ArrowLeft size={16} /> Back home</button><div className="page-title"><span className="eyebrow">YOUR PAST ROUNDS</span><h1>Solo Game History</h1><p>All recorded solo games saved on this device.</p></div><div className="leaderboard-card"><div className="leaderboard-head"><div><p>All recorded solo games · Local device</p></div><span className="local-badge"><Clock3 size={14} /> Game history</span></div><div className="leaderboard-filters" style={{ display: 'flex', gap: '12px', padding: '14px', flexWrap: 'wrap', borderBottom: '1px solid var(--line)', alignItems: 'center', justifyContent: 'space-between' }}><div style={{ display: 'flex', gap: '8px' }}>{['Easy', 'Normal', 'Medium', 'Hard', 'Extreme'].map((f) => (<button key={f} className={`count-btn ${historyFilter === f ? 'selected' : ''}`} onClick={() => setHistoryFilter(f)} style={{ padding: '6px 12px', fontSize: '11px', flex: '0 0 auto', width: 'auto' }}>{f}</button>))}</div><div style={{ display: 'flex', gap: '8px' }}><select value={historyPlayerFilter} onChange={(e) => setHistoryPlayerFilter(e.target.value)} style={{ fontSize: '11px', padding: '6px', borderRadius: '6px', border: '1px solid var(--line)', background: 'var(--surface-2)', color: 'var(--text)' }}><option value="">All players</option>{allPlayers.map(p => <option key={p} value={p}>{p}</option>)}</select><select value={historySort} onChange={(e) => setHistorySort(e.target.value)} style={{ fontSize: '11px', padding: '6px', borderRadius: '6px', border: '1px solid var(--line)', background: 'var(--surface-2)', color: 'var(--text)' }}><option value="newest">Newest first</option><option value="score">Highest score</option><option value="time">Fastest time</option></select></div></div>{historyList.filter(r => r.mode === 'solo').length ? <div className="leaderboard-list"><div className="leader-row table-header"><span>No.</span><span>Player</span><span>Diff</span><span style={{ textAlign: 'right' }}>Score</span><span style={{ textAlign: 'right' }}>Time</span><span style={{ textAlign: 'right' }}>Moves</span><span style={{ textAlign: 'right' }}>Acc.</span><span style={{ whiteSpace: 'nowrap', textAlign: 'right' }}>Date</span></div>{historyList.filter(r => r.mode === 'solo').slice(0, 100).map((row, i) => { const acc = row.moves ? Math.round((row.completedPairs / row.moves) * 100) : 0; return <div className="leader-row" key={row.id || `${row.date}-${i}`}><span className="rank">{String(i + 1).padStart(2, '0')}</span><span className="leader-player" title="Solo"><span className="player-avatar">{(row.name || 'P')[0].toUpperCase()}</span>{row.name || 'Player'}</span><span>{row.difficulty}</span><strong style={{ textAlign: 'right' }}>{row.score.toLocaleString()}</strong><span style={{ textAlign: 'right' }}>{row.seconds ? formatTime(row.seconds) : '—'}</span><span style={{ textAlign: 'right' }}>{row.moves || 0}</span><span style={{ textAlign: 'right' }}>{acc}%</span><span style={{ whiteSpace: 'nowrap', textAlign: 'right' }}>{row.date ? new Date(row.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }) : '—'}</span></div>; })}</div> : <div className="empty-state"><span className="empty-icon"><Clock3 size={24} /></span><h3>No games yet</h3><p>Complete a solo round and your results will show up here.</p><button className="btn primary" onClick={() => nav('setup')}>Start a game</button></div>}<div className="leaderboard-note"><Info size={15} /><p>Your game history is stored locally in this browser.</p></div></div></section>}
      {page === 'multiplayer_history' && <section className="content-page"><button className="back-link" onClick={() => nav('home')}><ArrowLeft size={16} /> Back home</button><div className="page-title"><span className="eyebrow">YOUR PAST ROUNDS</span><h1>Multiplayer History</h1><p>All recorded multiplayer matches on this device.</p></div><div className="leaderboard-card"><div className="leaderboard-head"><div><p>All recorded multiplayer games · Local device</p></div><span className="local-badge"><Users size={14} /> Match history</span></div><div className="leaderboard-filters" style={{ display: 'flex', gap: '12px', padding: '14px', flexWrap: 'wrap', borderBottom: '1px solid var(--line)', alignItems: 'center', justifyContent: 'space-between' }}><div style={{ display: 'flex', gap: '8px' }}>{['Easy', 'Normal', 'Medium', 'Hard', 'Extreme'].map((f) => (<button key={f} className={`count-btn ${historyFilter === f ? 'selected' : ''}`} onClick={() => setHistoryFilter(f)} style={{ padding: '6px 12px', fontSize: '11px', flex: '0 0 auto', width: 'auto' }}>{f}</button>))}</div><div style={{ display: 'flex', gap: '8px' }}><select value={historyPlayerFilter} onChange={(e) => setHistoryPlayerFilter(e.target.value)} style={{ fontSize: '11px', padding: '6px', borderRadius: '6px', border: '1px solid var(--line)', background: 'var(--surface-2)', color: 'var(--text)' }}><option value="">All players</option>{allPlayers.map(p => <option key={p} value={p}>{p}</option>)}</select><select value={historySort} onChange={(e) => setHistorySort(e.target.value)} style={{ fontSize: '11px', padding: '6px', borderRadius: '6px', border: '1px solid var(--line)', background: 'var(--surface-2)', color: 'var(--text)' }}><option value="newest">Newest first</option><option value="score">Highest score</option><option value="time">Fastest time</option></select></div></div>{historyList.filter(r => r.mode !== 'solo').length ? <div className="match-list" style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '16px' }}>{(() => {
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
      {page === 'profile' && <section className="content-page"><button className="back-link" onClick={() => nav('home')}><ArrowLeft size={16} /> Back home</button><div className="page-title"><span className="eyebrow">YOUR PROGRESS</span><h1>Player profile</h1><p>Your stats and records on this device.</p></div><div className="profile-card"><div className="profile-identity"><div className="profile-avatar">{(customName.trim()[0] || 'P').toUpperCase()}</div><div><h2>{customName || 'Player'}</h2><p>MindFlip player <span className="local-badge">Local profile</span></p></div></div><label className="field-label profile-name-field">Display name<input value={customName} maxLength={20} onChange={(e) => setCustomName(e.target.value)} placeholder="Your name" /></label><div className="profile-stats"><div><small>Games played</small><strong>{persisted.gamesPlayed || 0}</strong></div><div><small>Pairs matched</small><strong>{persisted.totalPairs || 0}</strong></div><div><small>Best solo score</small><strong>{bestSolo ? bestSolo.score.toLocaleString() : '—'}</strong></div></div><p className="profile-help"><Info size={15} /> Your local profile is saved in this browser. Sign-in and cross-device syncing can be added with Supabase.</p></div></section>}

      {page === 'settings' && <section className="content-page"><button className="back-link" onClick={() => nav('home')}><ArrowLeft size={16} /> Back home</button><div className="page-title"><span className="eyebrow">MAKE IT COMFORTABLE</span><h1>Settings</h1><p>A few small things to make MindFlip feel like yours.</p></div><div className="settings-card"><div className="setting-row"><span className="setting-icon"><dark-icon>{dark ? <Moon size={19} /> : <Sun size={19} />}</dark-icon></span><div className="setting-copy"><strong>Appearance</strong><small>Choose a theme that's comfortable for you.</small></div><button className="toggle-pill" onClick={() => setDark((v) => !v)}>{dark ? 'Dark' : 'Light'}<span className={dark ? 'toggle-knob on' : 'toggle-knob'} /></button></div><div className="setting-row"><span className="setting-icon">{sound ? <Volume2 size={19} /> : <VolumeX size={19} />}</span><div className="setting-copy"><strong>Sound effects</strong><small>Play a subtle sound when you find a match.</small></div><button className={sound ? 'switch on' : 'switch'} aria-label="Toggle sound" onClick={() => setSound((v) => !v)}><span /></button></div><div className="setting-row"><span className="setting-icon"><BarChart3 size={19} /></span><div className="setting-copy"><strong>Local data</strong><small>Clear this browser's saved results and preferences.</small></div><button className="btn danger-btn" onClick={() => { if (window.confirm('Clear local game history and saved statistics?')) { const clean = { displayName: customName }; setPersisted(clean); saveStore({ ...clean, dark, sound }); toast('Local history cleared.'); } }}><Trash2 size={14} aria-hidden="true" /> Clear data</button></div><div className="settings-foot"><Info size={15} /><p>MindFlip is a work-in-progress starter. Online rooms, accounts, and global rankings require Supabase configuration before they can be used across devices.</p></div></div></section>}

      {page === 'online' && <section className="content-page"><button className="back-link" onClick={() => nav('home')}><ArrowLeft size={16} /> Back home</button><div className="page-title" style={{ textAlign: 'center', margin: '40px 0 20px' }}><span className="local-badge" style={{ display: 'inline-block', marginBottom: '16px', background: 'var(--surface-2)', border: '1px solid var(--line)' }}><Sparkles size={14} /> COMING SOON</span><h1 style={{ marginBottom: '12px' }}>Online Multiplayer</h1><p style={{ maxWidth: '400px', margin: '0 auto', fontSize: '15px' }}>Play MindFlip with friends, wherever they are.</p></div><div className="settings-card" style={{ maxWidth: '500px', margin: '0 auto', textAlign: 'center', padding: '40px 20px' }}><div className="mode-icon peach" style={{ width: '60px', height: '60px', margin: '0 auto 24px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Globe2 size={32} /></div><p style={{ color: 'var(--muted)', lineHeight: '1.6', marginBottom: '32px', maxWidth: '400px', margin: '0 auto' }}>We're working on online multiplayer, including private rooms, friend invitations, and real-time matches. Stay tuned for updates.</p><div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px', textAlign: 'left', marginBottom: '32px' }}><div style={{ display: 'flex', alignItems: 'center', gap: '12px', background: 'var(--surface-2)', padding: '12px 16px', borderRadius: '12px', border: '1px solid var(--line)' }}><Lock size={18} style={{ color: 'var(--text)' }} /><span style={{ fontSize: '13px', fontWeight: 500 }}>Private Rooms</span></div><div style={{ display: 'flex', alignItems: 'center', gap: '12px', background: 'var(--surface-2)', padding: '12px 16px', borderRadius: '12px', border: '1px solid var(--line)' }}><Users size={18} style={{ color: 'var(--text)' }} /><span style={{ fontSize: '13px', fontWeight: 500 }}>Invite Friends</span></div><div style={{ display: 'flex', alignItems: 'center', gap: '12px', background: 'var(--surface-2)', padding: '12px 16px', borderRadius: '12px', border: '1px solid var(--line)' }}><Zap size={18} style={{ color: 'var(--text)' }} /><span style={{ fontSize: '13px', fontWeight: 500 }}>Real-Time Matches</span></div><div style={{ display: 'flex', alignItems: 'center', gap: '12px', background: 'var(--surface-2)', padding: '12px 16px', borderRadius: '12px', border: '1px solid var(--line)' }}><Trophy size={18} style={{ color: 'var(--text)' }} /><span style={{ fontSize: '13px', fontWeight: 500 }}>Online Leaderboards</span></div></div><button className="btn primary" onClick={() => nav('home')} style={{ padding: '0 32px' }}>Back to Home</button></div></section>}
      {page === 'how_to_play' && <section className="content-page"><button className="back-link" onClick={() => nav('home')}><ArrowLeft size={16} /> Back home</button><div className="page-title"><span className="eyebrow">LEARN THE RULES</span><h1>How to Play MindFlip</h1><p>Train your memory, sharpen your focus, and make every move count.</p></div><div className="section-block"><div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 280px), 1fr))', gap: '16px' }}><div className="setup-panel"><div className="panel-heading"><span className="step-number"><Info size={14} /></span><div><h3>Game Basics</h3></div></div><ul style={{ fontSize: '13px', color: 'var(--muted)', margin: 0, paddingLeft: '16px', lineHeight: '1.6' }}><li>Cards are placed face down.</li><li>Select two cards to reveal them.</li><li>If they match, they remain matched.</li><li>If they do not match, they are turned face down again.</li><li>Remember card positions to find matching pairs.</li><li>Complete all pairs before the timer runs out.</li></ul></div><div className="setup-panel"><div className="panel-heading"><span className="step-number"><UserRound size={14} /></span><div><h3>Game Modes</h3></div></div><ul style={{ fontSize: '13px', color: 'var(--muted)', margin: 0, paddingLeft: '16px', lineHeight: '1.6' }}><li><strong>Solo:</strong> Play alone and challenge your memory.</li><li><strong>Local Multiplayer:</strong> Play with 2–4 players on the same device.</li><li><strong>Online Multiplayer:</strong> (Coming Soon)</li></ul></div><div className="setup-panel"><div className="panel-heading"><span className="step-number"><Zap size={14} /></span><div><h3>Difficulty Levels</h3></div></div><ul style={{ fontSize: '13px', color: 'var(--muted)', margin: 0, paddingLeft: '16px', lineHeight: '1.6' }}><li><strong>Easy:</strong> 4 × 3 grid, 12 cards, 6 pairs, 1.5 minutes.</li><li><strong>Normal:</strong> 4 × 4 grid, 16 cards, 8 pairs, 2 minutes.</li><li><strong>Medium:</strong> 6 × 4 grid, 24 cards, 12 pairs, 3 minutes.</li><li><strong>Hard:</strong> 6 × 6 grid, 36 cards, 18 pairs, 4 minutes.</li><li><strong>Extreme:</strong> 8 × 6 grid, 48 cards, 24 pairs, 5 minutes.</li></ul></div><div className="setup-panel"><div className="panel-heading"><span className="step-number"><Sparkles size={14} /></span><div><h3>Card Themes</h3></div></div><ul style={{ fontSize: '13px', color: 'var(--muted)', margin: 0, paddingLeft: '16px', lineHeight: '1.6' }}><li><strong>Random:</strong> Selects one theme for the current match.</li><li><strong>Symbols</strong></li><li><strong>Nature</strong></li><li><strong>Tech</strong></li><li><strong>Everyday</strong></li></ul><p style={{ fontSize: '12px', color: 'var(--muted)', marginTop: '8px' }}>Random chooses a theme for the match and does not change the theme between cards during that match.</p></div><div className="setup-panel"><div className="panel-heading"><span className="step-number"><Target size={14} /></span><div><h3>Scoring and Accuracy</h3></div></div><ul style={{ fontSize: '13px', color: 'var(--muted)', margin: 0, paddingLeft: '16px', lineHeight: '1.6' }}><li>A move represents one completed attempt involving two cards.</li><li>Points are awarded for pairs, with faster completion and fewer moves yielding a higher score.</li><li><strong>Accuracy:</strong> successful matching attempts divided by total completed attempts, multiplied by 100.</li><li>If no attempts have been completed, accuracy is 0%.</li></ul></div><div className="setup-panel"><div className="panel-heading"><span className="step-number"><Users size={14} /></span><div><h3>Local Multiplayer Rules</h3></div></div><ul style={{ fontSize: '13px', color: 'var(--muted)', margin: 0, paddingLeft: '16px', lineHeight: '1.6' }}><li>Each player has their own score and statistics.</li><li>A correct match keeps the turn with the current player (if configured).</li><li>A mismatch passes the turn to the next player.</li><li>The game ends when all pairs are matched or the overall timer runs out.</li></ul></div><div className="setup-panel" style={{ gridColumn: '1 / -1' }}><div className="panel-heading"><span className="step-number"><Star size={14} /></span><div><h3>Tips for Better Results</h3></div></div><ul style={{ fontSize: '13px', color: 'var(--muted)', margin: 0, paddingLeft: '16px', lineHeight: '1.6' }}><li>Pay attention to card positions.</li><li>Start with the easiest difficulty if you are new.</li><li>Avoid random guessing.</li><li>Improve your accuracy by remembering previously revealed cards.</li></ul><div style={{ display: 'flex', gap: '12px', marginTop: '24px', flexWrap: 'wrap' }}><button className="btn primary" onClick={() => { setMode('solo'); nav('setup'); }}>Play Solo <ChevronRight size={17} /></button><button className="btn secondary" onClick={() => { setMode('local'); nav('setup'); }}><Users size={17} /> Play Together</button></div></div></div></div></section>}
      {page === 'about_developer' && <section className="content-page"><button className="back-link" onClick={() => nav('home')}><ArrowLeft size={16} /> Back home</button><div className="page-title"><span className="eyebrow">ABOUT THE DEVELOPER</span><h1>Built by JB Devs</h1></div>
        <div className="about-sections" style={{ display: 'flex', flexDirection: 'column', gap: '24px', marginTop: '32px' }}>
          
          <div className="section-block about-card profile-intro-card">
            <div className="profile-header">
              <div className="profile-photo-container">
                <img src="/images/developer-profile.jpg" alt="Developer profile photo" className="profile-photo" onError={(e) => { e.currentTarget.style.display = 'none'; const placeholder = e.currentTarget.nextElementSibling; if (placeholder) placeholder.style.display = 'flex'; }} />
                <div className="mode-icon peach profile-photo-placeholder" style={{ display: 'none', margin: 0, width: '100%', height: '100%', alignItems: 'center', justifyContent: 'center', borderRadius: 'inherit' }}>
                  <User size={32} />
                </div>
              </div>
              <div className="profile-content">
                <h2 style={{ margin: 0, fontSize: '22px', letterSpacing: '-0.5px' }}>Hi, I'm Jithu Biju</h2>
                <span className="local-badge" style={{ marginTop: '6px', display: 'inline-block', marginBottom: '16px' }}>BCA Graduate (2026)</span>
                <p style={{ color: 'var(--muted)', lineHeight: '1.6', fontSize: '14px', margin: 0 }}>
                  Hi, I'm a BCA graduate with a strong interest in web development and building practical digital experiences. I enjoy turning ideas into functional, user-friendly websites and applications while continuously improving my development skills.
                </p>
              </div>
            </div>
          </div>

          <div className="section-block about-card">
            <h3 style={{ marginBottom: '16px', fontSize: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}><Code2 size={18} style={{ color: 'var(--accent)' }}/> What I Do</h3>
            <ul style={{ color: 'var(--muted)', fontSize: '14px', lineHeight: '1.6', paddingLeft: '20px', margin: 0, display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <li>Building responsive and user-friendly web interfaces.</li>
              <li>Developing interactive applications using JavaScript and React.</li>
              <li>Learning and building full-stack applications using the MERN stack.</li>
              <li>Working with backend technologies, APIs, and databases.</li>
              <li>Improving usability, functionality, and overall user experience.</li>
            </ul>
          </div>

          <div className="section-block about-card">
            <h3 style={{ marginBottom: '20px', fontSize: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}><Cpu size={18} style={{ color: 'var(--accent)' }}/> Technologies I Work With</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }}>
              <div>
                <span className="eyebrow" style={{ display: 'block', marginBottom: '12px' }}>Frontend</span>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  <span className="tech-badge mern-badge">React</span>
                  <span className="tech-badge">JavaScript</span>
                  <span className="tech-badge">HTML</span>
                  <span className="tech-badge">CSS</span>
                </div>
              </div>
              
              <div>
                <span className="eyebrow" style={{ display: 'block', marginBottom: '12px' }}>Backend</span>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  <span className="tech-badge mern-badge">Node.js</span>
                  <span className="tech-badge mern-badge">Express.js</span>
                  <span className="tech-badge">Python</span>
                  <span className="tech-badge">Django</span>
                  <span className="tech-badge">PHP</span>
                </div>
              </div>

              <div>
                <span className="eyebrow" style={{ display: 'block', marginBottom: '12px' }}>Databases</span>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  <span className="tech-badge mern-badge">MongoDB</span>
                  <span className="tech-badge">MySQL</span>
                  <span className="tech-badge">SQLite</span>
                </div>
              </div>

              <div>
                <span className="eyebrow" style={{ display: 'block', marginBottom: '12px' }}>Tools</span>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  <span className="tech-badge">Git</span>
                  <span className="tech-badge">GitHub</span>
                  <span className="tech-badge">VS Code</span>
                </div>
              </div>
            </div>
          </div>



          <div className="section-block about-card">
            <h3 style={{ marginBottom: '12px', fontSize: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}><Brain size={18} style={{ color: 'var(--accent)' }}/> Why MindFlip?</h3>
            <p style={{ color: 'var(--muted)', lineHeight: '1.6', fontSize: '14px', margin: '0 0 12px 0' }}>
              MindFlip is a memory-card game project built to make improving memory and concentration enjoyable. It brings together interactive gameplay, multiple difficulty levels, card themes, solo challenges, and local multiplayer in one experience.
            </p>
            <p style={{ color: 'var(--muted)', lineHeight: '1.6', fontSize: '14px', margin: 0 }}>
              This project is part of my ongoing journey in building interactive web applications.
            </p>
          </div>

          <div className="section-block about-card">
            <h3 style={{ marginBottom: '16px', fontSize: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}><Link2 size={18} style={{ color: 'var(--accent)' }}/> Connect With Me</h3>
            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
              <a href="https://jithu-portfolio-alpha.vercel.app/" target="_blank" rel="noreferrer" className="btn secondary"><Briefcase size={16} /> Portfolio</a>
              <a href="https://www.linkedin.com/in/jithu-biju-/" target="_blank" rel="noreferrer" className="btn secondary"><Linkedin size={16} /> LinkedIn</a>
              <a href="https://www.instagram.com/j.i.t.h.u_/" target="_blank" rel="noreferrer" className="btn secondary"><Instagram size={16} /> Instagram</a>
            </div>
          </div>
        </div>
      </section>}
    </main>
    {!isGameplayActive && <footer className="footer-new">
      <div className="footer-content">
        <div className="footer-brand-area">
          <div className="footer-brand" style={{ marginBottom: '12px' }}>
            <span className="brand-mark small"><img src="/logo.png" alt="MindFlip logo" /></span>
            <span><strong>mindflip</strong></span>
          </div>
          <p style={{ color: 'var(--muted)', fontSize: '13px', lineHeight: '1.5', maxWidth: '250px', margin: 0 }}>
            Flip cards, match pairs, and challenge your memory.
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
        <span style={{ fontSize: '12px', color: 'var(--muted)', fontWeight: 500 }}>MindFlip v1.0.1</span>
      </div>
    </footer>}
    {notice && <div className="toast" role="status"><Check size={16} />{notice}</div>}
    {showHelp && <div className="modal-backdrop" onClick={() => setShowHelp(false)}><section className="help-modal" onClick={(e) => e.stopPropagation()}><button className="modal-close" onClick={() => setShowHelp(false)} aria-label="Close help"><X size={18} /></button><span className="mode-icon lavender"><Brain size={22} /></span><h2>How to play</h2><p>Flip two cards and look for matching symbols. In solo mode, try to finish with fewer moves. In local multiplayer, collect the most pairs to win.</p><div className="help-rule"><span>01</span><p><strong>Flip</strong><br />Choose any two hidden cards.</p></div><div className="help-rule"><span>02</span><p><strong>Match</strong><br />Matching pairs stay face up and score a point in multiplayer.</p></div><div className="help-rule"><span>03</span><p><strong>Remember</strong><br />If the cards don't match, they turn back over. Use what you saw next turn.</p></div><button className="btn primary full-btn" onClick={() => setShowHelp(false)}>Got it</button></section></div>}
  </div>;
}

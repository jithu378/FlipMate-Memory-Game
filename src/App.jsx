import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  Brain, Moon, Sun, Volume2, VolumeX, Trophy, Users, UserRound, Globe2,
  Settings, ArrowLeft, RotateCcw, Pause, Play, Clock3, Target, Zap,
  Sparkles, Medal, ChevronRight, X, Check, Copy, Info, House, BarChart3,
  Trash2, LogIn, ArrowRight, User,
  Circle, Square, Triangle, Hexagon, Octagon, Star, Diamond, Heart, Cloud, Umbrella, Music, Droplet, Flame, Snowflake, Shield, Crown, Anchor, Flag, Gem, Bell,
  Leaf, Trees, TreePine, Flower, Flower2, Bug, Bird, Rabbit, Snail, Turtle, Fish, Mountain, MountainSnow, Waves, CloudRain, CloudLightning, Wind, Sprout, Feather, Clover, Rat, Worm, Apple, Cherry,
  Laptop, Smartphone, Gamepad2, Headphones, Camera, Watch, Keyboard, Mouse, Tv, Speaker, HardDrive, Printer, Battery, Plug, Cpu, Wifi, Bluetooth, Radio, Calculator, Lightbulb, Monitor, Tablet, Mic, Webcam,
  Coffee, Book, Pencil, Scissors, Ticket, Gift, Plane, Car, Bus, Train, Bike, Compass, Map, Briefcase, ShoppingCart, CreditCard, Glasses, Key, Lock, Mail, Phone, Video
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
  const [page, setPage] = useState('home');
  const [mode, setMode] = useState('solo');
  const [difficulty, setDifficulty] = useState('Normal');
  const [theme, setTheme] = useState('Symbols');
  const [playerNames, setPlayerNames] = useState(['Player 1', 'Player 2', 'Player 3', 'Player 4']);
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
  const [leaderboardMode, setLeaderboardMode] = useState('solo');
  const [historyFilter, setHistoryFilter] = useState('Easy');
  const [historySort, setHistorySort] = useState('newest');
  const [historyPlayerFilter, setHistoryPlayerFilter] = useState('');
  const [showHelp, setShowHelp] = useState(false);
  const startAt = useRef(null);
  const activeGameId = useRef(null);
  const recordedGameId = useRef(null);
  const hintTimer = useRef(null);
  const noticeTimer = useRef(null);
  const settings = DIFFICULTIES[difficulty];
  const isMultiplayer = mode === 'local';
  const currentName = playerNames[activePlayer] || `Player ${activePlayer + 1}`;
  const totalPairs = settings.pairs;
  const complete = matched.length === deck.length && deck.length > 0;
  const accuracy = moves ? Math.round((matched.length / 2 / moves) * 100) : 0;
  const isGameplayActive = page === 'game' && (gameStatus === 'playing' || gameStatus === 'paused');

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

  const toast = (message) => { setNotice(message); window.clearTimeout(noticeTimer.current); noticeTimer.current = window.setTimeout(() => setNotice(''), 2600); };
  const startGame = (chosenMode = mode) => {
    window.clearTimeout(hintTimer.current);
    activeGameId.current = createGameId();
    recordedGameId.current = null;
    setMode(chosenMode);
    const pairs = DIFFICULTIES[difficulty].pairs;
    setDeck(makeDeck(pairs, theme)); setFlipped([]); setMatched([]); setScores([0, 0, 0, 0]); setPlayerMoves([0, 0, 0, 0]); setActivePlayer(0); setMoves(0); setSeconds(0); setPaused(false); setRunning(true); setGameStatus('playing'); setHintUsed(false); startAt.current = Date.now(); setPage('game');
  };
  const finishGame = useCallback((gameId, timedOut = false, completedPairs = matched.length / 2) => {
    if (!gameId || activeGameId.current !== gameId || recordedGameId.current === gameId) return;
    recordedGameId.current = gameId;
    setRunning(false); setPaused(false); setGameStatus(timedOut ? 'timeout' : 'complete');
    const current = readStore();
    const result = { id: gameId, mode, difficulty, score: isMultiplayer ? Math.max(...scores) * 100 : Math.max(0, Math.round(completedPairs * 100 * settings.multiplier - moves * 5 - seconds)), moves, seconds, completedPairs, date: new Date().toISOString(), name: isMultiplayer ? playerNames[scores.indexOf(Math.max(...scores))] : (customName || 'Player') };
    const isMeaningful = moves > 0;
    let newHistoryItems = [];
    let updatedMultiWins = { ...(current.multiplayerWins || {}) };
    
    if (isMeaningful) {
      if (isMultiplayer) {
        const playerStats = [];
        for (let i = 0; i < playerCount; i++) {
          if (playerMoves[i] > 0 || scores[i] > 0) {
            playerStats.push({
              index: i,
              score: Math.max(0, Math.round(scores[i] * 100 * settings.multiplier - playerMoves[i] * 5 - seconds)),
              pairs: scores[i]
            });
          }
        }
        
        let winnerIndex = -1;
        let isTie = false;
        
        if (playerStats.length > 0) {
          playerStats.sort((a, b) => {
            if (b.score !== a.score) return b.score - a.score;
            return b.pairs - a.pairs;
          });
          
          if (playerStats.length === 1) {
            winnerIndex = playerStats[0].index;
          } else {
            const first = playerStats[0];
            const second = playerStats[1];
            if (first.score === second.score && first.pairs === second.pairs) {
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
  const { bests, multiBests, historyList, allPlayers, multiWins } = useMemo(() => {
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

    return { bests: bestsArray.slice(0, 50), multiBests: multiBestsArray.slice(0, 50), historyList: hList, allPlayers: Array.from(pSet), multiWins };
  }, [persisted.history, persisted.multiplayerWins, leaderboardFilter, historyFilter, historySort, historyPlayerFilter]);
  const bestSolo = (persisted.history || []).filter((r) => r.mode === 'solo').sort((a, b) => b.score - a.score)[0];
  const nav = (next) => {
    if (next !== page) {
      if (next === 'leaderboard') setLeaderboardFilter('Easy');
      if (next === 'history' || next === 'multiplayer_history') setHistoryFilter('Easy');
    }
    setPage(next);
    setNotice('');
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
    {!isGameplayActive && <header className="topbar">
      <button className="brand" onClick={() => nav('home')} aria-label="MindFlip home"><span className="brand-mark"><img src="/logo.png" alt="MindFlip logo" /></span><span><strong>mindflip</strong><small>by JB Devs</small></span></button>
      <nav className="main-nav" aria-label="Main navigation">
        <button className={page === 'home' ? 'nav-link active' : 'nav-link'} onClick={() => nav('home')}><House size={16} /> Home</button>
        <button className={page === 'leaderboard' ? 'nav-link active' : 'nav-link'} onClick={() => nav('leaderboard')}><Trophy size={16} /> Leaderboard</button>
        <button className={page === 'history' ? 'nav-link active' : 'nav-link'} onClick={() => nav('history')}><Clock3 size={16} /> Solo History</button>
        <button className={page === 'multiplayer_history' ? 'nav-link active' : 'nav-link'} onClick={() => nav('multiplayer_history')}><Users size={16} /> Multiplayer History</button>
        <button className={page === 'profile' ? 'nav-link active' : 'nav-link'} onClick={() => nav('profile')}><UserRound size={16} /> Profile</button>
      </nav>
      <div className="top-actions"><button className="icon-btn" title={dark ? 'Switch to light mode' : 'Switch to dark mode'} aria-label={dark ? 'Switch to light mode' : 'Switch to dark mode'} onClick={() => setDark((v) => !v)}>{dark ? <Sun size={18} aria-hidden="true" /> : <Moon size={18} aria-hidden="true" />}</button><button className="icon-btn" title="Settings" aria-label="Settings" onClick={() => nav('settings')}><Settings size={18} aria-hidden="true" /></button><button className="avatar" aria-label="Profile" onClick={() => nav('profile')}>{(customName.trim()[0] || 'P').toUpperCase()}</button></div>
    </header>}

    <main className="container">
      {page === 'home' && <>
        <section className="hero"><div className="hero-copy"><span className="eyebrow"><span className="eyebrow-dot" /> A LITTLE CHALLENGE FOR YOUR MIND</span><h1>Make every<br /><span>move count.</span></h1><p>A simple game of memory. A friendly test of focus. Play your way, alone or together.</p><div className="hero-actions"><button className="btn primary" onClick={() => { setMode('solo'); nav('setup'); }}>Play solo <ChevronRight size={17} /></button><button className="btn secondary" onClick={() => { setMode('local'); nav('setup'); }}><Users size={17} /> Play together</button></div><div className="hero-meta"><span><Check size={14} /> Free to play</span><span><Check size={14} /> No install needed</span></div></div><div className="hero-art" aria-label="Decorative memory cards"><div className="floating-card card-one"><span>◆</span></div><div className="floating-card card-two"><span>●</span></div><div className="floating-card card-three"><span>▲</span></div><div className="art-caption"><span className="caption-dot" /> YOUR NEXT LITTLE WIN</div></div></section>
        <section className="quick-stats"><div className="stat"><span className="stat-icon"><Target size={18} /></span><div><small>Games played</small><strong>{persisted.gamesPlayed || 0}</strong></div></div><div className="stat"><span className="stat-icon"><Trophy size={18} /></span><div><small>Personal best</small><strong>{bestSolo ? bestSolo.score.toLocaleString() : '—'}</strong></div></div><div className="stat"><span className="stat-icon"><Sparkles size={18} /></span><div><small>Pairs matched</small><strong>{persisted.totalPairs || 0}</strong></div></div></section>
        <section className="section-block"><div className="section-heading"><div><span className="eyebrow">CHOOSE YOUR STYLE</span><h2>How do you want to play?</h2></div><span className="section-note">One game. Your rules.</span></div><div className="mode-grid"><button className="mode-card" onClick={() => { setMode('solo'); nav('setup'); }}><span className="mode-icon lavender"><UserRound size={22} /></span><span className="mode-title">Solo challenge</span><span className="mode-description">Beat your best score and sharpen your memory.</span><span className="mode-footer">Play alone <ChevronRight size={16} /></span></button><button className="mode-card" onClick={() => { setMode('local'); nav('setup'); }}><span className="mode-icon mint"><Users size={22} /></span><span className="mode-title">Local multiplayer</span><span className="mode-description">Take turns with 2–4 players on one device.</span><span className="mode-footer">Play together <ChevronRight size={16} /></span></button><button className="mode-card" onClick={() => nav('online')}><span className="mode-icon peach"><Globe2 size={22} /></span><span className="mode-title">Online multiplayer</span><span className="mode-description">Create a room and challenge friends on their devices.</span><span className="mode-footer">Explore online <ChevronRight size={16} /></span><span className="coming-badge">Backend setup needed</span></button></div></section>
        <section className="bottom-strip"><div className="strip-icon"><Trophy size={20} /></div><div><strong>Ready to climb the rankings?</strong><p>Your local results are saved on this device. Online rankings can be enabled with Supabase.</p></div><button className="btn text-btn" onClick={() => nav('leaderboard')}>View scores <ChevronRight size={16} /></button></section>
      </>}

      {page === 'setup' && <section className="setup-wrap"><button className="back-link" onClick={() => nav('home')}><ArrowLeft size={16} /> Back home</button><div className="page-title"><span className="eyebrow">MAKE IT YOUR GAME</span><h1>{mode === 'solo' ? 'Solo challenge' : 'Play together'}</h1><p>{mode === 'solo' ? 'Pick a difficulty, choose a theme, and see how sharp your memory is.' : 'Add your players, pick a challenge, and pass the device around.'}</p></div><div className="setup-grid"><div className="setup-panel"><div className="panel-heading"><span className="step-number">01</span><div><h3>Choose difficulty</h3><p>More pairs means a bigger challenge.</p></div></div><div className="difficulty-list">{Object.entries(DIFFICULTIES).map(([name, value]) => <button key={name} className={difficulty === name ? 'difficulty-option selected' : 'difficulty-option'} onClick={() => setDifficulty(name)}><span className="radio-dot" /><span className="difficulty-label"><strong>{name}</strong><small>{value.pairs} pairs · {value.time / 60} min</small></span><span className="difficulty-size">{name === 'Easy' ? '4 × 3' : name === 'Normal' ? '4 × 4' : name === 'Medium' ? '6 × 4' : name === 'Hard' ? '6 × 6' : '8 × 6'}</span></button>)}</div><div className="panel-heading theme-heading"><span className="step-number">02</span><div><h3>Choose a card theme</h3><p>Just a little personality.</p></div></div><div className="theme-options">{Object.keys(THEMES).map((name) => <button key={name} className={theme === name ? 'theme-option selected' : 'theme-option'} onClick={() => setTheme(name)}><span style={{ display: 'flex', gap: '4px', opacity: 0.8 }}>{name === 'Symbols' ? <><Circle size={14} /><Triangle size={14} /><Square size={14} /></> : name === 'Nature' ? <><Leaf size={14} /><Flower size={14} /><Bird size={14} /></> : name === 'Tech' ? <><Laptop size={14} /><Gamepad2 size={14} /><Cpu size={14} /></> : <><Coffee size={14} /><Book size={14} /><Gift size={14} /></>}</span><span>{name}</span></button>)}</div></div><div className="setup-panel players-panel"><div className="panel-heading"><span className="step-number">03</span><div><h3>{mode === 'solo' ? 'Your player name' : 'Meet the players'}</h3><p>{mode === 'solo' ? 'Your name appears in your results.' : 'Choose between two and four players.'}</p></div></div>{mode === 'solo' ? <label className="field-label">Display name<input value={customName} maxLength={20} onChange={(e) => setCustomName(e.target.value)} placeholder="Enter your name" /></label> : <><div className="player-count">{[2, 3, 4].map((n) => <button key={n} className={playerCount === n ? 'count-btn selected' : 'count-btn'} onClick={() => setPlayerCount(n)}>{n} players</button>)}</div><div className="player-fields">{selectedPlayers.map((name, i) => <label key={i} className="field-label">Player {i + 1}<input maxLength={20} value={name} onChange={(e) => setPlayerNames((old) => old.map((n, j) => j === i ? e.target.value : n))} placeholder={`Player ${i + 1}`} /></label>)}</div><label className="check-row"><input type="checkbox" checked={turnBased} onChange={(e) => setTurnBased(e.target.checked)} /><span><strong>Matching pair earns another turn</strong><small>Turn passes to the next player after a mismatch.</small></span></label></>}
        <div className="setup-summary"><div><span>Game mode</span><strong>{mode === 'solo' ? 'Solo' : `${playerCount} players`}</strong></div><div><span>Board</span><strong>{settings.pairs * 2} cards</strong></div><div><span>Difficulty</span><strong>{difficulty}</strong></div></div><button className="btn primary full-btn" onClick={() => startGame(mode)}>{mode === 'solo' ? 'Start challenge' : 'Start game'} <ChevronRight size={17} /></button><p className="fine-print"><Info size={13} /> No account needed to play locally.</p></div></div></section>}

      {page === 'game' && <section className={`game-wrap ${isMultiplayer ? 'multiplayer' : ''}`}><div className="game-top"><button className="back-link" onClick={() => { setRunning(false); nav('home'); }}><ArrowLeft size={16} /> Leave game</button><span className="game-chip">{mode === 'solo' ? 'SOLO CHALLENGE' : 'LOCAL MULTIPLAYER'} · {difficulty.toUpperCase()}</span><button className="icon-btn" title="Restart game" aria-label="Restart game" onClick={resetGame}><RotateCcw size={17} aria-hidden="true" /></button></div><div className="game-heading"><div><span className="eyebrow">STAY FOCUSED</span><h1>{gameStatus === 'playing' ? 'Find your pairs.' : gameStatus === 'complete' ? 'Nicely done!' : gameStatus === 'timeout' ? 'Time is up.' : 'Ready when you are.'}</h1><p>{gameStatus === 'complete' ? 'Here is how you did this round.' : gameStatus === 'timeout' ? 'Every attempt helps you improve. Give it another go.' : mode === 'solo' ? 'Find all matching pairs with as few moves as possible.' : `${currentName}'s turn — find a pair to score a point.`}</p></div>{gameStatus === 'playing' && <button className="btn secondary small-btn" onClick={handlePauseToggle}>{paused ? <Play size={15} /> : <Pause size={15} />} {paused ? 'Resume' : 'Pause'}</button>}</div>
        {gameStatus !== 'complete' && gameStatus !== 'timeout' && <div className="game-metrics"><div className="metric"><span className="metric-icon"><Clock3 size={17} /></span><div><small>{mode === 'solo' ? 'Elapsed time' : 'Elapsed time'}</small><strong>{formatTime(seconds)}</strong></div></div><div className="metric"><span className="metric-icon"><RotateCcw size={17} /></span><div><small>Moves</small><strong>{moves}</strong></div></div><div className="metric"><span className="metric-icon"><Target size={17} /></span><div><small>Pairs found</small><strong>{matched.length / 2}<em> / {totalPairs}</em></strong></div></div>{mode === 'local' && <div className="metric active-turn"><span className="metric-icon"><Users size={17} /></span><div><small>Current turn</small><strong>{currentName}</strong></div></div>}</div>}
        {mode === 'local' && <div className="scoreboard">{selectedPlayers.map((name, i) => <div key={i} className={activePlayer === i && gameStatus === 'playing' ? 'score-player active' : 'score-player'}><span className="player-avatar">{(name.trim()[0] || '?').toUpperCase()}</span><span className="score-name">{name || `Player ${i + 1}`}</span><strong>{scores[i]}</strong></div>)}</div>}
        {gameStatus === 'playing' && <div className={`card-grid ${settings.pairs >= 18 ? 'dense' : ''} ${settings.pairs >= 24 ? 'extra-dense' : ''}`} style={{ '--columns': gridColumns, '--rows': gridRows, '--card-gap': `${gridGap}px`, '--board-padding': `${gridPadding}px`, '--min-board-height': `${gridRows * 44 + (gridRows - 1) * gridGap + 2 * gridPadding + 2}px`, '--max-board-width': `${maxBoardWidth}px`, '--max-board-height': `${maxBoardHeight}px`, '--max-desktop-board-height': `${maxDesktopBoardHeight}px` }}>{deck.map((card) => { const revealed = flipped.includes(card.id) || matched.includes(card.id); const Icon = card.Icon; return <button key={card.id} className={`memory-card ${revealed ? 'revealed' : ''} ${matched.includes(card.id) ? 'matched' : ''}`} onClick={() => chooseCard(card)} disabled={paused || matched.includes(card.id) || flipped.length >= 2 || flipped.includes(card.id)} aria-label={revealed ? `Card ${card.pair + 1}${matched.includes(card.id) ? ', matched' : ''}` : 'Hidden card'}><span className="card-back"><span className="card-mark">m.</span></span><span className="card-front" style={{ color: matched.includes(card.id) ? 'var(--green)' : card.color }}><Icon size="50%" strokeWidth={2.2} /></span></button>; })}</div>}
        {paused && <div className="pause-overlay"><div className="pause-card"><span className="mode-icon lavender"><Pause size={22} /></span><h2>Take a breather.</h2><p>Your solo timer is paused. Come back when you're ready.</p><button className="btn primary" onClick={handlePauseToggle}><Play size={16} /> Resume game</button></div></div>}
        {(gameStatus === 'complete' || gameStatus === 'timeout') && <div className="results-panel"><div className="result-icon">{gameStatus === 'complete' ? <Trophy size={25} /> : <Clock3 size={25} />}</div><span className="eyebrow">ROUND SUMMARY</span><h2>{gameStatus === 'complete' ? (mode === 'local' ? `${playerNames[scores.indexOf(Math.max(...scores))] || 'Player'} wins!` : 'You did it!') : 'Keep practising.'}</h2><p>{gameStatus === 'complete' ? 'Nice focus. Here are your results.' : 'You can restart and try to beat the timer.'}</p><div className="result-stats"><div><small>Score</small><strong>{mode === 'local' ? Math.max(...scores) * 100 : Math.max(0, Math.round((matched.length / 2) * 100 * settings.multiplier - moves * 5 - seconds))}</strong></div><div><small>Moves</small><strong>{moves}</strong></div><div><small>Time</small><strong>{formatTime(seconds)}</strong></div><div><small>Accuracy</small><strong>{accuracy}%</strong></div></div><div className="result-actions"><button className="btn primary" onClick={() => startGame(mode)}><RotateCcw size={16} /> Play again</button><button className="btn secondary" onClick={() => nav('home')}>Home</button></div></div>}
        {gameStatus === 'playing' && <div className="game-tools"><button className="btn secondary small-btn" onClick={useHint} disabled={hintUsed}><Sparkles size={15} /> {hintUsed ? 'Hint used' : 'Use a hint'}</button><span>Matched cards stay visible. Take your time.</span><button className="icon-btn sound-toggle" title={sound ? 'Mute sound' : 'Enable sound'} aria-label={sound ? 'Mute sound' : 'Enable sound'} onClick={() => setSound((v) => !v)}>{sound ? <Volume2 size={17} aria-hidden="true" /> : <VolumeX size={17} aria-hidden="true" />}</button></div>}
      </section>}

      {page === 'leaderboard' && <section className="content-page"><button className="back-link" onClick={() => nav('home')}><ArrowLeft size={16} /> Back home</button><div className="page-title"><span className="eyebrow">A LITTLE FRIENDLY COMPETITION</span><h1>Leaderboard</h1><p>Your best local results, collected on this device.</p></div><div className="leaderboard-card"><div className="leaderboard-head"><div><div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}><button className={`count-btn ${leaderboardMode === 'solo' ? 'selected' : ''}`} onClick={() => setLeaderboardMode('solo')} style={{ padding: '6px 12px', fontSize: '11px' }}>Solo</button><button className={`count-btn ${leaderboardMode === 'multiplayer' ? 'selected' : ''}`} onClick={() => setLeaderboardMode('multiplayer')} style={{ padding: '6px 12px', fontSize: '11px' }}>Multiplayer</button></div><p>Top score per player · Local device</p></div><span className="local-badge"><BarChart3 size={14} /> Local results</span></div><div className="leaderboard-filters" style={{ display: 'flex', gap: '12px', padding: '14px', flexWrap: 'wrap', borderBottom: '1px solid var(--line)', alignItems: 'center', justifyContent: 'space-between' }}><div style={{ display: 'flex', gap: '8px' }}>{['Easy', 'Normal', 'Medium', 'Hard', 'Extreme'].map((f) => (<button key={f} className={`count-btn ${leaderboardFilter === f ? 'selected' : ''}`} onClick={() => setLeaderboardFilter(f)} style={{ padding: '6px 12px', fontSize: '11px', flex: '0 0 auto', width: 'auto' }}>{f}</button>))}</div></div>{(leaderboardMode === 'solo' ? bests : multiBests).length ? <div className="leaderboard-list"><div className="leader-row table-header"><span>Rank</span><span>Player</span><span>Diff</span><span>Score</span>{leaderboardMode === 'multiplayer' && <span>Wins</span>}<span>Time</span><span>Moves</span><span>Acc.</span><span>Date</span></div>{(leaderboardMode === 'solo' ? bests : multiBests).map((row, i) => { const acc = row.moves ? Math.round((row.completedPairs / row.moves) * 100) : 0; return <div className="leader-row" key={row.id || `${row.date}-${i}`}><span className={`rank ${i < 3 ? 'top-rank' : ''}`}>{String(i + 1).padStart(2, '0')}</span><span className="leader-player" title={row.mode === 'local' ? 'Local Multiplayer' : 'Solo'}><span className="player-avatar">{(row.name || 'P')[0].toUpperCase()}</span>{row.name || 'Player'}</span><span>{row.difficulty}</span><strong>{row.score.toLocaleString()}</strong>{leaderboardMode === 'multiplayer' && <span>{multiWins[row.name] || 0}</span>}<span>{row.seconds ? formatTime(row.seconds) : '—'}</span><span>{row.moves || 0}</span><span>{acc}%</span><span>{row.date ? new Date(row.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }) : '—'}</span></div>; })}</div> : <div className="empty-state"><span className="empty-icon"><Trophy size={24} /></span><h3>No scores yet</h3><p>Play your first round and your results will show up here.</p><button className="btn primary" onClick={() => nav('setup')}>Start a game</button></div>}<div className="leaderboard-note"><Info size={15} /><p>This is a local leaderboard stored in this browser. A shared global leaderboard requires the Supabase backend to be configured.</p></div></div></section>}
      {page === 'history' && <section className="content-page"><button className="back-link" onClick={() => nav('home')}><ArrowLeft size={16} /> Back home</button><div className="page-title"><span className="eyebrow">YOUR PAST ROUNDS</span><h1>Solo Game History</h1><p>All recorded solo games saved on this device.</p></div><div className="leaderboard-card"><div className="leaderboard-head"><div><p>All recorded solo games · Local device</p></div><span className="local-badge"><Clock3 size={14} /> Game history</span></div><div className="leaderboard-filters" style={{ display: 'flex', gap: '12px', padding: '14px', flexWrap: 'wrap', borderBottom: '1px solid var(--line)', alignItems: 'center', justifyContent: 'space-between' }}><div style={{ display: 'flex', gap: '8px' }}>{['Easy', 'Normal', 'Medium', 'Hard', 'Extreme'].map((f) => (<button key={f} className={`count-btn ${historyFilter === f ? 'selected' : ''}`} onClick={() => setHistoryFilter(f)} style={{ padding: '6px 12px', fontSize: '11px', flex: '0 0 auto', width: 'auto' }}>{f}</button>))}</div><div style={{ display: 'flex', gap: '8px' }}><select value={historyPlayerFilter} onChange={(e) => setHistoryPlayerFilter(e.target.value)} style={{ fontSize: '11px', padding: '6px', borderRadius: '6px', border: '1px solid var(--line)', background: 'var(--surface-2)', color: 'var(--text)' }}><option value="">All players</option>{allPlayers.map(p => <option key={p} value={p}>{p}</option>)}</select><select value={historySort} onChange={(e) => setHistorySort(e.target.value)} style={{ fontSize: '11px', padding: '6px', borderRadius: '6px', border: '1px solid var(--line)', background: 'var(--surface-2)', color: 'var(--text)' }}><option value="newest">Newest first</option><option value="score">Highest score</option><option value="time">Fastest time</option></select></div></div>{historyList.filter(r => r.mode === 'solo').length ? <div className="leaderboard-list"><div className="leader-row table-header"><span>No.</span><span>Player</span><span>Diff</span><span>Score</span><span>Time</span><span>Moves</span><span>Acc.</span><span>Date</span></div>{historyList.filter(r => r.mode === 'solo').slice(0, 100).map((row, i) => { const acc = row.moves ? Math.round((row.completedPairs / row.moves) * 100) : 0; return <div className="leader-row" key={row.id || `${row.date}-${i}`}><span className="rank">{String(i + 1).padStart(2, '0')}</span><span className="leader-player" title="Solo"><span className="player-avatar">{(row.name || 'P')[0].toUpperCase()}</span>{row.name || 'Player'}</span><span>{row.difficulty}</span><strong>{row.score.toLocaleString()}</strong><span>{row.seconds ? formatTime(row.seconds) : '—'}</span><span>{row.moves || 0}</span><span>{acc}%</span><span>{row.date ? new Date(row.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }) : '—'}</span></div>; })}</div> : <div className="empty-state"><span className="empty-icon"><Clock3 size={24} /></span><h3>No games yet</h3><p>Complete a solo round and your results will show up here.</p><button className="btn primary" onClick={() => nav('setup')}>Start a game</button></div>}<div className="leaderboard-note"><Info size={15} /><p>Your game history is stored locally in this browser.</p></div></div></section>}
      {page === 'multiplayer_history' && <section className="content-page"><button className="back-link" onClick={() => nav('home')}><ArrowLeft size={16} /> Back home</button><div className="page-title"><span className="eyebrow">YOUR PAST ROUNDS</span><h1>Multiplayer History</h1><p>All recorded multiplayer matches on this device.</p></div><div className="leaderboard-card"><div className="leaderboard-head"><div><p>All recorded multiplayer games · Local device</p></div><span className="local-badge"><Users size={14} /> Match history</span></div><div className="leaderboard-filters" style={{ display: 'flex', gap: '12px', padding: '14px', flexWrap: 'wrap', borderBottom: '1px solid var(--line)', alignItems: 'center', justifyContent: 'space-between' }}><div style={{ display: 'flex', gap: '8px' }}>{['Easy', 'Normal', 'Medium', 'Hard', 'Extreme'].map((f) => (<button key={f} className={`count-btn ${historyFilter === f ? 'selected' : ''}`} onClick={() => setHistoryFilter(f)} style={{ padding: '6px 12px', fontSize: '11px', flex: '0 0 auto', width: 'auto' }}>{f}</button>))}</div><div style={{ display: 'flex', gap: '8px' }}><select value={historyPlayerFilter} onChange={(e) => setHistoryPlayerFilter(e.target.value)} style={{ fontSize: '11px', padding: '6px', borderRadius: '6px', border: '1px solid var(--line)', background: 'var(--surface-2)', color: 'var(--text)' }}><option value="">All players</option>{allPlayers.map(p => <option key={p} value={p}>{p}</option>)}</select><select value={historySort} onChange={(e) => setHistorySort(e.target.value)} style={{ fontSize: '11px', padding: '6px', borderRadius: '6px', border: '1px solid var(--line)', background: 'var(--surface-2)', color: 'var(--text)' }}><option value="newest">Newest first</option><option value="score">Highest score</option><option value="time">Fastest time</option></select></div></div>{historyList.filter(r => r.mode !== 'solo').length ? <div className="leaderboard-list"><div className="leader-row table-header"><span>No.</span><span>Player</span><span>Diff</span><span>Score</span><span>Result</span><span>Moves</span><span>Acc.</span><span>Date</span></div>{historyList.filter(r => r.mode !== 'solo').slice(0, 100).map((row, i) => { const acc = row.moves ? Math.round((row.completedPairs / row.moves) * 100) : 0; return <div className="leader-row" key={row.id || `${row.date}-${i}`}><span className="rank">{String(i + 1).padStart(2, '0')}</span><span className="leader-player" title="Local Multiplayer"><span className="player-avatar">{(row.name || 'P')[0].toUpperCase()}</span>{row.name || 'Player'}</span><span>{row.difficulty}</span><strong>{row.score.toLocaleString()}</strong><span style={{color: row.matchResult === 'winner' ? 'var(--green)' : row.matchResult === 'tie' ? 'var(--yellow)' : 'inherit', textTransform: 'capitalize'}}>{row.matchResult || '—'}</span><span>{row.moves || 0}</span><span>{acc}%</span><span>{row.date ? new Date(row.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }) : '—'}</span></div>; })}</div> : <div className="empty-state"><span className="empty-icon"><Users size={24} /></span><h3>No matches yet</h3><p>Complete a multiplayer match and your results will show up here.</p><button className="btn primary" onClick={() => nav('setup')}>Start a game</button></div>}<div className="leaderboard-note"><Info size={15} /><p>Your game history is stored locally in this browser.</p></div></div></section>}
      {page === 'profile' && <section className="content-page"><button className="back-link" onClick={() => nav('home')}><ArrowLeft size={16} /> Back home</button><div className="page-title"><span className="eyebrow">YOUR PROGRESS</span><h1>Player profile</h1><p>Your stats and records on this device.</p></div><div className="profile-card"><div className="profile-identity"><div className="profile-avatar">{(customName.trim()[0] || 'P').toUpperCase()}</div><div><h2>{customName || 'Player'}</h2><p>MindFlip player <span className="local-badge">Local profile</span></p></div></div><label className="field-label profile-name-field">Display name<input value={customName} maxLength={20} onChange={(e) => setCustomName(e.target.value)} placeholder="Your name" /></label><div className="profile-stats"><div><small>Games played</small><strong>{persisted.gamesPlayed || 0}</strong></div><div><small>Pairs matched</small><strong>{persisted.totalPairs || 0}</strong></div><div><small>Best solo score</small><strong>{bestSolo ? bestSolo.score.toLocaleString() : '—'}</strong></div></div><p className="profile-help"><Info size={15} /> Your local profile is saved in this browser. Sign-in and cross-device syncing can be added with Supabase.</p></div></section>}

      {page === 'settings' && <section className="content-page"><button className="back-link" onClick={() => nav('home')}><ArrowLeft size={16} /> Back home</button><div className="page-title"><span className="eyebrow">MAKE IT COMFORTABLE</span><h1>Settings</h1><p>A few small things to make MindFlip feel like yours.</p></div><div className="settings-card"><div className="setting-row"><span className="setting-icon"><dark-icon>{dark ? <Moon size={19} /> : <Sun size={19} />}</dark-icon></span><div className="setting-copy"><strong>Appearance</strong><small>Choose a theme that's comfortable for you.</small></div><button className="toggle-pill" onClick={() => setDark((v) => !v)}>{dark ? 'Dark' : 'Light'}<span className={dark ? 'toggle-knob on' : 'toggle-knob'} /></button></div><div className="setting-row"><span className="setting-icon">{sound ? <Volume2 size={19} /> : <VolumeX size={19} />}</span><div className="setting-copy"><strong>Sound effects</strong><small>Play a subtle sound when you find a match.</small></div><button className={sound ? 'switch on' : 'switch'} aria-label="Toggle sound" onClick={() => setSound((v) => !v)}><span /></button></div><div className="setting-row"><span className="setting-icon"><BarChart3 size={19} /></span><div className="setting-copy"><strong>Local data</strong><small>Clear this browser's saved results and preferences.</small></div><button className="btn danger-btn" onClick={() => { if (window.confirm('Clear local game history and saved statistics?')) { const clean = { displayName: customName }; setPersisted(clean); saveStore({ ...clean, dark, sound }); toast('Local history cleared.'); } }}><Trash2 size={14} aria-hidden="true" /> Clear data</button></div><div className="settings-foot"><Info size={15} /><p>MindFlip is a work-in-progress starter. Online rooms, accounts, and global rankings require Supabase configuration before they can be used across devices.</p></div></div></section>}

      {page === 'online' && <section className="content-page"><button className="back-link" onClick={() => nav('home')}><ArrowLeft size={16} /> Back home</button><div className="page-title"><span className="eyebrow">BRING YOUR FRIENDS</span><h1>Play online</h1><p>Set up a room for friends on different devices.</p></div><div className="online-grid"><div className="online-card"><span className="mode-icon peach"><Globe2 size={22} /></span><h2>Create a room</h2><p>Start a private room and share its code with your friends.</p>{!roomCreated ? <button className="btn primary full-btn" onClick={createRoom}><Globe2 size={16} aria-hidden="true" /> Create demo room</button> : <div className="room-code"><span>{roomCode}</span><button className="icon-btn" onClick={copyRoom} aria-label="Copy room code"><Copy size={17} /></button></div>}<small className="setup-warning">Demo only: this room code is generated in this browser and is not shared online.</small></div><div className="online-card"><span className="mode-icon lavender"><Users size={22} /></span><h2>Join a room</h2><p>Have a room code from a friend? Enter it here.</p><form onSubmit={(e) => { e.preventDefault(); toast('Online room joining is not connected yet. Configure Supabase first.'); }}><label className="field-label">Room code<input value={roomCode} onChange={(e) => setRoomCode(e.target.value.toUpperCase().slice(0, 8))} placeholder="e.g. MF7K29" maxLength={8} /></label><button className="btn secondary full-btn" type="submit" disabled={roomCode.trim().length < 4}><LogIn size={16} aria-hidden="true" /> Join room</button></form><small className="setup-warning">Online room joining will work after the Supabase multiplayer backend is implemented and configured.</small></div></div><div className="leaderboard-note online-note"><Info size={16} /><p><strong>What's working now?</strong> You can play solo and local multiplayer on this device, save local results, and explore the UI. Real-time cross-device rooms, authentication, and a global leaderboard need the backend setup described in the README.</p></div></section>}
    </main>
    {!isGameplayActive && <footer className="footer"><div className="footer-brand"><span className="brand-mark small"><img src="/logo.png" alt="MindFlip logo" /></span><span><strong>mindflip</strong><small>by JB Devs</small></span></div><span>Made for curious minds.</span><button className="footer-help" onClick={() => setShowHelp(true)}><Info size={14} /> How to play</button></footer>}
    {notice && <div className="toast" role="status"><Check size={16} />{notice}</div>}
    {showHelp && <div className="modal-backdrop" onClick={() => setShowHelp(false)}><section className="help-modal" onClick={(e) => e.stopPropagation()}><button className="modal-close" onClick={() => setShowHelp(false)} aria-label="Close help"><X size={18} /></button><span className="mode-icon lavender"><Brain size={22} /></span><h2>How to play</h2><p>Flip two cards and look for matching symbols. In solo mode, try to finish with fewer moves. In local multiplayer, collect the most pairs to win.</p><div className="help-rule"><span>01</span><p><strong>Flip</strong><br />Choose any two hidden cards.</p></div><div className="help-rule"><span>02</span><p><strong>Match</strong><br />Matching pairs stay face up and score a point in multiplayer.</p></div><div className="help-rule"><span>03</span><p><strong>Remember</strong><br />If the cards don't match, they turn back over. Use what you saw next turn.</p></div><button className="btn primary full-btn" onClick={() => setShowHelp(false)}>Got it</button></section></div>}
  </div>;
}

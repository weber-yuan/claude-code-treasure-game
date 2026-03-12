import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Button } from './components/ui/button';
import { Badge } from './components/ui/badge';
import LoginScreen from './components/LoginScreen';
import LeaderboardDialog, { LeaderboardEntry } from './components/LeaderboardDialog';
import closedChest from './assets/treasure_closed.png';
import treasureChest from './assets/treasure_opened.png';
import skeletonChest from './assets/treasure_opened_skeleton.png';
import keyImage from './assets/key.png';
import chestOpenSound from './audios/chest_open.mp3';
import evilLaughSound from './audios/chest_open_with_evil_laugh.mp3';

const LEADERBOARD_KEY = 'treasure_hunt_leaderboard';

interface Box {
  id: number;
  isOpen: boolean;
  hasTreasure: boolean;
}

type View = 'login' | 'game';

function loadEntries(): LeaderboardEntry[] {
  try {
    return JSON.parse(localStorage.getItem(LEADERBOARD_KEY) ?? '[]');
  } catch {
    return [];
  }
}

export default function App() {
  const [view, setView] = useState<View>('login');
  const [currentUsername, setCurrentUsername] = useState('');
  const [isGuest, setIsGuest] = useState(false);
  const [leaderboardOpen, setLeaderboardOpen] = useState(false);
  const [leaderboardEntries, setLeaderboardEntries] = useState<LeaderboardEntry[]>(loadEntries);

  const [boxes, setBoxes] = useState<Box[]>([]);
  const [score, setScore] = useState(0);
  const [gameEnded, setGameEnded] = useState(false);

  const initializeGame = () => {
    const treasureBoxIndex = Math.floor(Math.random() * 3);
    setBoxes(
      Array.from({ length: 3 }, (_, i) => ({
        id: i,
        isOpen: false,
        hasTreasure: i === treasureBoxIndex,
      }))
    );
    setScore(0);
    setGameEnded(false);
  };

  // Save score when game ends (non-guests only)
  useEffect(() => {
    if (gameEnded && !isGuest && currentUsername) {
      saveScore(currentUsername, score);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gameEnded]);

  function saveScore(username: string, finalScore: number) {
    const entries = loadEntries();
    entries.push({ username, score: finalScore, playedAt: new Date().toISOString() });
    localStorage.setItem(LEADERBOARD_KEY, JSON.stringify(entries));
    setLeaderboardEntries(entries);
  }

  function startGame(name: string) {
    setCurrentUsername(name);
    setIsGuest(false);
    setView('game');
    initializeGame();
  }

  function playAsGuest() {
    setCurrentUsername('Guest');
    setIsGuest(true);
    setView('game');
    initializeGame();
  }

  function changePlayer() {
    setView('login');
    setCurrentUsername('');
    setIsGuest(false);
    setGameEnded(false);
  }

  const openBox = (boxId: number) => {
    if (gameEnded) return;

    const box = boxes.find(b => b.id === boxId);
    if (box && !box.isOpen) {
      const sound = new Audio(box.hasTreasure ? chestOpenSound : evilLaughSound);
      sound.play();
    }

    setBoxes(prevBoxes => {
      const updatedBoxes = prevBoxes.map(b => {
        if (b.id === boxId && !b.isOpen) {
          const newScore = b.hasTreasure ? score + 100 : score - 50;
          setScore(newScore);
          return { ...b, isOpen: true };
        }
        return b;
      });

      const treasureFound = updatedBoxes.some(b => b.isOpen && b.hasTreasure);
      const allOpened = updatedBoxes.every(b => b.isOpen);
      if (treasureFound || allOpened) {
        setGameEnded(true);
      }

      return updatedBoxes;
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-amber-100 flex flex-col items-center justify-center p-8">
      <AnimatePresence mode="wait">
        {view === 'login' ? (
          <motion.div
            key="login"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
          >
            <LoginScreen
              onStart={startGame}
              onGuest={playAsGuest}
              onViewLeaderboard={() => setLeaderboardOpen(true)}
              registeredCount={new Set(leaderboardEntries.map(e => e.username.toLowerCase())).size}
            />
          </motion.div>
        ) : (
          <motion.div
            key="game"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="flex flex-col items-center w-full"
          >
            {/* Header */}
            <div className="text-center mb-4">
              <h1 className="text-4xl mb-2 text-amber-900">🏴‍☠️ 尋寶遊戲 🏴‍☠️</h1>
              <div className="flex items-center justify-center gap-2 mb-2">
                <span className="text-amber-700 text-sm">玩家：</span>
                <Badge className="bg-amber-600 text-white">{currentUsername}</Badge>
                {isGuest && (
                  <span className="text-amber-500 text-xs">（分數不會儲存）</span>
                )}
              </div>
              <p className="text-amber-800 mb-1">點擊寶箱，看看裡面藏著什麼！</p>
              <p className="text-amber-700 text-sm">💰 寶藏：+$100 | 💀 骷髏：-$50</p>
            </div>

            {/* Score */}
            <div className="mb-8">
              <div className="text-2xl text-center p-4 bg-amber-200/80 backdrop-blur-sm rounded-lg shadow-lg border-2 border-amber-400">
                <span className="text-amber-900">目前分數：</span>
                <span className={score >= 0 ? 'text-green-600' : 'text-red-600'}>
                  ${score}
                </span>
                <span className={`ml-3 text-xl font-bold ${score > 0 ? 'text-green-600' : score < 0 ? 'text-red-600' : 'text-amber-700'}`}>
                  {score > 0 ? '贏' : score < 0 ? '輸' : '平手'}
                </span>
              </div>
            </div>

            {/* Boxes */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
              {boxes.map(box => (
                <motion.div
                  key={box.id}
                  className="flex flex-col items-center"
                  style={{ cursor: box.isOpen ? 'default' : `url(${keyImage}) 8 8, pointer` }}
                  whileHover={{ scale: box.isOpen ? 1 : 1.05 }}
                  whileTap={{ scale: box.isOpen ? 1 : 0.95 }}
                  onClick={() => openBox(box.id)}
                >
                  <motion.div
                    initial={{ rotateY: 0 }}
                    animate={{ rotateY: box.isOpen ? 180 : 0, scale: box.isOpen ? 1.1 : 1 }}
                    transition={{ duration: 0.6, ease: 'easeInOut' }}
                    className="relative"
                  >
                    <img
                      src={box.isOpen ? (box.hasTreasure ? treasureChest : skeletonChest) : closedChest}
                      alt={box.isOpen ? (box.hasTreasure ? '寶藏！' : '骷髏！') : '寶箱'}
                      className="w-48 h-48 object-contain drop-shadow-lg"
                    />
                    {box.isOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3, duration: 0.5 }}
                        className="absolute -top-8 left-1/2 transform -translate-x-1/2"
                      >
                        {box.hasTreasure ? (
                          <div className="text-2xl animate-bounce">✨💰✨</div>
                        ) : (
                          <div className="text-2xl animate-pulse">💀👻💀</div>
                        )}
                      </motion.div>
                    )}
                  </motion.div>

                  <div className="mt-4 text-center">
                    {box.isOpen ? (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.4, duration: 0.3 }}
                        className={`text-lg p-2 rounded-lg ${
                          box.hasTreasure
                            ? 'bg-green-100 text-green-800 border border-green-300'
                            : 'bg-red-100 text-red-800 border border-red-300'
                        }`}
                      >
                        {box.hasTreasure ? '+$100' : '-$50'}
                      </motion.div>
                    ) : (
                      <div className="text-amber-700 p-2">點擊開啟！</div>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Game Over panel */}
            {gameEnded && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="text-center"
              >
                <div className="mb-4 p-6 bg-amber-200/80 backdrop-blur-sm rounded-xl shadow-lg border-2 border-amber-400">
                  <h2 className="text-2xl mb-2 text-amber-900">遊戲結束！</h2>
                  <p className="text-lg text-amber-800">
                    最終分數：{' '}
                    <span className={score >= 0 ? 'text-green-600' : 'text-red-600'}>
                      ${score}
                    </span>
                  </p>
                  <p className="text-sm text-amber-600 mt-2">
                    {boxes.some(b => b.isOpen && b.hasTreasure)
                      ? '找到寶藏了！幹得好，尋寶獵人！🎉'
                      : '這次沒找到寶藏！下次好運！💀'}
                  </p>
                  {!isGuest && (
                    <p className="text-xs text-amber-500 mt-1">分數已儲存至排行榜。</p>
                  )}
                </div>

                <div className="flex flex-wrap justify-center gap-3">
                  <Button
                    onClick={initializeGame}
                    className="bg-amber-600 hover:bg-amber-700 text-white"
                  >
                    再玩一次
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setLeaderboardOpen(true)}
                    className="border-amber-400 text-amber-800 hover:bg-amber-100"
                  >
                    查看排行榜
                  </Button>
                  <Button
                    variant="ghost"
                    onClick={changePlayer}
                    className="text-amber-700 hover:text-amber-900 hover:bg-amber-100"
                  >
                    切換玩家
                  </Button>
                </div>
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      <LeaderboardDialog
        open={leaderboardOpen}
        onClose={() => setLeaderboardOpen(false)}
        entries={leaderboardEntries}
        currentUsername={isGuest ? undefined : currentUsername}
      />
    </div>
  );
}

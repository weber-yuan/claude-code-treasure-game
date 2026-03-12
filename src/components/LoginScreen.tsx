import { useState, KeyboardEvent } from 'react';
import { motion } from 'motion/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface LoginScreenProps {
  onStart: (username: string) => void;
  onGuest: () => void;
  onViewLeaderboard: () => void;
  registeredCount: number;
}

export default function LoginScreen({ onStart, onGuest, onViewLeaderboard, registeredCount }: LoginScreenProps) {
  const [name, setName] = useState('');

  const handleStart = () => {
    const trimmed = name.trim();
    if (trimmed) onStart(trimmed);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') handleStart();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="flex flex-col items-center justify-center"
    >
      <h1 className="text-4xl mb-8 text-amber-900">🏴‍☠️ 尋寶遊戲 🏴‍☠️</h1>
      <Card className="w-full max-w-sm border-2 border-amber-400 bg-amber-50/90 shadow-xl">
        <CardHeader>
          <CardTitle className="text-center text-amber-900 text-xl">輸入你的名字</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-3">
          <Input
            placeholder="輸入你的名字..."
            value={name}
            onChange={e => setName(e.target.value)}
            onKeyDown={handleKeyDown}
            className="border-amber-300 focus-visible:ring-amber-400"
            autoFocus
          />
          <Button
            onClick={handleStart}
            disabled={!name.trim()}
            className="bg-amber-600 hover:bg-amber-700 text-white"
          >
            開始遊戲
          </Button>
          <Button
            variant="ghost"
            onClick={onGuest}
            className="text-amber-700 hover:text-amber-900 hover:bg-amber-100"
          >
            以訪客身份遊玩
          </Button>
          <div className="flex items-center justify-center gap-2 pt-1">
            <Button
              variant="link"
              onClick={onViewLeaderboard}
              className="text-amber-600 hover:text-amber-800 p-0 h-auto"
            >
              查看排行榜
            </Button>
            <span className="text-amber-500 text-sm">
              · {registeredCount} 位已註冊{registeredCount === 1 ? '冒險家' : '冒險家'}
            </span>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

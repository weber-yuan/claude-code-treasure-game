import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

export interface LeaderboardEntry {
  username: string;
  score: number;
  playedAt: string; // ISO 8601
}

interface LeaderboardDialogProps {
  open: boolean;
  onClose: () => void;
  entries: LeaderboardEntry[];
  currentUsername?: string;
}

const MEDALS = ['🥇', '🥈', '🥉'];

export default function LeaderboardDialog({ open, onClose, entries, currentUsername }: LeaderboardDialogProps) {
  const sorted = [...entries].sort((a, b) => b.score - a.score);

  const uniqueUsers = new Set(entries.map(e => e.username.toLowerCase())).size;

  return (
    <Dialog open={open} onOpenChange={v => !v && onClose()}>
      <DialogContent className="max-w-lg border-2 border-amber-400 bg-amber-50" style={{ backgroundColor: 'rgb(255 251 235)' }}>
        <DialogHeader>
          <DialogTitle className="text-amber-900 text-xl">
            🏆 排行榜
          </DialogTitle>
          <DialogDescription className="text-amber-700">
            {uniqueUsers} 位已註冊冒險家 · 共 {entries.length} 場遊戲
          </DialogDescription>
        </DialogHeader>

        {sorted.length === 0 ? (
          <p className="text-center text-amber-600 py-8">
            還沒有冒險家，成為第一個吧！
          </p>
        ) : (
          <ScrollArea className="max-h-80">
            <Table>
              <TableHeader>
                <TableRow className="border-amber-300">
                  <TableHead className="text-amber-800 w-12">排名</TableHead>
                  <TableHead className="text-amber-800">名字</TableHead>
                  <TableHead className="text-amber-800 text-right">分數</TableHead>
                  <TableHead className="text-amber-800 text-right">日期</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sorted.map((entry, i) => {
                  const isCurrent = currentUsername &&
                    entry.username.toLowerCase() === currentUsername.toLowerCase();
                  const date = new Date(entry.playedAt).toLocaleDateString();
                  return (
                    <TableRow
                      key={`${entry.username}-${entry.playedAt}`}
                      className={isCurrent ? 'bg-amber-100 font-semibold' : 'border-amber-200'}
                    >
                      <TableCell className="text-center">
                        {i < 3 ? MEDALS[i] : i + 1}
                      </TableCell>
                      <TableCell>{entry.username}{isCurrent ? '（你）' : ''}</TableCell>
                      <TableCell className={`text-right ${entry.score >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        ${entry.score}
                      </TableCell>
                      <TableCell className="text-right text-amber-600 text-sm">{date}</TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </ScrollArea>
        )}

        <div className="flex justify-end pt-2">
          <Button
            onClick={onClose}
            className="bg-amber-600 hover:bg-amber-700 text-white"
          >
            關閉
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

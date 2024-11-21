import React from 'react';
import { motion } from 'framer-motion';
import { GameMode, Player } from '../types/game';
import { Monitor, User } from 'lucide-react';

interface ScoreBoardProps {
  mode: GameMode;
  currentPlayer: Player;
  scores: {
    player1: number;
    player2: number;
  };
  status: 'not-started' | 'playing' | 'finished';
}

export const ScoreBoard: React.FC<ScoreBoardProps> = ({
  mode,
  currentPlayer,
  scores,
  status,
}) => {
  const player2Label = mode === 'vs-computer' ? 'Computer' : 'Player 2';

  return (
    <div className="flex justify-center gap-8 mb-6">
      <div className="text-center">
        <motion.div
          animate={{
            scale: currentPlayer === 1 && status === 'playing' ? [1, 1.05, 1] : 1,
          }}
          transition={{ repeat: Infinity, duration: 2 }}
          className={`flex items-center gap-2 mb-2 px-4 py-2 rounded-lg ${
            currentPlayer === 1 && status === 'playing'
              ? 'bg-emerald-900/50'
              : 'bg-gray-800'
          }`}
        >
          <User size={20} className="text-emerald-500" />
          <span className="font-semibold text-emerald-500">Player 1</span>
        </motion.div>
        <div className="text-2xl font-bold text-white">{scores.player1}</div>
      </div>
      <div className="text-center">
        <motion.div
          animate={{
            scale: currentPlayer === 2 && status === 'playing' ? [1, 1.05, 1] : 1,
          }}
          transition={{ repeat: Infinity, duration: 2 }}
          className={`flex items-center gap-2 mb-2 px-4 py-2 rounded-lg ${
            currentPlayer === 2 && status === 'playing'
              ? 'bg-blue-900/50'
              : 'bg-gray-800'
          }`}
        >
          {mode === 'vs-computer' ? (
            <Monitor size={20} className="text-blue-400" />
          ) : (
            <User size={20} className="text-blue-400" />
          )}
          <span className="font-semibold text-blue-400">{player2Label}</span>
        </motion.div>
        <div className="text-2xl font-bold text-white">{scores.player2}</div>
      </div>
    </div>
  );
};
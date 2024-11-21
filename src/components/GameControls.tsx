import React from 'react';
import { motion } from 'framer-motion';
import { GameMode, GameStatus } from '../types/game';
import { Users, Monitor } from 'lucide-react';

interface GameControlsProps {
  mode: GameMode;
  status: GameStatus;
  onModeChange: (mode: GameMode) => void;
  onStart: () => void;
  onReset: () => void;
}

export const GameControls: React.FC<GameControlsProps> = ({
  mode,
  status,
  onModeChange,
  onStart,
  onReset,
}) => {
  return (
    <div className="flex flex-col items-center gap-4 mb-8">
      {status === 'not-started' && (
        <>
          <div className="flex gap-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onModeChange('vs-computer')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
                mode === 'vs-computer'
                  ? 'bg-emerald-600 text-white'
                  : 'bg-gray-700 text-gray-300'
              }`}
            >
              <Monitor size={20} />
              vs Computer
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onModeChange('vs-human')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
                mode === 'vs-human'
                  ? 'bg-emerald-600 text-white'
                  : 'bg-gray-700 text-gray-300'
              }`}
            >
              <Users size={20} />
              vs Human
            </motion.button>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onStart}
            className="px-6 py-3 text-lg font-semibold text-white bg-emerald-500 rounded-lg shadow-lg hover:bg-emerald-600 transition-colors"
          >
            Start Game
          </motion.button>
        </>
      )}
      {status === 'finished' && (
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onReset}
          className="px-6 py-3 text-lg font-semibold text-white bg-emerald-500 rounded-lg shadow-lg hover:bg-emerald-600 transition-colors"
        >
          Play Again
        </motion.button>
      )}
    </div>
  );
};
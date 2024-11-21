import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Line, Box, Player, GameStatus } from '../types/game';

interface GameGridProps {
  size: number;
  lines: Line[];
  boxes: Box[];
  status: GameStatus;
  onLineClick: (row: number, col: number, isHorizontal: boolean) => void;
}

export const GameGrid: React.FC<GameGridProps> = ({
  size,
  lines,
  boxes,
  status,
  onLineClick,
}) => {
  const gridSize = 400;
  const spacing = gridSize / (size - 1);
  const dotSize = 12;
  const lineThickness = 8;

  const isLinePlaced = (row: number, col: number, isHorizontal: boolean) =>
    lines.some(l => l.row === row && l.col === col && l.isHorizontal === isHorizontal);

  const getLineColor = (player?: Player) =>
    !player ? 'bg-gray-700 hover:bg-gray-600' : 
    player === 1 ? 'bg-emerald-500' : 'bg-blue-400';

  const getBoxColor = (owner?: Player) =>
    !owner ? 'bg-transparent' :
    owner === 1 ? 'bg-emerald-700/50' : 'bg-blue-700/50';

  return (
    <div className="relative" style={{ width: gridSize, height: gridSize }}>
      {/* Boxes */}
      <AnimatePresence>
        {boxes.map((box) => (
          <motion.div
            key={`box-${box.row}-${box.col}`}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            transition={{ duration: 0.2 }}
            className={`absolute ${getBoxColor(box.owner)}`}
            style={{
              left: box.col * spacing + dotSize / 2,
              top: box.row * spacing + dotSize / 2,
              width: spacing,
              height: spacing,
              borderRadius: '4px',
            }}
          />
        ))}
      </AnimatePresence>

      {/* Horizontal lines */}
      {Array.from({ length: size }, (_, row) =>
        Array.from({ length: size - 1 }, (_, col) => {
          const placed = isLinePlaced(row, col, true);
          const player = lines.find(l => l.row === row && l.col === col && l.isHorizontal)?.player;
          
          return (
            <motion.button
              key={`h-${row}-${col}`}
              className={`absolute ${getLineColor(player)} rounded-full transition-colors duration-150`}
              style={{
                left: col * spacing + dotSize,
                top: row * spacing + (dotSize - lineThickness) / 2,
                width: spacing - dotSize,
                height: lineThickness,
                cursor: status === 'playing' && !placed ? 'pointer' : 'default',
              }}
              disabled={status !== 'playing' || placed}
              onClick={() => onLineClick(row, col, true)}
              whileHover={status === 'playing' && !placed ? { scale: 1.1 } : {}}
              whileTap={status === 'playing' && !placed ? { scale: 0.95 } : {}}
            />
          );
        })
      )}

      {/* Vertical lines */}
      {Array.from({ length: size - 1 }, (_, row) =>
        Array.from({ length: size }, (_, col) => {
          const placed = isLinePlaced(row, col, false);
          const player = lines.find(l => l.row === row && l.col === col && !l.isHorizontal)?.player;
          
          return (
            <motion.button
              key={`v-${row}-${col}`}
              className={`absolute ${getLineColor(player)} rounded-full transition-colors duration-150`}
              style={{
                left: col * spacing + (dotSize - lineThickness) / 2,
                top: row * spacing + dotSize,
                width: lineThickness,
                height: spacing - dotSize,
                cursor: status === 'playing' && !placed ? 'pointer' : 'default',
              }}
              disabled={status !== 'playing' || placed}
              onClick={() => onLineClick(row, col, false)}
              whileHover={status === 'playing' && !placed ? { scale: 1.1 } : {}}
              whileTap={status === 'playing' && !placed ? { scale: 0.95 } : {}}
            />
          );
        })
      )}

      {/* Dots */}
      {Array.from({ length: size }, (_, row) =>
        Array.from({ length: size }, (_, col) => (
          <div
            key={`dot-${row}-${col}`}
            className="absolute bg-white rounded-full"
            style={{
              left: col * spacing,
              top: row * spacing,
              width: dotSize,
              height: dotSize,
              transform: 'translate(-50%, -50%)',
            }}
          />
        ))
      )}
    </div>
  );
};
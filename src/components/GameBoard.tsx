import React, { useState, useCallback, useEffect } from 'react';
import { GameControls } from './GameControls';
import { ScoreBoard } from './ScoreBoard';
import { GameGrid } from './GameGrid';
import { GameMode, GameStatus, Player, Line, Box } from '../types/game';

const GRID_SIZE = 5;

export const GameBoard: React.FC = () => {
  const [mode, setMode] = useState<GameMode>('vs-computer');
  const [status, setStatus] = useState<GameStatus>('not-started');
  const [currentPlayer, setCurrentPlayer] = useState<Player>(1);
  const [lines, setLines] = useState<Line[]>([]);
  const [boxes, setBoxes] = useState<Box[]>([]);
  const [scores, setScores] = useState({ player1: 0, player2: 0 });
  const [isComputerTurn, setIsComputerTurn] = useState(false);

  const checkForCompletedBoxes = (
    currentLines: Line[],
    row: number,
    col: number,
    isHorizontal: boolean,
    player: Player
  ): Box[] => {
    const newBoxes: Box[] = [];

    const hasLine = (r: number, c: number, h: boolean) =>
      currentLines.some(l => l.row === r && l.col === c && l.isHorizontal === h);

    if (isHorizontal) {
      // Check box above
      if (row > 0) {
        if (
          hasLine(row - 1, col, true) && // top
          hasLine(row - 1, col, false) && // left
          hasLine(row - 1, col + 1, false) // right
        ) {
          newBoxes.push({ row: row - 1, col, owner: player });
        }
      }
      // Check box below
      if (row < GRID_SIZE - 1) {
        if (
          hasLine(row + 1, col, true) && // bottom
          hasLine(row, col, false) && // left
          hasLine(row, col + 1, false) // right
        ) {
          newBoxes.push({ row, col, owner: player });
        }
      }
    } else {
      // Check box to the left
      if (col > 0) {
        if (
          hasLine(row, col - 1, false) && // left
          hasLine(row, col - 1, true) && // top
          hasLine(row + 1, col - 1, true) // bottom
        ) {
          newBoxes.push({ row, col: col - 1, owner: player });
        }
      }
      // Check box to the right
      if (col < GRID_SIZE - 1) {
        if (
          hasLine(row, col, true) && // top
          hasLine(row + 1, col, true) && // bottom
          hasLine(row, col + 1, false) // right
        ) {
          newBoxes.push({ row, col, owner: player });
        }
      }
    }

    return newBoxes;
  };

  const findBestMove = useCallback(() => {
    // First, look for moves that complete boxes
    for (let row = 0; row < GRID_SIZE; row++) {
      for (let col = 0; col < GRID_SIZE - 1; col++) {
        // Check horizontal lines
        if (!lines.some(l => l.row === row && l.col === col && l.isHorizontal)) {
          const testLines = [...lines, { row, col, isHorizontal: true, player: 2 }];
          if (checkForCompletedBoxes(testLines, row, col, true, 2).length > 0) {
            return { row, col, isHorizontal: true };
          }
        }
      }
    }
    for (let row = 0; row < GRID_SIZE - 1; row++) {
      for (let col = 0; col < GRID_SIZE; col++) {
        // Check vertical lines
        if (!lines.some(l => l.row === row && l.col === col && !l.isHorizontal)) {
          const testLines = [...lines, { row, col, isHorizontal: false, player: 2 }];
          if (checkForCompletedBoxes(testLines, row, col, false, 2).length > 0) {
            return { row, col, isHorizontal: false };
          }
        }
      }
    }

    // If no completing moves, make a random valid move
    const validMoves: { row: number; col: number; isHorizontal: boolean }[] = [];
    
    // Collect all valid moves
    for (let row = 0; row < GRID_SIZE; row++) {
      for (let col = 0; col < GRID_SIZE - 1; col++) {
        if (!lines.some(l => l.row === row && l.col === col && l.isHorizontal)) {
          validMoves.push({ row, col, isHorizontal: true });
        }
      }
    }
    for (let row = 0; row < GRID_SIZE - 1; row++) {
      for (let col = 0; col < GRID_SIZE; col++) {
        if (!lines.some(l => l.row === row && l.col === col && !l.isHorizontal)) {
          validMoves.push({ row, col, isHorizontal: false });
        }
      }
    }

    if (validMoves.length > 0) {
      return validMoves[Math.floor(Math.random() * validMoves.length)];
    }

    return null;
  }, [lines]);

  const makeMove = useCallback((row: number, col: number, isHorizontal: boolean) => {
    if (lines.some(l => l.row === row && l.col === col && l.isHorizontal === isHorizontal)) {
      return;
    }

    const newLines = [...lines, { row, col, isHorizontal, player: currentPlayer }];
    setLines(newLines);

    const completedBoxes = checkForCompletedBoxes(newLines, row, col, isHorizontal, currentPlayer);
    
    if (completedBoxes.length > 0) {
      const newBoxes = [...boxes, ...completedBoxes];
      setBoxes(newBoxes);
      
      const newScores = {
        player1: newBoxes.filter(b => b.owner === 1).length,
        player2: newBoxes.filter(b => b.owner === 2).length,
      };
      setScores(newScores);

      if (newBoxes.length === (GRID_SIZE - 1) * (GRID_SIZE - 1)) {
        setStatus('finished');
        return;
      }

      if (mode === 'vs-computer' && currentPlayer === 2) {
        setIsComputerTurn(true);
      }
    } else {
      const nextPlayer = currentPlayer === 1 ? 2 : 1;
      setCurrentPlayer(nextPlayer);
      if (mode === 'vs-computer' && nextPlayer === 2) {
        setIsComputerTurn(true);
      }
    }
  }, [lines, boxes, currentPlayer, mode]);

  useEffect(() => {
    if (status === 'playing' && mode === 'vs-computer' && isComputerTurn) {
      const timeoutId = setTimeout(() => {
        const computerMove = findBestMove();
        if (computerMove) {
          makeMove(computerMove.row, computerMove.col, computerMove.isHorizontal);
        }
        setIsComputerTurn(false);
      }, 300);

      return () => clearTimeout(timeoutId);
    }
  }, [status, mode, isComputerTurn, findBestMove, makeMove]);

  const handleStart = () => {
    setStatus('playing');
    setCurrentPlayer(1);
    setLines([]);
    setBoxes([]);
    setScores({ player1: 0, player2: 0 });
    setIsComputerTurn(false);
  };

  const handleReset = () => {
    setStatus('not-started');
    setCurrentPlayer(1);
    setLines([]);
    setBoxes([]);
    setScores({ player1: 0, player2: 0 });
    setIsComputerTurn(false);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <GameControls
        mode={mode}
        status={status}
        onModeChange={setMode}
        onStart={handleStart}
        onReset={handleReset}
      />
      {status !== 'not-started' && (
        <>
          <ScoreBoard
            mode={mode}
            currentPlayer={currentPlayer}
            scores={scores}
            status={status}
          />
          <GameGrid
            size={GRID_SIZE}
            lines={lines}
            boxes={boxes}
            status={status}
            onLineClick={makeMove}
          />
          {status === 'finished' && (
            <div className="mt-8 text-2xl font-bold text-white">
              {scores.player1 > scores.player2
                ? 'Player 1 Wins!'
                : scores.player1 < scores.player2
                ? mode === 'vs-computer'
                  ? 'Computer Wins!'
                  : 'Player 2 Wins!'
                : "It's a Tie!"}
            </div>
          )}
        </>
      )}
    </div>
  );
};
'use client';

import { useState } from 'react';
import { GameState, Player, Enemy, Card } from '../types/game';

const INITIAL_DECK: Card[] = [
  { id: '1', name: 'Strike', cost: 1, damage: 8, healing: 0, imageUrl: '/strike.png' },
  { id: '2', name: 'Strike', cost: 1, damage: 8, healing: 0, imageUrl: '/strike.png' },
  { id: '3', name: 'Heal Potion', cost: 2, damage: 0, healing: 15, imageUrl: '/heal.png' },
];

export default function Game() {
  const [gameState, setGameState] = useState<GameState>('START');
  const [player, setPlayer] = useState<Player>({
    health: 40, maxHealth: 40, energy: 3, maxEnergy: 3, hand: [], deck: INITIAL_DECK
  });
  const [enemy, setEnemy] = useState<Enemy>({
    name: 'Corrupted Knight', health: 30, maxHealth: 30, intent: 'ATTACK', nextMoveValue: 6, imageUrl: '/knight.png'
  });

  const startGame = () => {
    setPlayer(p => ({ ...p, hand: [...p.deck], health: p.maxHealth, energy: p.maxEnergy }));
    setEnemy(e => ({ ...e, health: e.maxHealth }));
    setGameState('PLAYER_TURN');
  };

  const playCard = (card: Card) => {
    if (player.energy < card.cost) return;
    
    setPlayer(p => ({
      ...p,
      energy: p.energy - card.cost,
      health: Math.min(p.maxHealth, p.health + card.healing),
      hand: p.hand.filter(c => c.id !== card.id)
    }));
    
    setEnemy(e => {
      const newHealth = Math.max(0, e.health - card.damage);
      if (newHealth === 0) setGameState('GAME_OVER');
      return { ...e, health: newHealth };
    });
  };

  const endTurn = () => {
    setGameState('ENEMY_TURN');
    setTimeout(() => {
      setPlayer(p => {
        const newHealth = Math.max(0, p.health - enemy.nextMoveValue);
        if (newHealth === 0) setGameState('GAME_OVER');
        return { ...p, health: newHealth, energy: p.maxEnergy, hand: [...p.deck] };
      });
      if (player.health - enemy.nextMoveValue > 0) setGameState('PLAYER_TURN');
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white p-8 flex flex-col items-center justify-center font-sans">
      {gameState === 'START' && (
        <button onClick={startGame} className="bg-indigo-600 px-8 py-4 rounded-lg text-2xl hover:bg-indigo-500 font-bold">
          Enter the Dungeon
        </button>
      )}

      {(gameState === 'PLAYER_TURN' || gameState === 'ENEMY_TURN') && (
        <div className="w-full max-w-3xl space-y-12">
          
          <div className="bg-gray-900 p-6 rounded-xl text-center border border-red-900/50 shadow-lg shadow-red-900/20">
            <h2 className="text-2xl text-red-400 font-bold">{enemy.name}</h2>
            <div className="text-gray-400 mt-2">HP: {enemy.health} / {enemy.maxHealth}</div>
            <div className="text-red-300 font-bold mt-2 bg-red-950/50 inline-block px-4 py-1 rounded">
              Intent: ATK {enemy.nextMoveValue}
            </div>
            
            <div className="w-48 h-48 mx-auto mt-6 border-2 border-gray-600 rounded overflow-hidden shadow-lg shadow-black flex items-center justify-center bg-gray-800">
              {enemy.imageUrl ? (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img src={enemy.imageUrl} alt={enemy.name} className="w-full h-full object-cover" />
              ) : (
                <span className="text-gray-500">Loading...</span>
              )}
            </div>
          </div>

          <div className="flex justify-between items-center bg-gray-900 p-4 rounded-xl border border-indigo-900/50">
            <div className="text-xl">❤️ HP: <span className="text-green-400">{player.health}</span>/{player.maxHealth}</div>
            <div className="text-xl">⚡ Energy: <span className="text-blue-400">{player.energy}</span>/{player.maxEnergy}</div>
            {gameState === 'PLAYER_TURN' ? (
              <button onClick={endTurn} className="bg-yellow-600 px-6 py-2 rounded font-bold hover:bg-yellow-500 text-black">End Turn</button>
            ) : (
              <div className="text-yellow-600 font-bold px-6 py-2">Enemy is attacking...</div>
            )}
          </div>

          <div className="flex justify-center gap-6">
            {player.hand.map(card => (
              <button 
                key={card.id} 
                onClick={() => playCard(card)}
                disabled={player.energy < card.cost || gameState !== 'PLAYER_TURN'}
                className="bg-gray-800 p-4 rounded-xl border-2 border-gray-700 w-40 h-56 flex flex-col items-center justify-between hover:border-indigo-500 hover:-translate-y-2 transition-transform disabled:opacity-50 disabled:hover:translate-y-0 cursor-pointer"
              >
                <div className="text-lg font-bold text-indigo-300">{card.name}</div>
                <div className="text-xs bg-blue-900 px-2 rounded-full mt-1">Cost: {card.cost}</div>
                
                <div className="w-full h-24 mt-2 border border-gray-700 rounded overflow-hidden bg-gray-900 flex items-center justify-center">
                  {card.imageUrl ? (
                    /* eslint-disable-next-line @next/next/no-img-element */
                    <img src={card.imageUrl} alt={card.name} className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-gray-500">...</span>
                  )}
                </div>
                
                <div className="text-sm font-bold mt-2">
                  {card.damage > 0 ? `💥 ${card.damage} DMG` : `💚 ${card.healing} HEAL`}
                </div>
              </button>
            ))}
          </div>

        </div>
      )}

      {gameState === 'GAME_OVER' && (
        <div className="text-center bg-gray-900 p-12 rounded-2xl border border-gray-700">
          <h1 className="text-5xl font-bold mb-8">{player.health <= 0 ? '☠️ YOU DIED' : '🏆 VICTORY'}</h1>
          <button onClick={startGame} className="bg-indigo-600 px-8 py-4 rounded-lg text-xl font-bold hover:bg-indigo-500">
            Play Again
          </button>
        </div>
      )}
    </div>
  );
}
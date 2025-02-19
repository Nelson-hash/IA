import React, { useState } from 'react';
import { ChevronRight, Trophy } from 'lucide-react';

const videoData = [
  {
    left: {
      url: "/videos/IA-1.mp4",
      correct: true
    },
    right: {
      url: "/videos/Reel-1.mp4",
      correct: false
    }
  },
  {
    left: {
      url: "/videos/IA-2.mp4",
      correct: true
    },
    right: {
      url: "/videos/Reel-2.mp4",
      correct: false
    }
  },
  {
    left: {
      url: "/videos/IA-3.mp4",
      correct: true
    },
    right: {
      url: "/videos/Reel-3.mp4",
      correct: false
    }
  },
  {
    left: {
      url: "/videos/IA-4.mp4",
      correct: true
    },
    right: {
      url: "/videos/Reel-4.mp4",
      correct: false
    }
  },
  {
    left: {
      url: "/videos/IA-5.mp4",
      correct: true
    },
    right: {
      url: "/videos/Reel-5.mp4",
      correct: false
    }
  },
  {
    left: {
      url: "/videos/IA-6.mp4",
      correct: true
    },
    right: {
      url: "/videos/Reel-6.mp4",
      correct: false
    }
  },
  {
    left: {
      url: "/videos/IA-7.mp4",
      correct: true
    },
    right: {
      url: "/videos/Reel-7.mp4",
      correct: false
    }
  },
  {
    left: {
      url: "/videos/IA-8.mp4",
      correct: true
    },
    right: {
      url: "/videos/Reel-8.mp4",
      correct: false
    }
  },
  {
    left: {
      url: "/videos/IA-9.mp4",
      correct: true
    },
    right: {
      url: "/videos/Reel-9.mp4",
      correct: false
    }
  },
  {
    left: {
      url: "/videos/IA-10.mp4",
      correct: true
    },
    right: {
      url: "/videos/Reel-10.mp4",
      correct: false
    }
  }
];

function App() {
  const [currentRound, setCurrentRound] = useState(0);
  const [score, setScore] = useState(0);
  const [gameComplete, setGameComplete] = useState(false);

  const handleChoice = (isLeft: boolean) => {
    const currentPair = videoData[currentRound];
    const isCorrect = isLeft ? currentPair.left.correct : currentPair.right.correct;
    
    if (isCorrect) {
      setScore(prev => prev + 1);
    }

    if (currentRound === videoData.length - 1) {
      setGameComplete(true);
    } else {
      setCurrentRound(prev => prev + 1);
    }
  };

  if (gameComplete) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center">
        <div className="bg-white p-8 rounded-2xl shadow-xl text-center max-w-md w-full mx-4">
          <Trophy className="w-16 h-16 mx-auto text-yellow-500 mb-4" />
          <h2 className="text-3xl font-bold mb-4">Game Complete!</h2>
          <p className="text-xl mb-6">Your Score: {score} / {videoData.length}</p>
          <button
            onClick={() => {
              setCurrentRound(0);
              setScore(0);
              setGameComplete(false);
            }}
            className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:opacity-90 transition-opacity"
          >
            Play Again
          </button>
        </div>
      </div>
    );
  }

  const currentPair = videoData[currentRound];

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Progress bar */}
      <div className="fixed top-0 left-0 w-full h-2 bg-gray-800">
        <div 
          className="h-full bg-gradient-to-r from-purple-600 to-blue-600 transition-all duration-300"
          style={{ width: `${(currentRound / videoData.length) * 100}%` }}
        />
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-2 gap-4 h-[calc(100vh-12rem)]">
          {/* Left Video */}
          <button
            onClick={() => handleChoice(true)}
            className="relative group overflow-hidden rounded-xl hover:scale-[1.02] transition-transform"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <video
              src={currentPair.left.url}
              className="w-full h-full object-cover"
              autoPlay
              muted
              playsInline
              loop
            />
          </button>

          {/* Right Video */}
          <button
            onClick={() => handleChoice(false)}
            className="relative group overflow-hidden rounded-xl hover:scale-[1.02] transition-transform"
          >
            <div className="absolute inset-0 bg-gradient-to-l from-blue-600/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <video
              src={currentPair.right.url}
              className="w-full h-full object-cover"
              autoPlay
              muted
              playsInline
              loop
            />
          </button>
        </div>

        {/* Question text */}
        <div className="text-center mt-8">
          <h2 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
            SAUREZ-VOUS TROUVER LAQUELLE DE CES DEUX VIDÉOS A ÉTÉ GÉNÉRÉE PAR IA ?
          </h2>
        </div>
      </div>
    </div>
  );
}

export default App;

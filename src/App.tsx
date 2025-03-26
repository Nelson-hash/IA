import React, { useState, useEffect } from 'react';
import { Trophy, Brain, ThumbsDown, X } from 'lucide-react';

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
    right: {
      url: "/videos/IA-3.mp4",
      correct: true
    },
    left: {
      url: "/videos/Reel-3.mp4",
      correct: false
    }
  },
  {
    right: {
      url: "/videos/IA-4.mp4",
      correct: true
    },
    left: {
      url: "/videos/Reel-4.mp4",
      correct: false
    }
  },
  {
    right: {
      url: "/videos/IA-5.mp4",
      correct: true
    },
    left: {
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
  }
];

function App() {
  const [currentRound, setCurrentRound] = useState(0);
  const [score, setScore] = useState(0);
  const [gameComplete, setGameComplete] = useState(false);
  const [timeLeft, setTimeLeft] = useState(180);
  const [mistakes, setMistakes] = useState([]);

  useEffect(() => {
    let timerId;
    
    if (!gameComplete && timeLeft > 0) {
      timerId = setTimeout(() => {
        setTimeLeft(timeLeft - 1);
      }, 1000);
    } else if (timeLeft === 0 && !gameComplete) {
      setGameComplete(true);
    }
    
    return () => {
      if (timerId) clearTimeout(timerId);
    };
  }, [timeLeft, gameComplete]);

  const handleChoice = (isLeft) => {
    const currentPair = videoData[currentRound];
    const isCorrect = isLeft ? currentPair.left.correct : currentPair.right.correct;
    
    if (!isCorrect) {
      // Track mistakes
      setMistakes(prev => [...prev, {
        round: currentRound + 1,
        video: isLeft ? currentPair.left.url : currentPair.right.url,
        correctVideo: isLeft ? currentPair.right.url : currentPair.left.url
      }]);
    } else {
      setScore(prev => prev + 1);
    }
    if (currentRound === videoData.length - 1) {
      setGameComplete(true);
    } else {
      setCurrentRound(prev => prev + 1);
    }
  };

  const resetGame = () => {
    setCurrentRound(0);
    setScore(0);
    setGameComplete(false);
    setTimeLeft(180);
    setMistakes([]);
  };

  if (gameComplete) {
    let message = "";
    let emoji = "";
    let Icon = Trophy;
    let gradientColors = "from-purple-600 to-blue-600";
    let iconColor = "text-yellow-500";
    let newsletterMessage = "";

    if (score >= 6) {
      message = "Bravo, vous avez l'œil affûté, les robots ne vous auront pas tout de suite ! 🎯";
      emoji = "🦅";
      Icon = Trophy;
      gradientColors = "from-green-600 to-teal-600";
      iconColor = "text-yellow-500";
      newsletterMessage = "Si vous voulez rester un expert, suivez notre newsletter :";
    } else if (score >= 4) {
      message = "Mouais, pas beaucoup mieux que le hasard... 🎲";
      emoji = "🤔";
      Icon = Brain;
      gradientColors = "from-orange-600 to-yellow-600";
      iconColor = "text-orange-500";
      newsletterMessage = "Si vous voulez en savoir plus, suivez notre newsletter :";
    } else {
      message = "Ah... Oui on en est là... 🤖";
      emoji = "😅";
      Icon = ThumbsDown;
      gradientColors = "from-red-600 to-pink-600";
      iconColor = "text-red-500";
      newsletterMessage = "Si vous voulez tout de suite vous mettre à la page, suivez notre newsletter :";
    }

    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-r from-gray-800 to-gray-900 text-white">
        <div className="text-center max-w-md">
          <div className="text-6xl mb-4">{emoji}</div>
          <div className="text-2xl mb-4">{message}</div>
          <div className="text-xl mb-6">Score: {score} / {videoData.length}</div>

          {/* Mistakes Overview with Video Thumbnails */}
          {mistakes.length > 0 && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-4">Vos erreurs :</h3>
              <div className="grid grid-cols-2 gap-4">
                {mistakes.map((mistake, index) => (
                  <div key={index} className="bg-gray-700 p-4 rounded-lg">
                    <div className="mb-2">Choix {mistake.round}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          <button 
            onClick={resetGame}
            className={`bg-gradient-to-r ${gradientColors} text-white px-6 py-3 rounded-lg font-semibold hover:opacity-90 transition-opacity mb-6`}
          >
            Rejouer
          </button>

          <div className="mt-4">
            <div>{newsletterMessage}</div>
            <button className="bg-blue-600 text-white px-4 py-2 rounded-lg mt-2">
              S'inscrire à notre newsletter
            </button>
          </div>
        </div>
      </div>
    );
  }

  const currentPair = videoData[currentRound];
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-r from-gray-800 to-gray-900 text-white">
      {/* Progress bar */}
      <div className="w-full h-2 bg-gray-700">
        <div 
          className="h-full bg-blue-500" 
          style={{width: `${((currentRound + 1) / videoData.length) * 100}%`}}
        ></div>
      </div>

      <div className="flex-grow flex flex-col justify-between p-6">
        {/* Logo */}
        <div className="text-center">
          <h1 className="text-2xl font-bold">IA ou Réel ?</h1>
        </div>
        
        {/* Timer - Bottom Left */}
        <div className="absolute top-4 right-4">
          <div className="text-xl font-mono">
            {Math.floor(timeLeft / 60)}:{timeLeft % 60 < 10 ? '0' : ''}{timeLeft % 60}
          </div>
        </div>
        
        {/* Video Selection */}
        <div className="flex justify-center space-x-8 mb-8">
          {/* Left Video */}
          <button 
            onClick={() => handleChoice(true)}
            className="relative group overflow-hidden rounded-xl hover:scale-[1.02] transition-transform"
          >
            <video src={currentPair.left.url} className="w-64 h-96 object-cover" />
          </button>

          {/* Right Video */}
          <button 
            onClick={() => handleChoice(false)}
            className="relative group overflow-hidden rounded-xl hover:scale-[1.02] transition-transform"
          >
            <video src={currentPair.right.url} className="w-64 h-96 object-cover" />
          </button>
        </div>

        {/* Question text */}
        <div className="text-center mb-8">
          <p className="text-xl font-semibold">
            SAUREZ-VOUS TROUVER LAQUELLE DE CES DEUX VIDÉOS A ÉTÉ GÉNÉRÉE PAR IA ?
          </p>
        </div>
      </div>

      {/* Text - Bottom Right */}
      <div className="absolute bottom-4 right-4 text-sm text-gray-400">
        Vidéos conçues par Siloé Ralite / Site web par Nelson Remy
      </div>
    </div>
  );
}

export default App;

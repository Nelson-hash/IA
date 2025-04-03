import React, { useState, useEffect } from 'react';
import { Trophy, Brain, ThumbsDown, X, BarChart } from 'lucide-react';
import { supabase } from './supabaseClient';
import { v4 as uuidv4 } from 'uuid';

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

type StatType = {
  round_number: number;
  correct_percentage: number;
  total_plays: number;
};

function App() {
  const [currentRound, setCurrentRound] = useState(0);
  const [score, setScore] = useState(0);
  const [gameComplete, setGameComplete] = useState(false);
  const [timeLeft, setTimeLeft] = useState(180);
  const [mistakes, setMistakes] = useState<any[]>([]);
  const [globalStats, setGlobalStats] = useState<StatType[]>([]);
  const [showStats, setShowStats] = useState(false);
  const [sessionId, setSessionId] = useState('');
  const [loadingStats, setLoadingStats] = useState(false);

  // Générer un ID de session unique au chargement
  useEffect(() => {
    setSessionId(uuidv4());
  }, []);

  // Récupérer les statistiques globales
  const fetchGlobalStats = async () => {
    try {
      setLoadingStats(true);
      const { data, error } = await supabase
        .from('round_stats')
        .select('*')
        .order('round_number', { ascending: true });

      if (error) throw error;

      const stats: StatType[] = data.map(item => {
        const totalPlays = item.correct_count + item.incorrect_count;
        const correctPercentage = totalPlays > 0 
          ? Math.round((item.correct_count / totalPlays) * 100) 
          : 0;
        
        return {
          round_number: item.round_number,
          correct_percentage: correctPercentage,
          total_plays: totalPlays
        };
      });

      setGlobalStats(stats);
    } catch (error) {
      console.error('Erreur lors de la récupération des statistiques:', error);
    } finally {
      setLoadingStats(false);
    }
  };

  useEffect(() => {
    let timerId: NodeJS.Timeout | undefined;
    
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

  // Charger les stats quand le jeu est terminé
  useEffect(() => {
    if (gameComplete) {
      fetchGlobalStats();
    }
  }, [gameComplete]);

  const handleChoice = async (isLeft: boolean) => {
    if (!sessionId) return;
    
    const currentPair = videoData[currentRound];
    const isCorrect = isLeft ? currentPair.left.correct : currentPair.right.correct;
    const selectedVideo = isLeft ? currentPair.left.url : currentPair.right.url;
    const roundNumber = currentRound + 1;
    
    // Enregistrer le résultat dans Supabase (user_results)
    try {
      const { error: userResultError } = await supabase
        .from('user_results')
        .insert([
          { 
            session_id: sessionId,
            round_number: roundNumber, 
            is_correct: isCorrect
          }
        ]);

      if (userResultError) throw userResultError;
      
      // Mettre à jour les statistiques agrégées
      const updateColumn = isCorrect ? 'correct_count' : 'incorrect_count';
      const { error: statsError } = await supabase
        .from('round_stats')
        .update({
          [updateColumn]: supabase.rpc('increment_counter', {
            row_id: roundNumber,
            column_name: updateColumn
          })
        })
        .eq('round_number', roundNumber);

      if (statsError) throw statsError;
    } catch (error) {
      console.error("Erreur lors de l'enregistrement du résultat:", error);
    }
    
    if (!isCorrect) {
      // Track mistakes
      setMistakes(prev => [...prev, {
        round: roundNumber,
        video: selectedVideo,
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

  const toggleStats = () => {
    setShowStats(!showStats);
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
      <div className={`min-h-screen bg-gradient-to-br ${gradientColors} flex items-center justify-center`}>
        <div className="bg-white p-8 rounded-2xl shadow-xl text-center max-w-md w-full mx-4">
          <Icon className={`w-16 h-16 mx-auto ${iconColor} mb-4`} />
          <div className="text-6xl mb-4">{emoji}</div>
          <h2 className="text-2xl font-bold mb-4">{message}</h2>
          <p className="text-xl mb-6">Score: {score} / {videoData.length}</p>
          
          {/* Statistiques Globales Button */}
          <button
            onClick={toggleStats}
            className="bg-gray-800 text-white px-6 py-2 rounded-lg font-semibold mb-4 flex items-center mx-auto"
            disabled={loadingStats}
          >
            <BarChart className="w-5 h-5 mr-2" />
            {loadingStats 
              ? "Chargement..." 
              : showStats 
                ? "Masquer les statistiques" 
                : "Voir les statistiques globales"}
          </button>
          
          {/* Statistiques Globales */}
          {showStats && globalStats.length > 0 && (
            <div className="bg-gray-100 rounded-lg p-4 mb-6">
              <h3 className="text-lg font-semibold mb-3">Statistiques globales</h3>
              <div className="space-y-3">
                {globalStats.map((stat) => (
                  <div key={stat.round_number} className="relative pt-1">
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-teal-600 bg-teal-200">
                          Question {stat.round_number}
                        </span>
                      </div>
                      <div className="text-right">
                        <span className="text-xs font-semibold inline-block text-teal-600">
                          {stat.correct_percentage}% ({stat.total_plays} joueurs)
                        </span>
                      </div>
                    </div>
                    <div className="overflow-hidden h-2 mt-1 text-xs flex rounded bg-gray-300">
                      <div 
                        style={{ width: `${stat.correct_percentage}%` }}
                        className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-teal-500"
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {/* Mistakes Overview */}
          {mistakes.length > 0 && (
            <div className="bg-gray-100 rounded-lg p-4 mb-6">
              <h3 className="text-lg font-semibold mb-3">Vos erreurs :</h3>
              <div className="grid grid-cols-2 gap-4">
                {mistakes.map((mistake, index) => (
                  <div key={index} className="relative">
                    <div className="absolute inset-0 z-10 flex items-center justify-center">
                      <X className="w-16 h-16 text-red-500 bg-white/70 rounded-full p-2" />
                    </div>
                    <video
                      src={mistake.video}
                      className="w-full h-32 object-cover rounded-lg opacity-70"
                      muted
                    />
                    <p className="text-xs mt-2">Choix {mistake.round}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          <button
            onClick={() => {
              setCurrentRound(0);
              setScore(0);
              setGameComplete(false);
              setTimeLeft(180);
              setMistakes([]);
              setShowStats(false);
              // Générer un nouveau sessionId pour une nouvelle partie
              setSessionId(uuidv4());
            }}
            className={`bg-gradient-to-r ${gradientColors} text-white px-6 py-3 rounded-lg font-semibold hover:opacity-90 transition-opacity mb-6`}
          >
            Rejouer
          </button>
          <div className="mt-6 pt-6 border-t border-gray-200">
            <p className="text-gray-600 mb-2">{newsletterMessage}</p>
            <a
              href="https://ia-vengersnewen.beehiiv.com/"
              target="_blank"
              rel="noopener noreferrer"
              className={`inline-block bg-gradient-to-r ${gradientColors} text-white px-6 py-3 rounded-lg font-semibold hover:opacity-90 transition-opacity`}
            >
              S'inscrire à notre newsletter
            </a>
          </div>
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
        {/* Logo */}
        <div className="absolute top-0 left-4 z-10">
          <img src="/images/logo.png" alt="Logo" className="w-32 h-auto" />
        </div>
        
        {/* Timer - Bottom Left */}
        <div className="fixed bottom-6 left-6 z-10 bg-black bg-opacity-50 px-4 py-2 rounded-full">
          <div className={`font-mono text-xl font-bold ${timeLeft <= 10 ? 'text-red-500' : 'text-white'}`}>
            {Math.floor(timeLeft / 60)}:{timeLeft % 60 < 10 ? '0' : ''}{timeLeft % 60}
          </div>
        </div>
        
        {/* Video Selection */}
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
      
      {/* Text - Bottom Right */}
      <div className="fixed bottom-4 right-4 z-10 text-gray-400 text-sm opacity-50 font-mono">
        Vidéos conçues par Siloé Ralite / Site web par Nelson Remy
      </div>
    </div>
  );
}

export default App;

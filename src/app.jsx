import React, { useState, useEffect, useRef } from 'react';
import M from './M.svg';
import Modal from './Modal';
import useModal from './useModal';

import { Wand2, Delete, Sparkles, Star, Heart } from 'lucide-react';

function App() {
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [mob, setMob] = useState(null);
  const [code1, setCode1] = useState(false);
  const [code1GotRight, setCode1GotRight] = useState(0);
  const [svgVisible, setSvgVisible] = useState(false);
  const mystery3Ref = useRef(null);
  
  const [showPuzzle2, setShowPuzzle2] = useState(false);
  const [code2, setCode2] = useState('');
  const [waveActive, setWaveActive] = useState(false);
  const [showPuzzle3, setShowPuzzle3] = useState(false);
  
  const [selectedStars, setSelectedStars] = useState([]);
  const [isComplete, setIsComplete] = useState(false);
  
  const heart = [
    { id: 1, x: 50, y: 25, size: 8 },
    { id: 2, x: 40, y: 20, size: 6 },
    { id: 3, x: 35, y: 30, size: 7 },
    { id: 4, x: 38, y: 45, size: 8 },
    { id: 5, x: 45, y: 50, size: 6 },
    { id: 6, x: 50, y: 55, size: 7 },
    { id: 7, x: 62, y: 45, size: 6 },
    { id: 8, x: 65, y: 30, size: 4 },
    { id: 9, x: 60, y: 20, size: 8 },
  ];
  
  const solution = [1, 2, 3, 4, 5, 6, 7, 8, 9];
  
  const bgStars = [];
  for(let i = 0; i < 50; i++) {
    bgStars.push({
      id: i + 100,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 3 + 1,
      opacity: Math.random() * 0.6 + 0.2
    });
  }

  const { isOpen, openModal, closeModal } = useModal(false);
  const { isOpen: isFinishOpen, openModal: openFinishModal, closeModal: closeFinishModal } = useModal(false);
  
  useEffect(() => {
    let ua = navigator.userAgent.toLowerCase();
    setMob(/android|phone|tablet|mobile/i.test(ua));
    
    let resizeTimer;
    const onResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        setMob(/android|phone|tablet|mobile/i.test(ua));
      }, 300);
    };
    
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);
  
  useEffect(() => {
    const moveSensor = e => {
      setPos({
        x: e.clientX,
        y: e.clientY
      });
    };
    
    const touchSensor = e => {
      if (!e.touches?.[0]) return;
      setPos({
        x: e.touches[0].clientX,
        y: e.touches[0].clientY
      });
      e.preventDefault();
    };
    
    const tiltSensor = e => {
      if (!mob || !e.gamma || !e.beta) return;
      
      let tiltCap = 15;
      let g = Math.min(Math.max(e.gamma, -tiltCap), tiltCap) / tiltCap;
      let b = Math.min(Math.max(e.beta - 40, -tiltCap), tiltCap) / tiltCap;
      
      setPos({
        x: (g + 1) / 2 * window.innerWidth,
        y: (b + 1) / 2 * window.innerHeight
      });
    };
    
    window.addEventListener('mousemove', moveSensor);
    window.addEventListener('touchmove', touchSensor, { passive: false });
    
    if ('DeviceOrientationEvent' in window) {
      window.addEventListener('deviceorientation', tiltSensor);
    }
    
    return () => {
      window.removeEventListener('mousemove', moveSensor);
      window.removeEventListener('touchmove', touchSensor);
      
      if ('DeviceOrientationEvent' in window) {
        window.removeEventListener('deviceorientation', tiltSensor);
      }
    };
  }, [mob]);
  
  const getMotion = () => {
    let limit = mob ? 4 : 5;
    
    let xRatio = (pos.x / window.innerWidth) * 2 - 1;
    let yRatio = (pos.y / window.innerHeight) * 2 - 1;
    
    return {
      x: xRatio * limit,
      y: yRatio * limit
    };
  };
  
  const motion = getMotion();

  const handleFirstCodeInput = (e) => {
    let code = e.target.value;
    setCode1(code);
    if (code.length == 0) {
      setCode1GotRight(0);
      return;
    }

    if (code[0] == "K") {
      setCode1GotRight(1);
      if (code.length > 1 && code[1] == "V") {
        setCode1GotRight(2);
        if (code.length > 2 && code[2] == "M") {
          setCode1GotRight(3);
        }
      }
    }
  }

  useEffect(() => {
    if (mystery3Ref.current && code1GotRight > 1) {
      const rect = mystery3Ref.current.getBoundingClientRect();
      const isHovering = 
        pos.x >= rect.left && 
        pos.x <= rect.right && 
        pos.y >= rect.top && 
        pos.y <= rect.bottom;
      
      setSvgVisible(isHovering);
    } else {
      setSvgVisible(false);
    }
  }, [pos, code1GotRight]);

  useEffect(() => {
    if (code2 === '4B 56 4D') {
      setTimeout(() => {
        setWaveActive(true);
        setShowPuzzle3(true);
        setTimeout(() => {
          document.getElementById('puzzle-3').scrollIntoView({ behavior: 'smooth' });
        }, 500);
        setTimeout(() => {
          setWaveActive(false);
        }, 1500);
      }, 1000);
    }
  }, [code2]);
  
  useEffect(() => {
    if (isComplete) {
      openFinishModal();
    }
  }, [isComplete]);
  
  const clickStar = (starId) => {
    console.log(starId);
    
    if (isComplete) return;
    
    if (selectedStars.includes(starId)) {
      setSelectedStars(prev => prev.filter(id => id !== starId));
    } else {
      const newSelection = [...selectedStars, starId];
      setSelectedStars(newSelection);
      
      if (newSelection.length === solution.length) {
        const correct = newSelection.every((id, index) => id === solution[index]);
        if (correct) {
          setIsComplete(true);
        } else {
          setTimeout(() => {
            setSelectedStars([]);
          }, 1000);
        }
      }
    }
  };
  
  const resetStars = () => {
    setSelectedStars([]);
    setIsComplete(false);
  };

  return (
    <>
      <div className={`fixed inset-0 z-50 pointer-events-none transition-all duration-1000 ${waveActive ? 'opacity-100' : 'opacity-0'}`}>
        <div className="relative w-full h-full overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-pink-500 to-yellow-500 animate-pulse"></div>
          
          <div className="absolute bottom-0 w-full h-full">
            <svg className="absolute bottom-0 w-full h-full" viewBox="0 0 1200 800" preserveAspectRatio="none">
              <path className="animate-wave-1" d="M0,800 C300,600 900,400 1200,600 L1200,800 Z" fill="rgba(236, 72, 153, 0.8)"/>
              <path className="animate-wave-2" d="M0,800 C400,550 800,350 1200,550 L1200,800 Z" fill="rgba(245, 158, 11, 0.6)"/>
              <path className="animate-wave-3" d="M0,800 C200,650 1000,450 1200,650 L1200,800 Z" fill="rgba(236, 72, 153, 0.4)"/>
            </svg>
          </div>
          
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-white text-6xl bangers-regular animate-bounce">
              LEVEL COMPLETE!
            </div>
          </div>
        </div>
      </div>

      <section id="landing" className='h-full w-full flex flex-col justify-center items-center relative'>
        <h1 className='text-[min(40vw,120px)] rajdhani-bold text-shadow-blue-200 text-shadow-lg'>MysUiz {mob}</h1>
        <input className={`mt-10 bg-slate-800 ${code1GotRight == 1? 'px-6' : code1GotRight == 2? 'px-4' : code1GotRight == 3? 'px-2' : 'px-8'} py-4 rounded-4xl placeholder:text-center text-center placeholder:text-slate-500 inset-shadow-black/60 inset-shadow-sm drop-shadow-2xl shadow-2xl outline-0 text-2xl transition-all translate-3 audiowide-regular`} placeholder='Secret Code' type="text" maxLength={4} onChange={handleFirstCodeInput} />
        
        {code1GotRight >= 3 && (
          <button 
            onClick={openModal} 
            className="mt-6 px-8 py-3 bg-green-500 hover:bg-green-600 text-white rounded-4xl shadow-green-400/40 shadow-lg transition-all duration-300 transform hover:scale-105 audiowide-regular"
          >
            Open Secret
          </button>
        )}
        
        <div
          className={`mys-1 absolute bg-green-500 shadow-green-400/40 shadow-xl rounded-full flex justify-center items-center`}
          style={{
            top: `calc(22px + ${mob? -motion.y*4 : -motion.y}px)`,
            left: `calc(22px + ${mob? -motion.x*4 : -motion.x}px)`,
            width: mob? "42px" : "32px",
            height: mob? "42px" : "32px",
          }}
        >
          <span className="w-full h-full flex justify-center items-center text-center rock-salt-regular" style={{ 
            fontSize: mob ? '22px' : '18px',
            lineHeight: '1',
            transform: 'scale(1.2)'
          }}>K</span>
        </div>
        <div 
          className={`mys-1-layer2 absolute bg-green-500 shadow-green-400/40 shadow-xl rounded-full`}
          style={{
            top: `calc(22px + ${mob? motion.y*4 : motion.y}px)`,
            left: `calc(22px + ${mob? motion.x*4 : motion.x}px)`,
            width: mob? "42px" : "32px",
            height: mob? "42px" : "32px",
          }}
        ></div>

        <div
          className={`${code1GotRight == 0? 'hidden': ''} mys-2 absolute bg-red-500 shadow-red-400/40 shadow-xl rotate-45 flex justify-center items-center`}
          style={{
            bottom: `calc(22px + ${mob? -motion.y*4 : -motion.y}px)`,
            right: `calc(22px + ${mob? motion.x*4 : motion.x}px)`,
            width: mob? "42px" : "32px",
            height: mob? "42px" : "32px",
          }}
        >
          <span className="w-full h-full flex justify-center items-center text-center rock-salt-regular" style={{ 
            fontSize: mob ? '22px' : '18px',
            lineHeight: '1',
            transform: 'scale(1.2)'
          }}>?</span>
        </div>
        <div 
          className={`${code1GotRight == 0? 'hidden': ''} mys-2-layer2 absolute bg-red-500 shadow-red-400/40 shadow-xl flex justify-center items-center animate-spin`}
          style={{
            bottom: `calc(22px + ${mob? motion.y*4 : motion.y}px)`,
            right: `calc(22px + ${mob? -motion.x*4 : -motion.x}px)`,
            width: mob? "42px" : "32px",
            height: mob? "42px" : "32px",
          }}
        ><span className='text-red-500' style={{ 
            fontSize: mob ? '22px' : '18px',
            lineHeight: '1',
            transform: 'scale(1.2)'
          }}>V</span></div>
        
        <div className="mystery-3" ref={mystery3Ref}>
          <img 
            src={M} 
            alt="M logo" 
            style={{
              opacity: svgVisible ? 1 : 0.005,
              filter: svgVisible ? 'drop-shadow(0 0 10px rgba(0, 255, 0, 0.8))' : 'none',
              transition: 'opacity 0.3s, filter 0.3s',
            }}
          />
        </div>
        
        <Modal 
          isOpen={isOpen} 
          onClose={closeModal}
          title="Secret Discovered"
          size="lg"
          blurBackground={true}
        >
          <div className="flex flex-col items-center">
            <div className="w-20 h-20 mb-4 bg-green-500 rounded-full flex items-center justify-center shadow-green-400/40 shadow-lg">
              <span className="text-4xl rock-salt-regular">!</span>
            </div>
            
            <p className="text-center mb-6 text-lg">
              You've uncovered the hidden code sequence: <span className="text-green-400 font-bold">KVM</span>
            </p>
            
            <div className="bg-slate-700 p-4 rounded-xl w-full mb-6">
              <p className="text-green-300 font-mono">
                <span className="text-pink-400">const</span> <span className="text-blue-400">secretKey</span> = <span className="text-amber-300">"KVM"</span>;
              </p>
            </div>
            
            <button 
              onClick={() => closeModal() + setShowPuzzle2(true) + setTimeout(() => document.getElementById('puzzle-2').scrollIntoView(), 500)}
              className="px-6 py-2 bg-slate-700 hover:bg-slate-600 rounded-full transition-colors duration-200 flex justify-center items-center"
            >
              <span className='bangers-regular text-2xl mr-4'>NEXT</span>
              <Wand2 className="text-yellow-400" size={24} />
            </button>
          </div>
        </Modal>
        
        <div className={`x-ray absolute w-100 h-100 ${code1GotRight > 1?'bg-green-400/70 shadow-green-400/70 drop-shadow-2xl shadow-2xl blur-2xl -translate-50': ''} rounded-full opacity-${code1GotRight > 2? 10 : code1GotRight > 1? 60 : 0} transition-all duration-600`} style={code1GotRight > 2? {bottom: 0, left: 0} : {top: pos.y, left: pos.x}}></div>
      </section>
      
      <section id="puzzle-2" className={`${showPuzzle2? 'flex' : 'hidden'} h-[100vh] justify-center items-center`}>
        <div className="pin-lock flex flex-col items-center gap-6 ring-2 ring-cyan-900 p-4 rounded-2xl relative overflow-hidden">
          <div className="screen min-w-60 min-h-20 bg-white/20 rounded-3xl flex justify-center items-center orbitron-400 text-2xl">
          {code2}
          {code2 != ""? <button className='ml-3' onClick={(e) => setCode2(prev => prev.slice(0, -1))}><Delete size={20} /></button> : ""}
        </div>
          <div className="btns grid grid-cols-3 gap-4">
            {[...Array(10).keys(), 'B', 'Hex', 'D'].slice(1).map((n) => <button className={`btn p-4 bg-cyan-200/10 rounded-2xl flex justify-center items-center orbitron-600 text-2xl hover:drop-shadow-xl hover:shadow-2xl scale-3d hover:scale-110 transition-all ${n == 'Hex'? 'text-green-500 shadow-green-200/30': 'shadow-cyan-200/30'}`} onClick={(e) => setCode2(prev => (prev + String(n)).replace(/\s+/g, '').match(/.{1,2}/g)?.join(' ') || '')}>{n}</button>)}
          </div>
          <div className={`fillup absolute bottom-0 w-100 animate-pulse transition-all duration-500 ${code2 == '4B 56 4D' ? 'h-100' : code2.startsWith('4B 56') ? 'h-70' : code2.startsWith('4B') ? 'h-35' : 'h-0'} bg-gradient-to-r from-pink-500 to-yellow-500 blur-2xl -z-10`}>
            
          </div>
        </div>
      </section>
      
      <section id='puzzle-3' className={`${showPuzzle3 ? 'flex' : 'hidden'} h-[100vh] flex-col justify-center items-center bg-slate-900 relative overflow-hidden`}>
        <div className="absolute inset-0 bg-gradient-to-b from-indigo-950 to-slate-900"></div>
        
        <div className="absolute inset-0">
          {bgStars.map(star => (
            <div
              key={star.id}
              className="absolute rounded-full bg-white animate-pulse"
              style={{
                left: `${star.x}%`,
                top: `${star.y}%`,
                width: `${star.size}px`,
                height: `${star.size}px`,
                opacity: star.opacity,
                animationDelay: `${Math.random() * 3}s`,
                animationDuration: `${2 + Math.random() * 2}s`
              }}
            />
          ))}
        </div>
        
        <div className="relative z-10 text-center mb-8">
          <h2 className="text-4xl bangers-regular text-white mb-4 flex justify-center items-center gap-2"><Heart size={42} fill='red' stroke='red' /> Love</h2>
          <p className="text-lg text-slate-300 mb-2">Connect the stars to form a Heart</p>
          <p className="text-sm text-slate-400">Click stars in the correct order: {selectedStars.length}/{solution.length}</p>
        </div>
        
        <div className="relative w-full max-w-4xl h-96 border-2 border-cyan-500/30 rounded-xl bg-black/20 backdrop-blur-sm">
          <svg className="absolute inset-0 w-full h-full pointer-events-none">
            {selectedStars.map((starId, index) => {
              if (index === 0) return null;
              const currentStar = heart.find(s => s.id === starId);
              const prevStar = heart.find(s => s.id === selectedStars[index - 1]);
              
              return (
                <line
                  key={`line-${index}`}
                  x1={`${prevStar.x}%`}
                  y1={`${prevStar.y}%`}
                  x2={`${currentStar.x}%`}
                  y2={`${currentStar.y}%`}
                  stroke="cyan"
                  strokeWidth="2"
                  className={`${isComplete ? 'animate-pulse' : ''}`}
                />
              );
            })}
          </svg>
          
          {heart.map((star, index) => (
            <button
              key={star.id}
              onClick={() => clickStar(star.id)}
              className={`absolute transform -translate-x-1/2 -translate-y-1/2 rounded-full transition-all duration-300 hover:scale-125 ${
                selectedStars.includes(star.id)
                  ? 'bg-cyan-400 shadow-cyan-400/50 shadow-lg'
                  : 'bg-yellow-200 hover:bg-yellow-300'
              } ${isComplete ? 'animate-pulse' : ''}`}
              style={{
                left: `${star.x}%`,
                top: `${star.y}%`,
                width: `${star.size + (selectedStars.includes(star.id) ? 4 : 0)}px`,
                height: `${star.size + (selectedStars.includes(star.id) ? 4 : 0)}px`,
              }}
            >
              {selectedStars.includes(star.id) && (
                <span className="absolute -top-8 left-1/2 transform -translate-x-1/2 text-cyan-400 text-sm font-bold">
                  {selectedStars.indexOf(star.id) + 1}
                </span>
              )}
            </button>
          ))}
        </div>
        
        <div className="relative z-10 mt-6 flex gap-4">
          <button
            onClick={resetStars}
            className="px-6 py-2 bg-slate-700 hover:bg-slate-600 rounded-full transition-colors duration-200"
          >
            Reset
          </button>
        </div>
      </section>
      
      <Modal 
        isOpen={isFinishOpen} 
        onClose={closeFinishModal}
        title="MysUiz Finished"
        size="lg"
        blurBackground={true}
      >
        <div className="flex flex-col items-center">
          <div className="w-24 h-24 mb-6 rounded-full flex items-center justify-center bg-gradient-to-b from-slate-500 to-slate-600 shadow-lg drop-shadow-2xl">
            <Sparkles size={32} className="text-white" />
          </div>
          
          <h3 className="text-2xl bangers-regular text-center mb-4">CONGRATULATIONS!</h3>
          
          <p className="text-center mb-6 text-lg">
            You've completed all the MysUiz challenges Comeback Soon for more challenges! The final code is: <span className="text-cyan-400 font-bold">URSA</span>
          </p>
          
          <div className="bg-slate-700 p-4 rounded-xl w-full mb-6">
            <p className="text-green-300 flex justify-center gap-5">
              <Star /> All puzzles solved! <Star />
            </p>
          </div>
        </div>
      </Modal>
    </>
  );
}

export default App;
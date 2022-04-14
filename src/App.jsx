import react from 'react'
import { useState , useEffect , useCallback , useRef} from 'react'
import "bootstrap-icons/font/bootstrap-icons.css";
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css'
import Data from './component/Db'
import ListTrack from './component/ListTrack'

const Player = () => {


  const [currentIndex,setCurrentIndex] = useState (0)
  const [isPlaying,setIsPlaying] = useState(false)
  const [progess,setProgess] = useState (0)
  const [isSong,setIsSong] = useState(false)
  const [state,setState] = useState (false)
  const [isRandom,setIsRandom] = useState(false)
  const {title,image,path,singer,id} = Data[currentIndex]
  const timingRef = useRef()
  const audioRef = useRef (new Audio (path))
  // const imgRef = useRef()
  // const Audio = new Audio ()
  const handleSetPlaying = useCallback(() =>{
    setIsPlaying(!isPlaying)
  },[isPlaying])
  
  const handlePrevSong = useCallback(() =>{
    console.log('prev song');
    if(currentIndex <= 0 ){
      setCurrentIndex(Data.length - 1)
    }else{
      setCurrentIndex(currentIndex - 1)
    }
    setIsPlaying(true);
  },[currentIndex])

  const handleNextSong = useCallback(() =>{
    console.log("next song")
    
    if(currentIndex >= Data.length-1){
      setCurrentIndex (0)
    }else{
      setCurrentIndex(currentIndex + 1)
      
    }
    setIsPlaying(true);
  },[currentIndex])

  const handleReloadSong = useCallback(() =>{
    setIsRandom(false)
    setIsSong(!isSong)
    audioRef.current.loop = true;
  },[isSong])



  Data.map(song => {
    if(song.id == currentIndex){
      document.title = song.title
    }
  })
  useEffect(() => {
    if (isPlaying) {
      audioRef.current.play();
      startTimer();

    } else {
      audioRef.current.pause();

    }
  }, [isPlaying,currentIndex]);
  

  useEffect(()=>{
    audioRef.current.pause();
    audioRef.current = new Audio(path);
    if(isPlaying){
      audioRef.current.play();
      setIsPlaying(true);
      startTimer();
    }
  },[currentIndex])


  const {duration} = audioRef.current
  const startTimer = () => {

    // reset lại thời gian
    clearInterval(timingRef.current);

    timingRef.current = setInterval(() => {
      if (audioRef.current.ended) {
        if(isRandom){
          random()
        }
        else{
          handleNextSong()
        }
      } else {
        setProgess(audioRef.current.currentTime);
      }
    }, [1000]);
  };

  const onScrub = (value) => {
    // reset lại thời gian
    clearInterval(timingRef.current);
    audioRef.current.currentTime = value;
    setProgess(audioRef.current.currentTime);
  };
  const onScrubEnd = () => {
    // nếu mà đang không chạy thì set cho chạy
    if (!isPlaying) {
      setIsPlaying(true);
    }
    startTimer();
  };
  const handleSelectThisTrack = (id) =>{
    console.log("Chọn bài");
    let currentTrackIndex = 0;
    Data.map((song, index) => {
        if (song.id === id) {
            currentTrackIndex = index;
        }
    });
    setCurrentIndex(currentTrackIndex)
    if(!isPlaying){
      audioRef.current.play();
      setIsPlaying(true);
    }
  }
  const btnToogle = () =>{
    setState(!state)
  }
  const handleSetIsRandom = useCallback(() =>{
    setIsSong(false)
    audioRef.current.loop = false;
    setIsRandom(!isRandom)
  },[isRandom])
  const random = useCallback(() =>{
      const newIndex = Math.floor(Math.random() * (Data.length+1))
      setCurrentIndex(newIndex)
      console.log(newIndex)
  },[])
  return(
    <div>
      
      <ListTrack 
        handleSelectThisTrack = {(id)=>handleSelectThisTrack(id)}
        state={state}
        btnToogle = {()=>btnToogle()}
      />
      <div className='background'>
        <img  src={image} alt={title} />
        <p className='title-song'>
          <span>
            {title}
          </span> 
          <br />
          <span>
            {singer}
          </span>
        </p>
      </div>
      <button className='btn' onClick={handlePrevSong}><i className="bi bi-skip-start"></i></button>
      <button className='btn' onClick={handleSetPlaying}> {isPlaying? <i className="bi bi-pause-circle"></i> : <i className="bi bi-play-circle"></i> }</button>
      <button className='btn' onClick={handleNextSong}><i className="bi bi-skip-end"></i></button>
      <div>
        <input type="range" name="" id="progress" min = '0' step="1"   max={duration ? duration : `${duration}`}
          value = {progess}
          onChange={(e) => onScrub(e.target.value)}
          onMouseUp={onScrubEnd}
          onKeyUp={onScrubEnd}
        />
      </div>
      <button className={state? 'btn btn-outline-light mx-2' : 'btn mx-2'} onClick={btnToogle}><i className="bi bi-music-note-list"></i></button>
      <button className={isSong? 'btn btn-outline-light mx-2' : 'btn mx-2'} onClick={handleReloadSong}><i className="bi bi-arrow-counterclockwise"></i></button>
      <button className={isRandom? 'btn btn-outline-light mx-2' : 'btn mx-2'} onClick={handleSetIsRandom}><i className="bi bi-shuffle"></i></button>
    </div>
  )
}

function App() {

  return (
    <div className="App">
      <div className="container">
        <Player />
        
      </div>
    </div>
  )
}

export default App

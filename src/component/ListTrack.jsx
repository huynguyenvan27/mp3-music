import Data from './Db'
import "bootstrap-icons/font/bootstrap-icons.css";

const ListTrack = (props) =>{


  return(
    <div className={props.state ? 'list-track open' :'list-track'}>

      <p className='mt-5 heading'>PLAY LIST</p>
      <ul>
          {Data.map(song=>{
            return(
              <li 
                  key={song.id} 
                  onClick = {()=>props.handleSelectThisTrack(song.id)}>
                {song.title}
              </li>
            )
          })}
      </ul>
      <button className='close-side btn' onClick={props.btnToogle}>
        <i className="bi bi-arrow-left"></i>
      </button>
    </div>
  )

}

export default ListTrack;
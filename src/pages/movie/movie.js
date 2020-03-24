import React, { useState } from 'react';
import { Row, Col, Button } from 'antd';
import { useParams } from 'react-router-dom';
import moment from 'moment';
import useFetch from '../../hooks/useFetch';
import { URL_API, API } from '../../utils/constants';
import Loading from '../../components/Loading';
import ModalVideo from '../../components/ModalVideo';
import './movie.scss';

export default function Movie() {

  const { id } = useParams();
  const movieInfo = useFetch(
    `${ URL_API }/movie/${ id }?api_key=${API}&language=en-ES`
  );

  if(movieInfo.loading || !movieInfo.result ) {
    return <Loading></Loading>
  }else {
    
    return <RenderMovie movieInfo={movieInfo.result}></RenderMovie>
  }

}

function RenderMovie(props) {

  const { movieInfo: { backdrop_path, poster_path } } = props;

  const backdropPath = `https://image.tmdb.org/t/p/original${backdrop_path}`;
  

  return (
    <div className="movie" 
    style={{ backgroundImage: `url('${backdropPath}')` }}
    >
      <div className="movie__dark"></div>
      <Row>
        <Col span={8} offset={3} className="movie__poster" >
          <PosteMovie image={poster_path}></PosteMovie>
        </Col>
        <Col span={10} className="movie__info">
          <MovieInfo movieInfo={ props.movieInfo }></MovieInfo>
        </Col>
      </Row>
    </div>
  )
}

function  PosteMovie(props) {

  const { image } =props;
  const posterPath  = `https://image.tmdb.org/t/p/original${image}`;
  console.log(posterPath);
  

  return (
    <div className="sa" style={{ backgroundImage: `url(${posterPath})` }}>

    </div>
  )
}

function MovieInfo(props) {
  const { movieInfo: { id, title, release_date, overview, genres } } = props;

  const [isVisibleModal, setIsVisibleModal] = useState(false);

  const videoMovie = useFetch(
    `${URL_API}/movie/${id}/videos?api_key=${API}&language=es-ES`
  )

  const openModal = () => setIsVisibleModal(true);
  const closeModal = () => {
    setIsVisibleModal(false);
  }
    

  const renderVideo = () => {
    if(videoMovie.result) {
      if(videoMovie.result.results.length > 0) {
        return (
          <>
          <Button icon="play-circle" onClick={openModal}>Ver Trailer</Button>
            <ModalVideo
              videoKey={ videoMovie.result.results[0].key }
              videoPlatform={ videoMovie.result.results[0].site }
              isOpen={isVisibleModal}
              close={ closeModal }
            ></ModalVideo>
          </>
        )
      }
    }
  }

  return (
    <>
      <div className="movie__info-header">
        <h1>{ title }
          <span>{ moment(release_date, "YYYY-MM-DD").format("YYYY") }</span>
        </h1>
        { renderVideo() }
        <ModalVideo></ModalVideo>
      </div>
      <div className="movie__info-content">
        <h3>General</h3> 
        <p>{overview}</p>

        <h3>Generos</h3>
        <ul>
          {genres.map(gender => (
            <li key={gender.id}>{gender.name}</li>
            ))}
        </ul>

      </div>
    </>
  )
}
import React, { useState, useEffect } from 'react';
import { Row, Col } from 'antd';
import { URL_API, API, UP_TOP } from '../utils/constants';
import Footer from '../components/Footer';
import Loading from '../components/Loading';
import MovieCatalog from '../components/MovieCatalog';
import Pagination from '../components/Pagination';

export default function Popular() {
  const [movieList, setMovieList] = useState([]);
  const [page, setPage] = useState(1);

  useEffect( () => {

    (async () => {

      const  response = await fetch(
        `${URL_API}/movie/popular?api_key=${API}&language=es-ES&page=${page}`
      );

      const movies = await response.json();

      setMovieList(movies);

    })();

  }, [page])

  const onChangePage = page => {
    setPage(page);
    UP_TOP();
  }

  return (
    <Row>
      <Col span={24} style={{ textAlign: "center", marginTop: 25 }}>
        <h1 style={{ fontSize: 35, fontWeight: "bold" }}>Peliculas Populares</h1>
      </Col>

      {movieList.results ? (

        <Row>
          <Col span={24}>
            <MovieCatalog movies={movieList}>

            </MovieCatalog>
          </Col>
           
          <Col span={24}>
          <Pagination 
              currentPage={ movieList.page }
              totalItems={movieList.total_results}
              OnChangePage={onChangePage}
            ></Pagination>
          </Col>
        </Row>

      ) : (
        <Col span={24}>
          <Loading></Loading>
        </Col>
      )}

      <Col span={24}>
        <Footer></Footer>
      </Col>
    </Row>
  )

}
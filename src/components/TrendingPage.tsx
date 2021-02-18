import { CircularProgress } from '@material-ui/core';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { loading } from '../actions';
import { RootState } from '../rootState';

function TrendingPage() {
  let isLoading = useSelector((state: RootState) => state.isLoading);
  let [trendingMovies, setTrendingMovies] = useState<any[]>([]);
  let dispatch = useDispatch();

  useEffect(() => {
    axios
      .get('/trending-movies')
      .then((res) => {
        dispatch(loading(false));
        setTrendingMovies(res.data);
      })
      .catch((err) => {
        console.log(err);
      });

    return () => {
      dispatch(loading(true));
    };
  }, [dispatch]);

  const formatChange = (change: number) => {
    const format = (() => {
      if (change > 0) {
        return {
          color: 'green',
          sign: '+',
        };
      } else if (change < 0) {
        return {
          color: 'red',
          sign: '',
        };
      } else {
        return {
          color: 'grey',
        };
      }
    })();

    return (
      <span
        style={{
          color: format.color,
        }}
      >
        {change !== 0 ? `${format.sign}${change}` : '-'}
      </span>
    );
  };

  return (
    <div className='trending-page-wrapper'>
      {isLoading && (
        <div className='loading-indicator'>
          <CircularProgress color='inherit' />
        </div>
      )}
      <div className='trending-movies-wrapper'>
        <table>
          <thead>
            <tr>
              <th>#</th>
              <th>+/-</th>
              <th>Title</th>
            </tr>
          </thead>
          <tbody>
            {trendingMovies.map((movie: any) => {
              const change = movie.prevRank - movie.rank;

              return (
                <tr key={movie._id}>
                  <td>{movie.rank}</td>
                  <td>{formatChange(change)}</td>
                  <td>{movie.title}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default TrendingPage;

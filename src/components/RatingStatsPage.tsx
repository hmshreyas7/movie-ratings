import { CircularProgress } from '@material-ui/core';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { loading } from '../actions';
import { RootState } from '../rootState';

function RatingStatsPage() {
  const user = useSelector((state: RootState) => state.user);
  let isLoading = useSelector((state: RootState) => state.isLoading);
  let [stats, setStats] = useState({
    totalRatings: 0,
    avgRating: '',
    ratingDistribution: {},
    avgRatingsByRuntime: [],
    favoriteGenres: [],
    avgRatingsByDecade: [],
  });
  let dispatch = useDispatch();

  useEffect(() => {
    axios
      .get(`http://localhost:5000/movie-rating-stats/${user.uid}`)
      .then((res) => {
        setStats(res.data);
        dispatch(loading(false));
      })
      .catch((err) => {
        console.log(err);
      });

    return () => {
      dispatch(loading(true));
    };
  }, [user.uid, dispatch]);

  const getRatingDistribution = () => {
    const ratingDistributionArray = Object.entries(
      stats.ratingDistribution
    ) as [string, number][];

    return ratingDistributionArray
      .sort((a, b) => parseInt(b[0]) - parseInt(a[0]))
      .map((rating) => {
        const ratingPct =
          stats.totalRatings > 0 ? (100 * rating[1]) / stats.totalRatings : 0;

        return (
          <div className='rating-row'>
            <div>{rating[0]}</div>
            <div className='rating-bar-wrapper'>
              <div
                className='rating-bar'
                style={{ width: ratingPct + '%' }}
              ></div>
              <div>
                {ratingPct.toFixed(1)}% ({rating[1]})
              </div>
            </div>
          </div>
        );
      });
  };

  const buildRatingStatsTable = (
    ratingGroupTitle: string,
    ratingGroupArray: [string, string][]
  ) => {
    return (
      <>
        <h2>Ratings by {ratingGroupTitle}</h2>
        <div className='rating-stats-table'>
          <div className='rating-stats-column'>
            {ratingGroupArray.map((ratingGroup) => (
              <div
                style={
                  ratingGroupTitle === 'Genre' ? { textAlign: 'left' } : {}
                }
              >
                {ratingGroup[0]}
              </div>
            ))}
          </div>
          <div className='rating-stats-column'>
            {ratingGroupArray.map((ratingGroup) => (
              <div>{ratingGroup[1]}</div>
            ))}
          </div>
        </div>
      </>
    );
  };

  return (
    <div className='rating-stats-page-wrapper'>
      {isLoading && (
        <div className='loading-indicator'>
          <CircularProgress color='inherit' />
        </div>
      )}
      <p>Total ratings: {stats.totalRatings}</p>
      <p>Average rating: {stats.avgRating}</p>
      <div className='rating-distribution'>
        <h2>Rating Distribution</h2>
        {getRatingDistribution()}
      </div>
      {buildRatingStatsTable('Runtime', stats.avgRatingsByRuntime)}
      {buildRatingStatsTable('Genre', stats.favoriteGenres)}
      {buildRatingStatsTable('Decade', stats.avgRatingsByDecade)}
    </div>
  );
}

export default RatingStatsPage;

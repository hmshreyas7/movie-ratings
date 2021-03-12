import { CircularProgress } from '@material-ui/core';
import axios from 'axios';
import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { loading } from '../actions';
import { RootState } from '../rootState';
import BottomNav from './BottomNav';
import NoData from './NoData';

function RatingStatsPage() {
  const user = useSelector((state: RootState) => state.user);
  let isLoading = useSelector((state: RootState) => state.isLoading);
  let [stats, setStats] = useState({
    totalRatings: 0,
    ratingDistribution: {},
    avgRatingsByRuntime: [],
    favoriteGenres: [],
    avgRatingsByDecade: [],
  });
  let [hasRatings, setHasRatings] = useState(true);
  let [selectedTab, setSelectedTab] = useState(0);
  let dispatch = useDispatch();
  let bottomNavRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (user.uid) {
      axios
        .get(`/api/movie-rating-stats/${user.uid}`)
        .then((res) => {
          setStats(res.data);
          dispatch(loading(false));
          setHasRatings(res.data.totalRatings !== 0);
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      dispatch(loading(false));
      setHasRatings(false);
    }

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
          <div key={rating[0]} className='rating-row'>
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

  const sortTable = (
    ratingGroupTitle: string,
    ratingGroupArray: [string, string[]][],
    sortByIndex?: number
  ) => {
    const arrayToBeSorted = (() => {
      switch (ratingGroupTitle) {
        case 'Runtime':
          return 'avgRatingsByRuntime';
        case 'Genre':
          return 'favoriteGenres';
        case 'Decade':
          return 'avgRatingsByDecade';
        default:
          return '';
      }
    })();

    const sortedArray = (() => {
      let result = [];

      if (ratingGroupTitle === 'Runtime') {
        const runtimeIntervals = [
          '< 60 min',
          '60-89 min',
          '90-119 min',
          '120-149 min',
          '150-179 min',
          '180+ min',
        ];

        result = [...ratingGroupArray].sort(
          (a, b) =>
            runtimeIntervals.indexOf(a[0]) - runtimeIntervals.indexOf(b[0])
        );
      } else {
        result = [...ratingGroupArray].sort((a, b) => a[0].localeCompare(b[0]));
      }

      if (sortByIndex !== undefined) {
        result.sort(
          (a, b) => Number(b[1][sortByIndex]) - Number(a[1][sortByIndex])
        );
      }

      return result;
    })();

    setStats((prevStats) => {
      return {
        ...prevStats,
        [arrayToBeSorted]: sortedArray,
      };
    });
  };

  const buildRatingStatsTable = (
    ratingGroupTitle: string,
    ratingGroupArray: [string, string[]][]
  ) => {
    return (
      <>
        <h2>Ratings by {ratingGroupTitle}</h2>
        <table className='rating-stats-table'>
          <thead>
            <tr>
              <th onClick={() => sortTable(ratingGroupTitle, ratingGroupArray)}>
                {ratingGroupTitle}
              </th>
              <th
                onClick={() => sortTable(ratingGroupTitle, ratingGroupArray, 1)}
                title='Number of ratings'
              >
                Count
              </th>
              <th
                onClick={() => sortTable(ratingGroupTitle, ratingGroupArray, 0)}
                title='Average rating'
              >
                Average
              </th>
            </tr>
          </thead>
          <tbody>
            {ratingGroupArray.map((ratingGroup) => (
              <tr key={ratingGroup[0]}>
                <td
                  style={
                    ratingGroupTitle === 'Genre' ? { textAlign: 'left' } : {}
                  }
                >
                  {ratingGroup[0]}
                </td>
                <td>{ratingGroup[1][1]}</td>
                <td>{ratingGroup[1][0]}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </>
    );
  };

  const displayTabContent = (index: number) => {
    switch (index) {
      case 0:
        return (
          <div className='rating-distribution'>
            <h2>Rating Distribution</h2>
            {getRatingDistribution()}
          </div>
        );
      case 1:
        return buildRatingStatsTable('Runtime', stats.avgRatingsByRuntime);
      case 2:
        return buildRatingStatsTable('Genre', stats.favoriteGenres);
      case 3:
        return buildRatingStatsTable('Decade', stats.avgRatingsByDecade);
    }
  };

  const onTabChange = (tabIndex: number) => {
    setSelectedTab(tabIndex);
  };

  return (
    <div
      className='rating-stats-page-wrapper'
      style={
        bottomNavRef.current
          ? { marginBottom: `${bottomNavRef.current.offsetHeight}px` }
          : {}
      }
    >
      {isLoading && (
        <div className='loading-indicator'>
          <CircularProgress color='inherit' />
        </div>
      )}
      {hasRatings ? (
        <>
          {displayTabContent(selectedTab)}
          <BottomNav
            ref={bottomNavRef}
            selectedTab={selectedTab}
            onTabChange={onTabChange}
          />
        </>
      ) : (
        <NoData />
      )}
    </div>
  );
}

export default RatingStatsPage;

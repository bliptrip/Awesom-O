/**************************************************************************************
This file is part of Awesom-O, an image acquisition and analysis web application,
consisting of a frontend web interface and a backend database, camera, and motor access
management framework.

Copyright (C)  2020  Andrew F. Maule

Awesom-O is free software: you can redistribute it and/or modify
it under the terms of the GNU Affero General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

Awesom-O is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU Affero General Public License for more details.

You should have received a copy of the GNU Affero General Public License
along with this Awesom-O.  If not, see <https://www.gnu.org/licenses/>.
**************************************************************************************/
import React from 'react';
import {connect} from 'react-redux';
import clsx from 'clsx';
import {makeStyles} from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Tooltip from '@material-ui/core/Tooltip';

const borderWidth='1px';

const useStyles = makeStyles(theme => ({
    root: {
        flexGrow: 1,
        backgroundColor: "black",
        padding: "10px",
        margin: "10px"
    },
    container: {
        "display": "grid",
        "height": "100%",
        "grid-template-columns":  "8.5% 8.5% 8.5% 8.5% 8.5% 8.5% 8.5% 8.5% 8.5% 8.5%",
        "grid-template-rows": "8.5% 8.5% 8.5% 8.5% 8.5% 8.5% 8.5% 8.5% 8.5% 8.5%",
        "grid-column-gap": "0.5%",
        "grid-row-gap": "1%",
        "justify-items": "center",
        "align-items": "center",
        "justify-content": "space-evenly",
        "align-content": "space-evenly",
        "background": "black",
        "padding": "5%"
    },
    item: {
        "padding": "5%",
        "background": "black",
        "border-width": borderWidth,
        "border-color": "black",
        "border-style": "solid"
    },
    itemCurrent: {
        "border-width": borderWidth,
        "border-color": "yellow",
        "border-style": "solid"
    }
}));

const RouteGridThumbnailPre = ({row, col, thumbnails, currentLocation}) => {
    let thumb = undefined;
    const classes = useStyles();

    if( thumbnails[row] && thumbnails[row][col] )
        thumb = thumbnails[row][col]

    return(
        <Tooltip className={clsx(classes.item, {[classes.itemCurrent]: (currentLocation.row === row) && (currentLocation.col === col)})} 
                 title={"Row: " + row + " Column: " + col}>
            <img width="100%" src={thumb || "/320x480.png"} />
        </Tooltip>
    );
};

const mapGridThumbnailStateToProp = (state) => ({
    thumbnails: state.viewport.thumbnails
});

const RouteGridThumbnail = connect(mapGridThumbnailStateToProp,null)(RouteGridThumbnailPre);

const RouteGridRow = ({row, num_cols}) => {
    return (
        <React.Fragment>
            { [1,2,3,4,5,6,7,8,9,10].map( j => (<RouteGridThumbnail row={row} col={j} currentLocation={{row: 2, col: 2}} />) ) }
        </React.Fragment>
    ); 
};

export default function RouteGrid() {
      const classes = useStyles();

      return (
              <div className={classes.container}>
                { [1,2,3,4,5,6,7,8,9,10].map( i => (<RouteGridRow row={i} num_cols='10' />) ) }
              </div>
            );
};

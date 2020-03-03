/**************************************************************************************
This file is part of Awesom-O, an image acquisition and analysis web application,
consisting of a frontend web interface and a backend database, camera, and motor access
management framework.

Copyright (C)  2020 Andrew F. Maule

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

import cookie from 'react-cookies';
import fetch from 'cross-fetch';

export const fetchAwesomO = ({url, method='GET', headers={"Content-Type": "application/json"}, body=undefined} = {}) => {
    let contents;
    contents = {
        method: method,
        mode: 'cors',
        cache: 'no-cache',
        credentials: 'same-origin'
    };
    contents.headers = headers;
    if(body)
        contents.body = JSON.stringify(body);
    return(fetch(url, contents));
}

export const fetchAwesomOJWT = ({url, method='GET', body=undefined} = {}) => {
    let headers;
    headers = {
        "Content-Type": "application/json",
        "Authorization": "Token " + cookie.load('token')
    };
    return(fetchAwesomO(url, method, headers, body));
}

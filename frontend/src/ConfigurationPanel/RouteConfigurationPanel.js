import './RouteConfigurationPanel.scss';
import React, {useState} from 'react';

function makeRange(max) {
    const arr=[];

    for(let i = 0; i < max; i++) {
        arr.push(i);
    }

    return(arr);
}

function RouteRow(props) {
    const colarr = new Array(parseInt(props.cols));
    colarr.fill(1);

    return(
        <tr>
            { colarr.map((e) => (
                <td>
                    <figure class="image is-64x64 is-square">
                        <img src="https://bulma.io/images/placeholders/128x128.png" />
                    </figure>
                </td>))
            }
        </tr>
    );
}

function RouteTemplate(props) {
    const rowarr = new Array(parseInt(props.rows));
    rowarr.fill(1);

    return(
        <table border="0">
            <tbody>
                { rowarr.map((e) => (<RouteRow cols={props.cols} />)) }
            </tbody>
        </table>
    )
}


function RouteConfigurationPanel(props) {
    return(
        <React.Fragment>
            <div class="box">
                <RouteTemplate rows="10" cols="10" />
            </div>
        </React.Fragment>
    )
};

export default RouteConfigurationPanel

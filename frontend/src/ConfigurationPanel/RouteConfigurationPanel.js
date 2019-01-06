import './RouteConfigurationPanel.scss';
import React, {useState} from 'react';
import GridLayout from 'react-grid-layout';

function RouteRow(props) {
    const colarr = new Array(parseInt(props.cols));
    colarr.fill(1);

    return(
        <div class="route-row">
            <tr>
                { colarr.map((e) => (
                    <td class="route-thumb">
                        <figure class="image">
                            <img src="https://bulma.io/images/placeholders/128x128.png" />
                        </figure>
                    </td>))
                }
            </tr>
        </div>
    );
}

function RouteTemplate(props) {
    const rowarr = new Array(parseInt(props.rows));
    rowarr.fill(1);

    return(
        <div class="route-table">
            <table border="0">
                <tbody>
                    { rowarr.map((e) => (<RouteRow cols={props.cols} />)) }
                </tbody>
            </table>
        </div>
    )
}

function RouteTable(props) {
    var   routeList     = props.route;
    const setRouteList  = props.setRouteList;

    function generateLayout() {
        let layout = [{i: "header", x: 0, y: 0, w: 1, h: 1, minW: 1, minH: 1, static: true}];
        for(let i = 0; i < routeList.length; i++) {
            let key = "R"+routeList[i].row+"C"+routeList[i].col;
            layout.push({i: key, x: 0, y: i+1, w: 1, h: 1, minW: 1, minH: 1});
        }
        return(layout);
    }


    
    return(
        <React.Fragment>
            <GridLayout class="layout" layout={generateLayout()} cols={1} rowHeight={30} width={1200}>
                <div key="header">
                    <div class="columns">
                        <div class="column route-table-row">
                            <strong>Row</strong>
                        </div>
                        <div class="column route-table-column">
                            <strong>Column</strong>
                        </div>
                    </div>
                </div>
                { routeList.map((r, i) => (
                    <div key={"R"+r.row+"C"+r.col}>
                        <div class="columns">
                            <div class="column route-table-row">
                                {r.row}
                            </div>
                            <div class="column route-table-column">
                                {r.col}
                            </div>
                        </div>
                    </div>
                )) }
            </GridLayout>
        </React.Fragment>
    );
}


function RouteConfigurationPanel(props) {
    return(
        <React.Fragment>
            <h1 class="is-1"><strong>Route Grid</strong></h1>
            <div class="box">
                <RouteTemplate rows="10" cols="10" />
            </div>
            <h1 class="is-1"><strong>Route Control</strong></h1>
            <div class="box">
                <div class="level">
                    <div class="level-left">
                        <div class="level-item">
                            <button class="button tooltip" data-tooltip="Clear Current Route">
                                <i class="fas fa-snowplow"></i>
                                Clear
                            </button>
                        </div>
                        <div class="level-item">
                            <button class="button tooltip" data-tooltip="Upload New Route (csv)">
                                <i class="fas fa-2x fa-upload"></i>
                                Upload 
                            </button>
                        </div>
                        <div class="level-item">
                            <button class="button tooltip" data-tooltip="Download Current Route (csv)">
                                <i class="fas fa-2x fa-download"></i>
                                Upload 
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            <h1 class="is-1"><strong>Route Table</strong></h1>
            <div class="box relative">
                <RouteTable route={[]} />                
            </div>
        </React.Fragment>
    )
};

export default RouteConfigurationPanel;

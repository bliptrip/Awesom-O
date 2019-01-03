import './DataConfigurationPanel.scss';
import React, {useState} from 'react';
import Table from 'csv-react-table';

function DataConfigurationPanel(props) {
    const tabledata = [ { id: "1", row: "1", column: "1" } ];

    return(
        <React.Fragment>
            <div class="container">
                <div class="box"> 
                    <h1 class="is-size-3"><strong>Experimental Configuration</strong></h1>
                    <span>
                        <a href="#" class="button tooltip" data-tooltip="Upload Experimental Configuration (csv)">
                            <span class="icon is-large">
                                <i class="fas fa-2x fa-upload"></i>
                            </span>
                            <p>Upload Configuration</p>
                        </a>
                        <a href="#" class="button tooltip" data-tooltip="Download Experimental Configuration (csv)">
                            <span class="icon is-large">
                                <i class="fas fa-2x fa-download"></i>
                            </span>
                            <p>Download Configuration</p>
                        </a>
                    </span>
                    <div>
                        <Table
                            list={tabledata}
                            pageCount={100}
                            headers={[
                                        {
                                            headerName: "Id",
                                            mapKey: "id"
                                        },
                                        {
                                            headerName: "Row",
                                            mapKey: "row"
                                        },
                                        {
                                            headerName: "Column",
                                            mapKey: "column"
                                        }
                                    ]}
                            csv
                            upload
                            edited={true}
                            // Add prop upload to upload csv file
                        />
                    </div>
                </div>
                <div class="box"> 
                    <h1 class="is-size-3"><strong>Image File Configuration</strong></h1>
                </div>
                <div class="box"> 
                    <h1 class="is-size-3"><strong>Cloud Configuration</strong></h1>
                </div>
            </div>
        </React.Fragment>
    )
};

export default DataConfigurationPanel;

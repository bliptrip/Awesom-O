import './DataConfigurationPanel.scss';
import React, {useState} from 'react';
//import Table from 'csv-react-table';
import ReactTable from 'react-table';
import 'react-table/react-table.css';

function makeDefaultData(rows = 10, cols = 10) {
    const arr = [];
    let id = 0;
    for(let c = 0; c < cols; c++ ) {
        for(let r = 0; r < rows; r++ ) {
            arr.push({id: id, row: r, col: c});
            id++;
        }
    }
    return(arr);
}

function makeDefaultHeader() {
    let header=[
        {
            Header: "Plate ID",
            accessor: "id"
        },
        {
            Header: "Row",
            accessor: "row"
        },
        {
            Header: "Column",
            accessor: "col"
        }
    ]
    return(header);
}

function DataConfigurationPanel(props) {
    //const tabledata = [ { id: "1", row: "1", column: "1" } ];
    const [tableData, setTableData] = useState(makeDefaultData());
    const [tableColumns, setTableColumns] = useState(makeDefaultHeader());

    function renderEditable(cellInfo) {
        return (
            <div
                style = {{ backgroundColor: "#fafafa" }}
                contentEditable
                suppressContentEditableWarning
                onBlur = {e => {
                    const data = [...tableData];
                    data[cellInfo.index][cellInfo.column.id] = e.target.innerHTML;
                    this.setState({ tableData });
                }}
                dangerouslySetInnerHTML={{
                    __html: tableData[cellInfo.index][cellInfo.column.id]
                }}
            />
        );
    }

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
                        <ReactTable
                            data={tableData}
                            columns={tableColumns}
                            defaultPageSize={25}
                            className="-striped -highlight"
                        />
                    </div>
                </div>
                <div class="box"> 
                    <h1 class="is-size-3"><strong>Image File Configuration</strong></h1>
                    <br />
                    <label>
                        <strong>Local Filesystem Path:</strong>
                        <input class="input is-primary" type="file" />
                    </label>
                    <hr />
                    <label class="checkbox tooltip" data-tooltip="Attach a datetime stamp to the end of every image file.">
                        <input type="checkbox" />
                        Append Datetime Suffix
                    </label>
                    <br />
                    <label class="checkbox tooltip" data-tooltip="Embed experimental configuration in metadata tags of image file.">
                        <input type="checkbox" />
                        Embed Metadata
                    </label>
                    <br />
                    <hr />
                    <label class="checkbox tooltip" data-tooltip="Rename image file using specified experimental configuration fields.">
                        <input type="checkbox" />
                        Rename File
                    </label>
                    <br />
                    <label class="tooltip" data-tooltip="Choose which fields to include in renamed file.">
                        <strong>Experimental Fields</strong>
                    </label>
                    <div class="container">
                        { tableColumns.map((e) => (
                                <React.Fragment>
                                    <label class="checkbox">
                                        <input type="checkbox" />
                                        {e.Header}
                                    </label>
                                    <br />
                                </React.Fragment>
                            ))
                        }
                    </div>
                    <hr />
                </div>
                <div class="box"> 
                    <h1 class="is-size-3"><strong>Cloud Configuration</strong></h1>
                </div>
            </div>
        </React.Fragment>
    )
};

export default DataConfigurationPanel;

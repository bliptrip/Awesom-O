import './Viewport.scss'
import React, {useState} from 'react';
import WebSocket from 'react-websocket';

function Viewport(props) {
    const [previewImage, setPreviewImage] = useState("https://bulma.io/images/placeholders/480x320.png");

    function wsPreviewImage(data) {
        setPreviewImage(data);
    }

    return(
        <div>
            <figure class="box image is-3x2">
                <img src={previewImage} />
            </figure>
            <WebSocket url='ws://localhost:3001/' onMessage={wsPreviewImage} />
        </div>
    );
};

export default Viewport;

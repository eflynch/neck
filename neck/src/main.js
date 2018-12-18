import React from 'react';
import $ from 'jquery';
import {render} from 'react-dom';

import App from './app';

const main = () => {
    render(<App/>, document.getElementById("content"));
};


document.addEventListener("DOMContentLoaded", function (){
    main();
});

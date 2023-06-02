import React from 'react';
import {createRoot} from 'react-dom/client';
import {Provider} from 'react-redux';
import App from './components/app';
import {store} from './state/store';
import {setChonkyDefaults} from 'chonky';
import {ChonkyIconFA} from 'chonky-icon-fontawesome';

// styles
import 'bootstrap/dist/css/bootstrap.min.css';
import "react-toastify/dist/ReactToastify.css";

// configure Chonky
setChonkyDefaults({iconComponent: ChonkyIconFA});

const root = createRoot(document.getElementById('output'));

root.render(<Provider store={store}><App/></Provider>);

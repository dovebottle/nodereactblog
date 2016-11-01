// require("./index.scss");
// require("../common/common.js");

import React from 'react';
import { render } from 'react-dom';
import { common_fun } from '../common/common.js';
import Greeter from '../common/reactdemo.js';
import styles from './index.scss';//scss导入

// import addnote from '../js/addnote.js';

common_fun();

//新增笔记
// addnote.init();

render(<Greeter />, document.getElementById('react_demo'));

console.log("client/page1/index.js01");
// var drawEl = document.getElementById("draw");
// drawEl.innerHTML = "peko";

// Uncomment these to enable hot module reload for this entry.
// if (module.hot) {
//   module.hot.accept();
// }

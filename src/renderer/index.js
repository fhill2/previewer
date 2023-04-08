// file-loader is necessary, for src/renderer/index.html to be copied to dist/renderer/index.html
require('file-loader?name=[name].[ext]!./index.html')

// fix "global is not defined" webpack error
// if (typeof global === "undefined") {
//   var global = window;
// }
//


import React from 'react';
import { createRoot } from "react-dom/client";
import App from "./App";

const container = document.getElementById("root");
const root = createRoot(container);
root.render(<App/>);

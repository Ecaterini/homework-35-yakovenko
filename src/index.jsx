import './css/style.css';
import './less/style.less';
import './sass/style.scss';
import './sass/style.sass';
import Post from '@/post';
import data from '@/assets/data.json';
import logo from '@/assets/icon-square-big.png';
import xml from '@/assets/data.xml';
import csv from '@/assets/data.csv';
import $ from 'jquery';
import React from 'react';
import { createRoot } from 'react-dom/client';

import './model/lodash';



const post = new Post('Webpack Post Title', logo);

$('pre').addClass('code').html(post.toString());

console.log('JSON data:', data);
console.log('XML data:', xml);
console.log('CSV data:', csv);

async function start() {
  return await new Promise((r) => setTimeout(() => r('Async done.'), 2000));
}

start().then((res) => console.log(res));

class Util {
  static id = Date.now()
}

console.log('Util Id:', Util.id)
const root = createRoot(document.getElementById('root'));

const App = () => {
 return (
  <div className="container">
    <h1>Webpack training</h1>
    <div className="logo" />
    <pre />
    <div className="less">
      <h2>Less</h2>
    </div>
    <div className="scss">
      <h2>SCSS</h2>
    </div>
    <div className="sass">
      <h2>Sass</h2>
    </div>
  </div>
)

}

root.render(<App />);

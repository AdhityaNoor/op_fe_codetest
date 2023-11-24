// import { useState } from 'react'

import './App.css'
import ItemList from './components/ItemList'

import items from './assets/items.json'

const jsonString = JSON.stringify(items);
const updatedJsonString  = jsonString.replace(/"3dFile"/g, '"_3dFile"');
const cleanItems = JSON.parse(updatedJsonString);

function App() {
  return (
    <>
      <ItemList items={cleanItems.items}/>
    </>
  )
}

export default App

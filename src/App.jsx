import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import axios from '@/lib/axios'


function App() {
  const [weight, setWeight] = useState({})

  const getData = () => {
		const requestUrl = `/weight/`;
		axios
			.get(requestUrl)
      .then((response) => {
        console.log(response.data);
			})
			.catch((error) => {
				console.log(error);
			});
	};

  return (
    <>
      <h1>La Vie Rabbit</h1>
      <button onClick={getData}>クリック</button>
    </>
  )
}

export default App

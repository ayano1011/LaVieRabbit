import { useState ,useEffect} from 'react'
import './App.css'
import axios from '@/lib/axios'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { formatDistance, format } from "date-fns";
import { ja } from "date-fns/locale";


function App() {
  const [weight, setWeight] = useState([])
  const [data,setData] = useState(null)

  const getData = () => {
		const requestUrl = `/weight/`;
		axios
			.get(requestUrl)
      .then((response) => {
        // console.log(response.data);
        setWeight(response.data);

        const format_time = response.data.map((item) => {
          return {
            weight: item.weight,
            time: format(Date.parse(item.created_at), "HH:mm")
          }
        })
        setData(format_time);
        console.log(format_time);
        // console.log(data);
      })

			.catch((error) => {
				console.log(error);
			});
  };


// 初回レンダリング時に実行
  useEffect(() => {
    getData();
  }, []);


  // テストデータ
//   const data = [
//   { time: '0:00', count: 10, average: 5 },
//   { time: '3:00', count: 15, average: 6 },
//   { time: '6:00', count: 12, average: 4 },
//   { time: '9:00', count: 18, average: 7 },
//   { time: '12:00', count: 20, average: 8 },
//   { time: '15:00', count: 17, average: 6 },
//   { time: '18:00', count: 14, average: 5 },
//   { time: '21:00', count: 11, average: 4 }
// ]

  return (
    <>
      <div className="total-area">
        <p>合計</p>
        <div className="total-text">
            <p>個</p>
        </div>
      </div>


      {/* <h1>La Vie Rabbit</h1> */}
      {/* <button onClick={getData}>クリック</button> */}
      <BarChart
        width={600}
        height={400}
        data={data}
        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
      >
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="time" />
      <YAxis />
      <Tooltip />
      <Legend />
      <Bar dataKey="weight" name='個数' fill="#8884d8" />
      <Bar dataKey="average" name='平均' fill="#82ca9d" />
    </BarChart>
    </>
  )
}

export default App

import { useState ,useEffect} from 'react'
import './App.css'
import axios from '@/lib/axios'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { formatDistance, format } from "date-fns";
import { ja } from "date-fns/locale";


function App() {
  const [weight, setWeight] = useState([])
  const [data, setData] = useState(null)
  const [date, setDate] = useState(format(new Date(), "yyyy-MM-dd"));


  //選択した日付の重さ情報を取得
  const getWeight = () => {
    const requestUrl = `weight/selectDate/${date}`;
    axios
      .get(requestUrl)
      .then((response) => {
        const format_time = response.data.map((item) => {
          return {
            count: item.count,
            time: format(Date.parse(item.created_at), "HH:mm")
          }
        })
        setData(format_time);
        console.log(format_time);
        console.log(data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

//選択した日付に切り替える
  const selectDateHandler = (e) => {
    console.log(e.target.value);
    setDate(e.target.value);
  }



// 初回レンダリング時に実行
  useEffect(() => {
    getWeight();
  }, [date]);



  return (
    <>
      <input type="date" onChange={selectDateHandler}  value={date}/>
  
      {/* <div>
        {formattedDate}
      </div> */}


      <div className="total-area">
        <p>合計</p>
        <div className="total-text">
            <p>個</p>
        </div>
      </div>


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
      <Bar dataKey="count" name='個数' fill="#8884d8" />
      <Bar dataKey="average" name='平均' fill="#82ca9d" />
    </BarChart>
    </>
  )
}

export default App

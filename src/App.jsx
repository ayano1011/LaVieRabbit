import { useState ,useEffect} from 'react'
import './App.css'
import axios from '@/lib/axios'
import { formatDistance, format } from "date-fns";
import { ja } from "date-fns/locale";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, TimeScale, Tooltip, Legend, PointElement, LineElement } from 'chart.js';
import { Line,Bar } from 'react-chartjs-2';
import { faker } from '@faker-js/faker';
import 'chartjs-adapter-date-fns';


function App() {
  // const [weight, setWeight] = useState([])
  const [data, setData] = useState(null)
  const [date, setDate] = useState(format(new Date(), "yyyy-MM-dd"));
  // const [labels, setLabels] = useState([1,21]);
  // const [weightData, setWeightData] = useState([1, 2]);
  const [isLorded, setIsLorded] = useState(false);

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
        const labels = format_time.map((obj) => obj.time)
        const weightData = format_time.map((obj) => obj.count);
        
        
        setData({
          labels,
          datasets: [
            {
              label: "個数",
              data: weightData,
              backgroundColor: "rgba(255, 99, 132, 0.5)",
            },
          ],
        })

        setIsLorded(true);
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

  ChartJS.register(
		CategoryScale,
		LinearScale,
		BarElement,
		Title,
		TimeScale,
		Tooltip,
		Legend,
		PointElement,
		LineElement
  );
  
  const options = {
		responsive: true,
		plugins: {
			legend: {
				// display: false,
			},
			title: {
				display: true,
				text: "Chart.js Bar Chart",
			},
		},
		scales: {
			x: {
				type: "time",
				min: "00:00",
				max: "23:59",
				title: {
					display: true,
					text: "時間",
				},
        time: {
          parser:"HH:mm",
					// unit: "hour",
				},
				ticks: {
					stepSize: 3,
				},
			},
		},
  };



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


      {/* <BarChart
        width={600}
        height={400}
        data={data}
        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
      >
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="time" type='time' scale='time' interval='hour'/>
      <YAxis />
      <Tooltip />
      <Legend />
      <Bar dataKey="count" name='個数' fill="#8884d8" />
      <Bar dataKey="average" name='平均' fill="#82ca9d" />
    </BarChart> */}



      {isLorded ? <Bar options={options} data={data} /> : <p>Loading...</p>}

      
    </>
  )
}

export default App

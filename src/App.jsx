import { useState ,useEffect} from 'react'
import './App.css'
import axios from '@/lib/axios'
import { formatDistance, format, addDays,subDays } from "date-fns";
import { ja } from "date-fns/locale";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, TimeScale, Tooltip, Legend, PointElement, LineElement } from 'chart.js';
import { Line,Bar } from 'react-chartjs-2';
import { faker } from '@faker-js/faker';
import 'chartjs-adapter-date-fns';

import { AiFillCaretLeft } from 'react-icons/ai';
import { AiFillCaretRight } from 'react-icons/ai';

import DatePicker, { registerLocale } from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css"

import Papa from 'papaparse';





function App() {
  const [data, setData] = useState(null)
  const [date, setDate] = useState(new Date());
  const [isLorded, setIsLorded] = useState(false);



  //CSVファイルデータから読み込み
useEffect(() => {
    Papa.parse("weight.csv", {
      download: true,
      header: true,
      complete: (results) => {
        console.log(results.data);
      }
    });
  }, []);


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

  registerLocale("ja", ja);

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

        console.log(data);

        setIsLorded(true);
      })
      .catch((error) => {
        console.log(error);
      });
  };

//カレンダーで選択した日付に切り替える
  const selectDateHandler = (e) => {
    console.log(e.target.value);
    setDate(e.target.value);
  }


  //前後の日付選択
  const handleAddDayChange = () => {
    setDate(addDays(date , 1))
  }

  const handleSubDayChange = () => {
    setDate(subDays(date , 1))
  }

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
      <AiFillCaretLeft onClick={ handleSubDayChange } />
      <DatePicker locale="ja" maxDate = { new Date() } dateFormatCalendar="yyyy年 MM月" dateFormat="yyyy/MM/dd" selected={date} onChange={(date) => setStartDate(date)} />
      <AiFillCaretRight onClick={ handleAddDayChange }/>

      <div className="total-area">
        <p>合計</p>
        <div className="total-text">
            <p>個</p>
        </div>
      </div>

      {isLorded ? <Bar options={options} data={data} /> : <p>Loading...</p>}
      {/* {isLorded ? <Bar options={options} data={format( data , "yyyy-MM-dd")} /> : <p>Loading...</p>} */}

    </>
  )
}

export default App

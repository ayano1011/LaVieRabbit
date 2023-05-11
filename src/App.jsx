import { useState ,useEffect} from 'react'
import './App.css'
import axios from '@/lib/axios'
import { formatDistance, format, addDays,subDays } from "date-fns";
import { ja } from "date-fns/locale";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, TimeScale, Tooltip, Legend, PointElement, LineElement } from 'chart.js';
import { Line,Bar } from 'react-chartjs-2';
import { faker } from '@faker-js/faker';
import 'chartjs-adapter-date-fns';

import { AiFillCaretLeft , AiFillCaretRight } from 'react-icons/ai';

import DatePicker, { registerLocale } from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css"

import Papa from 'papaparse';

function App() {
  const [data, setData] = useState(null)
  const [date, setDate] = useState(new Date());
  const [isLorded, setIsLorded] = useState(false);
  const [totalCount, setTotalCount] = useState(null);

  //CSVファイルデータから読み込み,データを取得。
  const getDataCSV = () => {
        Papa.parse("weight2.csv", {
          download: true,
          header: true,
          complete: (results) => {
            const filterData = results.data.filter((obj) => obj['日付'] === format(date, "yyyy/MM/dd"));
            setTotalCount(filterData.reduce((sum, element) => sum + Number(element['個数']), 0))

            const labels = filterData.map((obj) => obj['時間']);
            const weightData =  filterData.map((obj) => obj['個数']);;
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
            console.log(results.data);
            setIsLorded(true);
          }
        });
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
				},
				ticks: {
					stepSize: 3,
				},
			},
		},
  };

// 初回レンダリング時に実行
  useEffect(() => {
    // getWeight();
    getDataCSV();
  }, [date]);


  return (
    <>
      <AiFillCaretLeft onClick={ handleSubDayChange } />
      <DatePicker locale="ja" maxDate = { new Date() } dateFormatCalendar="yyyy年 MM月" dateFormat="yyyy/MM/dd" selected={date} onChange={(date) => setDate(date)} />
      <AiFillCaretRight onClick={ handleAddDayChange }/>

      <div className="total-area">
        <p>合計</p>
        <div className="total-text">
          <p>{ totalCount }個</p>
        </div>
      </div>

      {isLorded ? <Bar data={data} /> : <p>Loading...</p>}
    </>
  )
}

export default App

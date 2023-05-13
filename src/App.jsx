import { useState ,useEffect} from 'react'
import './App.css'
import axios from '@/lib/axios'
import { formatDistance, format, addDays,subDays } from "date-fns";
import { ja } from "date-fns/locale";
import { Chart as ChartJS, BarElement, Title, TimeScale, Tooltip, Legend} from 'chart.js';
import { Chart, LineController,ScatterController, LineElement, PointElement, LinearScale, CategoryScale } from 'chart.js';
import { Line,Bar } from 'react-chartjs-2';
import { faker } from '@faker-js/faker';
import 'chartjs-adapter-date-fns';

import { AiFillCaretLeft, AiFillCaretRight, } from 'react-icons/ai';
import { FaPoo } from 'react-icons/fa';
import { IconContext } from "react-icons"

import DatePicker, { registerLocale } from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css"

import Papa from 'papaparse';

/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";

function App() {
  const [data, setData] = useState(null);
  const [averageData, setAverageData] = useState(null);
  const [date, setDate] = useState(new Date());
  const [isLorded, setIsLorded] = useState(false);
  const [totalCount, setTotalCount] = useState(null);

  ChartJS.register(
		CategoryScale,
		LinearScale,
		BarElement,
		Title,
		TimeScale,
		Tooltip,
		Legend,
		PointElement,
		LineElement,
  );

  Chart.register(
    LineController,
    ScatterController,
    LineElement,
    PointElement,
    LinearScale,
    CategoryScale
  );

  //時間ごとの棒グラフ CSVファイルデータから読み込み,データを取得。
  const getDataCSV = () => {
    Papa.parse("weight2.csv", {
      download: true,
      header: true,
      complete: (results) => {
        const filterData = results.data.filter((obj) => obj['日付'] === format(date, "yyyy/MM/dd"));
        setTotalCount(filterData.reduce((sum, element) => sum + Number(element['個数']), 0))

        // const labels = filterData.map((obj) => obj['時間']);
        const labels = ['0時','1時','2時','3時','4時','5時','6時','7時','8時','9時','10時','11時','12時','13時','14時','15時','16時','17時','18時','19時','20時','21時','22時','23時'];
        const weightData =  filterData.map((obj) => obj['個数']);
        setData({
          labels,
          datasets: [
            {
              type:'bar',
              label: "個数",
              data: weightData,
              backgroundColor: "rgba(255, 99, 132, 0.5)",
            },
            {
              type:'line',
              label: "平均",
              data: [10, 16, 13, 2, 5, 6, 11, 2, 1, 9, 27, 26, 20, 23, 21, 29, 10, 3, 2, 3, 16, 10, 14, 4],
              pointRadius: 1,
              // backgroundColor: "rgba(0,0,128,1)",
              backgroundColor: "#ec7aa7",
              // borderColor: "rgba(30,144,255,1)",
              borderColor: "#ec7aa7",
              borderWidth: 1,
            },
            {
              type:'scatter',
              label: "ご飯",
              data: [, , , , , , , , ,1 , , , , , , , , , ,1 , , , ,],
              pointStyle: 'rectRounded',
              pointRadius: 4,
              // backgroundColor: "rgba(34,139,34,1)",
              backgroundColor: "#000000",
            },
          ],
        })
        console.log(results.data);
        setIsLorded(true);
      }
    });
  }

  //時間ごとの平均折れ線グラフ CSVファイルデータから読み込み,データを取得。
  const getDataAverage = () => {
    Papa.parse("average.csv", {
      download: true,
      header: true,
      complete: (results) => {
        const labels = results.data.map((obj) => obj['時間']);
        const averageData =  results.data.map((obj) => obj['個数/1時間ごと']);;
        setAverageData({
          labels,
          datasets: [
            {
              label: "個数/1時間ごと",
              data: averageData,
              backgroundColor: "rgba(255, 99, 132, 0.5)",
            },
          ],
        })
        console.log(results.data);
        // setIsLorded(true);
      }
    });
  }




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
    // getDataAverage();
  }, [date]);


  //CSS ーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーー
  const daySelect = css`
    display: flex;
    align-items: center;
    justify-content: center;
    margin-top: 0px;
  `

  const totalCountArea = css`
    display: flex;
    justify-content: center;
    align-items: center;
  `

  const totalTitle = css`
    font-size:10px
  `

  const totalCountItem = css`
    font-size:30px
  `

  const totalCountStyle = css`
  /* totalCountのスタイル */
    color: #F091A0;
    margin:0px
`;

  const individualCountStyle = css`
  /* 個のスタイル */
  color: black;
  font-size: 6px
`;


  const datePickerStyle = css`
  width: 140px;
  height: 24px;
  background-color: #f2f2f2;
  color: black;
  text-align: center;
  border: 0.5px solid #ccc;
  font-size: 16px
`;

  const faPoo = css`
    width: 30px;
    height: 30px;
    color: #F091A0;
  `

  const total = css`
    font-size: 16px
  `

  const total2 = css`
    margin:0px
  `

  const x = css`
    margin:30px
  `

  return (
    <>
      <div css={daySelect}>
        <IconContext.Provider value={{ color: '#ccc', size: '70px' }}>
          <AiFillCaretLeft onClick={ handleSubDayChange } />
            <DatePicker css={datePickerStyle} locale="ja" maxDate = { new Date() } dateFormatCalendar="yyyy年 MM月" dateFormat="yyyy/MM/dd" selected={date} onChange={(date) => setDate(date)} />
          <AiFillCaretRight onClick={ handleAddDayChange }/>
        </IconContext.Provider>
      </div>

      <div css={totalCountArea} className="total-area">
        {/* <p css={totalTitle}>合計 </p> */}
        <div css={totalCountItem} className="total-text">
          <p css={totalCountStyle}><span css={total}>Total</span></p>
        </div>
      </div>

      <div css={totalCountArea} className="total-area">
        <FaPoo css={faPoo} />
        {/* <p css={totalTitle}>合計 </p> */}
        <div css={totalCountItem} className="total-text">
          <p css={total2}>{totalCount} </p>
        </div>
      </div>

      {/* {isLorded ? <Bar data={data} /> : <p>Loading...</p>} */}
      {isLorded ? <Bar css={x} data={data} /> : <p>Loading...</p>}
    </>
  )
}

export default App

import LineChartComponent from './partials/chartcomponents/LineChartComponent';
import BarChartComponent from './partials/chartcomponents/BarChartComponent';
import MultiBarChartComponent from './partials/chartcomponents/MultiBarChartComponent';
import React, { useEffect, useState } from "react";
const HOST = import.meta.env.VITE_HOST;
const PORT = import.meta.env.VITE_PORT;

function Home() {
  // const [chartData, setChartData] = useState(null);
  //   useEffect(() => {
  //       const fetchData = async () => {
  //           try {
  //               const response = await fetch('/api/data');
  //               const data = await response.json();
  //               setChartData(data);
  //           } catch (error) {
  //               console.error('Error fetching data:', error);
  //           }
  //       };

  //       fetchData();
  //   }, []);

  const [chartData] = useState({
    lineGraphData: {
        labels: ['January', 'February', 'March', 'April', 'May', 'June'],
        values: [65, 59, 80, 81, 56, 55],
    },
    singleBarData: {
        labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
        values: [12, 19, 3, 5, 2, 3],
    },
    threeValuedBarData: {
        labels: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
        values1: [10, 20, 30, 40, 50],
        values2: [15, 25, 35, 45, 55],
        values3: [20, 30, 40, 50, 60],
    },
});

    if (!chartData) {
      return <div>Loading...</div>;
    }
    return (
      <div>
        <main className="container my-2">
          <section className="bg-light shadow-sm p-3 mb-5 bg-body-tertiary rounded">
            <h5 className="mb-3">Top growths in overall teaching quality last month</h5>
              <div className=" justify-content-center">
                <table className="table table-striped table-bordered">
                    <thead>
                        <tr>
                            <th scope="row">Teacher Code</th>
                            <th scope="row">Teacher Name</th>
                            <th scope="row">Feedback Of Month Before Previous Month</th>
                            <th scope="row">Feedback Of Previous Month</th>
                            <th scope="row">Improvement Percentage</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>SS1</td>
                            <td>Subrata Saha</td>
                            <td className="text-end">2.75</td>
                            <td className="text-end">2</td>
                            <td className="text-end">-27.27</td>
                        </tr>
                        <tr>
                            <td>SS1</td>
                            <td>Subrata Saha</td>
                            <td className="text-end">2.75</td>
                            <td className="text-end">2</td>
                            <td className="text-end">-27.27</td>
                        </tr>
                        <tr>
                            <td>SS1</td>
                            <td>Subrata Saha</td>
                            <td className="text-end">2.75</td>
                            <td className="text-end">2</td>
                            <td className="text-end">-27.27</td>
                        </tr>
                    </tbody>
                </table>
              </div>
          </section>
          <section className="bg-light shadow-sm p-3 mb-5 bg-body-tertiary rounded">
            <h5 className="mb-3">Select user type and user to see his/her details</h5>
              <div className=" justify-content-center">
                <div className="mb-3">
                    <label className="form-label">Select User Type <span className="ei-col-red">*</span></label>
                    <select name="user_type" className="form-control">
                        <option defaultValue>-- select --</option>
                        <option value="STUDENT">STUDENT</option>
                        <option value="TEACHER">TEACHER</option>
                    </select>
                </div>
                <div className="mb-3">
                    <label className="form-label">Name <span className="ei-col-red">*</span></label>
                    <select name="name" className="form-control">
                        <option defaultValue>-- select --</option>
                        <option value="">Priya Bhar</option>
                        <option value="">Disha Khan</option>
                    </select>
                </div>
              </div>
          </section>
          <section className="bg-light py-5 my-2">
            <div className="container px-5">
              <div className="row gx-5 justify-content-center">
                OVERALL STUDENT QUALITY / Current Year Average Overall Teaching Quality
                <LineChartComponent data={chartData.lineGraphData} />
              </div>
            </div>
          </section>
          <section className="bg-light py-5 my-2">
            <div className="container px-5">
              <div className="row gx-5 justify-content-center">
                LAST SEMESTER FEEDBACK / Last Month Average Feedback
                <BarChartComponent data={chartData.singleBarData} />
              </div>
            </div>
          </section>
          <section className="bg-light py-5 my-2">
            <div className="container px-5">
              <div className="row gx-5 justify-content-center">
                LAST THREE SEMESTER FEEDBACK / Last Three Months Average Feedback
                <MultiBarChartComponent data={chartData.threeValuedBarData} />
              </div>
            </div>
          </section>
          <section className="bg-light shadow-sm p-3 mb-5 bg-body-tertiary rounded">
            <h5 className="mb-3">TOP STRENGTHS AND AREAS FOR IMPROVEMENT BASED ON LAST THREE SEMESTER FEEDBACKS</h5>
              <div className=" justify-content-center">
                <table className="table table-striped table-bordered">
                    <thead>
                        <tr>
                            <th scope="row">Strengths</th>
                            <th scope="row">Areas of Improvement</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>SS1, jbajf, jgdha, khdgadhkj</td>
                            <td>kfhkaje, dhkaf, fhgdfk, hjdafk</td>
                        </tr>
                    </tbody>
                </table>
              </div>
          </section>
        </main>
      </div>
    );
  }
  
  export default Home;
  
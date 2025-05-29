import React, { useEffect, useState } from 'react';
import TableComponent from '../../components/TableComponent';
import SelectComponent from '../../components/SelectComponent';
import { getOrderSummary } from '../../api/admin-api';
import PageLoader from '../../components/ui/PageLoader';

const headers = ['#', 'FCID', 'Name', 'Rank', 'Total Sale'];


const data = [

];

const renderRow = (item, index) => (
  <>
    <td className="border-r whitespace-nowrap border-b border-text-white/40 p-2 md:p-3">{index + 1}</td>
    <td className="border-r whitespace-nowrap border-b border-text-white/40 p-2 md:p-3">{item?.username}</td>
    <td className="border-r whitespace-nowrap border-b border-text-white/40 p-2 md:p-3 uppercase">{item?.name}</td>
    <td className="border-r whitespace-nowrap border-b border-text-white/40 p-2 md:p-3">{item?.rank}</td>
    <td className="border-r whitespace-nowrap border-b border-text-white/40 p-2 md:p-3">{item?.totalAmount?.toFixed(2)}</td>
  </>
);

const OrderSummary = () => {
  const [options, setOptions] = useState([]);
  const [month, setMonth] = useState('');
  const [loading, setLoading] = useState(false);
  const [data,setData] = useState([]);

  useEffect(() => {
    const getLast12Months = () => {
      const months = [];
      const currentDate = new Date();

      for (let i = 0; i < 12; i++) {
        const date = new Date(currentDate.getFullYear(), currentDate.getMonth() - i, 1);
        const month = date.toLocaleString('default', { month: 'short' });
        const year = String(date.getFullYear()).slice(-2);
        months.push(`${month}-${year}`);
      }

      return months.reverse();
    };

    setOptions(getLast12Months());
  }, []);

 const handleMonth = async (selectedMonth) => {
  setMonth(selectedMonth);

  const [monthShort, year] = selectedMonth.split('-');

  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", 
                      "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const monthNumber = monthNames.indexOf(monthShort) + 1; 

  try {
    setLoading(true);
    await getOrderSummary({
      month: monthNumber, // e.g. May → 5
      year: `20${year}`,
    }).then((res) => setData(res));
  } catch (error) {
    console.log(error);
  } finally {
    setLoading(false);
  }
};

  return (
    <>
    {loading && <PageLoader/>}
      <div className=" bg-white shadow-xl rounded-xl">
      <div className='p-4'>
        <SelectComponent
          value={month}
          onChange={(e) => handleMonth(e.target.value)}
          placeholder="--Select Month--"
          options={options}
        />
      </div>
      <TableComponent
        title="Sales History"
        headers={headers}
        data={data}
        renderRow={renderRow}
        searchKeys={['name', 'fcid', 'rank']}
        searchKey="name"
        showSearch={false}
      />
    </div>
    </>
  
  );
};

export default OrderSummary;

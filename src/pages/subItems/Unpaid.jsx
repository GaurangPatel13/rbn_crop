import React from 'react'
import TableComponent from '../../components/TableComponent';

const Unpaid = () => {
  const headers = ['#', 'ID', 'Date', 'Associate', 'Mobile', 'Sponsor', 'Password'];


  const data = [
    {
      id: 1,
      associate: 'COMPANY ID (100001)',
      date: '21-07-2024',
      mobile: '9926651731',
      sponsor: 'N/A (N/A)',
      password: '123456'
    },
   
   
    // Add more objects for testing
  ];

  return (
    <div className='p-6 bg-white shadow-xl rounded-xl'>
     <TableComponent
        title="Unpaid"
        headers={headers}
        data={data}
        renderRow={(item, index) => (
          <>
            <td className="border-r border-b border-text-white/40 p-2 md:p-3">{index + 1}</td>
            <td className="border-r border-b border-text-white/40 p-2 md:p-3">{item.id}</td>
            <td className="border-r border-b border-text-white/40 p-2 md:p-3">{item.date}</td>
            <td className="border-r border-b border-text-white/40 p-2 md:p-3">{item.associate}</td>
            <td className="border-r border-b border-text-white/40 p-2 md:p-3">{item.mobile}</td>
            <td className="border-r border-b border-text-white/40 p-2 md:p-3">{item.sponsor}</td>
            <td className="border-r border-b border-text-white/40 p-2 md:p-3">{item.password}</td>
          </>
        )}
        searchKeys={['id', 'associate', 'mobile', 'sponsor', 'password']}
        searchKey="associate"
      />


    </div>
  )
}

export default Unpaid

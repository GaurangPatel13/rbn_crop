import React, { useEffect, useState } from 'react'
import TableComponent from '../../components/TableComponent'
import { teamSale } from '../../api/admin-api'
import PageLoader from '../../components/ui/PageLoader'
import { formatDateonly } from '../../utils/dateFunctions'

const TeamSale = () => {
  const headers = ["S.NO.", "Name","FCID", "Mobile", "DOJ", "Sponsor", "Rank", "Total Sale"]
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await teamSale();
      setData(res?.data)
    } catch (error) {
      console.log(error)
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchData();
  }, [])

  return (
    <>
      {loading && <PageLoader />}
      <div className='bg-white shadow-xl rounded-xl'>
        <TableComponent title={"Team Sale"} headers={headers} data={data} renderRow={
          (item, index) => {
            return (
              <>
                <td className='border-r border-b border-text-white/40 p-2 md:p-3'>{index + 1}</td>
                <td className='border-r border-b border-text-white/40 p-2 md:p-3'>{item?.name}</td>
                <td className='border-r border-b border-text-white/40 p-2 md:p-3'>{item?.username}</td>
                <td className='border-r border-b border-text-white/40 p-2 md:p-3'>{item?.mobile}</td>
                <td className='border-r border-b border-text-white/40 p-2 md:p-3'>{formatDateonly(item?.createdAt)}</td>
                <td className='border-r border-b border-text-white/40 p-2 md:p-3'>{item?.sponsor || "Admin"}</td>
                <td className='border-r border-b border-text-white/40 p-2 md:p-3'>{item?.rank}</td>
                <td className='border-r border-b border-text-white/40 p-2 md:p-3'>{(item?.totalDownlineOrderAmount).toFixed(2)}</td>
              </>
            )
          }
        } searchKeys={["name","username","rank"]} />
      </div>
    </>
  )
}

export default TeamSale;

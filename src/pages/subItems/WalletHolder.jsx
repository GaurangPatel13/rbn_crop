import React, { useEffect, useState } from 'react'
import TableComponent from '../../components/TableComponent'
import Button from '../../components/Button'
import { Routers } from '../../constants/Routes'
import { useNavigate } from 'react-router-dom'
import ButtonWithIcon from '../../components/ButtonWithIcon'
import { BiAddToQueue } from 'react-icons/bi'
import { getAllUsersList } from '../../api/admin-api'
import PageLoader from '../../components/ui/PageLoader'

const WalletHolder = () => {
  const headers = ["S.NO.","Fcid", "Associate", "Amount"]
  const navigate = useNavigate();
  const [loading ,setLoading] = useState(false);
  const [walletHolderList,setWalletHolderList] = useState([]);

    const fetchUsersList = async () => {
      try {
        setLoading(true);
        const response = await getAllUsersList();
        if (response?.success) {
      setWalletHolderList(response?.data);
        }
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    }
    useEffect(() => {
      fetchUsersList();
    }, [])
  

  return (
    <>
    {loading && <PageLoader/>}
    <div className=' bg-white shadow-xl rounded-xl'>
      <div className='px-5 pt-5'> 
        <ButtonWithIcon title="New Wallet" icon={<BiAddToQueue />} onClick={() => navigate(Routers.addfund)} />
      </div>
      <TableComponent title={"Wallet Holder"} headers={headers}  data={walletHolderList?.filter(item => item?.investment > 0)} renderRow={
        (item, index) => {
          
          return (
            <>
              <td className='border-r border-b border-text-white/40 p-2 md:p-3'>{index + 1}</td>
              <td className='border-r border-b border-text-white/40 p-2 md:p-3'>{item?.username}</td>
              <td className='border-r border-b border-text-white/40 p-2 md:p-3'>{item?.name}</td>
              <td className='border-r border-b border-text-white/40 p-2 md:p-3'>{item?.investment?.toFixed(2)}</td>
            </>
          )
        }
      } searchKeys={["name","username","investment"]} />

    </div>
    </>
  )
}

export default WalletHolder

import React, { useEffect, useState } from 'react'
import TableComponent from '../../components/TableComponent';
import { Routers } from '../../constants/Routes';
import { useNavigate } from 'react-router-dom';
import { FaEdit, FaTrashAlt } from 'react-icons/fa';
import SelectComponent from '../../components/SelectComponent';
import { deleteUser, getAllUsersList, updateUserRank } from '../../api/admin-api';
import Swal from 'sweetalert2';
import PageLoader from '../../components/ui/PageLoader';
import { formatDateonly } from '../../utils/dateFunctions';
import { TbLockOff, TbLockOpen } from "react-icons/tb";

const Modify = () => {
  const headers = ['ID', 'Date', 'FCID', 'Associate', 'Mobile', 'Sponsor', 'DOP', 'Rank', '#Action'];
  const [userList, setUserList] = useState([]);
  const [rankMap, setRankMap] = useState({});
  const [loading, setLoading] = useState(false);

  const labels = ['FC','FI', 'FR', 'BD', 'BR', 'CT', 'MQ', 'DU'];
  const options = labels.map(label => ({ label, value: label }));

  const navigate = useNavigate();

  useEffect(() => {
    const fetchUsersList = async () => {
      try {
        setLoading(true);
          const response = await getAllUsersList();

      if (response?.success) {
        setUserList(response?.data);
      }
      const initialRanks = {};
      response?.data?.forEach(user => {
        initialRanks[user._id] = user?.selectRank || '';
      });
      setRankMap(initialRanks);
      } catch (error) {
        console.log(error);
      }finally{
        setLoading(false);
      }
    
    }

    fetchUsersList();
  }, []);

  const handleRankChange = async (userId, value) => {
    try {
      setLoading(true);
      const res = await updateUserRank(userId, { "rank": value });
      if (res.success) {
        Swal.fire({
          title: "Success",
          text: "Rank updated successfully",
          icon: "success",

        })
        setRankMap(prev => ({
          ...prev,
          [userId]: value
        }));

      }

    } catch (error) {

    } finally {
      setLoading(false);
    }


  };

  const handleDelete = async (id) => {
    try {
      setLoading(true);
      const response = await deleteUser(id);
      if (response.success) {
        Swal.fire({
          icon: 'success',
          title: response?.message,
          text: response?.message || 'Block User Successfully',
          toast: true,
          position: 'top-end',
          showConfirmButton: false,
          timer: 3000,
          timerProgressBar: true,
        });

        setUserList(prevUsers =>
          prevUsers.map(user =>
            user._id === id ? { ...user, isBlocked: !user.isBlocked } : user
          )
        );
      }
    } catch (error) {
      console.error("Error deleting product:", error);
    } finally {
      setLoading(false);
    }
  };



  return (
    <>
      {loading && (
        <PageLoader />
      )}
      <div className='bg-white shadow-xl rounded-xl'>
        <TableComponent
          title="Modify"
          headers={headers}
          data={userList}
          renderRow={(item, index) => (
            <>
              <td className="border-r border-b border-text-white/40 p-2 md:p-3">{index + 1}</td>
              <td className="border-r border-b border-text-white/40 p-2 md:p-3">{formatDateonly(item?.createdAt)}</td>
              <td className="border-r border-b border-text-white/40 p-2 md:p-3">{item?.username}</td>
              <td className="border-r border-b border-text-white/40 p-2 md:p-3">{item?.name}</td>
              <td className="border-r border-b border-text-white/40 p-2 md:p-3">{item?.mobile}</td>
              <td className="border-r border-b border-text-white/40 p-2 md:p-3">{item?.referrCode == null ? "Admin" : item?.referredBy?.name}</td>
              <td className="border-r border-b border-text-white/40 p-2 md:p-3">{item?.lastPurchaseDate || "N/A"}</td>
              <td className="border-r border-b border-text-white/40 p-2 md:p-3">
                <SelectComponent
                  options={options}
                  value={rankMap[item._id] || ''}
                  onChange={(e) => handleRankChange(item._id, e.target.value)}
                  name="status"
                  placeholder="Rank Upgrade"
                />
              </td>
              <td className="border-r border-b border-text-white/40 p-2 md:p-3">
                <div className='flex gap-2'>
                  <button className="bg-green-500 text-white p-2 rounded text-sm" onClick={() => navigate(Routers.ProfileUpdate, { state: item._id })}><FaEdit /></button>
                  <button
                    className={`p-2 rounded text-sm text-white ${item.isBlocked ? 'bg-red-500' : 'bg-green-500'}`}
                    onClick={() => handleDelete(item._id)}
                  >
                    {!item.isBlocked ? <TbLockOpen /> : <TbLockOff />}
                  </button>
                </div>
              </td>
            </>
          )}
          searchKeys={['name', 'username', 'mobile', 'selectRank']}
          searchKey="name , fcid , mobile ,rank"
        />
      </div>
    </>

  )
}

export default Modify;

import React, { useEffect, useState } from 'react'
import SubItemPageHeader from './SubItemPageHeader'
import SearchFilterBar from './SearchFilterBar'
import TableComponent from '../../components/TableComponent';
import ButtonWithIcon from '../../components/ButtonWithIcon';
import { MdDoNotDisturb } from "react-icons/md";
import { FcAcceptDatabase } from "react-icons/fc";
import { getRankHistoryMQ, updateMQDURank } from '../../api/admin-api';
import debounce from 'lodash.debounce';
import { useCallback } from 'react';
import { formatDateonly } from '../../utils/dateFunctions';
import PageLoader from '../../components/ui/PageLoader';
import Swal from 'sweetalert2';

const MQC = () => {
  const headers = ['#', 'Ref ID', 'Date', 'FCID', 'Name', 'Fund', 'End Date', 'Status', 'Action'];
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [filters, setFilters] = useState({
    memberId: '',
    fromDate: '',
    toDate: '',
  });
  const debouncedSearch = useCallback(
    debounce(() => {
      handleSearch();
    }, 500),
    [filters]
  );

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => {
      const updatedFilters = { ...prev, [name]: value };

      debouncedSearch();
      return updatedFilters;
    });
  };
  const handleSearch = async () => {
    const queryParts = [];

    if (filters.memberId) {
      queryParts.push(`username=${filters.memberId}`);
    }
    if (filters.fromDate) {
      queryParts.push(`startDate=${filters.fromDate}`);
    }
    if (filters.toDate) {
      queryParts.push(`endDate=${filters.toDate}`);
    }

    const queryString = queryParts.length ? `?${queryParts.join('&')}` : '';
    try {
      const response = await getRankHistoryMQ(queryString);
      await fetchData();
      setData(response?.data);
    } catch (error) {
      console.log(error)
    }
  };
  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await getRankHistoryMQ();
      setData(res?.data);
    } catch (error) {
      console.log(error)
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchData();
  }, [])


  const renderRow = (item, index) => (
    <>
      <td className='border-r border-b border-text-white/40 p-2 md:p-3'>{index + 1}</td>
      <td className='border-r border-b border-text-white/40 p-2 md:p-3'>{item?.id || "NA"}</td>
      <td className='border-r border-b border-text-white/40 p-2 md:p-3'>{formatDateonly(item?.createdAt)}</td>
      <td className='border-r border-b border-text-white/40 p-2 md:p-3'>{item?.userId?.username}</td>
      <td className='border-r border-b border-text-white/40 p-2 md:p-3'>{item?.userId?.name}</td>
      <td className='border-r border-b border-text-white/40 p-2 md:p-3'>{item?.rankFund}</td>
      <td className='border-r border-b border-text-white/40 p-2 md:p-3'>{formatDateonly(item?.expireDate)}</td>
      <td className='border-r border-b border-text-white/40 p-2 md:p-3'>{item?.status}</td>
      <td className='border-r border-b border-text-white/40 p-2 md:p-3'>
        <div className="flex gap-2">
          <ButtonWithIcon title="Accept" icon={<FcAcceptDatabase />} bgcolor={"bg-green-600"} onClick={() => handleAction(item?._id,"Completed")} />
          <ButtonWithIcon title="Decline" icon={<MdDoNotDisturb />} bgcolor={"bg-red-600"} onClick={() => handleAction(item?._id, "Rejected" )} />
        </div>
      </td>
    </>
  );
  const handleAction = async (id, action) => {
    try {
      setLoading(true);
      await updateMQDURank(id, action);
      Swal.fire({
        position: 'center',
        icon: 'success',
        title: 'Rank Updated Successfully',
        showConfirmButton: false,
        timer: 1500
      }).then(()=>{
        fetchData();
      })

    } catch (error) {
      Swal.fire({
        position: 'center',
        icon: 'error',
        title: 'Something went wrong',
        showConfirmButton: false,
        timer: 1500
      })
    } finally {
      setLoading(false);
    }

  }

  return (
    <>
      {loading && <PageLoader />}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-5 bg-white shadow-xl rounded-xl">
        <div>
          <label className="block text-sm font-medium mb-1">Member ID:</label>
          <div className="flex">
            <input
              type="text"
              name="memberId"
              value={filters.memberId}
              onChange={handleInputChange}
              placeholder="Search Member ID"
              className="w-full border border-gray-300 px-3 py-2 rounded-l-md text-sm focus:outline-none"
            />
            <button
              className="bg-bg-color text-white px-4 rounded-r-md"
              onClick={handleSearch}
            >
              Search
            </button>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">From Date:</label>
          <input
            type="date"
            name="fromDate"
            value={filters.fromDate}
            onChange={handleInputChange}
            className="w-full border border-gray-300 px-3 py-2 rounded-md text-sm"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">To Date:</label>
          <input
            type="date"
            name="toDate"
            value={filters.toDate}
            onChange={handleInputChange}
            className="w-full border border-gray-300 px-3 py-2 rounded-md text-sm"
          />
        </div>

        <div className="flex items-end">
          <button
            className="w-full bg-bg-color text-white py-2 px-4 rounded-md"
            onClick={handleSearch}
          >
            Search
          </button>
        </div>
      </div>
      <div className='bg-white shadow-xl rounded-xl' >
        <TableComponent
          title="Challenge Request"
          headers={headers}
          data={data}
          renderRow={renderRow}
          searchKeys={['userId.name', 'userId.username']}
          searchKey="Ref ID / Name"
        />
      </div>
    </>

  )
}

export default MQC

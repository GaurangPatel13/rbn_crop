import React from 'react';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import ButtonWithIcon from '../components/ButtonWithIcon';
import { FaDownload } from 'react-icons/fa6';

const DownloadExcel = ({ data }) => {
  const handleDownload = () => {
    // Step 1: Convert JSON data to worksheet
    const worksheet = XLSX.utils.json_to_sheet(data);

    // Step 2: Create a workbook and add the worksheet
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');

    // Step 3: Generate buffer
    const excelBuffer = XLSX.write(workbook, {
      bookType: 'xlsx',
      type: 'array',
    });

    // Step 4: Create blob and trigger download
    const dataBlob = new Blob([excelBuffer], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    });

    saveAs(dataBlob, 'download.xlsx');
  };

  return (
    <ButtonWithIcon onClick={handleDownload}  title="Expand Summary" icon={<FaDownload/>} />
  );
};

export default DownloadExcel;

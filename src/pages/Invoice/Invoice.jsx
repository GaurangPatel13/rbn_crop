import React, { useEffect, useRef, useState } from 'react';
import { MainContent } from '../../constants/mainContent';
import { useParams } from 'react-router-dom';
import html2pdf from 'html2pdf.js';
import { getOrderInvoice } from '../../api/admin-api';
import PageLoader from '../../components/ui/PageLoader';
import html2canvas from 'html2canvas';

const Invoice = () => {
    const invoiceRef = useRef();
    const { id } = useParams();
    const [invoiceData, setInvoiceData] = useState(null);
    const [loading, setLoading] = useState()
    const getOrderInvoiceData = async () => {
        setLoading(true)
        try {
            const res = await getOrderInvoice(id);
            setInvoiceData(res.data);
        } catch (err) {
            console.error("Failed to fetch invoice", err);
        } finally {
            setLoading(false)
        }
    };

    useEffect(() => {
        getOrderInvoiceData();
    }, []);

    if (!invoiceData) return <div>
        <PageLoader />
    </div>;
    const {
        razorpayOrderId: orderNo,
        createdAt,
        items,
        totalAmount,
        gstAmount,
        shippingAmount,
        sponsorBonus,
        amount,
        userId
    } = invoiceData;

    const billTo = {
        name: userId?.name,
        fcid: userId?.username,
        email: userId?.email,
        mobile: userId?.mobile,
        pan: userId?.panNo,
        FatherName: userId?.generalDetails?.fatherName,
        AadharNo: userId?.generalDetails?.aadharNo
    };

    const careOf = {
        name: userId?.name,
        mobile: userId?.mobile,
        address: userId?.addresses?.[0] || "N/A",
        city: "Indore",
        state: "Madhya Pradesh",
    };

    const formatDate = (dateString) => new Date(dateString).toLocaleDateString('en-IN');



    const handleDownload = () => {
        const element = invoiceRef.current;
        const images = element.querySelectorAll("img");
        const loadImages = Array.from(images).map((img) =>
            new Promise((resolve) => {
                if (img.complete) resolve();
                else img.onload = img.onerror = resolve;
            })
        );

        Promise.all(loadImages).then(() => {
            const opt = {
                margin: 0.5,
                filename: `Invoice-${id}.pdf`,
                image: { type: "jpeg", quality: 0.98 },
                html2canvas: { scale: 2 },
                jsPDF: { unit: "in", format: "a4", orientation: "landscape" }

            };
            html2pdf().from(element).set(opt).save();
        });
    };

    // const handlePrint = () => {
    //     const printContents = invoiceRef.current.innerHTML;
    //     const originalContents = document.body.innerHTML;
    //     document.body.innerHTML = printContents;
    //     window.print();
    //     document.body.innerHTML = originalContents;
    //     // window.location.reload();
    //     // window.location.href = window.location.href;
    // };

  const handlePrint = () => {
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    const element = invoiceRef.current;

    if (!element) return;

    const images = element.querySelectorAll("img");
    const loadImages = Array.from(images).map((img) =>
        new Promise((resolve) => {
            if (img.complete) resolve();
            else img.onload = img.onerror = resolve;
        })
    );

    Promise.all(loadImages).then(() => {
        const opt = {
            margin: 0.5,
            filename: `Invoice-${id}.pdf`,
            image: { type: "jpeg", quality: 0.98 },
            html2canvas: { scale: 2 },
            jsPDF: { unit: "in", format: "letter", orientation: "portrait" },
              scale: 2,
    useCORS: true,            // 👈 Important
    allowTaint: false,        // 👈 Optional, prevents canvas tainting
    logging: false,
    scrollX: 0,
    scrollY: 0
        };

        if (isMobile) {
            // On mobile: download directly
            html2pdf().from(element).set(opt).save();
        } else {
            // On desktop: open print dialog
            html2canvas(element, {
                scale: 2,
                useCORS: true,
            }).then(canvas => {
                const dataUrl = canvas.toDataURL('image/png', 1.0);
                const printWindow = window.open('', '_blank', 'width=800,height=600');
                printWindow.document.write(`
                    <html>
                        <head>
                            <title>Invoice</title>
                            <style>
                                body { margin: 0; padding: 0; }
                                img { width: 100%; }
                            </style>
                        </head>
                        <body onload="window.print();window.close();">
                            <img src="${dataUrl}" style="width:100%;" />
                        </body>
                    </html>
                `);
                printWindow.document.close();
            });
        }
    });
};


    // const handlePrint = () => {

    //     if (!invoiceRef.current) return;

    //     html2canvas(invoiceRef.current, {
    //         scale: 2,
    //         useCORS: true,
    //     }).then(canvas => {
    //         const dataUrl = canvas.toDataURL('image/png', 1.0);
    //         const printWindow = window.open('', '_blank', 'width=800,height=600');
    //         printWindow.document.write(`
    //     <html>
    //       <head>
    //       <title>Screenshot</title>
    //       <style>
    //         body { margin: 0; padding: 0; }
    //         img { width: 100%; }
    //       </style>
    //       </head>
    //       <body style="margin:0; padding:0;">
    //         <img src="${dataUrl}" style="width:100%;" onload="window.print();window.close();" />
    //       </body>
    //     </html>
    //   `);
    //         printWindow.document.close();
    //     });
    // };


    const totalQuantity = items.reduce((sum, item) => sum + item.quantity, 0);
    const totalAmounts = items.reduce((sum, item) => sum + item.subtotal, 0);
    const totalGstAmount = items.reduce((sum, item) => {
        const gstRate = item?.product?.gst || 0;
        return sum + (item.subtotal * gstRate / 100);
    }, 0);
    return (
        <>
            <div ref={invoiceRef} id="printableArea" className=" md:p-5 p-3 md:text-sm text-[9px] text-gray-800 bg-white rounded-lg">
                <div className="flex justify-between gap-5  border-b pb-4">
                    <div className='flex items-center justify-start'>
                        <img src={MainContent.logo} className='h-10 sm:h-14 md:h-20' alt="Logo" crossOrigin="anonymous"/>
                    </div>
                    <div className='flex md:items-end md:justify-end flex-col'>
                        <h4 className="font-bold">AETHERIC DYNAMIC MKT PRIVATE LIMITED</h4>
                        <p className="">88/2/2/4 Singhal Compound Dewas Naka</p>
                        <p className="">Lasudiya Mori, Indore, India - 452010</p>
                        <p className="">(+91) 896 496 9960 | info@admpvt.com | www.admfashion.com</p>
                        <p className="">GSTIN : 23ABBCA1033C1ZO | PAN : ABBCA1033C</p>
                    </div>
                </div>

                <div className="flex items-start justify-between gap-6 my-4 ">
                    <div>
                        <h4 className="font-bold">Billing Details</h4>
                        <p>FCID: {billTo.fcid}</p>
                        <p>Name: {billTo.name}</p>
                        <p>Email: {billTo.email}</p>
                        <p>Mobile: {billTo.mobile}</p>
                        <p>Father Name: {billTo.FatherName}</p>
                        <p>AadharNo: {billTo.AadharNo}</p>
                        <p>PAN: {billTo.pan}</p>
                    </div>
                    <div>
                        <h4 className="font-bold">Shipping Address</h4>
                        <p>Name: {careOf.name}</p>
                        <p>Mobile: {careOf.mobile}</p>
                        <p>Address: {careOf.city}</p>
                        <p>City: {careOf.city}</p>
                        <p>State: {careOf.state}</p>
                    </div>
                    <div className="text-right">
                        <p className="">INVOICE : <span className="font-semibold">{orderNo}</span></p>
                        <p className="">ORD : <span className="font-semibold">{orderNo}</span></p>
                        <p className="">Order Date: {formatDate(createdAt)}</p>
                    </div>
                </div>

                {/* Table */}
                <div className='overflow-x-auto print:overflow-visible'>
                    <table className="w-full md:text-xs text-[9px]  border border-collapse mt-4  ">
                        <thead>
                            <tr className="bg-gray-200 text-left whitespace-nowrap">
                                <th className="border p-2 text-[11.5px]">#</th>
                                <th className="border p-2 text-[11.5px]">Product Name</th>
                                <th className="border p-2 text-[11.5px]">HSN</th>
                                <th className="border p-2 text-[11.5px]">Size</th>
                                <th className="border p-2 text-[11.5px]">Color</th>
                                <th className="border p-2 text-[11.5px]">Price</th>
                                <th className="border p-2 text-[11.5px]">Qty</th>
                                <th className="border p-2 text-[11.5px]">Discount (%)</th>
                                <th className="border p-2 text-[11.5px]">AD</th>
                                <th className="border p-2 text-[11.5px]">GST</th>
                                <th className="border p-2 text-[11.5px]">GST Amount</th>
                                <th className="border p-2 text-[11.5px]">AD+GST</th>
                                <th className="border p-2 text-[11.5px]">Total</th>
                            </tr>
                        </thead>
                        <tbody>
                            {items.map((item, i) => (
                                <tr key={i}>
                                    <td className="border p-2">{i + 1}</td>
                                    <td className="border p-2">
                                        <div className='flex items-center gap-1 h-[40px]'>
                                            <img src={item?.product?.defaultImage} className='h-8' alt="" crossOrigin="anonymous"/>
                                            <p className='w-full leading-9 line-clamp-1'>{item.product?.productName || "Product Name"}</p>
                                        </div>
                                    </td>
                                    <td className="border p-2">{item?.product?.hsn || "N/A"}</td>
                                    <td className="border p-2">{item?.size || "N/A"}</td>
                                    <td className="border p-2">{item?.product?.color || "N/A"}</td>
                                    {/* <td className="border p-2">{item.subtotal.toFixed(0) || "N/A"}</td> */}
                                    <td className="border p-2">
                                        {item.quantity ? item.subtotal / item.quantity : "N/A"}
                                    </td>
                                    <td className="border p-2">{item.quantity}</td>
                                    <td className="border p-2">{item.discount || 0}%</td>
                                    <td className="border p-2">{item.afterDiscount || 0}</td>
                                    <td className="border p-2">
                                        {item.product.gst}%
                                    </td>
                                    <td className="border p-2">
                                        {item.quantity && item?.product?.gst
                                            ? ((item.subtotal) * item.product.gst / 100).toFixed(2)
                                            : "0.00"}
                                    </td>
                                    <td className="border p-2">{item.afterDiscount || 0}</td>
                                    <td className="border p-2">
                                        {item.quantity && item?.product?.gst
                                            ? (item.subtotal + ((item.subtotal) * item.product.gst / 100)).toFixed(2)
                                            : item.subtotal.toFixed(2)}
                                    </td>
                                </tr>
                            ))}

                            <tr className="font-semibold bg-yellow-100">
                                <td colSpan="6" className="border p-2 text-right">Total</td>
                                <td className="border p-2">{totalQuantity}</td>
                                <td colSpan="5" className="border p-2"></td>
                                <td className="border p-2">{(totalAmounts + totalGstAmount).toFixed(2)}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                {/* Totals */}
                <div className=" text-right mt-6 space-y-2">
                    <p className='border-b pb-2'>Total Amount : {amount?.toFixed(2)}</p>
                    <p className='border-b pb-2'>Discount % : 0</p>
                    <p className='border-b pb-2'>After Discount : 0</p>
                    <p className='border-b pb-2'>GST : {gstAmount?.toFixed(2)}</p>
                    <p className='border-b pb-2'>CGST + SGST : 0</p>
                    <p className='border-b pb-2'>Shipping Charges With GST  : {shippingAmount?.toFixed(2)}</p>
                    <p className='border-b pb-2'>Sponsor Bonus   : {sponsorBonus?.toFixed(2) || 0}</p>
                    <p className="border-b pb-2 font-bold">Total Payable : {totalAmount?.toFixed(2)}</p>
                </div>

                <p className="mt-6 text-xs">Thank you!</p>

                <div className='mt-5 border-l-4 px-3 border-blue-950'>
                    <p>Terms & Conditions:</p>
                    <p className=''>1. All disputes Subject to 'Indore' Jurisdiction only.</p>
                    <p className=''>2. Goods sold will only be refunded under 15 days of generation of Invoice.</p>
                    <p className=''>3. Kindly contact ADM Care of any discrepancy in stock</p>
                </div>
                <div className='mt-10 gap-4 flex-wrap flex items-center justify-center'>
                    <button onClick={handleDownload} className=' border bg-bg-color px-8 py-2 text-white rounded-full'>
                        Download
                    </button>
                    <button onClick={handlePrint} className=' border bg-bg-color px-8 py-2 text-white rounded-full'>
                        Print
                    </button>
                </div>
            </div>
            {loading && (
                <div>
                    <PageLoader />
                </div>
            )}
        </>

    );
};

export default Invoice;
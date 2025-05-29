import { NumericFormat } from "react-number-format";
import { useNavigate } from "react-router-dom";

const HeaderStats = ({ data }) => {
    const navigate = useNavigate();
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {data?.map((stat, index) => (
                <div onClick={()=>navigate(stat.path ,{state: stat?.pathstate})}
                    key={index}
                    className="p-5 bg-white shadow-md rounded-2xl transition-all hover:shadow-xl flex justify-between items-center cursor-pointer"
                >
                    <div className="space-y-2">
                        <h4 className="text-sm text-gray-500 font-medium uppercase tracking-wide">
                            {stat.title}
                        </h4>
                        <div className="flex items-end gap-2">
                            <h3 className="text-2xl font-bold text-gray-800 flex items-center gap-1">
                                {stat.symbol}
                                <NumericFormat
                                    value={stat.value}
                                    allowLeadingZeros
                                    thousandSeparator=","
                                    displayType="text"
                                />
                            </h3>
                            <span
                                className={`text-sm font-medium ${stat.status === "up"
                                    ? "text-green-500"
                                    : "text-red-500"
                                    }`}
                            >
                                {stat.change}
                            </span>
                        </div>
                        {/* {stat.path && (
                            <p className="text-xs text-purple-700 underline cursor-pointer hover:text-purple-900 transition">
                                {stat.path}
                            </p>
                        )} */}
                    </div>
                    <div>
                        <div className="w-12 h-12 rounded-full bg-gradient-to-r from-[#00A59E] via-[#3ED6A5] to-[#9EFCAE]
 flex items-center justify-center text-white text-xl">
                            {stat.icon}
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default HeaderStats;

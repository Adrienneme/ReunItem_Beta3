import React, { useEffect, useState } from "react";
import AdminNavBar from "../../../components/layout/AdminNavBar";
import { getLogs } from "../../../api/admin";
import DateRangeFilter from "../../../components/ui/DateRangeFilter";
import dayjs from "dayjs";
import { Search } from "lucide-react";

export default function AuditLog() {
    const [logs, setLogs] = useState([]);
    const [selectedLog, setSelectedLog] = useState(null);

    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);

    const [searchQuery, setSearchQuery] = useState("");

    const fetchLogs = async () => {
        const logs = await getLogs();
        setLogs(logs || []);
    };

    useEffect(() => {
        fetchLogs();
    }, []);

    const filteredLogs = logs.filter((log) => {
        const created = dayjs(log.created_at);

        const matchesSearch =
            log.user?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            log.action?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            log.role?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            log.status?.toLowerCase().includes(searchQuery.toLowerCase());

        if (!matchesSearch) return false;

        if (startDate && created.isBefore(startDate, "day")) return false;
        if (endDate && created.isAfter(endDate, "day")) return false;

        return true;
    });

    const handleDateChange = ({ startDate, endDate }) => {
        setStartDate(startDate);
        setEndDate(endDate);
    };

    return (
        <div>
            <AdminNavBar />

            <div className="ml-15 p-8">
                <h1 className="text-3xl font-bold text-white mb-4">Audit Logs</h1>
                <p className="mb-5">See what happened and when.<br></br>
                    Track system activities, user actions, and changes to keep everything transparent and accountable.</p>

                <div className="flex flex-row justify-between">
                    <div className="flex items-center border rounded-lg px-3 py-2 bg-white w-1/3 mb-5">
                        <Search size={18} className="text-gray-500" />
                        <input
                            className="ml-2 w-full outline-none text-black"
                            placeholder="Search user, role, action, or status..."
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>

                    <div className="flex flex-row items-center gap-3 mb-4">
                        <p><b>Filter Logs by Date: </b></p>
                        <DateRangeFilter
                            startDate={startDate}
                            endDate={endDate}
                            onChange={handleDateChange}
                        />
                    </div>

                </div>

                <div className="bg-black-600 shadow-lg rounded-xl text-white flex">

                    <div className="w-2/3 border-r border-gray-700">
                        <div className="max-h-150 overflow-y-scroll">
                            <table className="min-w-full">
                                <thead className="bg-gray-100 text-gray-900 text-sm uppercase">
                                    <tr>
                                        <th className="p-4 text-left">User</th>
                                        <th className="p-4 text-left">Role</th>
                                        <th className="p-4 text-left">Action</th>
                                        <th className="p-4 text-left">Status</th>
                                        <th className="pr-10 text-left">Log Details</th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {filteredLogs.map((u) => (
                                        <tr key={u.audit_id} className="border-t hover:bg-gray-600">

                                            <td className="p-4 pr-15 whitespace-nowrap">{u.user}</td>
                                            <td className="p-4 pr-15">{u.role}</td>
                                            <td className="p-4 pr-15">{u.action}</td>

                                            <td
                                                className={`p-4 font-bold ${u.status === "OK"
                                                    ? "text-green-400"
                                                    : "text-red-400"
                                                    }`}
                                            >
                                                {u.status}
                                            </td>

                                            <td>
                                                <button
                                                    className="underline text-blue-300 hover:text-blue-400"
                                                    onClick={() => setSelectedLog(u)}
                                                >
                                                    View
                                                </button>
                                            </td>

                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <div className="w-1/3 p-6">
                        <h2 className="text-2xl font-bold mb-4">Log Details</h2>

                        {!selectedLog && (
                            <p className="text-gray-400">Select a log from the left to view details.</p>
                        )}

                        {selectedLog && (
                            <div className="space-y-5">
                                <p><strong>Audit Log ID:</strong> {selectedLog.audit_id}</p>
                                <p><strong>Actor ID:</strong> {selectedLog.actor_id}</p>
                                <p><strong>User Full Name:</strong> {selectedLog.user}</p>
                                <p><strong>Role:</strong> {selectedLog.role}</p>
                                <p><strong>Action:</strong> {selectedLog.action}</p>

                                <p>
                                    <strong>Status:</strong>{" "}
                                    <span className={selectedLog.status === "OK" ? "text-green-400" : "text-red-400"}>
                                        {selectedLog.status}
                                    </span>
                                </p>

                                <p><strong>Entity:</strong> {selectedLog.entity}</p>

                                <p className="mt-2"><strong>Description:</strong> {selectedLog.details}</p>
                                <p>
                                    <strong>Timestamp:</strong>{" "}
                                    {new Date(selectedLog.created_at).toLocaleString()}
                                </p>
                            </div>
                        )}
                    </div>

                </div>
            </div>
        </div>
    );
}

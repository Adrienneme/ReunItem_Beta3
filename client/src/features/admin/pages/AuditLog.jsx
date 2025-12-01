import React from 'react'
import AdminNavBar from '../../../components/layout/AdminNavBar'
import { getLogs } from '../../../api/admin';
import { useEffect } from 'react';

export default function AuditLog() {
    const [logs, setLogs] = React.useState([]);

     const fetchLogs = async () => {
        const logs = await getLogs();
        console.log(logs);
        setLogs(logs || []);
      };
    
      useEffect(() => {
        fetchLogs();
      }, []);


    return <div>
        <AdminNavBar />
        <div className="p-8">
            <h1 className="text-3xl font-bold text-white-800 mb-4">Audit Logs</h1>
            <div className="bg-black-600 shadow-lg rounded-xl overflow-hidden text-white">
                <table className="min-w-full">
                    <thead className="bg-gray-100 text-gray-600 text-sm uppercase">
                        <tr>
                            <th className="p-4 text-left">User</th>
                            <th className="p-4 text-left">Role</th>
                            <th className="p-4 text-left">Action</th>
                            <th className="p-4 text-left">Status</th>
                            
                        </tr>
                    </thead>

                    <tbody>
                        {logs.map((u) => (
                            <tr key={u.id} className="border-t hover:bg-gray-600">
                                <td className="p-4">{u.user}</td>
                                <td className="p-4">{u.role}</td>
                                <td className="p-4">{u.action}</td>
                                <td className="p-4">{u.status}</td>
                            </tr>
                        ))}
                    </tbody>

                </table>
            </div>
        </div>
    </div>
}

import React, {useState} from 'react';
import {Lock, User} from 'lucide-react';
import {adminLogin} from "@/axios/Request.ts";
import {useNavigate} from "react-router-dom";
import {toast, ToastContainer} from "react-toastify";


const AdminLoginPage = () => {
    const [username, setUsername] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [error, setError] = useState<string>('');
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!username || !password) {
            setError('Please enter both username and password');
            return;
        }
        const body = {
            email: username,
            password: password,
        }
        try{
            const response : string= await adminLogin(body);
            if (response) {
                localStorage.setItem("id", response);
                navigate("/admin");
            } else {
                toast.error("Đăng nhập thất bại");
            }
        }catch (error) {
            toast.error("Đăng nhập thất bại");
        }
        setError('');

    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
            <div className="w-full max-w-md">
                <form
                    onSubmit={handleSubmit}
                    className="bg-white shadow-md rounded-lg px-8 pt-6 pb-8 mb-4"
                >
                    <div className="text-center mb-6">
                        <h2 className="text-2xl font-bold text-gray-800">Admin Login</h2>
                    </div>

                    {error && (
                        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
                            {error}
                        </div>
                    )}

                    <div className="mb-4 relative">
                        <label
                            htmlFor="username"
                            className="block text-gray-700 text-sm font-bold mb-2"
                        >
                            Username
                        </label>
                        <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center">
                <User className="text-gray-400" size={20}/>
              </span>
                            <input
                                id="username"
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                placeholder="Enter your username"
                                className="pl-10 w-full py-2 px-3 text-gray-700 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                    </div>

                    <div className="mb-6 relative">
                        <label
                            htmlFor="password"
                            className="block text-gray-700 text-sm font-bold mb-2"
                        >
                            Password
                        </label>
                        <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center">
                <Lock className="text-gray-400" size={20}/>
              </span>
                            <input
                                id="password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Enter your password"
                                className="pl-10 w-full py-2 px-3 text-gray-700 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                    </div>

                    <div className="flex items-center justify-between">
                        <button
                            type="submit"
                            className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition duration-300 ease-in-out transform hover:scale-105"
                        >
                            Sign In
                        </button>
                    </div>
                </form>
            </div>
            <ToastContainer
                position="top-center"
                autoClose={1000}
                hideProgressBar={true}
                newestOnTop={true}
                closeOnClick
            />
        </div>
    );
};

export default AdminLoginPage;
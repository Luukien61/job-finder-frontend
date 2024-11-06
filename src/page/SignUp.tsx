import React, {ReactNode, useState} from 'react';
import {IoPersonOutline} from "react-icons/io5";
import {MdOutlineMail} from "react-icons/md";
import {FiPhone} from "react-icons/fi";
import {RiLockPasswordLine} from "react-icons/ri";
import {useNavigate} from "react-router-dom";

const Signup = () => {
    const [userName, setUserName]= useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [retypePass, setRetypePass] = useState('');
    const [phone, setPhone] = useState('');
    const navigate = useNavigate();
    const handleSignup = () => {

    }
    const handleSignupWithGoogle = () => {

    }
    const handleForwardLogin = () => {
        navigate("/login", {replace:false});
    }

    const [file, setFile] = useState(null);

    const handleFileChange = (event) => {
        setFile(event.target.files[0]);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (!file) return;

        // Tạo FormData để gửi file PDF
        const formData = new FormData();
        formData.append('file', file);

        try {
            const response = await fetch('http://localhost:8000/upload', {
                method: 'POST',
                body: formData,
            });

            if (response.ok) {
                alert('File uploaded successfully!');
            } else {
                alert('Failed to upload file.');
            }
        } catch (error) {
            console.error('Error uploading file:', error);
        }
    };

    return (
        <div className={`flex justify-center rounded  min-h-screen `}>
            <div className={`custom-container mt-2 flex justify-center `}>
                <div className={`w-2/3 rounded bg-white drop-shadow `}>
                    <div className={`flex flex-col gap-y-2 justify-center items-center pb-3`}>
                        <div className={`w-3/4 flex-col my-4`}>
                            <div className={`flex justify-center`}>
                                <img className={`w-32`} src={"/public/job-finder.png"} alt={`${userName} logo`}/>
                            </div>
                            {/*name*/}
                            <div>
                                <div>
                                    <p>Your Name</p>
                                </div>
                                <div className={`flex rounded border px-2 items-center py-2 gap-x-4`}>
                                    <IoPersonOutline color={`green`}/>
                                    <input
                                        value={userName}
                                        onChange={(e) => {
                                            setUserName(e.target.value)
                                        }}
                                        placeholder="Your Name"
                                        spellCheck={false}
                                        className={`outline-none text-black flex-1`}
                                    />
                                </div>
                            </div>
                            {/*email and phone*/}
                            <div className={`flex my-4`}>
                                <div className={`w-1/2 pr-2`}>
                                    <div>
                                        <p>Email</p>
                                    </div>
                                    <div className={`flex rounded border px-2 items-center py-2 `}>
                                        <MdOutlineMail color={`green`}/>
                                        <input
                                            value={email}
                                            onChange={(e) => {
                                                setEmail(e.target.value)
                                            }}
                                            placeholder="Email"
                                            spellCheck={false}
                                            className={`outline-none text-black max-w-[90%] flex-1 pl-4`}
                                        />
                                    </div>
                                </div>
                                <div className={`w-1/2 pl-2`}>
                                    <div>
                                        <p>Phone</p>
                                    </div>
                                    <div className={`flex rounded border items-center py-2 px-2 `}>
                                        <FiPhone color={`green`}/>
                                        <input
                                            value={phone}
                                            onChange={(e) => {
                                                setPhone(e.target.value)
                                            }}
                                            placeholder="Phone"
                                            spellCheck={false}
                                            className={`outline-none text-black max-w-[90%] flex-1 pl-4`}
                                        />
                                    </div>
                                </div>
                            </div>
                            {/*password*/}
                            <div className={`my-4`}>
                                <div>
                                    <p>Password</p>
                                </div>
                                <div className={`flex rounded border px-2 items-center py-2 gap-x-4`}>
                                    <RiLockPasswordLine color={`green`}/>
                                    <input
                                        value={password}
                                        onChange={(e) => {
                                            setPassword(e.target.value)
                                        }}
                                        type={`password`}
                                        placeholder="Password"
                                        spellCheck={false}
                                        className={`outline-none text-black flex-1`}
                                    />
                                </div>
                            </div>
                            {/*retype password*/}
                            <div>
                                <div>
                                    <p>Retype password</p>
                                </div>
                                <div className={`flex rounded border px-2 items-center py-2 gap-x-4`}>
                                    <RiLockPasswordLine color={`green`}/>
                                    <input
                                        value={retypePass}
                                        onChange={(e) => {
                                            setRetypePass(e.target.value)
                                        }}
                                        type={`password`}
                                        placeholder="Retype password"
                                        spellCheck={false}
                                        className={`outline-none text-black flex-1`}
                                    />
                                </div>
                            </div>
                            {/*Signup button*/}
                            <div className={`mt-8 drop-shadow-2xl`}>
                                <button
                                    onClick={handleSignup}
                                    type={`button`}
                                    className={`w-full rounded hover:bg-gray-800 text-white bg-primary py-2`}>
                                    Sign up
                                </button>
                            </div>
                            <div className={`flex justify-center my-4`}>
                                <p className={`text-gray-500`}><i>or</i></p>
                            </div>
                            {/*Signup with Google*/}
                            <div className={`flex items-center justify-center`}>
                                <button
                                    onClick={handleSignupWithGoogle}
                                    type={`button`}
                                    className=" flex  gap-x-3 items-center rounded-2xl bg-gray-100 p-2 hover:bg-gray-200">
                                    <img className={`w-6`} src="/public/google.png" alt={`Google Signup`}/>
                                    Sign up with Google
                                </button>
                            </div>
                            <div className={`flex items-center justify-center my-4 gap-x-1`}>
                                <p className={`text-[14px] text-gray-700`}>Already have an account? </p>
                                <p onClick={handleForwardLogin}
                                   className={`text-[14px] text-green-400 cursor-pointer hover:underline`}>Log in</p>
                            </div>
                            {/*file*/}
                            <div className="p-4 flex items-center justify-center w-full">
                                <form onSubmit={handleSubmit} className="space-y-4 flex justify-center items-center flex-col">
                                    <input
                                        type="file"
                                        accept="application/pdf"
                                        onChange={handleFileChange}
                                        className="block text-sm text-gray-50 w-[120px] file:py-2 file:px-4
                                                   file:rounded-full file:border-0
                                                   file:text-sm file:font-semibold
                                                   file:bg-violet-50 file:text-violet-700
                                                   hover:file:bg-violet-100"/>
                                    <button
                                        type="submit"
                                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                                    >
                                        Upload
                                    </button>
                                </form>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
};

export default Signup;

type InputProps = {
    icon: ReactNode,
    value: string,
    onChange: (value: string) => void
    style?: string,
    placeholder: string,
}
export const Input: React.FC<InputProps> = ({icon, value, onChange, placeholder, style}) => {
    return (
        <div className={`flex rounded border items-center py-2 px-2 `}>
            {icon}
            <input
                value={value}
                onChange={(e) => {
                    onChange(e.target.value)
                }}
                placeholder={placeholder}
                spellCheck={false}
                className={`outline-none text-black max-w-[90%] flex-1 pl-4 ${style}`}
            />
        </div>
    )
}
import React, {useState, useRef} from 'react';
import {Card} from '@/components/ui/card';
import {Button} from '@/components/ui/button';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import {Camera, Download, Phone, Upload} from 'lucide-react';
import {Input} from 'antd';
import {FaPhoneAlt} from "react-icons/fa";
import {LuPhone} from "react-icons/lu";
import {FiAtSign} from "react-icons/fi";
import {MdOutlineLocationOn} from "react-icons/md";
import {IoPerson} from "react-icons/io5";
import {GiJigsawPiece} from "react-icons/gi";
import {IoIosAdd, IoIosCloseCircleOutline} from "react-icons/io";

// Định nghĩa kiểu dữ liệu
interface CVData {
    fullName: string;
    title: string;
    email: string;
    phone: string;
    address: string;
    photoUrl: string;
    summary: string;
    experience: Array<{
        company: string;
        position: string;
        startDate: string;
        endDate: string;
        description: string;
    }>;
    education: Array<{
        school: string;
        degree: string;
        startDate: string;
        endDate: string;
    }>;
    skills: Array<{
        name: string;
        level: number;
    }>;
    languages: Array<{
        name: string;
        level: string;
    }>;
}

// Các mẫu CV
const CV_TEMPLATES = {
    modern: {
        name: "Modern",
        class: "bg-white",
        previewImage: "/cv/modern.png",
    },
    professional: {
        name: "Professional",
        class: "bg-gray-50",
        previewImage: "/api/placeholder/200/300",
    },
    creative: {
        name: "Creative",
        class: "bg-blue-50",
        previewImage: "/api/placeholder/200/300",
    },
    minimal: {
        name: "Minimal",
        class: "bg-neutral-50",
        previewImage: "/api/placeholder/200/300",
    }
};

interface InputItem {
    id: number;
    value: string;
}

const AdvancedCVBuilder = () => {
    const [selectedTemplate, setSelectedTemplate] = useState('modern');
    const [photoPreview, setPhotoPreview] = useState<string>('');
    const cvRef = useRef<HTMLDivElement>(null);
    const [numSkills, setNumSkills] = useState<number>(3);
    const [inputs, setInputs] = useState<InputItem[]>([{ id: Date.now(), value: '' }]);

    const handleAddInput = () => {
        setInputs([...inputs, { id: Date.now(), value: '' }]);
    };

    // Xóa một input
    const handleRemoveInput = (id: number) => {
        setInputs(inputs.filter(input => input.id !== id));
    };

    // Cập nhật giá trị của một input
    const handleInputChange = (id: number, value: string) => {
        setInputs(inputs.map(input => (input.id === id ? { ...input, value } : input)));
    };

    const [cvData, setCvData] = useState<CVData>({
        fullName: '',
        title: '',
        email: '',
        phone: '',
        address: '',
        photoUrl: '',
        summary: '',
        experience: [{
            company: '',
            position: '',
            startDate: '',
            endDate: '',
            description: ''
        }],
        education: [{
            school: '',
            degree: '',
            startDate: '',
            endDate: ''
        }],
        skills: [{
            name: '',
            level: 0
        }],
        languages: [{
            name: '',
            level: 'Basic'
        }]
    });

    // Xử lý upload ảnh
    const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setPhotoPreview(reader.result as string);
                setCvData(prev => ({...prev, photoUrl: reader.result as string}));
            };
            reader.readAsDataURL(file);
        }
    };

    // Xuất PDF
    const exportToPDF = async () => {
        if (cvRef.current) {
            const canvas = await html2canvas(cvRef.current);
            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF('p', 'mm', 'a4');
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = pdf.internal.pageSize.getHeight();
            pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
            pdf.save('my-cv.pdf');
        }
    };

    // Template Modern
    const ModernTemplate = () => (
        <div className={`bg-modern bg-no-repeat bg-center bg-cover aspect-[7/10] *:text-modern_default`}>
            <div className={`w-full flex p-2`}>
                <div className={`w-[40%] px-5  h-full`}>
                    <div className={`w-full h-[500px] `}>

                    </div>
                    {/*contact*/}
                    <div className={`flex flex-col gap-10`}>
                        <div>
                            <div
                                className={`flex gap-10 items-center border-b-2 border-modern_border pb-4`}>
                                <IoPerson size={24} fill={'#636466'}/>
                                <p className={`text-[24px]`}>Bản thân</p>
                            </div>
                            <div className={`flex flex-col gap-6 mt-6`}>
                                <p>
                                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
                                    incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud
                                    exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
                                </p>
                            </div>
                        </div>
                        <div>
                            <div
                                className={`flex gap-10 items-center border-b-2 border-modern_border pb-4`}>
                                <FaPhoneAlt size={24} fill={'#636466'}/>
                                <p className={`text-[24px]`}>Liên hệ</p>
                            </div>
                            <div className={`flex flex-col gap-6 mt-6`}>
                                <div className={`flex gap-6`}>
                                    <LuPhone className={`-rotate-90`} size={24} color={'#608abf'}/>
                                    <p className={``}>0353795729</p>
                                </div>
                                <div className={`flex gap-6`}>
                                    <FiAtSign size={24} color={'#608abf'}/>
                                    <p className={``}>kienluu61@gmail.com</p>
                                </div>
                                <div className={`flex gap-6`}>
                                    <MdOutlineLocationOn size={24} color={'#608abf'}/>
                                    <p className={``}>Ha Dong, Ha Noi</p>
                                </div>
                            </div>
                        </div>
                        <div>
                            <div
                                className={`flex gap-10 items-center border-b-2 border-modern_border pb-4`}>
                                <GiJigsawPiece size={24} fill={'#636466'}/>
                                <p className={`text-[24px]`}>Kĩ năng</p>
                            </div>
                            <div className={`flex flex-col gap-6 px-6 mt-6`}>
                                <ul className={`list-disc text-modern_border`}>
                                    {
                                        Array.from(Array(numSkills).keys()).map((item, index) => (
                                            <li  className={`mb-4`}>
                                                <div className={`flex justify-between`}>
                                                    <input className={`text-modern_default bg-transparent `}/>
                                                    <div onClick={()=>setNumSkills(prevState => prevState-1)} className={`cursor-pointer`}>
                                                        <IoIosCloseCircleOutline color={'#636466'}/>
                                                    </div>
                                                </div>
                                            </li>
                                        ))
                                    }
                                </ul>
                                <div
                                    onClick={()=>setNumSkills(prevState => prevState + 1)}
                                    className={`w-full ${numSkills==6 && 'hidden'} h-fit hover:bg-green_light cursor-pointer`}>
                                    <div className={`flex justify-center items-center`}>
                                        <IoIosAdd />
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>

                </div>

            </div>
        </div>
    );

    return (
        <div className="max-w-7xl mx-auto p-6">
            <div className="grid grid-cols-12 gap-6">
                {/* Template Selection */}
                <div className="col-span-12 mb-6">
                    <h2 className="text-2xl font-bold mb-4">Chọn mẫu CV</h2>
                    <div className="grid grid-cols-4 gap-4">
                        {Object.entries(CV_TEMPLATES).map(([key, template]) => (
                            <div
                                key={key}
                                onClick={() => setSelectedTemplate(key)}
                                className={`cursor-pointer rounded-lg overflow-hidden border-2 ${
                                    selectedTemplate === key ? 'border-blue-500' : 'border-gray-200'
                                }`}
                            >
                                <img src={template.previewImage} alt={template.name} className="w-full"/>
                                <div className="p-2 text-center">{template.name}</div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Form Section */}
                <div className="col-span-12 mb-6">
                    <div className={`w-full flex justify-center `}>
                        <div ref={cvRef}
                            className={`w-[80%]`}>
                            <ModernTemplate/>
                        </div>

                    </div>
                </div>
                <Button className="mt-6 w-full" onClick={exportToPDF}>
                    <Download className="w-4 h-4 mr-2" />
                    Xuất PDF
                </Button>
            </div>
        </div>
    );
};

export default AdvancedCVBuilder;
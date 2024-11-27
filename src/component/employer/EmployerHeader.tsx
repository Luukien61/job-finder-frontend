import React from 'react';

const EmployerHeader = () => {

    return (
        <div className={`px-4 flex min-h-[74px] bg-white border-none border-b-[1px] border-b-[#e9eaec] sticky top-0 z-50 shadow`}>

            <div className={`flex justify-between w-full`}>
                {/*App logo*/}
                <div>
                    <a
                        href="/employer"
                        target='_self'
                        className="mr-3 flex-none overflow-hidden w-auto flex items-center gap-2"
                    >
                        <img
                            src="/public/job-finder.jpg"
                            alt="App Home page"
                            className="object-cover w-[70%] max-w-[128px] "
                        />
                        {/*<p className="text-black font-semibold">{AppInfo.appName}</p>*/}
                    </a>
                </div>
                <div className={`flex-1 flex *:text-[18px] justify-start gap-10   items-center`}>
                    <img className={`h-[70px] `} src={'/public/img_1.png'}/>
                </div>
            </div>


        </div>

    );
};

export default EmployerHeader;
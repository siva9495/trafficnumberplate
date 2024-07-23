import React from 'react'

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-200 flex items-center justify-center">
      <div className='flex gap-4 sm:mx-auto sm:w-full sm:max-w-full justify-center'>
        <div className="flex-col max-w-sm bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700 hover:shadow-2xl">
          <a href="/criminal_dash">
            <img className="rounded-t-lg w-full h-72" src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRdEVJX_2TWB1CzCMRbrdLVJw8ztGGncHSh9j_TMdtOJ9GxTQx7aQmufT1BgRV7noyIiGk&usqp=CAU" alt="Crime Department" />
          </a>
          <div className="p-5 hover:bg-blue-400 rounded-md">
            <a href="/criminal_dash" className="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
              CRIMINAL DATA
              <svg className="rtl:rotate-180 w-3.5 h-3.5 ms-2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 10">
                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M1 5h12m0 0L9 1m4 4L9 9" />
              </svg>
            </a>
          </div>
        </div>
        <div className="flex-col max-w-sm bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700 hover:shadow-2xl">
          <a href="/trafficDepartmentv2">
            <img className="rounded-t-lg w-full h-72" src="https://media.istockphoto.com/id/1137447471/vector/drivers-test-and-license-icon-set-and-web-header-banner.jpg?s=612x612&w=0&k=20&c=xxYtFepudzQqUSVNh0wuna0zyYrKopNCN47Y4RInoQ0=" alt="Traffic Department" />
          </a>
          <div className="p-5 hover:bg-blue-400 rounded-md">
            <a href="/trafficDepartmentv2" className="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
              TRAFFIC DATA
              <svg className="rtl:rotate-180 w-3.5 h-3.5 ms-2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 10">
                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M1 5h12m0 0L9 1m4 4L9 9" />
              </svg>
            </a>
          </div>
        </div>
        <div className="flex-col max-w-sm bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700 hover:shadow-2xl">
          <a href="/secretaryv2">
            <img className="rounded-t-lg w-full h-72" src="https://previews.123rf.com/images/artshotphoto/artshotphoto1711/artshotphoto171100097/90745609-security-check-at-the-airport-icon-vector.jpg" alt="Secretary Department" />
          </a>
          <div className="p-5 hover:bg-blue-400 rounded-md">
            <a href="/secretaryv2" className="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
              SECRETARIATE DATA
              <svg className="rtl:rotate-180 w-3.5 h-3.5 ms-2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 10">
                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M1 5h12m0 0L9 1m4 4L9 9" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}

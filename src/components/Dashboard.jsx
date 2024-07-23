import { useState,useEffect } from "react";
import { auth } from "../firebase";
import { onAuthStateChanged } from "firebase/auth";

export default function Dashboard() {
const [user,setUser] = useState(null)
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
          setUser(currentUser);
        });
        return () => unsubscribe();
      }, []);
    return (
      <div className="h-screen w-full">
        <div className="relative isolate overflow-hidden bg-gray-900 shadow-2xl h-full flex items-center justify-center">
          <svg
            viewBox="0 0 1024 1024"
            className="absolute left-1/2 top-1/2 -z-10 h-[64rem] w-[64rem] -translate-y-1/2 [mask-image:radial-gradient(closest-side,white,transparent)] sm:left-full sm:-ml-80 lg:left-1/2 lg:ml-0 lg:-translate-x-1/2 lg:translate-y-0"
            aria-hidden="true"
          >
            <circle cx={512} cy={512} r={512} fill="url(#759c1415-0410-454c-8f7c-9a820de03641)" fillOpacity="0.7" />
            <defs>
              <radialGradient id="759c1415-0410-454c-8f7c-9a820de03641">
                <stop stopColor="#7775D6" />
                <stop offset={1} stopColor="#E935C1" />
              </radialGradient>
            </defs>
          </svg>
          <div className="relative z-10 flex flex-col lg:flex-row lg:gap-x-20 lg:px-24 items-center justify-center text-center lg:text-left">
            <div className="max-w-md lg:max-w-none lg:flex-1">
              <h2 className="text-3xl font-bold tracking-tight text-white sm:text-3xl">
              Streamline Operations with Advanced 
                <br />
                Criminal, Traffic, and Gate Entry Systems
              </h2>
              <p className="mt-6 text-lg leading-8 text-gray-300">
              Leverage AI-driven insights to enhance security, optimize traffic flow, and streamline visitor tracking.
              </p>
              <div className="mt-10 flex items-center justify-center gap-x-6 lg:justify-start">
                <a
                  href={user?'/home':'/signin'}
                  className="rounded-md bg-white px-3.5 py-2.5 text-sm font-semibold text-gray-900 shadow-sm hover:bg-gray-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                >
                  Get started
                </a>
                <a href="/aboutus" className="text-sm font-semibold leading-6 text-white">
                  Learn more <span aria-hidden="true">→</span>
                </a>
              </div>
            </div>
            <div className="relative mt-6 lg:mt-28 lg:flex-1 lg:h-auto h-80 ">
              <div className="flex gap-4 ">
                <div className="flex flex-col gap-4 py-36">
                  <img
                    className="rounded-md h-[250px] object-cover"
                    src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSzb4SIXD47QAxN6p3V53Zc_qxKX3G91pICVzf0zbY9qe9AlrHa1Mj2okMd-DJSSPrZf4w&usqp=CAU"
                    alt="image1"
                  />
                </div>
                <div className="flex flex-col gap-4">
                  <img
                    className="rounded-md h-[250px] object-cover"
                    src="https://www.shutterstock.com/image-vector/automated-license-plate-recognition-parking-600nw-2224544275.jpg"
                    alt="image3"
                  />
                  <img
                    className="rounded-md h-[250px] object-cover"
                    src="https://thumbs.dreamstime.com/b/young-man-passing-automated-passport-border-control-gates-flat-vector-illustration-young-man-passing-automated-171347057.jpg"
                    alt="image4"
                  />
                </div>
                <div className="flex flex-col gap-4 py-4">
                  <img
                    className="rounded-md h-[250px] object-cover"
                    src="https://www.fujitsu.com/downloads/blog/fgb/2021-01-20/fgb_20210120_01_index_pic_1.jpg"
                    alt="image6"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
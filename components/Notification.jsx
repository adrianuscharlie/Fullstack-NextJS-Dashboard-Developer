import React from 'react';
import {CheckCircle2,Loader} from 'lucide-react'
const Notification = ({ type = 'general', title, onActionClick, onClose }) => {
  const getIcon = () => {
    switch (type) {
      case 'success':
        return (
          <CheckCircle2 className='text-green-500' width={50} height={35}/>
        );
      case 'error':
        return (
          <svg
            width="30"
            height="30"
            viewBox="0 0 30 30"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M15 0C6.728 0 0 6.728 0 15C0 23.272 6.728 30 15 30C23.272 30 30 23.272 30 15C30 6.728 23.272 0 15 0ZM19.425 20.175L15 15.75L10.575 20.175L8.825 18.425L13.25 14L8.825 9.575L10.575 7.825L15 12.25L19.425 7.825L21.175 9.575L16.75 14L21.175 18.425L19.425 20.175Z"
              fill="#F44336"
            />
          </svg>
        );
      default:
        return (
          <Loader className='text-sky-500' width={50} height={35}/>
        );
    }
  };

  const getTitleClass = () => {
    switch (type) {
      case 'success':
        return 'text-green-600';
      case 'failed':
        return 'text-red-600';
      default:
        return 'text-black ';
    }
  };

  return (
    <div className={`max-w-[557px] rounded-lg bg-white p-5 fixed top-4 left-1/2 transform -translate-x-1/2 z-50 border py-6 pl-4 pr-5.5 sm:pl-6 ${type === 'general' ? 'border-stroke ' : ''}`}>
      <div className="flex justify-between gap-5">
        <div className="flex flex-grow gap-5">
          <div>
            {getIcon()}
          </div>
          <div>
            <h4 className={`mb-2 text-title-xsm font-medium ${getTitleClass()}`}>
              {title}
            </h4>            
          </div>
        </div>
        <div>
          <button onClick={onClose}>
            <svg
              className="fill-current"
              width="14"
              height="14"
              viewBox="0 0 14 14"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M0.854423 0.85186C1.2124 0.493879 1.79281 0.493879 2.15079 0.85186L7.0026 5.70368L11.8544 0.85186C12.2124 0.493879 12.7928 0.493879 13.1508 0.85186C13.5088 1.20984 13.5088 1.79024 13.1508 2.14822L8.29897 7.00004L13.1508 11.8519C13.5088 12.2098 13.5088 12.7902 13.1508 13.1482C12.7928 13.5062 12.2124 13.5062 11.8544 13.1482L7.0026 8.2964L2.15079 13.1482C1.79281 13.5062 1.2124 13.5062 0.854423 13.1482C0.496442 12.7902 0.496442 12.2098 0.854423 11.8519L5.70624 7.00004L0.854423 2.14822C0.496442 1.79024 0.496442 1.20984 0.854423 0.85186Z"
                fill=""
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Notification;

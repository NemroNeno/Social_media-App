import React from 'react'
import Cancel from '../img/Cancel.png';
import './OverlayWrapperStyling.css';

const OverlayWrapper = ({Open, closeFunction ,children}) => {

  return (
    <>
    <div onClick={closeFunction} className='cursor-pointer fixed h-screen w-screen  z-10 inset-0 flex justify-center items-center bg-black bg-opacity-60 '>
      <div onClick={(e)=>{e.stopPropagation()}} className='fixed w-6/12 h-3/5 m-3 p-10 px-14 z-10 flex flex-col border-black border-3 bg-slate-100 rounded-3xl overflow-y-auto hide-scrollbar cursor-default'>
        <div className='flex justify-end mb-4'>
          <button onClick={closeFunction} className='text-white rounded'>
            <img src={Cancel} alt='cancel logo' className='h-10 w-10'/>
          </button>
        </div>
        {children}
      </div>
    </div>
    </>
  )
}

export default OverlayWrapper

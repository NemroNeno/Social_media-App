import React, { useRef, useEffect } from 'react'
import Chahat from '../img/Chahat.png';

const SearchOverlay = ({onClose}) => {
    const divref = useRef();

    const FriendsAvailable = [
        {
            keyId: 1,
            image: Chahat,
            name: "AhmedBilal"
        },
        {
            keyId: 2,
            image: Chahat,
            name: "QasimSiddiqui"
        },
    ];

    const handleChatter = (Friend) => {
        onClose({Friend});
    }

    // useEffect(()=> {
    //     const handleClickOutside = (event) => {
    //         if(!divref.current && !divref.current.contains(event.target)){
    //             onClose();
    //         }
    //     };

    //     document.addEventListener('click', handleClickOutside);

    //     return ()=>{
    //         document.removeEventListener('click', handleClickOutside);
    //     };
    // }, [onClose]);

    // const handleDivClick = (event) => {
    //      // Prevent the click event from propagating to the document
    //     // Handle click within the div here
    //     // ...
    //   };


  return (
    <div onClick={onClose} className='fixed h-screen w-screen inset-0 z-10 flex justify-center items-center bg-black bg-opacity-60 cursor-pointer'>
        <div className='w-1/2 h-fit z-50 m-3 p-4 flex flex-col justify-start border-black border-3 bg-slate-700'>
              <input className='w-9/12 h-10 border-black border-2 rounded-full p-3 ml-3 mr-3' placeholder='Start chat with...'/>
              <div className='m-4 flex flex-col'>
                    {
                        FriendsAvailable.map((Friends, index)=>
                        <div ref={divref} key={index}  onClick={handleChatter} className='flex flex-row bg-white hover:bg-blue-500 cursor-pointer'>
                            <img src={Friends.image} alt='friend avatar'/>
                            <p className='w-9/12 h-10'>{Friends.name}</p>
                        </div>
                        )
                    }
              </div>
        </div> 
    </div>
  )
}

export default SearchOverlay;

// <div className='fixed inset-0 z-50 flex justify-center items-center bg-black bg-opacity-50'>
//       <div className='bg-white p-6 rounded-lg'>
//         <h2 className='text-lg font-bold mb-4'>Overlay Content</h2>
//         <input
//           type='text'
//           className='border rounded-md px-3 py-2 w-full mb-4'
//           placeholder='Enter data...'
//         />
//         <button
//           className='bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600'
//         >
//           Submit
//         </button>
//       </div>
//     </div>

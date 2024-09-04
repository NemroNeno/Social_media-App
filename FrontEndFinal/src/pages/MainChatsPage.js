import React from 'react'
import ChatsList from '../components/ChatsList';

import ChatMessageList from '../components/ChatMessageList';
import "../pages/styles.css";
import TopBarApp from '../components/TopBarApp';


const MainChatsPage = () => {
  return (
    <TopBarApp isChats={true} isPosts={false}>
    <div className='w-screen height-selector overflow-y-auto hide-scrollbar bg-slate-100' >
      {/* Whole screen */}
      <div className='flex flex-row h-fit min-w-screen m-3 mr-3 mb-4 p-3'>
        {/* SidebarChats */}
        <div className='w-3/12 h-screen border border-x-2 rounded-lg bg-white items-start overflow-hidden flex flex-col mr-3'>
            <p className='font-bold mx-0 p-5 bg-slate-100 w-full h-16'>Messages</p>
            <ChatsList id='1'/>
        </div>
        {/* ChatsArea */}
        <div className='w-full h-screen bg-white flex flex-col overflow-visible rounded-lg border border-x-2'>
            <ChatMessageList/>
        </div>
      </div>
    </div>
    </TopBarApp>
  )
}

export default MainChatsPage

// import React from 'react'
// import ChatsList from '../components/ChatsList';

// import ChatMessageList from '../components/ChatMessageList';
// import "../pages/styles.css";
// import TopBarApp from '../components/TopBarApp';


// const MainChatsPage = () => {
//   return (
//     <TopBarApp isChats={true} isPosts={false}>
//     <div className='max-h-screen overflow-hidden' >
//       {/* Whole screen */}
//       <div className='flex flex-row min-h-screen'>
//         {/* SidebarChats */}
//         <div className='w-3/12 h-screen border border-x-2 border-black bg-slate-300 items-start overflow-hidden'>
//             <ChatsList id='1'/>
//         </div>
//         {/* ChatsArea */}
//         <div className='w-full h-screen bg-orange-300 flex flex-col overflow-visible'>
//             <ChatMessageList/>
//         </div>
//       </div>
//     </div>
//     </TopBarApp>
//   )
// }

// export default MainChatsPage


// <div className='h-15 bg-teal-300 flex justify-between items-center pr-3 pl-3 '>
//         <div className='flex flex-rows m-0 items-center'>
//           <img src={logoConnectify} alt="Connectify Logo" className='h-12' onClick={navig}/> {/* Use the imported image */}
//           <Button variant='Search' onClick={toggleOverlay}><img src={Search} alt='search logo' className='h-11 w-11'/></Button>
//         </div>
//         <div>
//         <Button variant='Menu selection'><FaBars /></Button>
//           <Button variant='Chat bubble'><img src={chatBubble} alt='chat logo' className='h-12 w-10 p-0'></img></Button>
//           <Button variant='Profile'><img src={Chahat} alt='chahatFateh' className='h-12 w-12 p-0 border-black border-2 rounded-full' /></Button>
//           <Button variant='Logout'><img src={Logout} alt='chat logo' className='h-12 w-10 p-0'></img></Button>
//         </div>
//       </div>
import React from "react";
import OverlayWrapper from "./OverlayWrapper";
import Badge from "./Badge";

const ChatInfoOverlay = ({ closeFunction, isAdmin, user_id, group_id }) => {

    const mockGroupMembers = [
        "Hashim",
        "Ahmad",
        "Mohsin",
        "Chahat",
        "Fateh"
    ];

    const onChosing = (e) => {
        //Heres the functionality for if user selects to remove that member from the group
    }

  return (
    <OverlayWrapper closeFunction={closeFunction}>
           <div className="flex flex-col">
           <label for="Group Name" className="block overflow-hidden rounded-md border border-gray-200 px-3 py-2 shadow-sm focus-within:border-blue-600 focus-within:ring-1 focus-within:ring-blue-600">
             <span class="text-xs font-medium text-gray-700"> Group Name </span>
             {isAdmin && <input
               type="name"
               id="Group Name"
               placeholder={`${group_id}anthony@rhcp.com`}
               class="mt-1 w-full border-none p-0 focus:border-transparent focus:outline-none focus:ring-0 sm:text-sm"
             />}
             {!isAdmin && <input
               type="name"
               id="Group Name"
               placeholder={`${group_id}anthony@rhcp.com`}
               class="mt-1 w-full border-none p-0 focus:border-transparent focus:outline-none focus:ring-0 sm:text-sm"
               readOnly
             />}
           </label>

           <label for="Group Description" className="block overflow-hidden rounded-md border border-gray-200 px-3 py-2 shadow-sm focus-within:border-blue-600 focus-within:ring-1 focus-within:ring-blue-600">
             <span class="text-xs font-medium text-gray-700"> Group Description </span>
                {isAdmin && <input
               type="description"
               id="Group Description"
               placeholder={`${group_id}anthony@rhcp.com`}
               class="mt-1 w-full border-none p-0 focus:border-transparent focus:outline-none focus:ring-0 sm:text-sm"
             />}
             {!isAdmin && <input
               type="description"
               id="Group Description"
               placeholder={`${group_id}anthony@rhcp.com`}
               class="mt-1 w-full border-none p-0 focus:border-transparent focus:outline-none focus:ring-0 sm:text-sm"
               readOnly
             />}
             
           </label>

           <div className="flex flex-wrap w-full h-fit bg-slate-600 border-2 border-black m-3 p-2">
               {
                   mockGroupMembers?.map((member, index)=>(
                       <Badge isAdmin={isAdmin} onChosing={onChosing}>
                           {member}
                       </Badge>
                   ))
               }
           </div>
         </div>
    </OverlayWrapper>
  );
};

export default ChatInfoOverlay;

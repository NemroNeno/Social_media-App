import React from "react";
import OverlayWrapper from "./OverlayWrapper";
import Badge from "./Badge";

const ChatInfoOverlay = ({ closeFunction, user_ids, group_name }) => {
  console.log(group_name);

  const mockGroupMembers = ["Hashim", "Ahmad", "Mohsin", "Chahat", "Fateh"];

  const onChosing = (e) => {
    //Heres the functionality for if user selects to remove that member from the group
  };

  return (
    <OverlayWrapper closeFunction={closeFunction}>
      <div className="w-full h-fit p-3 border-2 border-black bg-blue-100">
        <p className="text-5xl flex justify-center mb-7 font-extrabold">
          Group Info
        </p>
        <div className="flex flex-col w-full">
          <span class="text-xs font-medium text-gray-700"> Group Name </span>
          <p className="text-5xl w-full px-3 mx-2 font-serif h-3 bg-slate-200">
            {group_name}
          </p>

          <label
            for="Group Description"
            className="block overflow-hidden rounded-md border border-gray-200 px-3 py-2 shadow-sm focus-within:border-blue-600 focus-within:ring-1 focus-within:ring-blue-600"
          >
            <span class="text-xs font-medium text-gray-700">
              {" "}
              Group Description{" "}
            </span>
            <div className="flex flex-rows w-full h-fit bg-slate-600 border-2 border-black m-3 p-2">
              {user_ids?.map((userName) => (
                <Badge onChosing={onChosing}>{userName}</Badge>
              ))}
            </div>
          </label>
        </div>
      </div>
    </OverlayWrapper>
  );
};

export default ChatInfoOverlay;

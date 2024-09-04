import axios from "axios";
import React, { useEffect, useState } from "react";
import { useAuth } from "./contexts/authContext";

const SearchComponent = ({ onSelection }) => {
  const [filteredCandidates, setFilteredCandidates] = useState([
  
  ]);
  const [inputValue, setInputValue] = useState("");
  const [searchResult,setSearchResult]=useState([null]);
  const [auth,setAuth]=useAuth();


const searchUsers=async ()=>{
  try {
    if(inputValue.length<2)
    return;

//console.log(auth.token);
    const res=await axios.post('http://localhost:3001/api/auth/searchUser',{query:inputValue},{
      headers: {
        Authorization: auth.token,
      },
    });
    if( res?.data?.success){
      let arr=res?.data?.users;
      const filteredArray = arr.filter(obj => obj.id !== auth.user.id);


    setSearchResult([...filteredArray])

    }
else{
  //console.log( res.data.message);
}
  } catch (error) {
    console.log(error)
  }
};



useEffect(()=>{
  const identifier=setTimeout(()=>{
    
    searchUsers();
   }, 1000);

   return () =>{
      clearTimeout(identifier);  
   };

},[inputValue])



  

  const inputHandler = (e) => {
    const query = e.target.value;
    setInputValue(query);
  };
  return (
    <div>
      <input
      value={inputValue}
        onChange={inputHandler}
        placeholder="Enter  the username!"
        className="w-9/12 h-10 p-3 mb-4 border-black border-2"
      />
      {(
        <div className="w-1/3 h-fit p-3 border-black border-1 justify-center items-center">
          {searchResult?.map((candidate, index) => (
            <div key={index} >
              <p
                onClick={() => onSelection(candidate)}
                className="bg-teal-500 border-black border-1 m-1 p-2 rounded-full cursor-pointer"
              >
               {candidate?.username}
               
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchComponent;

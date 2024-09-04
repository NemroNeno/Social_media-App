import React, { useState } from 'react'

const CommentListComponent = ({commentedPost}) => {
  return (
    <div className='w-11/12 h-fit bg-green-200 flex flex-col mx-2 my-4 p-2 border-2 border-green-400 rounded-2xl'>
      <p>@ChahatFateh</p>
      <p>{commentedPost.created_at}</p>
      <p>{commentedPost.body}</p>
    </div>
  )
}

export default CommentListComponent;

//I wanted to place those items from postsList to commentsList which will render at runtime

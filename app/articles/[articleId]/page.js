import React from 'react'

function page({ params }) {
  const { articleId } = params;
  return (
    <div>
      <h1>articleId: {articleId}</h1>
    </div>
  )
}

export default page
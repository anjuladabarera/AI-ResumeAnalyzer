import React from 'react'

const UploadJobDescription = () => {
  return (
    <div>
      Here is the Job Description upload page.
    <br />

      <textarea 
         name="jobDescription" 
         rows="10" cols="50" 
         placeholder="Paste job description here..." >
    
      </textarea>
      
   <br />
       


      <button type="submit">Submit</button>


    </div>
  )
}

export default UploadJobDescription

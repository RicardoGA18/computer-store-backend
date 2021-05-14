/* Function to verify the required keys */
const verifyKeys = (reqObject,requiredFields) => {
  const objectKeys = Object.keys(reqObject)
  let response = {
    success: true,
    key: null,
  }
  requiredFields.forEach(key => {
    if(!objectKeys.includes(key)){
      response = {
        success: false,
        key,
      }
    }else{
      if(!reqObject[key]){
        response = {
          success: false,
          key,
        }
      }
    }
  })
  return response
}

export default verifyKeys
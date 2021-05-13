/* Function to verify the required keys */
const verifyKeys = (reqObject,requiredFields) => {
  const objectKeys = Object.keys(reqObject)
  requiredFields.forEach(key => {
    if(!objectKeys.includes(key)){
      return {
        success: false,
        key,
      }
    }
  })
  return {
    success: true,
    key: null,
  }
}

export default verifyKeys
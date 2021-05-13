/* Function to verify the types of the fields  */
const verifyTypes = (fields,types) => {
  for(let i = 0; i < fields.length; i++){
    if(fields[i]){
      if(typeof fields[i] !== types[i]){
        return {
          success: false,
          field: fields[i],
          type: types[i],
        }
      }
    }
  }
  return {
    success: true,
    field: null,
    type: null,
  }
}

export default verifyTypes
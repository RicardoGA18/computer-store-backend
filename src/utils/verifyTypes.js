/* Function to verify the types of the fields  */
const verifyTypes = (values,types,fields) => {
  for(let i = 0; i < values.length; i++){
    if(values[i]){
      if(types[i] === 'array'){
        if(!(values[i] instanceof Array)){
          return {
            success: false,
            field: fields[i],
            type: types[i]
          }
        }
      }
      else if(typeof values[i] !== types[i]){
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
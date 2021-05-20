import verifyKeys from './verifyKeys'
import verifyTypes from './verifyTypes'

const verifyDetails = details => {
  /* Checking that there is almost one detail */
  if(!details.length){
    return {
      success: false,
      typeError: 'no received',
    }
  }
  for(let detail of details){
    /* Checking the required fields of the details */
    const keys = ['key','value']
    const isValidKeys = verifyKeys(detail,keys)
    if(!isValidKeys.success){
      return {
        success: false,
        typeError: 'invalid'
      }
    }
    /* Checking the type of the fields */
    const { key , value } = detail
    const values = [key,value]
    const types= ['string','string']
    const isValidTypes = verifyTypes(values,types,keys)
    if(!isValidTypes.success){
      return {
        success: false,
        typeError: 'invalid'
      }
    }
  }
  return {
    success: true,
    typeError: false
  }
}

export default verifyDetails
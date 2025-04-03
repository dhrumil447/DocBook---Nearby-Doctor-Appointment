export const ShowOnLogin = ({children})=>{
    if(sessionStorage.getItem("DocBook") != null){  return children   }
    else return null
}

export const ShowOnLogout = ({children})=>{
    if(sessionStorage.getItem("DocBook") == null){  return children  }
    else return null
}
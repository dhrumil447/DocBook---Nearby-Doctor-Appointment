import { createSlice } from "@reduxjs/toolkit"  

const doctorSlice =  createSlice({
    name:"doctor",
    initialState:{doctors:[]},
    reducers:{
        store_doctors(state,action){
            state.doctors =  action.payload }   }
})
export const {store_doctors} = doctorSlice.actions
export default doctorSlice
export const selectdoctors =  state=>state.doctor.doctors
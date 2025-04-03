import { createSlice } from "@reduxjs/toolkit"

const patientSlice = createSlice({
    name:"patient",
    initialState:{patients:[]},
    reducers:{
        store_patients(state,action){
            state.patients = action.payload}}
})
export const {store_patients} = patientSlice.actions
export default patientSlice
export const selectpatients = state=>state.patient.patients

import { configureStore } from "@reduxjs/toolkit";
import doctorSlice from "./doctorSlice";
import patientSlice from "./patientSlice";

const mystore = configureStore({
    reducer:{
        doctor:doctorSlice.reducer,
        patient:patientSlice.reducer
    }
})
export default mystore
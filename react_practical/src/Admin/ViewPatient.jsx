import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { selectpatients, store_patients } from '../redux/patientSlice';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router';
import { FaPenAlt, FaTrash } from 'react-icons/fa';
import { toast } from 'react-toastify';

const ViewPatient = () => {
  
  const patients = useSelector(selectpatients);
  const dispatch = useDispatch();
  const redirect = useNavigate();

  const getData = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_BASE_URL}/patients?isAdmin=false`);
      const patientList = Array.isArray(res.data.patients) ? res.data.patients : res.data;
      dispatch(store_patients(patientList));
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  const handleDelete = async(id)=>{
    if(window.confirm("are you sure to delete this??")){
      try{
        await axios.delete(`${import.meta.env.VITE_BASE_URL}/patients/${id}`)
        toast.success("patient deleted successfully")
        setIsDeleted(!isDeleted)
      }
      catch(err){toast.error(err)}
  }
}
  return (
    <>
       <div className='mt-3'>
            <h3 className='text-info'>View Patients</h3>
            <hr />
            <div className="table-responsive">
              <table className="table table-bordered table-striped table-hover">
                <thead>
                  <tr>
                    <th>Sr. No</th>
                    <th>Name</th>
                    <th>Age</th>
                    <th>Gender</th>
                    <th>Phone</th>
                    <th>email</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {patients.length === 0 ? (
                    <tr>
                      <td colSpan={8} className='text-center'>No Patient Found</td>
                    </tr>
                  ) : patients.map((patient, index) => (
                    <tr key={index}>
                      <td>{index + 1}</td>
                      <td>{patient.username}</td>
                      <td>{patient.age}</td>
                      <td>{patient.gender}</td>
                      <td>{patient.phone}</td>
                      <td>{patient.email}</td>
                      <td>
                        <button
                          className='btn btn-success me-2'
                          onClick={() => redirect(`/admin/patient/edit/${patient.id}`)}
                        >
                          <FaPenAlt />
                        </button>
                        <button
                          className='btn btn-danger'
                          onClick={() => handleDelete(patient.id)}
                        >
                          <FaTrash/>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
    </>
  )
}

export default ViewPatient

import mongoose, { Schema, model } from "mongoose";

const studentSchema = new Schema(
    {
        admissionNo:{
            type: String,
            required: true,
            unique:true,
            trim: true

        },
    // // rollNo: {
    // //     type: String,
        
    // },
    firstName: {
      type: String,
      required: true
    },
    lastName: {
      type: String,
      required: true
    },
    fatherName: {
      type: String,
      required: true
    },
    dateOfBirth: {
      type: Date,
      required: true
    },
    gender: {
      type: String,
      enum: ['Male', 'Female', 'Other'],
      required: true
    },
    email: String,
    phone: String,
    
    student_status:{
      type: String,
      enum: ['Regular', 'Private', 'Other'],
    },
    address: String,
   class: {
  type: mongoose.Schema.Types.ObjectId,
  ref: 'Class',
  required: true
},
    section: {
      type: String,
      required: true
    },
    academicYear: {
      type: String,
      required: true
    },
    cnic: {
      type: String,
      required: true
    },
    photo: {
        type: String
    }
  },
  { timestamps: true }

);

export const Student = model('Student', studentSchema);

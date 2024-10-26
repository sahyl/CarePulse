"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Form } from "@/components/ui/form";
import CustomFormField from "../CustomFormField";
import SubmitButton from "../SubmitButton";
import { useState } from "react";
import { getAppointmentSchema } from "@/lib/validation";
import { useRouter } from "next/navigation";
import { FormFieldType } from "./PatientForm";
import { Doctors } from "@/constants";
import { SelectItem } from "../ui/select";
import Image from "next/image";
import {
  createAppointment,
  updateAppointment,
} from "@/lib/actions/appointment.actions";
import { Appointment } from "@/types/appwrite.types";

// Your main component code remains the same
const AppointmentForm = ({
  userId,
  patientId,
  type,
  appointment,
  setOpen,
}: {
  userId: string;
  patientId: string;
  type: "create" | "cancel" | "schedule";
  appointment?: Appointment;
  setOpen: (open: boolean) => void;
}) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const AppointmentFormValidation = getAppointmentSchema(type);
  
  // Set up form with zodResolver
  const form = useForm<z.infer<typeof AppointmentFormValidation>>({
    resolver: zodResolver(AppointmentFormValidation),
    defaultValues: {
      primaryPhysician: appointment ? appointment.primaryPhysician : "",
      schedule: appointment ? new Date(appointment.schedule) : new Date(),
      reason: appointment?.reason || "",
      note: appointment?.note || "",
      cancellationReason: appointment?.cancellationReason || "",
    },
  });

  async function onSubmit(values: z.infer<typeof AppointmentFormValidation>) {
    setIsLoading(true);
    let status = type === "schedule" ? "scheduled" : type === "cancel" ? "cancelled" : "pending";
    
    try {
      if (type === "create" && patientId) {
        const appointmentData = {
          userId,
          patient: patientId,
          primaryPhysician: values.primaryPhysician,
          schedule: new Date(values.schedule),
          reason: values.reason!,
          note: values.note,
          status,
        };
        const appointment = await createAppointment(appointmentData);
        if (appointment) {
          form.reset();
          router.push(`/patients/${userId}/new-appointment/success?appointmentId=${appointment.$id}`);
        }
      } else {
        const appointmentToUpdate = {
          userId,
          appointmentId: appointment?.$id!,
          appointment: {
            primaryPhysician: values.primaryPhysician,
            schedule: new Date(values.schedule),
            status,
            cancellationReason: values.cancellationReason,
          },
          type,
        };
        const updatedAppointment = await updateAppointment(appointmentToUpdate);
        if (updatedAppointment) {
          setOpen(false);
          form.reset();
        }
      }
    } catch (error) {
      console.error(error);
    }
  }

  const buttonLabel = type === "cancel" ? "Cancel Appointment" : type === "schedule" ? "Schedule Appointment" : "Submit Appointment";

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 flex-1">
        {type === "create" && (
          <section className="mb-12 space-y-4">
            <h1 className="header">New Appointment 🗒️</h1>
            <p className="text-dark-700">Request an appointment here</p>
          </section>
        )}
        
        {type !== "cancel" && (
          <>
            <CustomFormField
              control={form.control}
              fieldType={FormFieldType.SELECT}
              name="primaryPhysician"
              label="Doctors"
              placeholder="Select a physician"
            >
              {Doctors.map((doctor) => (
                <SelectItem key={doctor.name} value={doctor.name}>
                  <div className="flex cursor-pointer items-center gap-2">
                    <Image
                      src={doctor.image}
                      alt={doctor.name}
                      width={32}
                      height={32}
                      className="rounded-full border border-dark-500"
                    />
                    <p>{doctor.name}</p>
                  </div>
                </SelectItem>
              ))}
            </CustomFormField>

            <CustomFormField
              fieldType={FormFieldType.DATE_PICKER}
              control={form.control}
              name="schedule"
              label="Schedule Date"
              showTimeSelect
              dateFormat="dd/MM/yyyy h:mm aa"
            />

            <div className="flex flex-col gap-6 xl:flex-row">
              <CustomFormField
                fieldType={FormFieldType.TEXTAREA}
                control={form.control}
                name="reason"
                label="Reason for Appointment"
                placeholder="Enter reason for appointment"
              />

              <CustomFormField
                fieldType={FormFieldType.TEXTAREA}
                control={form.control}
                name="note"
                label="Notes for Appointment"
                placeholder="Enter notes for appointment"
              />
            </div>
          </>
        )}

        {type === "cancel" && (
          <CustomFormField
            fieldType={FormFieldType.TEXTAREA}
            control={form.control}
            name="cancellationReason"
            label="Reason for Cancellation of Appointment"
            placeholder="Enter reason for cancellation"
          />
        )}

        <SubmitButton
          isLoading={isLoading}
          className={`${type === "cancel" ? "shad-danger-btn" : "shad-primary-btn"} w-full`}
        >
          {buttonLabel}
        </SubmitButton>
      </form>
    </Form>
  );
};

export default AppointmentForm;






// "use client";

// import { zodResolver } from "@hookform/resolvers/zod";
// import Image from "next/image";
// import { useRouter } from "next/navigation";
// import { Dispatch, SetStateAction, useState } from "react";
// import { useForm } from "react-hook-form";
// import { z } from "zod";

// import { SelectItem } from "@/components/ui/select";
// import { Doctors } from "@/constants";
// import {
//   createAppointment,
//   updateAppointment,
// } from "@/lib/actions/appointment.actions";
// import { getAppointmentSchema } from "@/lib/validation";
// import { Appointment } from "@/types/appwrite.types";

// import "react-datepicker/dist/react-datepicker.css";

// import CustomFormField from "../CustomFormField";

// import SubmitButton from "../SubmitButton";
// import { Form } from "../ui/form";
// import { FormFieldType } from "./PatientForm";

// const AppointmentForm = ({
//   userId,
//   patientId,
//   type = "create",
//   appointment,
//   setOpen,
// }: {
//   userId: string;
//   patientId: string;
//   type: "create" | "schedule" | "cancel";
//   appointment?: Appointment;
//   setOpen?: Dispatch<SetStateAction<boolean>>;
// }) => {
//   const router = useRouter();
//   const [isLoading, setIsLoading] = useState(false);

//   const AppointmentFormValidation = getAppointmentSchema(type);

//   const form = useForm<z.infer<typeof AppointmentFormValidation>>({
//     resolver: zodResolver(AppointmentFormValidation),
//     defaultValues: {
//       primaryPhysician: appointment ? appointment?.primaryPhysician : "",
//       schedule: appointment
//         ? new Date(appointment?.schedule!)
//         : new Date(Date.now()),
//       reason: appointment ? appointment.reason : "",
//       note: appointment?.note || "",
//       cancellationReason: appointment?.cancellationReason || "",
//     },
//   });

//   const onSubmit = async (
//     values: z.infer<typeof AppointmentFormValidation>
//   ) => {
//     setIsLoading(true);

//     let status;
//     switch (type) {
//       case "schedule":
//         status = "scheduled";
//         break;
//       case "cancel":
//         status = "cancelled";
//         break;
//       default:
//         status = "pending";
//     }

//     try {
//       if (type === "create" && patientId) {
//         const appointment = {
//           userId,
//           patient: patientId,
//           primaryPhysician: values.primaryPhysician,
//           schedule: new Date(values.schedule),
//           reason: values.reason!,
//           status: status as Status,
//           note: values.note,
//         };

//         const newAppointment = await createAppointment(appointment);

//         if (newAppointment) {
//           form.reset();
//           router.push(
//             `/patients/${userId}/new-appointment/success?appointmentId=${newAppointment.$id}`
//           );
//         }
//       } else {
//         const appointmentToUpdate = {
//           userId,
//           appointmentId: appointment?.$id!,
//           appointment: {
//             primaryPhysician: values.primaryPhysician,
//             schedule: new Date(values.schedule),
//             status: status as Status,
//             cancellationReason: values.cancellationReason,
//           },
//           type,
//         };

//         const updatedAppointment = await updateAppointment(appointmentToUpdate);

//         if (updatedAppointment) {
//           setOpen && setOpen(false);
//           form.reset();
//         }
//       }
//     } catch (error) {
//       console.log(error);
//     }
//     setIsLoading(false);
//   };

//   let buttonLabel;
//   switch (type) {
//     case "cancel":
//       buttonLabel = "Cancel Appointment";
//       break;
//     case "schedule":
//       buttonLabel = "Schedule Appointment";
//       break;
//     default:
//       buttonLabel = "Submit Apppointment";
//   }

//   return (
//     <Form {...form}>
//       <form onSubmit={form.handleSubmit(onSubmit)} className="flex-1 space-y-6">
//         {type === "create" && (
//           <section className="mb-12 space-y-4">
//             <h1 className="header">New Appointment</h1>
//             <p className="text-dark-700">
//               Request a new appointment in 10 seconds.
//             </p>
//           </section>
//         )}

//         {type !== "cancel" && (
//           <>
//             <CustomFormField
//               fieldType={FormFieldType.SELECT}
//               control={form.control}
//               name="primaryPhysician"
//               label="Doctor"
//               placeholder="Select a doctor"
//             >
//               {Doctors.map((doctor, i) => (
//                 <SelectItem key={doctor.name + i} value={doctor.name}>
//                   <div className="flex cursor-pointer items-center gap-2">
//                     <Image
//                       src={doctor.image}
//                       width={32}
//                       height={32}
//                       alt="doctor"
//                       className="rounded-full border border-dark-500"
//                     />
//                     <p>{doctor.name}</p>
//                   </div>
//                 </SelectItem>
//               ))}
//             </CustomFormField>

//             <CustomFormField
//               fieldType={FormFieldType.DATE_PICKER}
//               control={form.control}
//               name="schedule"
//               label="Expected appointment date"
//               showTimeSelect
//               dateFormat="MM/dd/yyyy  -  h:mm aa"
//             />

//             <div
//               className={`flex flex-col gap-6  ${type === "create" && "xl:flex-row"}`}
//             >
//               <CustomFormField
//                 fieldType={FormFieldType.TEXTAREA}
//                 control={form.control}
//                 name="reason"
//                 label="Appointment reason"
//                 placeholder="Annual montly check-up"
//                 disabled={type === "schedule"}
//               />

//               <CustomFormField
//                 fieldType={FormFieldType.TEXTAREA}
//                 control={form.control}
//                 name="note"
//                 label="Comments/notes"
//                 placeholder="Prefer afternoon appointments, if possible"
//                 disabled={type === "schedule"}
//               />
//             </div>
//           </>
//         )}

//         {type === "cancel" && (
//           <CustomFormField
//             fieldType={FormFieldType.TEXTAREA}
//             control={form.control}
//             name="cancellationReason"
//             label="Reason for cancellation"
//             placeholder="Urgent meeting came up"
//           />
//         )}

//         <SubmitButton
//           isLoading={isLoading}
//           className={`${type === "cancel" ? "shad-danger-btn" : "shad-primary-btn"} w-full`}
//         >
//           {buttonLabel}
//         </SubmitButton>
//       </form>
//     </Form>
//   );
// };
// export default AppointmentForm
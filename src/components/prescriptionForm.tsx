// "use client";

// import { useEffect } from "react";
// import { useForm } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { z } from "zod";
// import {
//   Form,
//   FormControl,
//   FormField,
//   FormItem,
//   FormLabel,
//   FormMessage,
// } from "@/components/ui/form";
// import { Input } from "@/components/ui/input";
// import { Button } from "@/components/ui/button";
// import { Textarea } from "@/components/ui/textarea";

// const prescriptionSchema = z.object({
//   medicineName: z.string().min(1, "Medicine name is required"),
//   dosage: z.string().min(1, "Dosage is required"),
//   duration: z.string().min(1, "Duration is required"),
//   notes: z.string().optional(),
// });

// export type PrescriptionFormValues = z.infer<typeof prescriptionSchema>;

// interface PrescriptionFormProps {
//   onSubmit: (values: PrescriptionFormValues) => void;
//   defaultValues?: Partial<PrescriptionFormValues> | null;
// }

// export default function PrescriptionForm({ onSubmit, defaultValues }: PrescriptionFormProps) {
//   const form = useForm<PrescriptionFormValues>({
//     resolver: zodResolver(prescriptionSchema),
//     defaultValues: {
//       medicineName: "",
//       dosage: "",
//       duration: "",
//       notes: "",
//       ...defaultValues,
//     },
//   });

//   useEffect(() => {
//     if (defaultValues) {
//       form.reset({
//         medicineName: defaultValues.medicineName || "",
//         dosage: defaultValues.dosage || "",
//         duration: defaultValues.duration || "",
//         notes: defaultValues.notes || "",
//       });
//     }
//   }, [defaultValues, form]);

//   const handleSubmit = (values: PrescriptionFormValues) => {
//     onSubmit(values);
//     form.reset();
//   };

//   return (
//     <Form {...form}>
//       <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
//         <FormField
//           control={form.control}
//           name="medicineName"
//           render={({ field }) => (
//             <FormItem>
//               <FormLabel>Medicine Name</FormLabel>
//               <FormControl>
//                 <Input placeholder="Enter medicine name" {...field} />
//               </FormControl>
//               <FormMessage />
//             </FormItem>
//           )}
//         />

//         <div className="grid grid-cols-2 gap-4">
//           <FormField
//             control={form.control}
//             name="dosage"
//             render={({ field }) => (
//               <FormItem>
//                 <FormLabel>Dosage</FormLabel>
//                 <FormControl>
//                   <Input placeholder="e.g., 1 tablet twice a day" {...field} />
//                 </FormControl>
//                 <FormMessage />
//               </FormItem>
//             )}
//           />

//           <FormField
//             control={form.control}
//             name="duration"
//             render={({ field }) => (
//               <FormItem>
//                 <FormLabel>Duration</FormLabel>
//                 <FormControl>
//                   <Input placeholder="e.g., 5 days" {...field} />
//                 </FormControl>
//                 <FormMessage />
//               </FormItem>
//             )}
//           />
//         </div>

//         <FormField
//           control={form.control}
//           name="notes"
//           render={({ field }) => (
//             <FormItem>
//               <FormLabel>Notes / Instructions</FormLabel>
//               <FormControl>
//                 <Textarea placeholder="Special instructions for the patient" {...field} />
//               </FormControl>
//               <FormMessage />
//             </FormItem>
//           )}
//         />
//         <div className="flex justify-end gap-4 pt-2">
//           <Button type="submit" className="bg-teal-500 cursor-pointer hover:bg-teal-600 text-white">
//             {defaultValues ? "Update Prescription" : "Add Prescription"}
//           </Button>
//         </div>
//       </form>
//     </Form>
//   );
// }






"use client";

import { useEffect } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area"
import { RxCross2 } from "react-icons/rx";


const medicineSchema = z.object({
  medicineName: z.string().min(1, "Medicine name is required"),
  dosage: z.string().min(1, "Dosage is required"),
  duration: z.string().min(1, "Duration is required"),
  interval: z.string().min(1, "Interval is required"),
  notes: z.string().optional(),
});

const prescriptionSchema = z.object({
  medicines: z.array(medicineSchema).min(1, "At least one medicine is required"),
});

export type PrescriptionFormValues = z.infer<typeof prescriptionSchema>;

interface PrescriptionFormProps {
  onSubmit: (values: PrescriptionFormValues) => void;
  defaultValues?: Partial<PrescriptionFormValues> | null;
}

export default function PrescriptionForm({ onSubmit, defaultValues }: PrescriptionFormProps) {
  const form = useForm<PrescriptionFormValues>({
    resolver: zodResolver(prescriptionSchema),
    defaultValues: {
      medicines: defaultValues?.medicines || [
        { medicineName: "", dosage: "", duration: "", interval:"", notes: "" },
      ],
    },
  });

  const { control, handleSubmit, reset } = form;

  const { fields, append, remove } = useFieldArray({
    control,
    name: "medicines",
  });

  useEffect(() => {
    if (defaultValues) {
      reset({
        medicines: defaultValues.medicines || [{ medicineName: "", dosage: "", duration: "", interval:"", notes: "" }],
      });
    }
  }, [defaultValues, reset]);

  const handleFormSubmit = (values: PrescriptionFormValues) => {
    onSubmit(values);
    reset({
      medicines: [{ medicineName: "", dosage: "", duration: "", interval:"", notes: "" }],
    });
  };

  return (
    <div className="">
      <Form {...form} >
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4 ">
          <ScrollArea className="h-[61vh]  rounded-md border p-4 ">

            {fields.map((field, index) => (
              <Card key={field.id} className="p-4 mb-2 bg-white ">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="font-semibold text-lg">Medicine {index + 1}</h3>
                  {fields.length > 1 && (
                    <RxCross2  onClick={() => remove(index)} className="text-gray-500 cursor-pointer size-5" />
                  )}
                </div>

                <FormField
                  control={control}
                  name={`medicines.${index}.medicineName`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Medicine Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter medicine name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-2 gap-4 mt-4">
                  <FormField
                    control={control}
                    name={`medicines.${index}.dosage`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Dosage</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., 1 tablet twice a day" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={control}
                    name={`medicines.${index}.duration`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Duration</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., 5 days" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={control}
                    name={`medicines.${index}.interval`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Interval</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., two time in a day" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={control}
                  name={`medicines.${index}.notes`}
                  render={({ field }) => (
                    <FormItem className="mt-4">
                      <FormLabel>Notes / Instructions</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Special instructions" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </Card>
            ))}
          </ScrollArea>

          <Button
            type="button"
            variant="outline"
            className="w-full cursor-pointer  border-dashed text-teal-500 hover:text-teal-500"
            onClick={() =>
              append({ medicineName: "", dosage: "", duration: "", interval:"", notes: "" })
            }
          >
            + Add Another Medicine
          </Button>

          <div className="flex w-full justify-end">
            <Button type="submit" className=" cursor-pointer bg-teal-500 w-full text-white hover:bg-teal-600">
              {defaultValues ? "Update Prescription" : "Submit Prescription"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}

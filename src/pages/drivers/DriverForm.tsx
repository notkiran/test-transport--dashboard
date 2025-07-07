import React, { useState, useEffect } from 'react';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { format } from "date-fns";
import { CalendarIcon, Pencil, User, FileText, BadgeCheck, FilePlus } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { PageHeader } from "@/components/PageHeader";
import { PhotoUpload } from "@/components/PhotoUpload";
import { MultiPhotoUpload } from "@/components/MultiPhotoUpload";

import { Driver } from "@/lib/types";
import { sampleVehicles } from "@/data/sampleData";
import { cn } from "@/lib/utils";

const formSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  salary: z.coerce.number().positive({ message: "Salary must be a positive number." }),
  phone: z.string().regex(/^\d{10}$/, { message: "Phone number must be 10 digits." }),
  licenseNumber: z.string().min(5, { message: "A valid license number is required." }),
  licenseExpiry: z.date({ required_error: "License expiry date is required." }),
  vehicleId: z.string().optional(),
});

export type DriverFormData = z.infer<typeof formSchema>;

interface DriverFormProps {
  initialData?: Driver | null;
  onSubmit: (data: DriverFormData, files: { 
    photo?: File | null, 
    license?: File | null,
    aadharFiles?: File[],
    otherFiles?: File[],
    removedAadharUrls?: string[],
    removedOtherUrls?: string[],
  }) => void;
  onBack: () => void;
}

const DisplayField = ({ label, value }: { label: string; value?: React.ReactNode }) => (
  <div className="space-y-2">
    <FormLabel>{label}</FormLabel>
    <div className="text-base pt-2 h-10 flex items-center text-foreground/80">
      {value || <span className="text-muted-foreground">Not provided</span>}
    </div>
  </div>
);

export function DriverForm({ initialData, onSubmit, onBack }: DriverFormProps) {
  const [isEditing, setIsEditing] = useState(!initialData);
  
  // Single file states
  const [driverPhotoFile, setDriverPhotoFile] = useState<File | null | undefined>(undefined);
  const [licensePhotoFile, setLicensePhotoFile] = useState<File | null | undefined>(undefined);

  // Multi-file states
  const [aadharFiles, setAadharFiles] = useState<File[]>([]);
  const [otherFiles, setOtherFiles] = useState<File[]>([]);
  
  // State for tracking removed existing URLs
  const [removedAadharUrls, setRemovedAadharUrls] = useState<string[]>([]);
  const [removedOtherUrls, setRemovedOtherUrls] = useState<string[]>([]);

  const form = useForm<DriverFormData>({
    resolver: zodResolver(formSchema),
  });

  useEffect(() => {
    const defaultValues = {
      name: initialData?.name || "",
      salary: initialData?.salary || undefined,
      phone: initialData?.phone || "",
      licenseNumber: initialData?.licenseNumber || "",
      licenseExpiry: initialData ? new Date(initialData.licenseExpiry) : undefined,
      vehicleId: initialData?.vehicleId || "unassigned",
    };
    form.reset(defaultValues);
    
    // Reset all file states
    setDriverPhotoFile(undefined);
    setLicensePhotoFile(undefined);
    setAadharFiles([]);
    setOtherFiles([]);
    setRemovedAadharUrls([]);
    setRemovedOtherUrls([]);
  }, [isEditing, initialData, form]);

  function handleFormSubmit(values: DriverFormData) {
    const submissionData = {
      ...values,
      vehicleId: values.vehicleId === "unassigned" ? null : values.vehicleId,
    };
    onSubmit(submissionData as any, {
      photo: driverPhotoFile,
      license: licensePhotoFile,
      aadharFiles,
      otherFiles,
      removedAadharUrls,
      removedOtherUrls,
    });
  }

  const handleCancelEdit = () => {
    setIsEditing(false);
    // Reset file states on cancel as well
    setDriverPhotoFile(undefined);
    setLicensePhotoFile(undefined);
    setAadharFiles([]);
    setOtherFiles([]);
    setRemovedAadharUrls([]);
    setRemovedOtherUrls([]);
  };

  const handleRemoveAadharUrl = (url: string) => {
    setRemovedAadharUrls(prev => [...prev, url]);
  };
  
  const handleRemoveOtherUrl = (url: string) => {
    setRemovedOtherUrls(prev => [...prev, url]);
  };

  const aadharUrlsToDisplay = initialData?.aadharPhotoUrls?.filter(url => !removedAadharUrls.includes(url)) || [];
  const otherUrlsToDisplay = initialData?.otherDocumentUrls?.filter(url => !removedOtherUrls.includes(url)) || [];

  const title = initialData ? "Driver Details" : "Add New Driver";
  const description = isEditing
    ? (initialData ? "Update the information for the selected driver." : "Fill in the details to add a new driver to the system.")
    : "View the details for the selected driver.";
  const submitButtonText = initialData ? "Save Changes" : "Add Driver";

  const assignedVehicle = sampleVehicles.find(v => v.id === initialData?.vehicleId);
  const vehicleDisplayText = assignedVehicle ? `${assignedVehicle.registrationNumber} (${assignedVehicle.model})` : "Unassigned";

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <PageHeader title={title} showBackButton onBack={onBack}>
        {initialData && !isEditing && (
          <Button onClick={() => setIsEditing(true)}>
            <Pencil className="mr-2 h-4 w-4" />
            Edit Driver
          </Button>
        )}
      </PageHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>Driver Profile</CardTitle>
              <CardDescription>{description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col md:flex-row items-center md:items-start gap-8 border-b pb-8 mb-8">
                <PhotoUpload
                  label=""
                  imageUrl={initialData?.photoUrl}
                  onImageChange={setDriverPhotoFile}
                  isEditing={isEditing}
                  placeholderIcon={<User className="h-24 w-24 text-muted-foreground/50" />}
                  className="w-48"
                  aspect="aspect-square"
                  rounded="rounded-full"
                />
                <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-6 w-full">
                  {isEditing ? (
                    <FormField control={form.control} name="name" render={({ field }) => (
                      <FormItem>
                        <FormLabel>Full Name</FormLabel>
                        <FormControl><Input placeholder="e.g. Ramesh Kumar" {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                  ) : <DisplayField label="Full Name" value={initialData?.name} />}

                  {isEditing ? (
                    <FormField control={form.control} name="phone" render={({ field }) => (
                      <FormItem>
                        <FormLabel>Mobile Number</FormLabel>
                        <FormControl><Input placeholder="10-digit mobile number" {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                  ) : <DisplayField label="Mobile Number" value={initialData?.phone} />}

                  {isEditing ? (
                    <FormField control={form.control} name="salary" render={({ field }) => (
                      <FormItem>
                        <FormLabel>Salary (per month)</FormLabel>
                        <FormControl><Input type="number" placeholder="e.g. 25000" {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                  ) : <DisplayField label="Salary (per month)" value={initialData?.salary?.toLocaleString('en-IN', { style: 'currency', currency: 'INR', minimumFractionDigits: 0 })} />}

                  {isEditing ? (
                    <FormField control={form.control} name="vehicleId" render={({ field }) => (
                      <FormItem>
                        <FormLabel>Assigned Vehicle</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger><SelectValue placeholder="Select a vehicle to assign" /></SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="unassigned">Unassigned</SelectItem>
                            {sampleVehicles.map(vehicle => (
                              <SelectItem key={vehicle.id} value={vehicle.id}>{vehicle.registrationNumber} ({vehicle.model})</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )} />
                  ) : <DisplayField label="Assigned Vehicle" value={vehicleDisplayText} />}
                </div>
              </div>

              <div className="space-y-8">
                <h3 className="text-xl font-semibold tracking-tight">Documents</h3>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div className="space-y-6">
                        {isEditing ? (
                            <FormField control={form.control} name="licenseNumber" render={({ field }) => (
                            <FormItem>
                                <FormLabel>Driving License Number</FormLabel>
                                <FormControl><Input placeholder="e.g. DL1420110012345" {...field} /></FormControl>
                                <FormMessage />
                            </FormItem>
                            )} />
                        ) : <DisplayField label="Driving License Number" value={initialData?.licenseNumber} />}

                        {isEditing ? (
                            <FormField control={form.control} name="licenseExpiry" render={({ field }) => (
                            <FormItem className="flex flex-col pt-2">
                                <FormLabel>License Expiry Date</FormLabel>
                                <Popover>
                                <PopoverTrigger asChild>
                                    <FormControl>
                                    <Button variant={"outline"} className={cn("w-full pl-3 text-left font-normal", !field.value && "text-muted-foreground")}>
                                        {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                    </Button>
                                    </FormControl>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0" align="start">
                                    <Calendar mode="single" selected={field.value} onSelect={field.onChange} disabled={(date) => date < new Date()} initialFocus />
                                </PopoverContent>
                                </Popover>
                                <FormMessage />
                            </FormItem>
                            )} />
                        ) : <DisplayField label="License Expiry Date" value={initialData ? format(new Date(initialData.licenseExpiry), "PPP") : ''} />}
                    </div>
                    <PhotoUpload
                        label="Driving License Photo"
                        imageUrl={initialData?.licensePhotoUrl}
                        onImageChange={setLicensePhotoFile}
                        isEditing={isEditing}
                        placeholderIcon={<FileText className="h-16 w-16 text-muted-foreground/50" />}
                    />
                </div>
                <MultiPhotoUpload
                    label="Aadhar Card"
                    isEditing={isEditing}
                    existingImageUrls={aadharUrlsToDisplay}
                    onFilesChange={setAadharFiles}
                    onRemoveExistingUrl={handleRemoveAadharUrl}
                    placeholderIcon={<BadgeCheck className="h-12 w-12 text-muted-foreground/50" />}
                />
                <MultiPhotoUpload
                    label="Other Documents"
                    isEditing={isEditing}
                    existingImageUrls={otherUrlsToDisplay}
                    onFilesChange={setOtherFiles}
                    onRemoveExistingUrl={handleRemoveOtherUrl}
                    placeholderIcon={<FilePlus className="h-12 w-12 text-muted-foreground/50" />}
                />
              </div>

              {isEditing && (
                <div className="flex justify-end space-x-4 pt-8">
                  <Button type="button" variant="outline" onClick={initialData ? handleCancelEdit : onBack}>
                    Cancel
                  </Button>
                  <Button type="submit">{submitButtonText}</Button>
                </div>
              )}
            </CardContent>
          </Card>
        </form>
      </Form>
    </div>
  );
}

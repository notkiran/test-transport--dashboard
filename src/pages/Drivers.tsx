import React, { useMemo, useState } from 'react';
import { PageHeader } from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { sampleDrivers } from "@/data/sampleData";
import { PlusCircle } from "lucide-react";
import { DataTable } from "@/components/data-table/data-table";
import { getDriverColumns } from "@/components/data-table/columns";
import { Driver } from '@/lib/types';
import { toast } from 'sonner';
import { DriverForm, DriverFormData } from './drivers/DriverForm';

type DriverFiles = { 
  photo?: File | null, 
  license?: File | null,
  aadharFiles?: File[],
  otherFiles?: File[],
  removedAadharUrls?: string[],
  removedOtherUrls?: string[],
};

export function Drivers() {
  const [view, setView] = useState<'list' | 'add' | 'details'>('list');
  const [drivers, setDrivers] = useState<Driver[]>(sampleDrivers);
  const [editingDriver, setEditingDriver] = useState<Driver | null>(null);

  const handleAddClick = () => {
    setEditingDriver(null);
    setView('add');
  };

  const handleEditClick = (driver: Driver) => {
    setEditingDriver(driver);
    setView('details');
  };

  const handleCancelForm = () => {
    setView('list');
    setEditingDriver(null);
  };

  const handleDeleteDriver = (driverToDelete: Driver) => {
    toast.error(`Are you sure you want to delete driver ${driverToDelete.name}?`, {
      action: {
        label: 'Delete',
        onClick: () => {
          setDrivers(prev => prev.filter(d => d.id !== driverToDelete.id));
          toast.success(`Driver ${driverToDelete.name} has been deleted.`);
        }
      },
      cancel: { label: 'Cancel' },
    });
  };

  const handleBulkDelete = (driversToDelete: Driver[]) => {
    const numToDelete = driversToDelete.length;
    toast.error(`Are you sure you want to delete ${numToDelete} selected driver(s)?`, {
      action: {
        label: 'Delete',
        onClick: () => {
          const idsToDelete = new Set(driversToDelete.map(d => d.id));
          setDrivers(prev => prev.filter(d => !idsToDelete.has(d.id)));
          toast.success(`${numToDelete} driver(s) deleted successfully.`);
        }
      },
      cancel: { label: 'Cancel' },
    });
  };

  const handleAddDriver = (data: DriverFormData, files: DriverFiles) => {
    const newDriver: Driver = {
      id: `D${String(drivers.length + 101).slice(1)}`,
      ...data,
      vehicleId: data.vehicleId || null,
      licenseExpiry: data.licenseExpiry.toISOString(),
      photoUrl: files.photo ? URL.createObjectURL(files.photo) : undefined,
      licensePhotoUrl: files.license ? URL.createObjectURL(files.license) : undefined,
      aadharPhotoUrls: files.aadharFiles?.map(f => URL.createObjectURL(f)) || [],
      otherDocumentUrls: files.otherFiles?.map(f => URL.createObjectURL(f)) || [],
    };
    setDrivers(prev => [newDriver, ...prev]);
    toast.success("Driver added successfully!");
    if (files.photo) toast.info("Driver photo has been staged for upload.");
    if (files.license) toast.info("License photo has been staged for upload.");
    if (files.aadharFiles?.length) toast.info(`${files.aadharFiles.length} Aadhar photo(s) staged.`);
    handleCancelForm();
  };

  const handleUpdateDriver = (data: DriverFormData, files: DriverFiles) => {
    if (!editingDriver) return;

    let photoUrl = editingDriver.photoUrl;
    if (files.photo) {
      photoUrl = URL.createObjectURL(files.photo);
      toast.info("Driver photo updated.");
    } else if (files.photo === null) {
      photoUrl = undefined;
      toast.info("Driver photo removed.");
    }

    let licensePhotoUrl = editingDriver.licensePhotoUrl;
    if (files.license) {
      licensePhotoUrl = URL.createObjectURL(files.license);
      toast.info("License photo updated.");
    } else if (files.license === null) {
      licensePhotoUrl = undefined;
      toast.info("License photo removed.");
    }

    const existingAadharUrls = editingDriver.aadharPhotoUrls?.filter(
        url => !files.removedAadharUrls?.includes(url)
    ) || [];
    const newAadharUrls = files.aadharFiles?.map(f => URL.createObjectURL(f)) || [];
    const aadharPhotoUrls = [...existingAadharUrls, ...newAadharUrls];

    const existingOtherUrls = editingDriver.otherDocumentUrls?.filter(
        url => !files.removedOtherUrls?.includes(url)
    ) || [];
    const newOtherUrls = files.otherFiles?.map(f => URL.createObjectURL(f)) || [];
    const otherDocumentUrls = [...existingOtherUrls, ...newOtherUrls];

    const updatedDriver: Driver = {
      ...editingDriver,
      ...data,
      vehicleId: data.vehicleId || null,
      licenseExpiry: data.licenseExpiry.toISOString(),
      photoUrl,
      licensePhotoUrl,
      aadharPhotoUrls,
      otherDocumentUrls,
    };
    setDrivers(prev => prev.map(d => d.id === editingDriver.id ? updatedDriver : d));
    toast.success("Driver details updated successfully!");
    handleCancelForm();
  };

  const columns = useMemo(() => getDriverColumns({
    onEdit: handleEditClick,
    onDelete: handleDeleteDriver
  }), []);

  if (view === 'add' || view === 'details') {
    return (
      <DriverForm
        initialData={editingDriver}
        onBack={handleCancelForm}
        onSubmit={view === 'add' ? handleAddDriver : handleUpdateDriver}
      />
    );
  }

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <PageHeader title="Driver Management">
        <Button onClick={handleAddClick}>
          <PlusCircle className="mr-2 h-4 w-4" /> Add Driver
        </Button>
      </PageHeader>
      <Card>
        <CardHeader>
          <CardTitle>All Drivers</CardTitle>
        </CardHeader>
        <CardContent>
          <DataTable 
            columns={columns} 
            data={drivers} 
            filterColumnId="name"
            filterPlaceholder="Filter by driver name..."
            onDeleteSelected={handleBulkDelete}
          />
        </CardContent>
      </Card>
    </div>
  );
}

import type { Metadata } from "next";
import React from "react";
import ComponentCard from "@/components/common/ComponentCard";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import UsersList from "@/components/users/UsersList";
export const metadata: Metadata = {
  title: "Users List IELTS Prep & Practice",
  description: "List of users register for ielts",
};

export default function Users() {
  return (
    <div >
     

      <PageBreadcrumb pageTitle="Users List" />
      <div className="space-y-6">
        <ComponentCard title="Users List">
          <UsersList />
        </ComponentCard>
      </div>
   
    </div>
  );
}
